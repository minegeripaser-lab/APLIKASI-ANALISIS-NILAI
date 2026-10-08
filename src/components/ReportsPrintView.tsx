import React, { useState } from 'react';
import {
  Assessment,
  ClassStatistics,
  ItemAnalysisResult,
  SchoolProfile,
  StudentGradingResult,
  TeacherProfile,
  TPAnalysisResult,
} from '../types';
import {
  Printer,
  FileSpreadsheet,
  FileText,
  UserCheck,
  CheckCircle,
  Award,
  AlertCircle,
  Layers,
} from 'lucide-react';

interface ReportsPrintViewProps {
  assessment: Assessment;
  school: SchoolProfile;
  teacher: TeacherProfile;
  classStats: ClassStatistics;
  gradedResults: StudentGradingResult[];
  itemAnalyses: ItemAnalysisResult[];
  tpAnalyses: TPAnalysisResult[];
  onExportExcel: () => void;
}

export type ReportType =
  | 'rekap_nilai'
  | 'analisis_butir'
  | 'analisis_tp'
  | 'remedial_pengayaan'
  | 'kartu_individual';

export const ReportsPrintView: React.FC<ReportsPrintViewProps> = ({
  assessment,
  school,
  teacher,
  classStats,
  gradedResults,
  itemAnalyses,
  tpAnalyses,
  onExportExcel,
}) => {
  const [activeReport, setActiveReport] = useState<ReportType>('rekap_nilai');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    gradedResults.length > 0 ? gradedResults[0].student.id : ''
  );

  const handlePrint = () => {
    window.print();
  };

  const selectedStudentResult =
    gradedResults.find((r) => r.student.id === selectedStudentId) || gradedResults[0];

  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls (Hidden on Print) */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Format Administrasi Guru Resmi</span>
            <span aria-hidden="true">·</span>
            <span>KOP Surat & Pengesahan Tanda Tangan NIP</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Laporan Administrasi & Dokumen Cetak
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Pilih model dokumen resmi yang hendak dicetak ke PDF/kertas A4 atau diekspor ke Microsoft Excel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onExportExcel}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            Ekspor Excel (.xlsx)
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Dokumen Sekarang (PDF)
          </button>
        </div>
      </div>

      {/* Selector Model Dokumen (Hidden on Print) */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="text-xs font-semibold text-slate-700 mb-2">Pilih Format Laporan:</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={() => setActiveReport('rekap_nilai')}
            className={`p-2.5 rounded-lg text-xs font-semibold text-left transition-colors flex flex-col justify-between ${
              activeReport === 'rekap_nilai'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="font-bold">1. Rekap Nilai Kelas</span>
            <span className="text-[10px] opacity-80 mt-1">Daftar nilai, peringkat & ketuntasan</span>
          </button>

          <button
            onClick={() => setActiveReport('analisis_butir')}
            className={`p-2.5 rounded-lg text-xs font-semibold text-left transition-colors flex flex-col justify-between ${
              activeReport === 'analisis_butir'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="font-bold">2. Analisis Butir Soal</span>
            <span className="text-[10px] opacity-80 mt-1">Tingkat kesukaran & daya pembeda</span>
          </button>

          <button
            onClick={() => setActiveReport('analisis_tp')}
            className={`p-2.5 rounded-lg text-xs font-semibold text-left transition-colors flex flex-col justify-between ${
              activeReport === 'analisis_tp'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="font-bold">3. Ketercapaian TP</span>
            <span className="text-[10px] opacity-80 mt-1">Capaian kompetensi per materi</span>
          </button>

          <button
            onClick={() => setActiveReport('remedial_pengayaan')}
            className={`p-2.5 rounded-lg text-xs font-semibold text-left transition-colors flex flex-col justify-between ${
              activeReport === 'remedial_pengayaan'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="font-bold">4. Remedial & Pengayaan</span>
            <span className="text-[10px] opacity-80 mt-1">Tindak lanjut & nilai perbaikan</span>
          </button>

          <button
            onClick={() => setActiveReport('kartu_individual')}
            className={`p-2.5 rounded-lg text-xs font-semibold text-left transition-colors flex flex-col justify-between ${
              activeReport === 'kartu_individual'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="font-bold">5. Kartu Hasil Siswa</span>
            <span className="text-[10px] opacity-80 mt-1">Laporan perorangan ke orang tua</span>
          </button>
        </div>

        {activeReport === 'kartu_individual' && (
          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-3">
            <span className="text-xs text-slate-600">Pilih Siswa untuk Kartu Individual:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {gradedResults.map((r) => (
                <option key={r.student.id} value={r.student.id}>
                  {r.student.nis} - {r.student.name} (Nilai: {r.finalScore})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* LEMBAR DOKUMEN CETAK RESMI (PAPER FORMAT) */}
      <div className="print-container bg-white border border-slate-300 rounded-xl p-8 sm:p-12 shadow-sm max-w-4xl mx-auto font-serif text-slate-900">
        {/* KOP SURAT RESMI LEMBAGA */}
        <div className="text-center pb-4 border-b-2 border-double border-slate-900 mb-6">
          <div className="text-lg sm:text-xl font-bold uppercase tracking-wide">
            {school.schoolName}
          </div>
          <div className="text-xs font-sans text-slate-700 mt-1">
            {school.address}, Kec. {school.district}, {school.city}, {school.province} · NPSN: {school.npsn}
          </div>
        </div>

        {/* JUDUL DOKUMEN SESUAI PILIHAN */}
        <div className="text-center mb-6">
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider underline">
            {activeReport === 'rekap_nilai' && 'REKAPITULASI HASIL ASESMEN DAN KETUNTASAN BELAJAR'}
            {activeReport === 'analisis_butir' && 'LAPORAN ANALISIS KUALITAS BUTIR SOAL'}
            {activeReport === 'analisis_tp' && 'LAPORAN KETERCAPAIAN TUJUAN PEMBELAJARAN (TP)'}
            {activeReport === 'remedial_pengayaan' && 'PROGRAM PELAKSANAAN REMEDIAL DAN PENGAYAAN'}
            {activeReport === 'kartu_individual' && 'KARTU HASIL ASESMEN INDIVIDUAL PESERTA DIDIK'}
          </h2>
          <div className="text-xs font-sans text-slate-600 mt-1">
            Tahun Ajaran: {assessment.academicYear} · Semester: {assessment.semester}
          </div>
        </div>

        {/* IDENTITAS ASESMEN (Tabel 2 Kolom Bersih) */}
        <div className="grid grid-cols-2 text-xs font-sans mb-6 pb-3 border-b border-slate-200 gap-y-1">
          <div>
            <span className="w-32 inline-block font-semibold">Mata Pelajaran</span>: {assessment.subject}
          </div>
          <div>
            <span className="w-32 inline-block font-semibold">KKTP / KKM</span>: <strong className="font-mono">{assessment.kktp}</strong>
          </div>
          <div>
            <span className="w-32 inline-block font-semibold">Kelas / Rombel</span>: {assessment.className}
          </div>
          <div>
            <span className="w-32 inline-block font-semibold">Bentuk Asesmen</span>: {assessment.title}
          </div>
          <div>
            <span className="w-32 inline-block font-semibold">Guru Pengampu</span>: {teacher.teacherName}
          </div>
          <div>
            <span className="w-32 inline-block font-semibold">Jumlah Soal / Siswa</span>: {assessment.questions.length} Butir / {classStats.participantCount} Siswa
          </div>
        </div>

        {/* ISI DOKUMEN 1: REKAPITULASI NILAI */}
        {activeReport === 'rekap_nilai' && (
          <div className="space-y-6 font-sans">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold border border-slate-900 text-center">
                  <th className="p-1.5 border border-slate-900 w-10">No</th>
                  <th className="p-1.5 border border-slate-900 w-20">NIS</th>
                  <th className="p-1.5 border border-slate-900 text-left">Nama Lengkap Siswa</th>
                  <th className="p-1.5 border border-slate-900 w-12">L/P</th>
                  <th className="p-1.5 border border-slate-900 w-14">Benar</th>
                  <th className="p-1.5 border border-slate-900 w-14">Salah</th>
                  <th className="p-1.5 border border-slate-900 w-16">Nilai</th>
                  <th className="p-1.5 border border-slate-900 w-14">Rank</th>
                  <th className="p-1.5 border border-slate-900 w-24">Ketuntasan</th>
                  <th className="p-1.5 border border-slate-900 w-20">Nilai Akhir*</th>
                </tr>
              </thead>
              <tbody>
                {gradedResults.map((r, i) => (
                  <tr key={r.student.id} className="border border-slate-900 text-center">
                    <td className="p-1 border border-slate-900 tabular-nums">{i + 1}</td>
                    <td className="p-1 border border-slate-900 font-mono tabular-nums">{r.student.nis}</td>
                    <td className="p-1 border border-slate-900 text-left font-medium">{r.student.name}</td>
                    <td className="p-1 border border-slate-900">{r.student.gender}</td>
                    <td className="p-1 border border-slate-900 tabular-nums">{r.correctCount}</td>
                    <td className="p-1 border border-slate-900 tabular-nums">{r.incorrectCount}</td>
                    <td className="p-1 border border-slate-900 font-bold font-mono tabular-nums">{r.finalScore}</td>
                    <td className="p-1 border border-slate-900 font-mono tabular-nums">#{r.rank}</td>
                    <td className="p-1 border border-slate-900 font-semibold text-[11px]">
                      {r.isPassing ? 'TUNTAS' : 'BELUM TUNTAS'}
                    </td>
                    <td className="p-1 border border-slate-900 font-mono tabular-nums">
                      {r.remedialFinalScore ?? r.finalScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Rekap Statistik Bawah */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border border-slate-900 p-3 bg-slate-50">
              <div>Rata-rata: <strong>{classStats.meanScore}</strong></div>
              <div>Nilai Tertinggi: <strong>{classStats.highestScore}</strong></div>
              <div>Nilai Terendah: <strong>{classStats.lowestScore}</strong></div>
              <div>Standar Deviasi: <strong>{classStats.standardDeviation}</strong></div>
              <div>Siswa Tuntas: <strong>{classStats.passedCount} orang ({classStats.passedPercentage}%)</strong></div>
              <div>Siswa Belum Tuntas: <strong>{classStats.failedCount} orang ({classStats.failedPercentage}%)</strong></div>
              <div className="sm:col-span-2">
                Ketuntasan Klasikal (&ge;85%): <strong>{classStats.isClassMastered ? 'TERCAPAI' : 'BELUM TERCAPAI'}</strong>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 italic">
              * Nilai Akhir mencakup nilai penyesuaian pasca remedial bagi siswa yang mengikuti ujian perbaikan.
            </div>
          </div>
        )}

        {/* ISI DOKUMEN 2: ANALISIS BUTIR SOAL */}
        {activeReport === 'analisis_butir' && (
          <div className="space-y-6 font-sans">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold border border-slate-900 text-center">
                  <th className="p-1.5 border border-slate-900 w-10">No</th>
                  <th className="p-1.5 border border-slate-900 w-14">Tipe</th>
                  <th className="p-1.5 border border-slate-900 w-14">Kunci</th>
                  <th className="p-1.5 border border-slate-900 w-16">Benar</th>
                  <th className="p-1.5 border border-slate-900 w-20">Tk. Sukar (P)</th>
                  <th className="p-1.5 border border-slate-900 w-20">Kategori P</th>
                  <th className="p-1.5 border border-slate-900 w-20">Pembeda (D)</th>
                  <th className="p-1.5 border border-slate-900 w-24">Kategori D</th>
                  <th className="p-1.5 border border-slate-900 w-28">Rekomendasi</th>
                  <th className="p-1.5 border border-slate-900 text-left">Catatan Tindak Lanjut</th>
                </tr>
              </thead>
              <tbody>
                {itemAnalyses.map((item) => (
                  <tr key={item.questionNumber} className="border border-slate-900 text-center">
                    <td className="p-1 border border-slate-900 font-bold tabular-nums">{item.questionNumber}</td>
                    <td className="p-1 border border-slate-900">{item.question.type}</td>
                    <td className="p-1 border border-slate-900 font-bold font-mono">{item.question.correctAnswer}</td>
                    <td className="p-1 border border-slate-900 tabular-nums">{item.correctTotal}</td>
                    <td className="p-1 border border-slate-900 font-mono tabular-nums">{item.difficultyIndex.toFixed(2)}</td>
                    <td className="p-1 border border-slate-900">{item.difficultyCategory}</td>
                    <td className="p-1 border border-slate-900 font-mono tabular-nums">{item.discriminationIndex.toFixed(2)}</td>
                    <td className="p-1 border border-slate-900">{item.discriminationCategory}</td>
                    <td className="p-1 border border-slate-900 font-bold text-[11px]">{item.recommendation}</td>
                    <td className="p-1 border border-slate-900 text-left text-[11px] leading-tight">{item.recommendationNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ISI DOKUMEN 3: ANALISIS KETERCAPAIAN TP */}
        {activeReport === 'analisis_tp' && (
          <div className="space-y-6 font-sans">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold border border-slate-900 text-center">
                  <th className="p-1.5 border border-slate-900 w-16">Kode TP</th>
                  <th className="p-1.5 border border-slate-900 w-32 text-left">Lingkup Materi</th>
                  <th className="p-1.5 border border-slate-900 text-left">Tujuan Pembelajaran</th>
                  <th className="p-1.5 border border-slate-900 w-16">No Soal</th>
                  <th className="p-1.5 border border-slate-900 w-20">Capaian (%)</th>
                  <th className="p-1.5 border border-slate-900 w-24">Status</th>
                  <th className="p-1.5 border border-slate-900 text-left">Siswa Belum Tuntas</th>
                </tr>
              </thead>
              <tbody>
                {tpAnalyses.map((t) => (
                  <tr key={t.tp.id} className="border border-slate-900">
                    <td className="p-1.5 border border-slate-900 font-bold text-center font-mono">{t.tp.code}</td>
                    <td className="p-1.5 border border-slate-900 font-medium">{t.tp.material}</td>
                    <td className="p-1.5 border border-slate-900 leading-snug">{t.tp.description}</td>
                    <td className="p-1.5 border border-slate-900 text-center font-mono">{t.questionNumbers.join(', ')}</td>
                    <td className="p-1.5 border border-slate-900 font-bold font-mono text-center tabular-nums">
                      {t.averageScorePercentage}%
                    </td>
                    <td className="p-1.5 border border-slate-900 font-bold text-center text-[11px]">
                      {t.isAchieved ? 'TERCAPAI' : 'BELUM TERCAPAI'}
                    </td>
                    <td className="p-1.5 border border-slate-900 text-[11px] leading-snug">
                      {t.studentsNotAchieved.length === 0
                        ? 'Seluruh siswa tuntas'
                        : `${t.studentsNotAchieved.length} siswa: ${t.studentsNotAchieved.map((s) => s.student.name).join(', ')}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ISI DOKUMEN 4: REMEDIAL & PENGAYAAN */}
        {activeReport === 'remedial_pengayaan' && (
          <div className="space-y-6 font-sans">
            <div>
              <h3 className="font-bold text-xs uppercase mb-2 text-slate-800">
                A. Daftar Pelaksanaan Program Remedial (Nilai &lt; {assessment.kktp})
              </h3>
              <table className="w-full text-left border-collapse text-xs mb-4">
                <thead>
                  <tr className="bg-slate-100 font-bold border border-slate-900 text-center">
                    <th className="p-1 border border-slate-900 w-8">No</th>
                    <th className="p-1 border border-slate-900 w-20">NIS</th>
                    <th className="p-1 border border-slate-900 text-left">Nama Siswa</th>
                    <th className="p-1 border border-slate-900 w-16">Nilai Awal</th>
                    <th className="p-1 border border-slate-900 w-16">Nilai Rem.</th>
                    <th className="p-1 border border-slate-900 w-16">Nilai Akhir</th>
                    <th className="p-1 border border-slate-900 text-left">Tindak Lanjut / Materi</th>
                  </tr>
                </thead>
                <tbody>
                  {gradedResults.filter((r) => !r.isPassing).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-3 text-center border border-slate-900 italic">
                        Seluruh siswa telah mencapai KKTP.
                      </td>
                    </tr>
                  ) : (
                    gradedResults
                      .filter((r) => !r.isPassing)
                      .map((r, i) => {
                        const rec = assessment.studentAnswers[r.student.id];
                        return (
                          <tr key={r.student.id} className="border border-slate-900 text-center">
                            <td className="p-1 border border-slate-900 tabular-nums">{i + 1}</td>
                            <td className="p-1 border border-slate-900 font-mono">{r.student.nis}</td>
                            <td className="p-1 border border-slate-900 text-left font-medium">{r.student.name}</td>
                            <td className="p-1 border border-slate-900 font-bold tabular-nums text-rose-700">{r.finalScore}</td>
                            <td className="p-1 border border-slate-900 font-mono tabular-nums">{rec?.remedialScore ?? '-'}</td>
                            <td className="p-1 border border-slate-900 font-bold font-mono tabular-nums">{r.remedialFinalScore ?? '-'}</td>
                            <td className="p-1 border border-slate-900 text-left text-[11px]">{rec?.remedialNotes || 'Bimbingan khusus'}</td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-bold text-xs uppercase mb-2 text-slate-800">
                B. Daftar Pelaksanaan Program Pengayaan (Nilai &ge; {assessment.kktp})
              </h3>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 font-bold border border-slate-900 text-center">
                    <th className="p-1 border border-slate-900 w-8">No</th>
                    <th className="p-1 border border-slate-900 w-20">NIS</th>
                    <th className="p-1 border border-slate-900 text-left">Nama Siswa</th>
                    <th className="p-1 border border-slate-900 w-16">Nilai Asesmen</th>
                    <th className="p-1 border border-slate-900 text-left">Bentuk Kegiatan Pengayaan</th>
                  </tr>
                </thead>
                <tbody>
                  {gradedResults
                    .filter((r) => r.isPassing)
                    .map((r, i) => {
                      const rec = assessment.studentAnswers[r.student.id];
                      return (
                        <tr key={r.student.id} className="border border-slate-900 text-center">
                          <td className="p-1 border border-slate-900 tabular-nums">{i + 1}</td>
                          <td className="p-1 border border-slate-900 font-mono">{r.student.nis}</td>
                          <td className="p-1 border border-slate-900 text-left font-medium">{r.student.name}</td>
                          <td className="p-1 border border-slate-900 font-bold font-mono tabular-nums text-emerald-800">{r.finalScore}</td>
                          <td className="p-1 border border-slate-900 text-left text-[11px]">
                            {rec?.enrichmentActivity || 'Tutor Sebaya & Pemecahan Soal Penalaran (HOTS)'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ISI DOKUMEN 5: KARTU INDIVIDUAL SISWA */}
        {activeReport === 'kartu_individual' && selectedStudentResult && (
          <div className="space-y-6 font-sans">
            <div className="p-4 border-2 border-slate-900 rounded-lg space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <div>
                  <div className="text-sm font-bold">{selectedStudentResult.student.name}</div>
                  <div className="text-xs text-slate-600 font-mono">
                    NIS: {selectedStudentResult.student.nis} · NISN: {selectedStudentResult.student.nisn || '-'} · L/P: {selectedStudentResult.student.gender}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold">Status Ketercapaian:</div>
                  <div className={`text-sm font-bold ${selectedStudentResult.isPassing ? 'text-emerald-800' : 'text-rose-700'}`}>
                    {selectedStudentResult.isPassing ? 'TUNTAS' : 'BELUM TUNTAS'}
                  </div>
                </div>
              </div>

              {/* Rincian Skor */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 border border-slate-300 rounded">
                  <div className="text-slate-500 text-[11px]">Jumlah Benar</div>
                  <div className="text-base font-bold font-mono">{selectedStudentResult.correctCount} / {assessment.questions.length}</div>
                </div>
                <div className="p-2 border border-slate-300 rounded">
                  <div className="text-slate-500 text-[11px]">Nilai Asesmen</div>
                  <div className="text-xl font-bold font-mono text-slate-900">{selectedStudentResult.finalScore}</div>
                </div>
                <div className="p-2 border border-slate-300 rounded">
                  <div className="text-slate-500 text-[11px]">Peringkat Kelas</div>
                  <div className="text-base font-bold font-mono">#{selectedStudentResult.rank}</div>
                </div>
              </div>

              {/* Tabel Capaian per TP untuk Siswa Ini */}
              <div className="pt-2">
                <div className="text-xs font-bold mb-2">Capaian Berdasarkan Tujuan Pembelajaran (TP):</div>
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 border border-slate-900 font-bold">
                      <th className="p-1 border border-slate-900">Kode TP</th>
                      <th className="p-1 border border-slate-900">Materi & Kompetensi</th>
                      <th className="p-1 border border-slate-900 text-center w-24">Capaian Siswa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tpAnalyses.map((t) => {
                      const notIn = t.studentsNotAchieved.some(
                        (s) => s.student.id === selectedStudentResult.student.id
                      );
                      return (
                        <tr key={t.tp.id} className="border border-slate-900">
                          <td className="p-1 border border-slate-900 font-bold font-mono text-center">{t.tp.code}</td>
                          <td className="p-1 border border-slate-900">{t.tp.material}: {t.tp.description}</td>
                          <td className="p-1 border border-slate-900 text-center font-bold">
                            {!notIn ? 'Tuntas' : 'Perlu Bimbingan'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TANDA TANGAN RESMI KEPALA SEKOLAH & GURU MATA PELAJARAN */}
        <div className="mt-12 pt-6 font-sans text-xs flex justify-between page-break-inside-avoid">
          <div className="text-center w-64">
            Mengetahui,<br />
            {school.headmasterTitle}<br />
            <br />
            <br />
            <br />
            <strong>{school.principalName}</strong><br />
            NIP. {school.principalNIP || '...........................................'}
          </div>

          <div className="text-center w-64">
            {school.city}, {currentDateFormatted}<br />
            Guru Mata Pelajaran<br />
            <br />
            <br />
            <br />
            <strong>{teacher.teacherName}</strong><br />
            NIP. {teacher.teacherNIP || '...........................................'}
          </div>
        </div>
      </div>
    </div>
  );
};
