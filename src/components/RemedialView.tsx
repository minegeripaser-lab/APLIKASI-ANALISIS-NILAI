import React, { useState } from 'react';
import {
  Assessment,
  ClassStatistics,
  StudentGradingResult,
  TPAnalysisResult,
} from '../types';
import {
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Settings2,
  Calendar,
  FileCheck,
  Save,
  Printer,
} from 'lucide-react';

interface RemedialViewProps {
  assessment: Assessment;
  classStats: ClassStatistics;
  gradedResults: StudentGradingResult[];
  tpAnalyses: TPAnalysisResult[];
  onUpdateAssessmentRemedialPolicy: (policy: 'max_kktp' | 'pure_remedial' | 'average') => void;
  onUpdateStudentRemedialRecord: (
    studentId: string,
    remedialScore?: number,
    remedialDate?: string,
    remedialNotes?: string
  ) => void;
  onQuickPrint: () => void;
}

export const RemedialView: React.FC<RemedialViewProps> = ({
  assessment,
  classStats,
  gradedResults,
  tpAnalyses,
  onUpdateAssessmentRemedialPolicy,
  onUpdateStudentRemedialRecord,
  onQuickPrint,
}) => {
  const { kktp, remedialPolicy, studentAnswers } = assessment;

  const remedialStudents = gradedResults.filter((r) => !r.isPassing);
  const failurePercentage = classStats.failedPercentage;

  // Rekomendasi Klasikal Kurikulum Nasional
  let classicalRecommendationTitle = '';
  let classicalRecommendationDesc = '';
  let classicalBadgeColor = '';

  if (failurePercentage > 50) {
    classicalRecommendationTitle = 'Pembelajaran Ulang Klasikal (Re-teaching)';
    classicalRecommendationDesc =
      'Lebih dari 50% siswa belum tuntas. Guru wajib memberikan pembelajaran ulang seluruh kelas dengan metode, pendekatan, atau media ajar yang berbeda sebelum dilakukan tes remedial.';
    classicalBadgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
  } else if (failurePercentage >= 20) {
    classicalRecommendationTitle = 'Bimbingan Kelompok Khusus Terarah';
    classicalRecommendationDesc =
      'Antara 20% hingga 50% siswa belum tuntas. Bentuk kelompok belajar kecil untuk membedah kembali indikator-indikator soal yang paling banyak salah, dipandu oleh guru.';
    classicalBadgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
  } else {
    classicalRecommendationTitle = 'Bimbingan Perorangan & Pemanfaatan Tutor Sebaya';
    classicalRecommendationDesc =
      'Kurang dari 20% siswa belum tuntas. Berikan bimbingan khusus individual atau pasangkan siswa tersebut dengan siswa tuntas bernilai tinggi sebagai tutor sebaya.';
    classicalBadgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
  }

  // Local state for editing fields
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [tempScore, setTempScore] = useState<string>('');
  const [tempDate, setTempDate] = useState<string>('');
  const [tempNotes, setTempNotes] = useState<string>('');

  const handleStartEdit = (studentId: string) => {
    const rec = studentAnswers[studentId] || { answers: {} };
    setEditingStudentId(studentId);
    setTempScore(rec.remedialScore !== undefined ? String(rec.remedialScore) : '');
    setTempDate(rec.remedialDate || new Date().toISOString().split('T')[0]);
    setTempNotes(rec.remedialNotes || 'Bimbingan khusus materi belum tuntas');
  };

  const handleSaveRemedial = (studentId: string) => {
    const numScore = tempScore.trim() !== '' ? Number(tempScore) : undefined;
    onUpdateStudentRemedialRecord(studentId, numScore, tempDate, tempNotes);
    setEditingStudentId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Standar Pembelajaran & Asesmen</span>
            <span aria-hidden="true">·</span>
            <span>KKTP: <strong className="text-slate-800">{kktp}</strong></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Program Remedial & Tindak Lanjut Asesmen
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Daftar otomatis siswa yang belum mencapai KKTP, penentuan bentuk intervensi, serta pencatatan nilai hasil perbaikan.
          </p>
        </div>

        <button
          onClick={onQuickPrint}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          Cetak Lembar Remedial
        </button>
      </div>

      {/* Kotak Rekomendasi Bentuk Remedial Klasikal */}
      <div className={`p-5 rounded-xl border ${classicalBadgeColor} shadow-xs`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Rekomendasi Bentuk Remedial: {classicalRecommendationTitle}</span>
          </div>
          <span className="text-xs font-mono font-bold tabular-nums">
            {failurePercentage}% Siswa Belum Tuntas ({remedialStudents.length}/{classStats.participantCount})
          </span>
        </div>
        <p className="text-xs leading-relaxed opacity-90">
          {classicalRecommendationDesc}
        </p>
      </div>

      {/* Pengaturan Kebijakan Penentuan Nilai Akhir Remedial */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Settings2 className="w-4 h-4 text-slate-500" />
          <div>
            <div className="text-xs font-bold text-slate-900">
              Kebijakan Perhitungan Nilai Akhir Pasca Remedial
            </div>
            <div className="text-[11px] text-slate-500">
              Pilih formula yang diterapkan satuan pendidikan Anda
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={remedialPolicy}
            onChange={(e) =>
              onUpdateAssessmentRemedialPolicy(e.target.value as 'max_kktp' | 'pure_remedial' | 'average')
            }
            className="text-xs font-semibold py-1.5 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="max_kktp">
              Batas Maksimal Setara KKTP ({kktp}) — (Standar Sekolah)
            </option>
            <option value="pure_remedial">
              Nilai Murni Hasil Tes Remedial
            </option>
            <option value="average">
              Rata-rata Nilai Awal dan Nilai Remedial
            </option>
          </select>
        </div>
      </div>

      {/* Tabel Siswa Memerlukan Remedial */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            Daftar Peserta Remedial ({remedialStudents.length} Siswa)
          </span>
          <span className="text-slate-500">
            Klik tombol &quot;Input Nilai&quot; untuk mencatat hasil tes perbaikan siswa
          </span>
        </div>

        {remedialStudents.length === 0 ? (
          <div className="p-8 text-center text-xs text-emerald-700 bg-white">
            <CheckCircle className="w-7 h-7 mx-auto mb-2 text-emerald-600" />
            Tidak ada siswa yang memerlukan remedial. Seluruh peserta telah melampaui batas KKTP ({kktp}).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3 w-12 text-center">No</th>
                  <th className="py-2.5 px-3 w-24">NIS</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3 w-20 text-center">Nilai Awal</th>
                  <th className="py-2.5 px-3 w-24 text-center">Nilai Remedial</th>
                  <th className="py-2.5 px-3 w-24 text-center">Nilai Akhir</th>
                  <th className="py-2.5 px-3 w-28">Tgl Remedial</th>
                  <th className="py-2.5 px-3">Bentuk Bimbingan / Catatan</th>
                  <th className="py-2.5 px-3 w-24 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {remedialStudents.map((item, idx) => {
                  const rec = studentAnswers[item.student.id] || { answers: {} };
                  const isEditing = editingStudentId === item.student.id;

                  return (
                    <tr key={item.student.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500 tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700 tabular-nums">
                        {item.student.nis}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {item.student.name}
                      </td>

                      {/* Nilai Awal */}
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-mono font-bold text-rose-700 tabular-nums">
                          {item.finalScore}
                        </span>
                      </td>

                      {/* Nilai Tes Remedial */}
                      <td className="py-2.5 px-3 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={tempScore}
                            onChange={(e) => setTempScore(e.target.value)}
                            placeholder="75"
                            className="w-16 px-1.5 py-1 text-xs border border-emerald-400 rounded text-center font-mono focus:outline-none"
                          />
                        ) : (
                          <span className="font-mono font-bold text-slate-800 tabular-nums">
                            {rec.remedialScore !== undefined ? rec.remedialScore : '-'}
                          </span>
                        )}
                      </td>

                      {/* Nilai Akhir Pasca Remedial */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-xs tabular-nums ${
                            item.remedialFinalScore !== undefined && item.remedialFinalScore >= kktp
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.remedialFinalScore !== undefined ? item.remedialFinalScore : '-'}
                        </span>
                      </td>

                      {/* Tanggal */}
                      <td className="py-2.5 px-3 text-xs text-slate-600">
                        {isEditing ? (
                          <input
                            type="date"
                            value={tempDate}
                            onChange={(e) => setTempDate(e.target.value)}
                            className="text-xs p-1 border border-slate-300 rounded focus:outline-none"
                          />
                        ) : (
                          rec.remedialDate || '-'
                        )}
                      </td>

                      {/* Catatan / Materi */}
                      <td className="py-2.5 px-3 text-xs text-slate-600">
                        {isEditing ? (
                          <input
                            type="text"
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            placeholder="Materi yang diremedialkan..."
                            className="w-full text-xs p-1 border border-slate-300 rounded focus:outline-none"
                          />
                        ) : (
                          rec.remedialNotes || 'Bimbingan khusus indikator soal'
                        )}
                      </td>

                      {/* Tombol Aksi */}
                      <td className="py-2.5 px-3 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveRemedial(item.student.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors flex items-center gap-1 ml-auto"
                          >
                            <Save className="w-3 h-3" />
                            Simpan
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(item.student.id)}
                            className="px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded border border-slate-200"
                          >
                            Input Nilai
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
