import React, { useState } from 'react';
import { LearningObjective, QuestionItem, QuestionType } from '../types';
import {
  KeyRound,
  Plus,
  Trash2,
  Edit2,
  Check,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';

interface QuestionsManagerProps {
  questions: QuestionItem[];
  objectives: LearningObjective[];
  onUpdateQuestions: (newQuestions: QuestionItem[]) => void;
}

export const QuestionsManager: React.FC<QuestionsManagerProps> = ({
  questions,
  objectives,
  onUpdateQuestions,
}) => {
  const [quickKeyString, setQuickKeyString] = useState('');
  const [showQuickKeyModal, setShowQuickKeyModal] = useState(false);
  const [showBatchGenerateModal, setShowBatchGenerateModal] = useState(false);
  const [batchCount, setBatchCount] = useState(20);
  const [batchOptionsCount, setBatchOptionsCount] = useState(4);
  const [batchWeight, setBatchWeight] = useState(1);

  // Quick edit single question state
  const [editingNumber, setEditingNumber] = useState<number | null>(null);

  // Apply fast key string paste (e.g. "ABCDABCD...")
  const handleApplyQuickKeys = () => {
    const clean = quickKeyString.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (!clean) return;

    const updated = questions.map((q, idx) => {
      if (idx < clean.length && q.type === 'PG') {
        return {
          ...q,
          correctAnswer: clean[idx],
        };
      }
      return q;
    });

    onUpdateQuestions(updated);
    setShowQuickKeyModal(false);
    setQuickKeyString('');
  };

  // Generate batch of questions (e.g. 20, 25, 40 questions)
  const handleBatchGenerate = () => {
    const defaultTpId = objectives.length > 0 ? objectives[0].id : '';
    const newQuestions: QuestionItem[] = [];

    for (let i = 1; i <= batchCount; i++) {
      // Distribusikan ke TP yang ada secara merata
      const tpIndex = objectives.length > 0 ? (i - 1) % objectives.length : 0;
      const tp = objectives[tpIndex];

      newQuestions.push({
        number: i,
        type: 'PG',
        tpId: tp ? tp.id : defaultTpId,
        indicator: `Indikator soal nomor ${i}`,
        correctAnswer: 'A',
        maxScore: batchWeight,
        optionsCount: batchOptionsCount,
      });
    }

      onUpdateQuestions(newQuestions);
      setShowBatchGenerateModal(false);
    };

  const handleUpdateSingleField = (
    number: number,
    field: keyof QuestionItem,
    value: any
  ) => {
    const updated = questions.map((q) => {
      if (q.number === number) {
        return { ...q, [field]: value };
      }
      return q;
    });
    onUpdateQuestions(updated);
  };

  const handleAddQuestion = () => {
    const nextNum = questions.length + 1;
    const defaultTpId = objectives.length > 0 ? objectives[0].id : '';

    const newQ: QuestionItem = {
      number: nextNum,
      type: 'PG',
      tpId: defaultTpId,
      indicator: `Indikator soal nomor ${nextNum}`,
      correctAnswer: 'A',
      maxScore: 1,
      optionsCount: 4,
    };

    onUpdateQuestions([...questions, newQ]);
  };

  const handleDeleteQuestion = (number: number) => {
    const filtered = questions
      .filter((q) => q.number !== number)
      .map((q, idx) => ({ ...q, number: idx + 1 }));
    onUpdateQuestions(filtered);
  };

  const totalMaxScore = questions.reduce((sum, q) => sum + (q.maxScore || 1), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Instrumen Soal: <strong className="text-slate-800 tabular-nums">{questions.length} Butir</strong></span>
            <span aria-hidden="true">·</span>
            <span>Skor Maksimal Total: <strong className="text-slate-800 tabular-nums">{totalMaxScore}</strong></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kisi-Kisi, Bobot & Kunci Jawaban
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Atur kunci jawaban setiap butir soal, tipe soal (Pilihan Ganda/Isian/Uraian), bobot skor, dan tujuan pembelajaran terkait.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick key paste */}
          <button
            onClick={() => setShowQuickKeyModal(true)}
            className="px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5"
            title="Paste deretan huruf kunci sekaligus"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            Set Kunci Cepat
          </button>

          {/* Generator Cepat Jumlah Soal */}
          <button
            onClick={() => setShowBatchGenerateModal(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            Atur Jumlah Soal
          </button>

          {/* Tambah 1 Soal */}
          <button
            onClick={handleAddQuestion}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah 1 Soal
          </button>
        </div>
      </div>

      {/* Modal Input Kunci Sekaligus */}
      {showQuickKeyModal && (
        <div className="bg-white border-2 border-emerald-500 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Pengisian Kunci Jawaban Cepat (Paste String)
              </h2>
            </div>
            <button
              onClick={() => setShowQuickKeyModal(false)}
              className="text-xs text-slate-400 hover:text-slate-800"
            >
              Tutup
            </button>
          </div>

          <p className="text-xs text-slate-600 mb-3">
            Ketik atau paste deretan huruf kunci jawaban (misalnya:{' '}
            <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-700 font-bold">
              CBADBBCADABCDCBACDBA
            </code>
            ). Sistem akan otomatis memasangkannya secara berurutan ke nomor soal 1 hingga {questions.length}.
          </p>

          <div className="space-y-3">
            <input
              type="text"
              value={quickKeyString}
              onChange={(e) => setQuickKeyString(e.target.value.toUpperCase())}
              placeholder="Contoh: CBADBBCADABCDCBACDBA"
              className="w-full px-3 py-2 text-base font-mono tracking-widest uppercase border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Jumlah karakter diketik:{' '}
                <strong className="text-slate-800 font-mono tabular-nums">
                  {quickKeyString.replace(/[^A-Za-z]/g, '').length}
                </strong>{' '}
                / {questions.length} butir
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickKeyModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplyQuickKeys}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  Terapkan Kunci
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Generator Kisi-Kisi Cepat */}
      {showBatchGenerateModal && (
        <div className="bg-white border-2 border-slate-400 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Konfigurasi Format Asesmen & Jumlah Soal
            </h2>
            <button
              onClick={() => setShowBatchGenerateModal(false)}
              className="text-xs text-slate-400 hover:text-slate-800"
            >
              Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Soal
              </label>
              <select
                value={batchCount}
                onChange={(e) => setBatchCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value={10}>10 Soal (Format Kuis/Ulangan Harian Singkat)</option>
                <option value={15}>15 Soal</option>
                <option value={20}>20 Soal (Format STS / PTS Standar)</option>
                <option value={25}>25 Soal</option>
                <option value={30}>30 Soal</option>
                <option value={40}>40 Soal (Format SAS / Ujian Semester)</option>
                <option value={50}>50 Soal (Format Ujian Sekolah / Try Out)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Opsi Pilihan Ganda
              </label>
              <select
                value={batchOptionsCount}
                onChange={(e) => setBatchOptionsCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={4}>4 Opsi (A - D) - Jenjang SD / SMP / MTs</option>
                <option value={5}>5 Opsi (A - E) - Jenjang SMA / SMK / MA</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bobot Standar per Soal
              </label>
              <input
                type="number"
                min={1}
                value={batchWeight}
                onChange={(e) => setBatchWeight(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowBatchGenerateModal(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              onClick={handleBatchGenerate}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
            >
              Buat Instrumen Soal ({batchCount} Soal)
            </button>
          </div>
        </div>
      )}

      {/* Tabel Kisi-Kisi & Kunci Jawaban */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-3 w-14 text-center">No</th>
                <th className="py-3 px-3 w-28">Jenis Soal</th>
                <th className="py-3 px-3 w-32 text-center">Kunci Jawaban</th>
                <th className="py-3 px-3 w-20 text-center">Bobot</th>
                <th className="py-3 px-3 w-48">Tujuan Pembelajaran (TP)</th>
                <th className="py-3 px-3">Indikator Soal</th>
                <th className="py-3 px-3 w-16 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {questions.map((q) => {
                const options = q.optionsCount === 5 ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];

                return (
                  <tr key={q.number} className="hover:bg-slate-50/70 transition-colors">
                    {/* Nomor Soal */}
                    <td className="py-2 px-3 text-center font-bold text-slate-900 font-mono tabular-nums">
                      {q.number}
                    </td>

                    {/* Tipe Soal */}
                    <td className="py-2 px-3">
                      <select
                        value={q.type}
                        onChange={(e) =>
                          handleUpdateSingleField(q.number, 'type', e.target.value as QuestionType)
                        }
                        className="w-full text-xs py-1 px-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                      >
                        <option value="PG">Pilihan Ganda</option>
                        <option value="ISIAN">Isian Singkat</option>
                        <option value="URAIAN">Uraian / Essay</option>
                      </select>
                    </td>

                    {/* Kunci Jawaban */}
                    <td className="py-2 px-3 text-center">
                      {q.type === 'PG' ? (
                        <div className="flex items-center justify-center gap-1">
                          {options.map((opt) => {
                            const isSelected = q.correctAnswer === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleUpdateSingleField(q.number, 'correctAnswer', opt)}
                                className={`w-6 h-6 rounded text-xs font-bold transition-all ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white shadow-xs scale-105'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={q.correctAnswer}
                          onChange={(e) =>
                            handleUpdateSingleField(q.number, 'correctAnswer', e.target.value)
                          }
                          placeholder="Kunci teks/angka"
                          className="w-full text-xs py-1 px-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      )}
                    </td>

                    {/* Bobot */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min={1}
                        value={q.maxScore}
                        onChange={(e) =>
                          handleUpdateSingleField(q.number, 'maxScore', Number(e.target.value) || 1)
                        }
                        className="w-14 text-center text-xs py-1 px-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono tabular-nums"
                      />
                    </td>

                    {/* Link TP */}
                    <td className="py-2 px-3">
                      <select
                        value={q.tpId}
                        onChange={(e) => handleUpdateSingleField(q.number, 'tpId', e.target.value)}
                        className="w-full text-xs py-1 px-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        {objectives.map((tp) => (
                          <option key={tp.id} value={tp.id}>
                            {tp.code}: {tp.material}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Indikator */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={q.indicator}
                        onChange={(e) =>
                          handleUpdateSingleField(q.number, 'indicator', e.target.value)
                        }
                        placeholder="Deskripsi indikator soal..."
                        className="w-full text-xs py-1 px-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>

                    {/* Hapus */}
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => handleDeleteQuestion(q.number)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Hapus butir soal ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
