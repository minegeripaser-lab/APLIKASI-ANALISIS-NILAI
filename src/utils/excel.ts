import * as XLSX from 'xlsx';
import {
  Assessment,
  ClassStatistics,
  ItemAnalysisResult,
  SchoolProfile,
  Student,
  StudentGradingResult,
  TeacherProfile,
  TPAnalysisResult,
} from '../types';

/**
 * Membaca data siswa dari file Excel/CSV secara cerdas dan fleksibel.
 * Mendeteksi posisi baris header secara otomatis meskipun terdapat judul di baris 1-5.
 */
export async function parseStudentsFromExcel(file: File): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Dapatkan data dalam bentuk matriks 2D (baris dan kolom)
        const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          blankrows: false,
        });

        if (!rows || rows.length === 0) {
          resolve([]);
          return;
        }

        // Cari baris header yang memuat kolom "Nama" atau variasi lainnya
        let headerRowIdx = -1;
        let colNameIdx = -1;
        let colNisIdx = -1;
        let colNisnIdx = -1;
        let colGenderIdx = -1;

        for (let r = 0; r < Math.min(rows.length, 15); r++) {
          const row = rows[r];
          if (!Array.isArray(row)) continue;

          for (let c = 0; c < row.length; c++) {
            const cellVal = String(row[c] || '').trim().toLowerCase();
            if (
              cellVal.includes('nama') ||
              cellVal.includes('name') ||
              cellVal.includes('siswa') ||
              cellVal.includes('peserta didik')
            ) {
              headerRowIdx = r;
              colNameIdx = c;
              break;
            }
          }

          if (headerRowIdx !== -1) {
            // Temukan kolom NIS, NISN, Gender di baris yang sama
            const headerRow = rows[headerRowIdx];
            for (let c = 0; c < headerRow.length; c++) {
              const cellVal = String(headerRow[c] || '').trim().toLowerCase();
              if (c === colNameIdx) continue;

              if (cellVal.includes('nisn')) {
                colNisnIdx = c;
              } else if (
                cellVal.includes('nis') ||
                cellVal.includes('induk') ||
                cellVal === 'no' ||
                cellVal === 'id'
              ) {
                if (colNisIdx === -1 && cellVal !== 'no') {
                  colNisIdx = c;
                }
              } else if (
                cellVal.includes('jk') ||
                cellVal.includes('jenis kelamin') ||
                cellVal.includes('l/p') ||
                cellVal.includes('gender') ||
                cellVal.includes('kelamin')
              ) {
                colGenderIdx = c;
              }
            }
            break;
          }
        }

        // Jika tidak ditemukan header kata "Nama", gunakan deteksi kolom teks terpanjang
        if (headerRowIdx === -1 || colNameIdx === -1) {
          // Asumsikan data mulai dari baris 0 atau 1
          headerRowIdx = 0;
          // Cari kolom dengan teks terpanjang (kemungkinan besar Nama Siswa)
          let maxAvgLength = 0;
          const maxCols = Math.max(...rows.map((r) => r.length));

          for (let c = 0; c < maxCols; c++) {
            let totalLen = 0;
            let count = 0;
            for (let r = 0; r < rows.length; r++) {
              const val = String(rows[r][c] || '').trim();
              if (val.length > 0 && isNaN(Number(val))) {
                totalLen += val.length;
                count++;
              }
            }
            const avg = count > 0 ? totalLen / count : 0;
            if (avg > maxAvgLength) {
              maxAvgLength = avg;
              colNameIdx = c;
            }
          }
        }

        const students: Student[] = [];
        const startRow = headerRowIdx + 1;

        for (let r = startRow; r < rows.length; r++) {
          const row = rows[r];
          if (!row || !Array.isArray(row)) continue;

          const rawName = colNameIdx !== -1 ? String(row[colNameIdx] || '').trim() : '';
          // Lewati jika nama kosong atau baris nomor urut
          if (!rawName || rawName.toLowerCase() === 'nama' || rawName.toLowerCase() === 'nama siswa') {
            continue;
          }

          // Dapatkan NIS
          let rawNis = colNisIdx !== -1 ? String(row[colNisIdx] || '').trim() : '';
          if (!rawNis) {
            rawNis = String(students.length + 1).padStart(4, '0');
          }

          // Dapatkan NISN
          const rawNisn = colNisnIdx !== -1 ? String(row[colNisnIdx] || '').trim() : '';

          // Dapatkan Gender
          let rawGender = colGenderIdx !== -1 ? String(row[colGenderIdx] || '').trim().toUpperCase() : '';
          let gender: 'L' | 'P' = 'L';
          if (rawGender.startsWith('P') || rawGender.startsWith('W')) {
            gender = 'P';
          }

          students.push({
            id: `std-${Date.now()}-${r}-${Math.random().toString(36).substring(2, 6)}`,
            nis: rawNis,
            nisn: rawNisn,
            name: rawName,
            gender,
          });
        }

        resolve(students);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Membaca data siswa dari teks mentah (Copy-Paste dari Excel / WA / Dokumen)
 */
export function parseStudentsFromText(rawText: string): Student[] {
  const lines = rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const students: Student[] = [];

  lines.forEach((line, index) => {
    // Abaikan header jika ada
    const lower = line.toLowerCase();
    if (
      index === 0 &&
      (lower.includes('nama siswa') || lower.includes('no\tnis') || lower.includes('nama\t'))
    ) {
      return;
    }

    // Split dengan tab, koma, atau titik koma
    const parts = line.includes('\t')
      ? line.split('\t').map((p) => p.trim())
      : line.includes(';')
      ? line.split(';').map((p) => p.trim())
      : line.includes(',')
      ? line.split(',').map((p) => p.trim())
      : [line];

    let name = '';
    let nis = '';
    let nisn = '';
    let gender: 'L' | 'P' = 'L';

    if (parts.length === 1) {
      // Hanya nama saja
      name = parts[0];
      nis = String(students.length + 1).padStart(4, '0');
    } else if (parts.length === 2) {
      // Bisa [NIS, Nama] atau [No, Nama] atau [Nama, Gender]
      if (!isNaN(Number(parts[0]))) {
        nis = parts[0];
        name = parts[1];
      } else {
        name = parts[0];
        if (parts[1].toUpperCase().startsWith('P')) gender = 'P';
        nis = String(students.length + 1).padStart(4, '0');
      }
    } else {
      // 3 kolom atau lebih: misal [No, NIS, Nama] atau [NIS, NISN, Nama, Gender]
      const nonNumericIdx = parts.findIndex((p) => isNaN(Number(p)) && p.length > 2);
      if (nonNumericIdx !== -1) {
        name = parts[nonNumericIdx];
        if (nonNumericIdx > 0) {
          nis = parts[nonNumericIdx - 1];
        }
      } else {
        name = parts[parts.length - 1];
      }

      // Cari gender
      const genderPart = parts.find(
        (p) => p.toUpperCase() === 'L' || p.toUpperCase() === 'P' || p.toUpperCase() === 'LAKI-LAKI' || p.toUpperCase() === 'PEREMPUAN'
      );
      if (genderPart && (genderPart.toUpperCase().startsWith('P') || genderPart.toUpperCase().startsWith('W'))) {
        gender = 'P';
      }

      if (!nis) {
        nis = String(students.length + 1).padStart(4, '0');
      }
    }

    // Bersihkan nama dari nomor urut awal (misal: "1. Ahmad Fauzi" -> "Ahmad Fauzi")
    const cleanedName = name.replace(/^[\d]+[\.\)\-\s]+/, '').trim();

    if (cleanedName) {
      students.push({
        id: `std-txt-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
        nis: nis || String(students.length + 1).padStart(4, '0'),
        nisn: nisn || '',
        name: cleanedName,
        gender,
      });
    }
  });

  return students;
}

/**
 * Membuat & mendownload template Excel data siswa resmi
 */
export function downloadStudentTemplateExcel() {
  const sampleRows = [
    {
      'No': 1,
      'NIS': '2401',
      'NISN': '0098765432',
      'Nama Siswa': 'Ahmad Fauzi Pratama',
      'Jenis Kelamin (L/P)': 'L',
    },
    {
      'No': 2,
      'NIS': '2402',
      'NISN': '0098765433',
      'Nama Siswa': 'Annisa Putri Rahmawati',
      'Jenis Kelamin (L/P)': 'P',
    },
    {
      'No': 3,
      'NIS': '2403',
      'NISN': '0098765434',
      'Nama Siswa': 'Bagas Dwi Santoso',
      'Jenis Kelamin (L/P)': 'L',
    },
    {
      'No': 4,
      'NIS': '2404',
      'NISN': '0098765435',
      'Nama Siswa': 'Dewi Ayu Lestari',
      'Jenis Kelamin (L/P)': 'P',
    },
    {
      'No': 5,
      'NIS': '2405',
      'NISN': '0098765436',
      'Nama Siswa': 'Eko Prasetyo Wibowo',
      'Jenis Kelamin (L/P)': 'L',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleRows);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 12 },
    { wch: 16 },
    { wch: 32 },
    { wch: 20 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template_Data_Siswa');
  XLSX.writeFile(wb, 'Template_Import_Siswa_AnalisGuru.xlsx');
}

/**
 * Mengekspor seluruh laporan Asesmen ke dalam berkas Excel resmi (.xlsx)
 */
export function exportAssessmentToExcel(
  assessment: Assessment,
  gradedResults: StudentGradingResult[],
  classStats: ClassStatistics,
  itemAnalyses: ItemAnalysisResult[],
  tpAnalyses: TPAnalysisResult[],
  school: SchoolProfile,
  teacher: TeacherProfile
) {
  const wb = XLSX.utils.book_new();

  // 1. Sheet Rekapitulasi Nilai Siswa
  const rekapRows = gradedResults.map((item, idx) => ({
    'No': idx + 1,
    'NIS': item.student.nis,
    'NISN': item.student.nisn,
    'Nama Siswa': item.student.name,
    'L/P': item.student.gender,
    'Benar': item.correctCount,
    'Salah': item.incorrectCount,
    'Skor Mentah': item.rawScore,
    'Skor Maksimal': item.maxScore,
    'Nilai Asesmen': item.finalScore,
    'KKTP': assessment.kktp,
    'Status': item.isPassing ? 'TUNTAS' : 'BELUM TUNTAS',
    'Peringkat': item.rank,
    'Nilai Remedial': item.remedialFinalScore ?? '-',
  }));

  const wsRekap = XLSX.utils.json_to_sheet(rekapRows);
  XLSX.utils.book_append_sheet(wb, wsRekap, 'Rekap_Nilai');

  // 2. Sheet Analisis Butir Soal
  const butirRows = itemAnalyses.map((item) => ({
    'No Soal': item.questionNumber,
    'Tipe Soal': item.question.type,
    'Kunci': item.question.correctAnswer,
    'Bobot': item.question.maxScore,
    'TP / Materi': item.tp ? `${item.tp.code} - ${item.tp.material}` : '-',
    'Indikator': item.question.indicator || '-',
    'Jml Benar': item.correctTotal,
    'Jml Salah': item.incorrectTotal,
    'Tingkat Kesukaran (P)': item.difficultyIndex,
    'Kategori Kesukaran': item.difficultyCategory,
    'Daya Pembeda (D)': item.discriminationIndex,
    'Kategori Pembeda': item.discriminationCategory,
    'Rekomendasi': item.recommendation,
    'Catatan Ahli': item.recommendationNote,
  }));

  const wsButir = XLSX.utils.json_to_sheet(butirRows);
  XLSX.utils.book_append_sheet(wb, wsButir, 'Analisis_Butir_Soal');

  // 3. Sheet Distraktor Pilihan Ganda
  const distractorRows: any[] = [];
  itemAnalyses.forEach((item) => {
    if (item.question.type === 'PG' && item.distractors.length > 0) {
      item.distractors.forEach((d) => {
        distractorRows.push({
          'No Soal': item.questionNumber,
          'Kunci': item.question.correctAnswer,
          'Opsi': d.option,
          'Status Kunci': d.isKey ? 'KUNCI' : 'PENGECOH',
          'Kelompok Atas': d.countUpper,
          'Kelompok Bawah': d.countLower,
          'Total Pemilih': d.countTotal,
          'Persentase Total (%)': `${d.percentageTotal}%`,
          'Efektivitas': d.isEffective ? 'BERFUNGSI' : 'TIDAK EFEKTIF',
          'Keterangan': d.statusNote,
        });
      });
    }
  });

  if (distractorRows.length > 0) {
    const wsDistraktor = XLSX.utils.json_to_sheet(distractorRows);
    XLSX.utils.book_append_sheet(wb, wsDistraktor, 'Analisis_Pengecoh');
  }

  // 4. Sheet Analisis Ketercapaian TP
  const tpRows = tpAnalyses.map((t) => ({
    'Kode TP': t.tp.code,
    'Materi': t.tp.material,
    'Tujuan Pembelajaran': t.tp.description,
    'No Soal Terkait': t.questionNumbers.join(', '),
    'Rata-rata Capaian (%)': `${t.averageScorePercentage}%`,
    'Status Ketercapaian': t.isAchieved ? 'TERCAPAI' : 'BELUM TERCAPAI',
    'Jumlah Siswa Belum Tuntas': t.studentsNotAchieved.length,
    'Nama Siswa Belum Tuntas': t.studentsNotAchieved.map((s) => s.student.name).join('; '),
  }));

  const wsTp = XLSX.utils.json_to_sheet(tpRows);
  XLSX.utils.book_append_sheet(wb, wsTp, 'Ketercapaian_TP');

  // 5. Sheet Program Remedial & Pengayaan
  const remedialRows = gradedResults
    .filter((r) => !r.isPassing)
    .map((r, i) => {
      const rec = assessment.studentAnswers[r.student.id];
      return {
        'No': i + 1,
        'NIS': r.student.nis,
        'Nama Siswa': r.student.name,
        'Nilai Awal': r.finalScore,
        'KKTP': assessment.kktp,
        'Nilai Remedial': rec?.remedialScore ?? '',
        'Nilai Akhir Pasca Remedial': r.remedialFinalScore ?? '',
        'Tanggal Pelaksanaan': rec?.remedialDate ?? '',
        'Bentuk Tindak Lanjut': rec?.remedialNotes ?? 'Bimbingan khusus dan pengerjaan ulang soal terkait',
      };
    });

  const wsRemedial = XLSX.utils.json_to_sheet(
    remedialRows.length > 0
      ? remedialRows
      : [{ 'Catatan': 'Semua siswa telah mencapai KKTP (Tidak ada remedial).' }]
  );
  XLSX.utils.book_append_sheet(wb, wsRemedial, 'Program_Remedial');

  const enrichmentRows = gradedResults
    .filter((r) => r.isPassing)
    .map((r, i) => {
      const rec = assessment.studentAnswers[r.student.id];
      return {
        'No': i + 1,
        'NIS': r.student.nis,
        'Nama Siswa': r.student.name,
        'Nilai Asesmen': r.finalScore,
        'Kegiatan Pengayaan': rec?.enrichmentActivity ?? 'Tutor Sebaya & Penyelesaian Soal Penalaran (HOTS)',
      };
    });

  const wsEnrichment = XLSX.utils.json_to_sheet(
    enrichmentRows.length > 0 ? enrichmentRows : [{ 'Catatan': 'Tidak ada siswa pengayaan.' }]
  );
  XLSX.utils.book_append_sheet(wb, wsEnrichment, 'Program_Pengayaan');

  // 6. Sheet Ringkasan Statistik
  const summaryRows = [
    { 'Parameter': 'Nama Sekolah / Madrasah', 'Nilai': school.schoolName },
    { 'Parameter': 'NPSN', 'Nilai': school.npsn },
    { 'Parameter': 'Mata Pelajaran', 'Nilai': assessment.subject },
    { 'Parameter': 'Kelas', 'Nilai': assessment.className },
    { 'Parameter': 'Tahun Ajaran / Semester', 'Nilai': `${assessment.academicYear} / ${assessment.semester}` },
    { 'Parameter': 'Nama Guru Pengampu', 'Nilai': teacher.teacherName },
    { 'Parameter': 'NIP Guru', 'Nilai': teacher.teacherNIP },
    { 'Parameter': 'KKTP / KKM', 'Nilai': assessment.kktp },
    { 'Parameter': 'Jumlah Peserta Tes', 'Nilai': classStats.participantCount },
    { 'Parameter': 'Nilai Tertinggi', 'Nilai': classStats.highestScore },
    { 'Parameter': 'Nilai Terendah', 'Nilai': classStats.lowestScore },
    { 'Parameter': 'Rata-rata Nilai (Mean)', 'Nilai': classStats.meanScore },
    { 'Parameter': 'Median Nilai', 'Nilai': classStats.medianScore },
    { 'Parameter': 'Standar Deviasi', 'Nilai': classStats.standardDeviation },
    { 'Parameter': 'Jumlah Siswa Tuntas', 'Nilai': classStats.passedCount },
    { 'Parameter': 'Jumlah Siswa Belum Tuntas', 'Nilai': classStats.failedCount },
    { 'Parameter': 'Persentase Ketuntasan Klasikal', 'Nilai': `${classStats.passedPercentage}%` },
    { 'Parameter': 'Status Ketuntasan Klasikal (Target 85%)', 'Nilai': classStats.isClassMastered ? 'TERCAPAI' : 'BELUM TERCAPAI' },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Statistik_Klasikal');

  // Simpan berkas
  const cleanTitle = (assessment.title || 'Asesmen').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanClass = (assessment.className || 'Kelas').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Laporan_Analisis_${cleanTitle}_${cleanClass}.xlsx`;

  XLSX.writeFile(wb, filename);
}
