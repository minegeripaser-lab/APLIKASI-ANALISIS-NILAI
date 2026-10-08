import React, { useState } from 'react';
import { Assessment, LearningObjective, QuestionItem, Student } from '../types';
import { PlusCircle, Edit3, X, Check } from 'lucide-react';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentToEdit?: Assessment | null;
  onSaveAssessment: (assessment: Assessment) => void;
  defaultStudents: Student[];
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  assessmentToEdit,
  onSaveAssessment,
  defaultStudents,
}) => {
  if (!isOpen) return null;

  const isEdit = !!assessmentToEdit;

  const [title, setTitle] = useState(assessmentToEdit?.title || 'Sumatif Lingkup Materi 2');
  const [subject, setSubject] = useState(assessmentToEdit?.subject || 'Matematika');
  const [className, setClassName] = useState(assessmentToEdit?.className || 'VIII A');
  const [academicYear, setAcademicYear] = useState(assessmentToEdit?.academicYear || '2024/2025');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>(assessmentToEdit?.semester || 'Ganjil');
  const [date, setDate] = useState(assessmentToEdit?.date || new Date().toISOString().split('T')[0]);
  const [kktp, setKktp] = useState(assessmentToEdit?.kktp ?? 75);
  const [questionCount, setQuestionCount] = useState(assessmentToEdit?.questions.length || 20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && assessmentToEdit) {
      const updated: Assessment = {
        ...assessmentToEdit,
        title: title.trim(),
        subject: subject.trim(),
        className: className.trim(),
        academicYear: academicYear.trim(),
        semester,
        date,
        kktp: Number(kktp) || 75,
      };
      onSaveAssessment(updated);
    } else {
      // Create new assessment
      const defaultTPs: LearningObjective[] = [
        {
          id: `tp-${Date.now()}-1`,
          code: 'TP 1',
          material: 'Materi Pokok 1',
          description: 'Menganalisis dan menyelesaikan permasalahan kontekstual materi pokok 1',
        },
        {
          id: `tp-${Date.now()}-2`,
          code: 'TP 2',
          material: 'Materi Pokok 2',
          description: 'Menerapkan konsep penalaran kritis dalam pemecahan masalah materi pokok 2',
        },
      ];

      const questions: QuestionItem[] = [];
      for (let i = 1; i <= questionCount; i++) {
        const tp = i <= questionCount / 2 ? defaultTPs[0] : defaultTPs[1];
        questions.push({
          number: i,
          type: 'PG',
          tpId: tp.id,
          indicator: `Indikator soal nomor ${i}`,
          correctAnswer: 'A',
          maxScore: 1,
          optionsCount: 4,
        });
      }

      const emptyAnswers: Record<string, any> = {};
      defaultStudents.forEach((s) => {
        emptyAnswers[s.id] = { answers: {} };
      });

      const newAssessment: Assessment = {
        id: `asm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        subject: subject.trim(),
        className: className.trim(),
        academicYear: academicYear.trim(),
        semester,
        date,
        kktp: Number(kktp) || 75,
        remedialPolicy: 'max_kktp',
        questions,
        learningObjectives: defaultTPs,
        students: defaultStudents,
        studentAnswers: emptyAnswers,
      };

      onSaveAssessment(newAssessment);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isEdit ? 'Edit Pengaturan Asesmen Aktif' : 'Buat Asesmen / Ulangan Baru'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEdit ? 'Ubah judul, kelas, atau batas KKTP' : 'Tambahkan paket tes ulangan atau ujian baru'}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama / Judul Asesmen *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Sumatif Tengah Semester (STS) Ganjil"
              className="w-full text-xs sm:text-sm py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mata Pelajaran *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Matematika"
                className="w-full text-xs sm:text-sm py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rombel / Kelas *
              </label>
              <input
                type="text"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="VIII A"
                className="w-full text-xs sm:text-sm py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tahun Ajaran
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2024/2025"
                className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as 'Ganjil' | 'Genap')}
                className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                KKTP / KKM *
              </label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={kktp}
                onChange={(e) => setKktp(Number(e.target.value))}
                className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-emerald-500 text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Pelaksanaan
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {!isEdit && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jumlah Soal Awal
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  <option value={10}>10 Soal</option>
                  <option value={15}>15 Soal</option>
                  <option value={20}>20 Soal</option>
                  <option value={25}>25 Soal</option>
                  <option value={30}>30 Soal</option>
                  <option value={40}>40 Soal</option>
                  <option value={50}>50 Soal</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
            >
              {isEdit ? 'Perbarui Asesmen' : 'Buat Asesmen Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
