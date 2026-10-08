import React, { useState } from 'react';
import { Assessment, StudentGradingResult } from '../types';
import { Award, CheckCircle2, BookOpen, Save, Printer } from 'lucide-react';

interface EnrichmentViewProps {
  assessment: Assessment;
  gradedResults: StudentGradingResult[];
  onUpdateEnrichmentActivity: (studentId: string, activity: string) => void;
  onQuickPrint: () => void;
}

export const EnrichmentView: React.FC<EnrichmentViewProps> = ({
  assessment,
  gradedResults,
  onUpdateEnrichmentActivity,
  onQuickPrint,
}) => {
  const { kktp, studentAnswers } = assessment;
  const enrichmentStudents = gradedResults.filter((r) => r.isPassing);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [activityText, setActivityText] = useState('');

  const handleStartEdit = (studentId: string) => {
    const rec = studentAnswers[studentId];
    setEditingId(studentId);
    setActivityText(
      rec?.enrichmentActivity || 'Tutor Sebaya & Pemecahan Soal Penalaran (HOTS)'
    );
  };

  const handleSave = (studentId: string) => {
    onUpdateEnrichmentActivity(studentId, activityText);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Standar Pembelajaran Berdiferensiasi</span>
            <span aria-hidden="true">·</span>
            <span>KKTP: {kktp}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Program Pengayaan (Enrichment)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Daftar siswa yang telah mencapai kompetensi minimal dan siap diberikan penguatan bernalar kritis tingkat lanjut.
          </p>
        </div>

        <button
          onClick={onQuickPrint}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          Cetak Lembar Pengayaan
        </button>
      </div>

      {/* Info Card Ragam Kegiatan Pengayaan */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 mb-2">
          <Award className="w-4 h-4 text-emerald-700" />
          <span>Panduan Pelaksanaan Pengayaan Kurikulum Nasional:</span>
        </div>
        <ul className="text-xs text-emerald-800 space-y-1 list-disc list-inside">
          <li>
            <strong>Tutor Sebaya:</strong> Siswa berpencapaian tinggi mendampingi rekan sejawat yang memerlukan remedial pada sesi bimbingan terarah.
          </li>
          <li>
            <strong>Pendalaman Materi HOTS:</strong> Pemberian latihan pemecahan masalah konteks nyata dengan tingkat kognitif C4–C6 (Analisis, Evaluasi, Kreasi).
          </li>
          <li>
            <strong>Proyek Investigasi Mandiri:</strong> Penyusunan mini-makalah, infografis, atau eksperimen sederhana terkait materi.
          </li>
        </ul>
      </div>

      {/* Tabel Siswa Pengayaan */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            Daftar Peserta Pengayaan ({enrichmentStudents.length} Siswa)
          </span>
          <span className="text-slate-500">
            Seluruh siswa memiliki nilai &ge; {kktp}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3 w-12 text-center">No</th>
                <th className="py-2.5 px-3 w-24">NIS</th>
                <th className="py-2.5 px-3">Nama Siswa</th>
                <th className="py-2.5 px-3 w-20 text-center">L/P</th>
                <th className="py-2.5 px-3 w-24 text-center">Nilai Asesmen</th>
                <th className="py-2.5 px-3 w-20 text-center">Peringkat</th>
                <th className="py-2.5 px-3">Bentuk Kegiatan Pengayaan</th>
                <th className="py-2.5 px-3 w-24 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrichmentStudents.map((item, idx) => {
                const rec = studentAnswers[item.student.id];
                const isEditing = editingId === item.student.id;
                const activity =
                  rec?.enrichmentActivity ||
                  (item.rank <= 3
                    ? 'Tutor Sebaya & Pemecahan Masalah Kompetisi (HOTS)'
                    : 'Pendalaman Materi & Latihan Soal Penerapan Lanjutan');

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
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded tabular-nums">
                        {item.finalScore}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700 tabular-nums">
                      #{item.rank}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-slate-700">
                      {isEditing ? (
                        <input
                          type="text"
                          value={activityText}
                          onChange={(e) => setActivityText(e.target.value)}
                          className="w-full text-xs p-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      ) : (
                        activity
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isEditing ? (
                        <button
                          onClick={() => handleSave(item.student.id)}
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
                          Ubah
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
