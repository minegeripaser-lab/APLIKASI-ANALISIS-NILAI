import React from 'react';
import {
  Assessment,
  ClassStatistics,
  ItemAnalysisResult,
  StudentGradingResult,
  TPAnalysisResult,
} from '../types';
import {
  Users,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  FileSpreadsheet,
  Printer,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  assessment: Assessment;
  classStats: ClassStatistics;
  gradedResults: StudentGradingResult[];
  itemAnalyses: ItemAnalysisResult[];
  tpAnalyses: TPAnalysisResult[];
  onNavigate: (tab: any) => void;
  onExportExcel: () => void;
  onQuickPrint: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  assessment,
  classStats,
  gradedResults,
  itemAnalyses,
  tpAnalyses,
  onNavigate,
  onExportExcel,
  onQuickPrint,
}) => {
  // Hitung sebaran rentang nilai
  const scoreRanges = [
    { label: '< 60', count: gradedResults.filter((r) => r.finalScore < 60).length, color: 'bg-rose-500' },
    { label: '60 - 69', count: gradedResults.filter((r) => r.finalScore >= 60 && r.finalScore < 70).length, color: 'bg-amber-500' },
    { label: '70 - 79', count: gradedResults.filter((r) => r.finalScore >= 70 && r.finalScore < 80).length, color: 'bg-blue-500' },
    { label: '80 - 89', count: gradedResults.filter((r) => r.finalScore >= 80 && r.finalScore < 90).length, color: 'bg-indigo-500' },
    { label: '90 - 100', count: gradedResults.filter((r) => r.finalScore >= 90).length, color: 'bg-emerald-600' },
  ];
  const maxRangeCount = Math.max(...scoreRanges.map((s) => s.count), 1);

  // Rekomendasi butir soal breakdown
  const recKept = itemAnalyses.filter((i) => i.recommendation.startsWith('Dipertahankan')).length;
  const recRevised = itemAnalyses.filter((i) => i.recommendation === 'Direvisi').length;
  const recRejected = itemAnalyses.filter((i) => i.recommendation === 'Ditolak/Dibuang').length;

  // Siswa butuh perhatian
  const topStudents = [...gradedResults].sort((a, b) => b.finalScore - a.finalScore).slice(0, 5);
  const remedialStudents = gradedResults.filter((r) => !r.isPassing);

  return (
    <div className="space-y-6">
      {/* Banner Ringkasan Asesmen */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{assessment.subject}</span>
            <span aria-hidden="true">·</span>
            <span>Kelas {assessment.className}</span>
            <span aria-hidden="true">·</span>
            <span>Tahun Ajaran {assessment.academicYear} ({assessment.semester})</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {assessment.title}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kriteria Ketercapaian Tujuan Pembelajaran (KKTP / KKM):{' '}
            <span className="font-bold text-slate-900 tabular-nums">{assessment.kktp}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('answers')}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            Input / Edit Jawaban
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onExportExcel}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Ekspor Excel
          </button>
          <button
            onClick={onQuickPrint}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Berkas
          </button>
        </div>
      </div>

      {/* Grid Statistik Utama (Tabular numerals, unboxed metadata) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Peserta Tes</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {classStats.participantCount}
            </span>
            <span className="text-xs text-slate-500">Siswa</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {assessment.questions.length} butir soal teranalisis
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Rata-Rata Kelas</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums">
              {classStats.meanScore}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Median: <strong className="font-semibold text-slate-800 tabular-nums">{classStats.medianScore}</strong></span>
            <span>·</span>
            <span>SD: <strong className="font-semibold text-slate-800 tabular-nums">{classStats.standardDeviation}</strong></span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Rentang Nilai</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {classStats.highestScore}
            </span>
            <span className="text-xs text-slate-400">/ min</span>
            <span className="text-lg font-bold text-slate-600 tabular-nums">
              {classStats.lowestScore}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Rentang selisih: <strong className="tabular-nums text-slate-700">{Math.round((classStats.highestScore - classStats.lowestScore) * 10) / 10}</strong> poin
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Ketuntasan Klasikal</span>
            <CheckCircle2 className={`w-4 h-4 ${classStats.isClassMastered ? 'text-emerald-600' : 'text-amber-500'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-bold tabular-nums ${classStats.passedPercentage >= 85 ? 'text-emerald-700' : 'text-amber-600'}`}>
              {classStats.passedPercentage}%
            </span>
            <span className="text-xs text-slate-500">({classStats.passedCount}/{classStats.participantCount})</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {classStats.isClassMastered ? 'Tuntas Klasikal (Target >=85%)' : 'Belum Mencapai Target 85%'}
          </div>
        </div>
      </div>

      {/* Baris Visualisasi Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Distribusi Nilai */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Distribusi Frekuensi Nilai Siswa</h2>
              <p className="text-xs text-slate-500">Sebaran nilai asesmen dalam 5 rentang interval</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3 pt-2">
            {scoreRanges.map((range) => {
              const pct = classStats.participantCount > 0 ? (range.count / classStats.participantCount) * 100 : 0;
              return (
                <div key={range.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 w-16">{range.label}</span>
                    <div className="flex items-center gap-2 text-slate-500 tabular-nums">
                      <span className="font-semibold text-slate-800">{range.count} Siswa</span>
                      <span>({Math.round(pct)}%)</span>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${range.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div>
              Batas Ketercapaian (KKTP): <span className="font-bold text-slate-900 tabular-nums">{assessment.kktp}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                <span>Tuntas: <strong className="tabular-nums font-semibold text-slate-800">{classStats.passedCount}</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                <span>Remedial: <strong className="tabular-nums font-semibold text-slate-800">{classStats.failedCount}</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Ringkasan Kualitas Butir Soal & Rekomendasi */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-900">Kualitas Butir Soal</h2>
              <button
                onClick={() => onNavigate('item_analysis')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
              >
                Detail
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Berdasarkan Indeks Kesukaran (P) & Daya Pembeda (D)
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-emerald-900">Dipertahankan</div>
                  <div className="text-[11px] text-emerald-700">Soal valid & diskriminatif</div>
                </div>
                <div className="text-xl font-bold text-emerald-800 tabular-nums">
                  {recKept} <span className="text-xs font-normal">soal</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-amber-900">Perlu Direvisi</div>
                  <div className="text-[11px] text-amber-700">Daya pembeda sedang/distraktor lemah</div>
                </div>
                <div className="text-xl font-bold text-amber-800 tabular-nums">
                  {recRevised} <span className="text-xs font-normal">soal</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-rose-900">Ditolak / Dibuang</div>
                  <div className="text-[11px] text-rose-700">Daya pembeda jelek atau negatif</div>
                </div>
                <div className="text-xl font-bold text-rose-800 tabular-nums">
                  {recRejected} <span className="text-xs font-normal">soal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Rumus: Metode Kelley Upper-Lower 27% & Klasifikasi Standar Pusmendik.
          </div>
        </div>
      </div>

      {/* Baris Ketercapaian Tujuan Pembelajaran (TP) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Ketercapaian Tujuan Pembelajaran (TP)</h2>
            <p className="text-xs text-slate-500">
              Persentase ketuntasan kompetensi materi kurikulum merdeka terhadap batas KKTP ({assessment.kktp}%)
            </p>
          </div>
          <button
            onClick={() => onNavigate('tp_analysis')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
          >
            Lihat Analisis TP
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tpAnalyses.map((tpRes) => {
            const isAchieved = tpRes.isAchieved;
            return (
              <div
                key={tpRes.tp.id}
                className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800">{tpRes.tp.code}</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        isAchieved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isAchieved ? 'Tercapai' : 'Perlu Remedial'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mb-1">
                    {tpRes.tp.material}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {tpRes.tp.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Rata-rata Capaian:</span>
                    <span className="font-bold tabular-nums text-slate-900">
                      {tpRes.averageScorePercentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isAchieved ? 'bg-emerald-600' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, tpRes.averageScorePercentage)}%` }}
                    />
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    {tpRes.studentsNotAchieved.length} siswa belum tuntas
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Baris Siswa Berprestasi & Tindak Lanjut Remedial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Siswa Perlu Remedial */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-semibold text-slate-900">
                Siswa Memerlukan Remedial ({remedialStudents.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigate('remedial')}
              className="text-xs text-rose-700 hover:text-rose-800 font-medium flex items-center gap-1"
            >
              Program Remedial
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Siswa dengan nilai di bawah batas KKTP ({assessment.kktp}). Memerlukan bimbingan atau tes ulang.
          </p>

          {remedialStudents.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
              Alhamdulillah, seluruh siswa telah mencapai batas KKTP!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {remedialStudents.slice(0, 5).map((item) => (
                <div key={item.student.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">{item.student.name}</span>
                    <span className="text-slate-400 text-[11px] ml-2">NIS: {item.student.nis}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 tabular-nums">{item.correctCount}/{assessment.questions.length} Benar</span>
                    <span className="font-bold text-rose-600 tabular-nums text-sm">
                      {item.finalScore}
                    </span>
                  </div>
                </div>
              ))}
              {remedialStudents.length > 5 && (
                <div className="pt-2 text-center text-xs text-slate-500">
                  + {remedialStudents.length - 5} siswa lainnya terdata di menu Remedial
                </div>
              )}
            </div>
          )}
        </div>

        {/* Siswa Berprestasi Tertinggi */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-semibold text-slate-900">
                Peringkat Teratas (Siap Pengayaan)
              </h2>
            </div>
            <button
              onClick={() => onNavigate('enrichment')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
            >
              Program Pengayaan
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Siswa dengan capaian tertinggi siap diberikan tantangan mandiri atau menjadi tutor sebaya.
          </p>

          <div className="divide-y divide-slate-100">
            {topStudents.map((item) => (
              <div key={item.student.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-[11px] tabular-nums">
                    {item.rank}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-800">{item.student.name}</span>
                    <span className="text-slate-400 text-[11px] ml-2">NIS: {item.student.nis}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 tabular-nums">{item.correctCount}/{assessment.questions.length} Benar</span>
                  <span className="font-bold text-emerald-700 tabular-nums text-sm">
                    {item.finalScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
