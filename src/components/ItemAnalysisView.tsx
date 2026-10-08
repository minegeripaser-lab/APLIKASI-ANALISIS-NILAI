import React, { useState } from 'react';
import { ItemAnalysisResult } from '../types';
import {
  BarChart2,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface ItemAnalysisViewProps {
  itemAnalyses: ItemAnalysisResult[];
  onOpenFormulasModal: () => void;
}

export const ItemAnalysisView: React.FC<ItemAnalysisViewProps> = ({
  itemAnalyses,
  onOpenFormulasModal,
}) => {
  const [expandedQuestionNumber, setExpandedQuestionNumber] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'Mudah' | 'Sedang' | 'Sukar'>('ALL');

  const filteredItems = itemAnalyses.filter((item) => {
    if (filterCategory === 'ALL') return true;
    return item.difficultyCategory === filterCategory;
  });

  const toggleExpand = (qNum: number) => {
    setExpandedQuestionNumber((prev) => (prev === qNum ? null : qNum));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Standar Penilaian Pendidikan</span>
            <span aria-hidden="true">·</span>
            <span>Metode Kelly 27% Upper / Lower Group</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Analisis Psikometrik Butir Soal (Item Analysis)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Evaluasi mendalam tingkat kesukaran, daya pembeda, efektivitas pengecoh/distraktor, dan rekomendasi tindak lanjut bank soal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFormulasModal}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            Kaidah & Rumus Psikometri
          </button>
        </div>
      </div>

      {/* Ringkasan & Filter Kategori Kesukaran */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-600">
          Menampilkan <strong className="font-semibold text-slate-900 tabular-nums">{filteredItems.length}</strong> dari{' '}
          <strong className="font-semibold text-slate-900 tabular-nums">{itemAnalyses.length}</strong> butir soal.
          Klik baris soal untuk melihat efektivitas opsi pengecoh (Distraktor).
        </div>

        {/* Segmented Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterCategory === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterCategory('Mudah')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterCategory === 'Mudah'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mudah (P &gt; 0.7)
          </button>
          <button
            onClick={() => setFilterCategory('Sedang')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterCategory === 'Sedang'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sedang (0.3 - 0.7)
          </button>
          <button
            onClick={() => setFilterCategory('Sukar')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filterCategory === 'Sukar'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sukar (P &lt; 0.3)
          </button>
        </div>
      </div>

      {/* Tabel Butir Soal */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-3 w-12 text-center">No</th>
                <th className="py-3 px-3 w-28">TP / Materi</th>
                <th className="py-3 px-3 w-16 text-center">Kunci</th>
                <th className="py-3 px-3 w-24 text-center">Benar / Salah</th>
                <th className="py-3 px-3 w-28 text-center">Kesukaran (P)</th>
                <th className="py-3 px-3 w-28 text-center">Daya Pembeda (D)</th>
                <th className="py-3 px-3 w-36">Rekomendasi</th>
                <th className="py-3 px-3">Catatan Analisis Ahli</th>
                <th className="py-3 px-3 w-12 text-center">Detail</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isExpanded = expandedQuestionNumber === item.questionNumber;

                // Difficulty color
                const diffBadge =
                  item.difficultyCategory === 'Sedang'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.difficultyCategory === 'Mudah'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-rose-100 text-rose-800';

                // Discrimination color
                const discBadge =
                  item.discriminationCategory === 'Sangat Baik'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.discriminationCategory === 'Baik'
                    ? 'bg-teal-100 text-teal-800'
                    : item.discriminationCategory === 'Cukup'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800';

                // Recommendation badge
                const recBadge =
                  item.recommendation === 'Dipertahankan'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.recommendation.startsWith('Dipertahankan')
                    ? 'bg-teal-100 text-teal-800'
                    : item.recommendation === 'Direvisi'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800';

                return (
                  <React.Fragment key={item.questionNumber}>
                    <tr
                      onClick={() => toggleExpand(item.questionNumber)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-slate-50/90' : ''
                      }`}
                    >
                      {/* No Soal */}
                      <td className="py-3 px-3 text-center font-bold text-slate-900 font-mono tabular-nums">
                        {item.questionNumber}
                      </td>

                      {/* TP / Materi */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">
                          {item.tp ? item.tp.code : '-'}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[120px]">
                          {item.tp ? item.tp.material : '-'}
                        </div>
                      </td>

                      {/* Kunci */}
                      <td className="py-3 px-3 text-center font-bold text-emerald-700 font-mono">
                        {item.question.correctAnswer}
                      </td>

                      {/* Benar / Salah */}
                      <td className="py-3 px-3 text-center font-mono tabular-nums text-xs">
                        <span className="text-emerald-700 font-bold">{item.correctTotal}</span>
                        <span className="text-slate-400"> / </span>
                        <span className="text-rose-600 font-medium">{item.incorrectTotal}</span>
                      </td>

                      {/* Tingkat Kesukaran */}
                      <td className="py-3 px-3 text-center">
                        <div className="font-mono font-bold text-slate-800 tabular-nums">
                          {item.difficultyIndex.toFixed(3)}
                        </div>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded inline-block mt-0.5 ${diffBadge}`}>
                          {item.difficultyCategory}
                        </span>
                      </td>

                      {/* Daya Pembeda */}
                      <td className="py-3 px-3 text-center">
                        <div className="font-mono font-bold text-slate-800 tabular-nums">
                          {item.discriminationIndex.toFixed(3)}
                        </div>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded inline-block mt-0.5 ${discBadge}`}>
                          {item.discriminationCategory}
                        </span>
                      </td>

                      {/* Rekomendasi */}
                      <td className="py-3 px-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded inline-block ${recBadge}`}>
                          {item.recommendation}
                        </span>
                      </td>

                      {/* Catatan Ahli */}
                      <td className="py-3 px-3 text-xs text-slate-600 leading-snug">
                        {item.recommendationNote}
                      </td>

                      {/* Expand Toggle */}
                      <td className="py-3 px-3 text-center text-slate-400">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 mx-auto text-emerald-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 mx-auto" />
                        )}
                      </td>
                    </tr>

                    {/* EXPANDED DISTRACTOR ANALYSIS ROW */}
                    {isExpanded && (
                      <tr className="bg-slate-50 border-y border-slate-200">
                        <td colSpan={9} className="p-4 sm:p-5">
                          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                              <div>
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                                  Analisis Efektivitas Opsi Pengecoh (Distraktor) — Soal Nomor {item.questionNumber}
                                </h3>
                                <p className="text-xs text-slate-500">
                                  Kunci Jawaban: <strong className="text-emerald-700 font-bold font-mono">{item.question.correctAnswer}</strong> · Indikator: {item.question.indicator || '-'}
                                </p>
                              </div>
                              <div className="text-xs text-slate-500 font-mono">
                                Kelompok Atas ({item.correctUpper} Benar) · Kelompok Bawah ({item.correctLower} Benar)
                              </div>
                            </div>

                            {item.question.type !== 'PG' ? (
                              <p className="text-xs text-slate-500 italic">
                                Analisis sebaran opsi distraktor hanya berlaku untuk soal tipe Pilihan Ganda (PG).
                              </p>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                      <th className="py-2 px-3 text-center w-16">Opsi</th>
                                      <th className="py-2 px-3 text-center w-28">Status Kunci</th>
                                      <th className="py-2 px-3 text-center w-24">Kelompok Atas</th>
                                      <th className="py-2 px-3 text-center w-24">Kelompok Bawah</th>
                                      <th className="py-2 px-3 text-center w-24">Total Pemilih</th>
                                      <th className="py-2 px-3 text-center w-28">Persentase (%)</th>
                                      <th className="py-2 px-3">Efektivitas Distraktor & Evaluasi</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {item.distractors.map((d) => {
                                      const isKey = d.isKey;

                                      return (
                                        <tr
                                          key={d.option}
                                          className={`hover:bg-slate-50/70 ${
                                            isKey ? 'bg-emerald-50/50 font-semibold' : ''
                                          }`}
                                        >
                                          {/* Opsi */}
                                          <td className="py-2 px-3 text-center font-bold font-mono text-sm">
                                            {d.option}
                                          </td>

                                          {/* Status Kunci */}
                                          <td className="py-2 px-3 text-center">
                                            {isKey ? (
                                              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                                KUNCI
                                              </span>
                                            ) : (
                                              <span className="text-[11px] text-slate-500">
                                                Pengecoh
                                              </span>
                                            )}
                                          </td>

                                          {/* Kelompok Atas */}
                                          <td className="py-2 px-3 text-center font-mono tabular-nums">
                                            {d.countUpper}
                                          </td>

                                          {/* Kelompok Bawah */}
                                          <td className="py-2 px-3 text-center font-mono tabular-nums">
                                            {d.countLower}
                                          </td>

                                          {/* Total */}
                                          <td className="py-2 px-3 text-center font-mono font-bold tabular-nums">
                                            {d.countTotal}
                                          </td>

                                          {/* Persentase */}
                                          <td className="py-2 px-3 text-center font-mono tabular-nums">
                                            {d.percentageTotal}%
                                          </td>

                                          {/* Evaluasi */}
                                          <td className="py-2 px-3">
                                            <span
                                              className={`text-xs ${
                                                isKey
                                                  ? 'text-emerald-700 font-semibold'
                                                  : d.isEffective
                                                  ? 'text-emerald-700'
                                                  : d.statusNote.includes('Menyesatkan')
                                                  ? 'text-rose-700 font-semibold'
                                                  : 'text-amber-700'
                                              }`}
                                            >
                                              {d.statusNote}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                              <strong>Kaidah Evaluasi Pengecoh:</strong> Suatu opsi pengecoh dinyatakan berfungsi efektif apabila dipilih oleh sekurang-kurangnya 5% dari seluruh peserta ujian, dan proporsi kelompok bawah yang memilih opsi tersebut lebih banyak daripada kelompok atas.
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
