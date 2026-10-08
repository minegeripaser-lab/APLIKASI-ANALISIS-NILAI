import React, { useState } from 'react';
import { Assessment, TPAnalysisResult } from '../types';
import {
  ListChecks,
  CheckCircle2,
  AlertCircle,
  Users,
  Target,
  ArrowRight,
} from 'lucide-react';

interface ObjectiveAnalysisViewProps {
  assessment: Assessment;
  tpAnalyses: TPAnalysisResult[];
  onNavigateToRemedial: () => void;
}

export const ObjectiveAnalysisView: React.FC<ObjectiveAnalysisViewProps> = ({
  assessment,
  tpAnalyses,
  onNavigateToRemedial,
}) => {
  const [selectedTpId, setSelectedTpId] = useState<string>(
    tpAnalyses.length > 0 ? tpAnalyses[0].tp.id : ''
  );

  const selectedAnalysis = tpAnalyses.find((t) => t.tp.id === selectedTpId) || tpAnalyses[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Kurikulum Merdeka</span>
            <span aria-hidden="true">·</span>
            <span>Ketercapaian Standar Kompetensi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Analisis Ketercapaian per Tujuan Pembelajaran (TP)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Menganalisis penguasaan setiap kompetensi materi ajar serta mengidentifikasi siswa yang belum tuntas per TP secara spesifik.
          </p>
        </div>

        <button
          onClick={onNavigateToRemedial}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          Lihat Program Remedial
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid Ringkasan Seluruh TP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tpAnalyses.map((item) => {
          const isSelected = item.tp.id === selectedTpId;
          const isAchieved = item.isAchieved;

          return (
            <div
              key={item.tp.id}
              onClick={() => setSelectedTpId(item.tp.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-emerald-800 font-mono">
                    {item.tp.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isAchieved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isAchieved ? 'TERCAPAI' : 'BELUM TERCAPAI'}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 mb-1">
                  {item.tp.material}
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {item.tp.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Capaian Kelas:</span>
                  <span className="font-bold font-mono text-slate-900 tabular-nums">
                    {item.averageScorePercentage}%
                  </span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isAchieved ? 'bg-emerald-600' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, item.averageScorePercentage)}%` }}
                  />
                </div>

                <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                  <span>KKTP: {assessment.kktp}%</span>
                  <span className={item.studentsNotAchieved.length > 0 ? 'text-rose-600 font-medium' : 'text-emerald-700'}>
                    {item.studentsNotAchieved.length} Siswa Belum Tuntas
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail TP yang Dipilih & Siswa yang Belum Mencapai Target */}
      {selectedAnalysis && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-emerald-800 text-base">
                  {selectedAnalysis.tp.code}
                </span>
                <span className="text-base font-bold text-slate-900">
                  {selectedAnalysis.tp.material}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl">
                {selectedAnalysis.tp.description}
              </p>
            </div>

            <div className="text-right sm:self-center">
              <div className="text-xs text-slate-500">Butir Soal Terkait:</div>
              <div className="flex gap-1 justify-end mt-1">
                {selectedAnalysis.questionNumbers.map((num) => (
                  <span
                    key={num}
                    className="px-2 py-0.5 bg-slate-100 font-mono text-xs font-bold text-slate-700 rounded"
                  >
                    No.{num}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tabel Siswa Belum Mencapai Target TP ini */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                Daftar Siswa Belum Mencapai Target {selectedAnalysis.tp.code} (
                {selectedAnalysis.studentsNotAchieved.length} Siswa)
              </h2>
              <span className="text-xs text-slate-500">
                Ambang Batas KKTP: <strong className="text-slate-800">{assessment.kktp}%</strong>
              </span>
            </div>

            {selectedAnalysis.studentsNotAchieved.length === 0 ? (
              <div className="p-8 text-center text-xs text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                Luar biasa! Seluruh siswa telah berhasil menuntaskan kompetensi pada Tujuan Pembelajaran ini.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-3 w-12 text-center">No</th>
                      <th className="py-2.5 px-3 w-28">NIS</th>
                      <th className="py-2.5 px-3">Nama Siswa</th>
                      <th className="py-2.5 px-3 w-20 text-center">L/P</th>
                      <th className="py-2.5 px-3 w-32 text-center">Capaian TP</th>
                      <th className="py-2.5 px-3">Rekomendasi Bimbingan Guru</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedAnalysis.studentsNotAchieved.map((item, idx) => (
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
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              item.student.gender === 'L'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-pink-50 text-pink-700'
                            }`}
                          >
                            {item.student.gender}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded tabular-nums">
                            {item.scorePercentage}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-slate-600">
                          Penguatan konsep materi {selectedAnalysis.tp.material} melalui pengerjaan latihan soal No.{' '}
                          {selectedAnalysis.questionNumbers.join(', ')}.
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
