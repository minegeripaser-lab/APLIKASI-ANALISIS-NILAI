import React, { useState, useRef } from 'react';
import { Assessment, QuestionItem, Student } from '../types';
import {
  FileCheck,
  Smartphone,
  Grid,
  Zap,
  Check,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

interface AnswersInputMatrixProps {
  assessment: Assessment;
  onUpdateAnswers: (
    newStudentAnswers: Record<
      string,
      {
        answers: Record<number, string>;
        customScores?: Record<number, number>;
        remedialScore?: number;
        remedialDate?: string;
        remedialNotes?: string;
        enrichmentActivity?: string;
      }
    >
  ) => void;
}

export const AnswersInputMatrix: React.FC<AnswersInputMatrixProps> = ({
  assessment,
  onUpdateAnswers,
}) => {
  const { students, questions, studentAnswers, kktp } = assessment;

  // View modes: 'matrix' | 'batch_string' | 'mobile_card'
  const [viewMode, setViewMode] = useState<'matrix' | 'batch_string' | 'mobile_card'>('matrix');

  // Mobile card state: which student index is active
  const [activeStudentIndex, setActiveStudentIndex] = useState(0);

  // Batch paste state
  const [batchInputText, setBatchInputText] = useState('');
  const [batchStatus, setBatchStatus] = useState<string | null>(null);

  // Handle single cell update in matrix
  const handleAnswerChange = (studentId: string, qNumber: number, answerVal: string) => {
    const cleanVal = answerVal.trim().toUpperCase();
    const currentRec = studentAnswers[studentId] || { answers: {} };

    const updatedAnswers = {
      ...currentRec.answers,
      [qNumber]: cleanVal,
    };

    onUpdateAnswers({
      ...studentAnswers,
      [studentId]: {
        ...currentRec,
        answers: updatedAnswers,
      },
    });
  };

  // Quick single string input for one student (e.g. "CBAD...")
  const handleSingleStudentString = (studentId: string, strVal: string) => {
    const clean = strVal.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const ansMap: Record<number, string> = {};

    questions.forEach((q, idx) => {
      if (idx < clean.length) {
        ansMap[q.number] = clean[idx];
      }
    });

    const currentRec = studentAnswers[studentId] || { answers: {} };

    onUpdateAnswers({
      ...studentAnswers,
      [studentId]: {
        ...currentRec,
        answers: ansMap,
      },
    });
  };

  // Bulk paste all students at once
  // Format per baris: [NIS atau Nama] [Jawaban, misal ABCD...] atau hanya [Jawaban] per baris sesuai urutan siswa
  const handleApplyBatchPaste = () => {
    const lines = batchInputText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const newStudentAnswers = { ...studentAnswers };
    let filledCount = 0;

    lines.forEach((line, index) => {
      if (index >= students.length) return;
      const targetStudent = students[index];

      // Ambil karakter huruf saja atau bagian terakhir dari split spasi/tab
      const parts = line.split(/[\t,; ]+/);
      const answerStr = parts[parts.length - 1].toUpperCase();

      const ansMap: Record<number, string> = {};
      questions.forEach((q, qIdx) => {
        if (qIdx < answerStr.length) {
          ansMap[q.number] = answerStr[qIdx];
        }
      });

      newStudentAnswers[targetStudent.id] = {
        ...(newStudentAnswers[targetStudent.id] || { answers: {} }),
        answers: ansMap,
      };
      filledCount++;
    });

    onUpdateAnswers(newStudentAnswers);
    setBatchStatus(`Berhasil memperbarui jawaban ${filledCount} siswa secara massal!`);
    setTimeout(() => setBatchStatus(null), 3500);
  };

  // Clear answers confirmation
  const handleResetAnswers = () => {
    const empty: Record<string, any> = {};
    students.forEach((s) => {
      empty[s.id] = { answers: {} };
    });
    onUpdateAnswers(empty);
    setBatchStatus('Seluruh lembar jawaban siswa telah dikosongkan.');
    setTimeout(() => setBatchStatus(null), 3500);
  };

  const activeStudent = students[activeStudentIndex] || students[0];

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{students.length} Siswa Terdaftar</span>
            <span aria-hidden="true">·</span>
            <span>{questions.length} Butir Soal</span>
            <span aria-hidden="true">·</span>
            <span>KKTP: {kktp}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Input Jawaban & Koreksi Lembar Siswa
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Pilih metode input yang paling cepat: Matriks Tabel, Paste Teks Massal, atau Mode Layar Sentuh HP.
          </p>
        </div>

        {/* Segmented Mode Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'matrix'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Matriks Tabel
          </button>

          <button
            onClick={() => setViewMode('batch_string')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'batch_string'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            Paste Massal
          </button>

          <button
            onClick={() => setViewMode('mobile_card')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'mobile_card'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mode HP (Sentuh)
          </button>
        </div>
      </div>

      {batchStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{batchStatus}</span>
        </div>
      )}

      {/* MODE 1: MATRIKS TABEL LENGKAP */}
      {viewMode === 'matrix' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <span>
                Ketik huruf jawaban (<strong className="font-mono">A, B, C, D, E</strong>) pada setiap kotak.
              </span>
              <span className="hidden sm:inline">
                Kotak hijau: Benar · Kotak merah: Salah.
              </span>
            </div>
            <button
              onClick={handleResetAnswers}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Semua Jawaban
            </button>
          </div>

          <div className="overflow-x-auto max-h-[600px] relative">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs">
                <tr className="border-b border-slate-300 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3 w-10 text-center sticky left-0 z-30 bg-slate-100 border-r border-slate-200">
                    No
                  </th>
                  <th className="py-2.5 px-3 min-w-[160px] sticky left-10 z-30 bg-slate-100 border-r border-slate-200">
                    Nama Siswa
                  </th>
                  <th className="py-2.5 px-2 min-w-[120px] text-center border-r border-slate-200">
                    String Cepat
                  </th>
                  {questions.map((q) => (
                    <th
                      key={q.number}
                      className="py-2.5 px-1.5 w-10 text-center font-mono border-r border-slate-200"
                    >
                      <div>{q.number}</div>
                      <div className="text-[10px] font-bold text-emerald-700">
                        ({q.correctAnswer})
                      </div>
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-center min-w-[70px]">Benar</th>
                  <th className="py-2.5 px-3 text-center min-w-[70px]">Nilai</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {students.map((student, idx) => {
                  const rec = studentAnswers[student.id] || { answers: {} };
                  let correctCount = 0;
                  let rawScore = 0;
                  const totalMax = questions.reduce((s, q) => s + (q.maxScore || 1), 0);

                  // Construct current string representation
                  const currentStr = questions.map((q) => rec.answers?.[q.number] || '-').join('');

                  questions.forEach((q) => {
                    const ans = (rec.answers?.[q.number] || '').toUpperCase();
                    if (ans && ans === q.correctAnswer) {
                      correctCount++;
                      rawScore += q.maxScore || 1;
                    }
                  });

                  const finalScore = totalMax > 0 ? Math.round(((rawScore / totalMax) * 100) * 10) / 10 : 0;
                  const isPassing = finalScore >= kktp;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Nomor Urut (Sticky Left) */}
                      <td className="py-2 px-3 text-center font-mono font-medium text-slate-500 sticky left-0 z-10 bg-white border-r border-slate-200 tabular-nums">
                        {idx + 1}
                      </td>

                      {/* Nama Siswa (Sticky Left) */}
                      <td className="py-2 px-3 font-medium text-slate-900 sticky left-10 z-10 bg-white border-r border-slate-200 truncate max-w-[180px]">
                        <div>{student.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">NIS: {student.nis}</div>
                      </td>

                      {/* Input String Cepat Per Siswa */}
                      <td className="py-2 px-2 text-center border-r border-slate-200">
                        <input
                          type="text"
                          maxLength={questions.length}
                          defaultValue={currentStr.replace(/-/g, '')}
                          onBlur={(e) => handleSingleStudentString(student.id, e.target.value)}
                          placeholder="Paste..."
                          className="w-24 px-1.5 py-1 text-[11px] font-mono uppercase border border-slate-200 rounded text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>

                      {/* Cells Nomor Soal */}
                      {questions.map((q) => {
                        const ans = (rec.answers?.[q.number] || '').toUpperCase();
                        const isCorrect = ans && ans === q.correctAnswer;
                        const isWrong = ans && ans !== q.correctAnswer;

                        return (
                          <td
                            key={q.number}
                            className={`p-1 text-center border-r border-slate-200 ${
                              isCorrect
                                ? 'bg-emerald-50/70'
                                : isWrong
                                ? 'bg-rose-50/70'
                                : ''
                            }`}
                          >
                            <input
                              type="text"
                              maxLength={1}
                              value={ans}
                              onChange={(e) =>
                                handleAnswerChange(student.id, q.number, e.target.value)
                              }
                              className={`w-7 h-7 text-center font-mono font-bold uppercase rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                isCorrect
                                  ? 'border-emerald-400 text-emerald-800 bg-white'
                                  : isWrong
                                  ? 'border-rose-300 text-rose-700 bg-white'
                                  : 'border-slate-200 text-slate-700 bg-white'
                              }`}
                            />
                          </td>
                        );
                      })}

                      {/* Benar */}
                      <td className="py-2 px-3 text-center font-mono font-semibold text-slate-700 tabular-nums">
                        {correctCount}/{questions.length}
                      </td>

                      {/* Nilai Akhir */}
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`font-mono font-bold text-xs px-2 py-0.5 rounded tabular-nums ${
                            isPassing
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {finalScore}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 2: PASTE MASSAL (BULK PASTE STRING) */}
      {viewMode === 'batch_string' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Input Jawaban Massal (Batch String Paste)
              </h2>
              <p className="text-xs text-slate-500">
                Paste jawaban seluruh siswa sekaligus. 1 baris mewakili 1 siswa secara berurutan sesuai daftar kelas.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
            <strong>Petunjuk Format:</strong>
            <p className="mt-1">
              Setiap baris berisi huruf jawaban siswa tanpa spasi (panjang {questions.length} karakter).
            </p>
            <pre className="mt-2 p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-800">
              {students.slice(0, 3).map((s, i) => `${s.nis}\tCBADBBCADABCDCBACDBA`).join('\n')}
            </pre>
          </div>

          <div>
            <textarea
              rows={10}
              value={batchInputText}
              onChange={(e) => setBatchInputText(e.target.value)}
              placeholder={`Paste deretan jawaban siswa di sini...\nBaris 1 = Siswa 1 (${students[0]?.name || 'Siswa'})\nBaris 2 = Siswa 2 (${students[1]?.name || 'Siswa'})...`}
              className="w-full p-3 text-xs sm:text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-500">
              Total baris terdeteksi:{' '}
              <strong className="text-slate-800 font-mono">
                {batchInputText.split('\n').filter((l) => l.trim().length > 0).length}
              </strong>{' '}
              / {students.length} siswa
            </span>

            <button
              onClick={handleApplyBatchPaste}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              Terapkan Jawaban Massal
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: MODE LAYAR SENTUH HP / ANDROID */}
      {viewMode === 'mobile_card' && activeStudent && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          {/* Navigasi Siswa */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button
              disabled={activeStudentIndex <= 0}
              onClick={() => setActiveStudentIndex((prev) => Math.max(0, prev - 1))}
              className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-xs text-slate-500">
                Siswa {activeStudentIndex + 1} dari {students.length}
              </span>
              <h2 className="text-base font-bold text-slate-900">{activeStudent.name}</h2>
              <span className="text-xs font-mono text-slate-500">NIS: {activeStudent.nis}</span>
            </div>

            <button
              disabled={activeStudentIndex >= students.length - 1}
              onClick={() => setActiveStudentIndex((prev) => Math.min(students.length - 1, prev + 1))}
              className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Grid Tombol Pilihan Jawaban Besar untuk Jempol HP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {questions.map((q) => {
              const rec = studentAnswers[activeStudent.id] || { answers: {} };
              const currentAns = (rec.answers?.[q.number] || '').toUpperCase();
              const options = q.optionsCount === 5 ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];

              return (
                <div
                  key={q.number}
                  className={`p-3 rounded-lg border ${
                    currentAns === q.correctAnswer
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : currentAns
                      ? 'border-rose-200 bg-rose-50/30'
                      : 'border-slate-200 bg-slate-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-800 font-mono">Soal No.{q.number}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Kunci: <strong className="text-emerald-700">{q.correctAnswer}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1.5">
                    {options.map((opt) => {
                      const isSelected = currentAns === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleAnswerChange(activeStudent.id, q.number, opt)}
                          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all active:scale-95 ${
                            isSelected
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigasi Cepat Siswa Bawah */}
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <button
              disabled={activeStudentIndex <= 0}
              onClick={() => setActiveStudentIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40"
            >
              ← Siswa Sebelumnya
            </button>

            <button
              disabled={activeStudentIndex >= students.length - 1}
              onClick={() => setActiveStudentIndex((prev) => Math.min(students.length - 1, prev + 1))}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-40"
            >
              Siswa Selanjutnya →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
