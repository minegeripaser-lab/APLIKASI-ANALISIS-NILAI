import React, { useState } from 'react';
import { LearningObjective, QuestionItem } from '../types';
import { Target, Plus, Edit2, Trash2, CheckCircle2, Layers } from 'lucide-react';

interface ObjectivesManagerProps {
  objectives: LearningObjective[];
  questions: QuestionItem[];
  onUpdateObjectives: (newObjectives: LearningObjective[]) => void;
}

export const ObjectivesManager: React.FC<ObjectivesManagerProps> = ({
  objectives,
  questions,
  onUpdateObjectives,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    code: string;
    material: string;
    description: string;
  }>({
    code: '',
    material: '',
    description: '',
  });

  const handleStartAdd = () => {
    const nextNum = objectives.length + 1;
    setFormData({
      code: `TP ${nextNum}`,
      material: '',
      description: '',
    });
    setEditingId(null);
    setIsAdding(true);
  };

  const handleStartEdit = (item: LearningObjective) => {
    setFormData({
      code: item.code,
      material: item.material,
      description: item.description,
    });
    setEditingId(item.id);
    setIsAdding(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.description.trim()) return;

    if (editingId) {
      const updated = objectives.map((o) =>
        o.id === editingId ? { ...o, ...formData } : o
      );
      onUpdateObjectives(updated);
    } else {
      const newObj: LearningObjective = {
        id: `tp-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        code: formData.code.trim(),
        material: formData.material.trim(),
        description: formData.description.trim(),
      };
      onUpdateObjectives([...objectives, newObj]);
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onUpdateObjectives(objectives.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Kurikulum Merdeka / K-13</span>
            <span aria-hidden="true">·</span>
            <span>{objectives.length} Tujuan Pembelajaran Terdefinisi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tujuan Pembelajaran (TP) & Lingkup Materi
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Petakan kompetensi dasar dan tujuan pembelajaran yang diujikan dalam instrumen asesmen ini.
          </p>
        </div>

        <div>
          <button
            onClick={handleStartAdd}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah TP Baru
          </button>
        </div>
      </div>

      {/* Form Modal / In-page Add */}
      {isAdding && (
        <div className="bg-white border-2 border-emerald-500/30 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              {editingId ? 'Edit Tujuan Pembelajaran' : 'Tambah Tujuan Pembelajaran Baru'}
            </h2>
            <button
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode TP *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="TP 1 / TP 1.1"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Materi Pokok / Lingkup Materi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="Contoh: Pola Bilangan dan Deret Aritmetika"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deskripsi Tujuan Pembelajaran / Kompetensi Yang Diukur *
              </label>
              <textarea
                required
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Contoh: Peserta didik mampu menentukan suku ke-n dan jumlah n suku pertama dari barisan aritmetika..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {editingId ? 'Simpan Perubahan TP' : 'Tambah TP'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daftar Kartu TP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {objectives.map((tp) => {
          const linkedQuestions = questions.filter((q) => q.tpId === tp.id);
          const qNums = linkedQuestions.map((q) => q.number);

          return (
            <div
              key={tp.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded font-mono">
                      {tp.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {tp.material}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(tp)}
                      className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded"
                      title="Edit TP"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tp.id)}
                      className="p-1 text-slate-400 hover:text-rose-700 hover:bg-slate-100 rounded"
                      title="Hapus TP"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {tp.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Soal yang Mengukur:</span>
                <div>
                  {qNums.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {qNums.map((num) => (
                        <span
                          key={num}
                          className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-mono text-[11px] rounded font-semibold tabular-nums"
                        >
                          No.{num}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Belum ada butir soal</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
