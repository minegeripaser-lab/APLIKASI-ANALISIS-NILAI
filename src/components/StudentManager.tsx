import React, { useState, useRef } from 'react';
import { Assessment, Student, StudentGradingResult } from '../types';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Download,
  Trash2,
  Edit2,
  Search,
  Check,
  AlertCircle,
  FileUp,
  Eye,
  Printer,
  CheckSquare,
  Square,
  X,
  FileCheck,
  AlertTriangle,
  Award,
  ChevronRight,
  ClipboardPaste,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import {
  parseStudentsFromExcel,
  parseStudentsFromText,
  downloadStudentTemplateExcel,
} from '../utils/excel';
import * as XLSX from 'xlsx';

interface StudentManagerProps {
  students: Student[];
  onUpdateStudents: (newStudents: Student[]) => void;
  className: string;
  assessment?: Assessment;
  gradedResults?: StudentGradingResult[];
  onUpdateStudentAnswers?: (studentId: string, answers: Record<number, string>) => void;
  onNavigateToTab?: (tab: any) => void;
  onPrintStudentReport?: (studentId: string) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  onUpdateStudents,
  className,
  assessment,
  gradedResults = [],
  onUpdateStudentAnswers,
  onNavigateToTab,
  onPrintStudentReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'L' | 'P'>('ALL');

  // Selection state for batch actions
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Modal states
  const [isAdding, setIsAdding] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<Student | null>(null);
  const [isBatchDeleteConfirm, setIsBatchDeleteConfirm] = useState(false);

  // Dedicated Import Modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importModeTab, setImportModeTab] = useState<'excel' | 'paste'>('excel');
  const [importStrategy, setImportStrategy] = useState<'replace' | 'append'>('replace');
  const [pastedText, setPastedText] = useState('');
  const [previewStudents, setPreviewStudents] = useState<Student[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);

  // Form input state (manual add/edit)
  const [formData, setFormData] = useState<{
    nis: string;
    nisn: string;
    name: string;
    gender: 'L' | 'P';
  }>({
    nis: '',
    nisn: '',
    name: '',
    gender: 'L',
  });

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.includes(searchTerm) ||
      s.nisn.includes(searchTerm);
    const matchesGender = genderFilter === 'ALL' || s.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  // Toggle selection
  const handleToggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleToggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Start add
  const handleStartAdd = () => {
    setFormData({
      nis: String(students.length + 1).padStart(4, '0'),
      nisn: '',
      name: '',
      gender: 'L',
    });
    setEditingStudentId(null);
    setIsAdding(true);
  };

  // Start edit
  const handleStartEdit = (student: Student) => {
    setFormData({
      nis: student.nis,
      nisn: student.nisn,
      name: student.name,
      gender: student.gender,
    });
    setEditingStudentId(student.id);
    setIsAdding(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingStudentId) {
      // Edit
      const updated = students.map((s) =>
        s.id === editingStudentId ? { ...s, ...formData } : s
      );
      onUpdateStudents(updated);
      showNotification(`Data siswa "${formData.name}" berhasil diperbarui!`);
    } else {
      // Add
      const newStudent: Student = {
        id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        nis: formData.nis.trim(),
        nisn: formData.nisn.trim(),
        name: formData.name.trim(),
        gender: formData.gender,
      };
      onUpdateStudents([...students, newStudent]);
      showNotification(`Siswa "${formData.name}" berhasil ditambahkan!`);
    }

    setIsAdding(false);
    setEditingStudentId(null);
  };

  // Delete single student
  const confirmDeleteStudent = (student: Student) => {
    setDeleteConfirmStudent(student);
  };

  const executeDeleteStudent = () => {
    if (!deleteConfirmStudent) return;
    const studentName = deleteConfirmStudent.name;
    const updated = students.filter((s) => s.id !== deleteConfirmStudent.id);
    onUpdateStudents(updated);
    setSelectedStudentIds((prev) => prev.filter((id) => id !== deleteConfirmStudent.id));
    setDeleteConfirmStudent(null);
    if (detailStudent?.id === deleteConfirmStudent.id) {
      setDetailStudent(null);
    }
    showNotification(`Siswa "${studentName}" berhasil dihapus dari daftar asesmen.`);
  };

  // Batch delete
  const executeBatchDelete = () => {
    const updated = students.filter((s) => !selectedStudentIds.includes(s.id));
    const count = selectedStudentIds.length;
    onUpdateStudents(updated);
    setSelectedStudentIds([]);
    setIsBatchDeleteConfirm(false);
    showNotification(`${count} siswa berhasil dihapus secara massal.`);
  };

  // Auto-renumber NIS
  const handleAutoRenumberNIS = () => {
    const startNIS = '2401';
    const updated = students.map((s, idx) => ({
      ...s,
      nis: String(Number(startNIS) + idx).padStart(4, '0'),
    }));
    onUpdateStudents(updated);
    showNotification('Nomor Induk Siswa (NIS) berhasil dirapikan secara berurutan!');
  };

  // Export selected students
  const handleExportSelected = () => {
    const toExport = students.filter((s) =>
      selectedStudentIds.length > 0 ? selectedStudentIds.includes(s.id) : true
    );

    const rows = toExport.map((s, idx) => {
      const result = gradedResults.find((r) => r.student.id === s.id);
      return {
        'No': idx + 1,
        'NIS': s.nis,
        'NISN': s.nisn || '-',
        'Nama Siswa': s.name,
        'Jenis Kelamin': s.gender,
        'Nilai Asesmen': result?.finalScore ?? '-',
        'Status': result ? (result.isPassing ? 'TUNTAS' : 'BELUM TUNTAS') : '-',
        'Peringkat': result?.rank ?? '-',
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Data_Siswa_${className}`);
    XLSX.writeFile(wb, `Data_Siswa_Kelas_${className.replace(/\s+/g, '_')}.xlsx`);
  };

  // Open import modal
  const handleOpenImportModal = () => {
    setPreviewStudents([]);
    setImportError(null);
    setImportFileName(null);
    setPastedText('');
    setImportStrategy('replace');
    setIsImportModalOpen(true);
  };

  // Handle Excel file chosen in modal
  const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportFileName(file.name);
    setIsParsingFile(true);

    try {
      const parsed = await parseStudentsFromExcel(file);
      if (parsed.length === 0) {
        setImportError(
          'Tidak dapat menemukan data nama siswa pada berkas tersebut. Pastikan berkas memiliki kolom Nama atau gunakan format template.'
        );
        setPreviewStudents([]);
      } else {
        setPreviewStudents(parsed);
      }
    } catch (err: any) {
      console.error('Error parsing file:', err);
      setImportError(`Gagal membaca file: ${err?.message || 'Format tidak didukung'}`);
      setPreviewStudents([]);
    } finally {
      setIsParsingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle pasted text parse
  const handleParsePastedText = () => {
    if (!pastedText.trim()) {
      setImportError('Silakan tempel (paste) teks daftar nama siswa terlebih dahulu.');
      return;
    }

    setImportError(null);
    const parsed = parseStudentsFromText(pastedText);
    if (parsed.length === 0) {
      setImportError('Tidak ada nama siswa yang terdeteksi dari teks yang ditempelkan.');
      setPreviewStudents([]);
    } else {
      setPreviewStudents(parsed);
    }
  };

  // Commit imported students into state
  const handleCommitImport = () => {
    if (previewStudents.length === 0) return;

    if (importStrategy === 'replace') {
      onUpdateStudents(previewStudents);
      showNotification(
        `Berhasil mengimpor ${previewStudents.length} siswa baru (menggantikan data lama)!`
      );
    } else {
      // Append strategy
      const existingNames = new Set(students.map((s) => s.name.toLowerCase()));
      const toAdd = previewStudents.filter((s) => !existingNames.has(s.name.toLowerCase()));
      onUpdateStudents([...students, ...toAdd]);
      showNotification(
        `Berhasil menambahkan ${toAdd.length} siswa baru ke daftar yang sudah ada!`
      );
    }

    setIsImportModalOpen(false);
    setPreviewStudents([]);
    setSelectedStudentIds([]);
  };

  // Update answer for single student inside detail modal
  const handleDetailAnswerChange = (qNum: number, letter: string) => {
    if (!detailStudent || !assessment || !onUpdateStudentAnswers) return;
    const currentRec = assessment.studentAnswers[detailStudent.id]?.answers || {};
    const updatedAnswers = {
      ...currentRec,
      [qNum]: letter.toUpperCase(),
    };
    onUpdateStudentAnswers(detailStudent.id, updatedAnswers);
  };

  const detailResult = detailStudent
    ? gradedResults.find((r) => r.student.id === detailStudent.id)
    : null;

  return (
    <div className="space-y-6">
      {/* Header & Aksi Import */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Rombel / Kelas: <strong className="text-slate-800">{className}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Total Siswa Terdaftar: <strong className="text-slate-800 tabular-nums">{students.length} Orang</strong></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Data Siswa & Manajemen Rombongan Belajar
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola data siswa, lihat rincian lembar jawaban per siswa, lakukan koreksi, atau impor dari file Excel Dapodik / EMIS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Template */}
          <button
            onClick={downloadStudentTemplateExcel}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="Unduh Format Excel Template"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Format Template
          </button>

          {/* Tombol Impor Data Siswa (Membuka Modal Impor Interaktif) */}
          <button
            onClick={handleOpenImportModal}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileUp className="w-4 h-4 text-emerald-700" />
            Impor Data Siswa (Excel / Teks)
          </button>

          {/* Tambah Manual */}
          <button
            onClick={handleStartAdd}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Tambah Siswa
          </button>
        </div>
      </div>

      {/* Status Alert Notification */}
      {notificationMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Baris Aksi Massal */}
      {selectedStudentIds.length > 0 && (
        <div className="bg-slate-900 text-white rounded-xl p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] tabular-nums">
              {selectedStudentIds.length}
            </span>
            <span>Siswa Dipilih</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAutoRenumberNIS}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              Rapikan NIS Berurutan
            </button>
            <button
              onClick={handleExportSelected}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Ekspor Siswa Terpilih
            </button>
            <button
              onClick={() => setIsBatchDeleteConfirm(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus ({selectedStudentIds.length})
            </button>
            <button
              onClick={() => setSelectedStudentIds([])}
              className="p-1.5 text-slate-400 hover:text-white rounded"
              title="Batal Pilih"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL IMPOR DATA SISWA RESMI & FLEKSIBEL (EXCEL & PASTE TEKS) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-5 animate-scaleUp">
            {/* Header Modal Impor */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <FileUp className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Impor Data Siswa Kelas {className}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Unggah berkas Excel / CSV atau tempel teks daftar nama siswa secara langsung
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Tab Pilihan Metode Impor */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => {
                  setImportModeTab('excel');
                  setImportError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                  importModeTab === 'excel'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                Unggah File Excel (.xlsx / .xls / .csv)
              </button>

              <button
                onClick={() => {
                  setImportModeTab('paste');
                  setImportError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                  importModeTab === 'paste'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ClipboardPaste className="w-4 h-4 text-blue-700" />
                Salin & Tempel (Copy-Paste) Teks
              </button>
            </div>

            {/* KONTEN TAB 1: UNGGAH BERKAS EXCEL */}
            {importModeTab === 'excel' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-emerald-50/20 transition-all flex flex-col items-center justify-center">
                  <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-700 mb-1">
                    Pilih file Excel dari komputer atau HP Anda
                  </p>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Mendukung format .xlsx, .xls, dan .csv (Dapodik, EMIS, atau format sendiri)
                  </p>

                  <label className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors shadow-xs">
                    {isParsingFile ? 'Membaca Berkas...' : 'Jelajahi File Excel'}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChosen}
                      className="hidden"
                    />
                  </label>

                  {importFileName && (
                    <div className="mt-3 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Berkas terpilih: {importFileName}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>Perlu format baku?</span>
                  <button
                    onClick={downloadStudentTemplateExcel}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh Format Template Excel
                  </button>
                </div>
              </div>
            )}

            {/* KONTEN TAB 2: COPY-PASTE TEKS LANGSUNG */}
            {importModeTab === 'paste' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Salin (Copy) daftar nama dari Excel, Word, atau pesan, lalu tempel (Paste) di kotak berikut. Setiap baris mewakili 1 siswa:
                </p>

                <textarea
                  rows={6}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={`Contoh baris per baris:\n2401\tAhmad Fauzi Pratama\tL\n2402\tAnnisa Putri Rahmawati\tP\n2403\tBagas Dwi Santoso\tL`}
                  className="w-full p-3 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleParsePastedText}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                  >
                    Proses & Deteksi Daftar Siswa
                  </button>
                </div>
              </div>
            )}

            {/* Pesan Error Jika Ada */}
            {importError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {/* PRATINJAU HASIL BACAAN (LIVE PREVIEW) */}
            {previewStudents.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Pratinjau Data Terdeteksi:
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full tabular-nums">
                      {previewStudents.length} Siswa Ditemukan
                    </span>
                  </div>

                  {/* Pilihan Strategi Impor */}
                  <div className="flex items-center gap-2 text-xs">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="importStrategy"
                        value="replace"
                        checked={importStrategy === 'replace'}
                        onChange={() => setImportStrategy('replace')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-slate-700 font-medium">Gantikan Data Lama</span>
                    </label>

                    <label className="flex items-center gap-1 cursor-pointer ml-2">
                      <input
                        type="radio"
                        name="importStrategy"
                        value="append"
                        checked={importStrategy === 'append'}
                        onChange={() => setImportStrategy('append')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-slate-700 font-medium">Tambahkan ke Yang Ada</span>
                    </label>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 sticky top-0 font-semibold">
                      <tr>
                        <th className="p-2 w-10 text-center">No</th>
                        <th className="p-2 w-20">NIS</th>
                        <th className="p-2">Nama Siswa</th>
                        <th className="p-2 w-16 text-center">L/P</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewStudents.map((s, idx) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-2 text-center text-slate-500 font-mono tabular-nums">
                            {idx + 1}
                          </td>
                          <td className="p-2 font-mono text-slate-700 tabular-nums">{s.nis}</td>
                          <td className="p-2 font-medium text-slate-900">{s.name}</td>
                          <td className="p-2 text-center">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                s.gender === 'L'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-pink-50 text-pink-700'
                              }`}
                            >
                              {s.gender}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Footer Modal Impor */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={previewStudents.length === 0}
                onClick={handleCommitImport}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                Terapkan & Simpan {previewStudents.length} Data Siswa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT MANUAL */}
      {isAdding && (
        <div className="bg-white border-2 border-emerald-500/40 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              {editingStudentId ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
            </h2>
            <button
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSaveStudent} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIS *
              </label>
              <input
                type="text"
                required
                value={formData.nis}
                onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                placeholder="2401"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NISN (Opsional)
              </label>
              <input
                type="text"
                value={formData.nisn}
                onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                placeholder="0098765432"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Siswa *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ahmad Fauzi"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Kelamin *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="L">Laki-Laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>

            <div className="sm:col-span-4 flex justify-end gap-2 pt-2">
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
                {editingStudentId ? 'Perbarui Data Siswa' : 'Simpan Siswa'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Pencarian */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa, NIS, atau NISN..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter Gender (Segmented controls) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setGenderFilter('ALL')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              genderFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({students.length})
          </button>
          <button
            onClick={() => setGenderFilter('L')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              genderFilter === 'L'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Laki-laki ({students.filter((s) => s.gender === 'L').length})
          </button>
          <button
            onClick={() => setGenderFilter('P')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              genderFilter === 'P'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Perempuan ({students.filter((s) => s.gender === 'P').length})
          </button>
        </div>
      </div>

      {/* Tabel Data Siswa dengan Tombol Aksi Lengkap & Aktif */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-3 w-10 text-center">
                  <button
                    onClick={handleToggleSelectAll}
                    title="Pilih Semua Siswa"
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    {selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 w-12 text-center">No</th>
                <th className="py-3 px-3 w-20">NIS</th>
                <th className="py-3 px-3 w-28">NISN</th>
                <th className="py-3 px-4">Nama Lengkap Siswa</th>
                <th className="py-3 px-3 w-16 text-center">L/P</th>
                <th className="py-3 px-3 w-24 text-center">Nilai</th>
                <th className="py-3 px-3 w-24 text-center">Status</th>
                <th className="py-3 px-4 text-center min-w-[200px]">Aksi Pengelolaan Siswa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                    Tidak ada data siswa yang cocok dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  const result = gradedResults.find((r) => r.student.id === student.id);
                  const isPassing = result?.isPassing ?? false;

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleSelectStudent(student.id)}
                          className="p-1 text-slate-400 hover:text-slate-700"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                      </td>

                      {/* No */}
                      <td className="py-2.5 px-3 text-center text-slate-500 font-mono text-xs tabular-nums">
                        {index + 1}
                      </td>

                      {/* NIS */}
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700 text-xs tabular-nums">
                        {student.nis}
                      </td>

                      {/* NISN */}
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-xs tabular-nums">
                        {student.nisn || '-'}
                      </td>

                      {/* Nama */}
                      <td className="py-2.5 px-4 font-medium text-slate-900">
                        {student.name}
                      </td>

                      {/* L/P */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            student.gender === 'L'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-pink-50 text-pink-700'
                          }`}
                        >
                          {student.gender}
                        </span>
                      </td>

                      {/* Nilai Asesmen */}
                      <td className="py-2.5 px-3 text-center">
                        {result ? (
                          <span className="font-mono font-bold text-slate-900 tabular-nums">
                            {result.finalScore}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Status Ketuntasan */}
                      <td className="py-2.5 px-3 text-center">
                        {result ? (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isPassing
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {isPassing ? 'TUNTAS' : 'REMEDIAL'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>

                      {/* KOLOM AKSI LENGKAP & BERFUNGSI AKTIF */}
                      <td className="py-2.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* 1. Detail & Analisis Jawaban Siswa */}
                          <button
                            onClick={() => setDetailStudent(student)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1"
                            title="Buka Lembar Jawaban & Analisis Hasil Siswa Ini"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Detail</span>
                          </button>

                          {/* 2. Cetak Kartu Individual Siswa */}
                          <button
                            onClick={() => {
                              if (onPrintStudentReport) {
                                onPrintStudentReport(student.id);
                              } else if (onNavigateToTab) {
                                onNavigateToTab('reports');
                              }
                            }}
                            className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                            title="Cetak Kartu Hasil Asesmen Siswa Ini"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. Edit Profil Siswa */}
                          <button
                            onClick={() => handleStartEdit(student)}
                            className="p-1 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                            title="Edit Data Siswa (Nama, NIS, NISN, L/P)"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* 4. Hapus Siswa dengan Dialog Konfirmasi */}
                          <button
                            onClick={() => confirmDeleteStudent(student)}
                            className="p-1 text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded-md transition-colors"
                            title="Hapus Siswa dari Asesmen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: DETAIL LENGKAP & KOREKSI JAWABAN SISWA */}
      {detailStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-5">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  {detailStudent.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{detailStudent.name}</h2>
                  <div className="text-xs text-slate-500 font-mono">
                    NIS: {detailStudent.nis} · NISN: {detailStudent.nisn || '-'} · L/P: {detailStudent.gender}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDetailStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Statistik Ringkas Siswa */}
            {detailResult && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[11px] text-slate-500">Nilai Akhir</div>
                  <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                    {detailResult.finalScore}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Status Capaian</div>
                  <div
                    className={`text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded ${
                      detailResult.isPassing
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {detailResult.isPassing ? 'TUNTAS (>= KKTP)' : 'BELUM TUNTAS'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Peringkat Kelas</div>
                  <div className="text-xl font-bold font-mono text-slate-800 tabular-nums">
                    #{detailResult.rank}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Benar / Salah</div>
                  <div className="text-sm font-bold font-mono text-slate-800 tabular-nums mt-1">
                    <span className="text-emerald-700">{detailResult.correctCount}</span> /{' '}
                    <span className="text-rose-600">{detailResult.incorrectCount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tabel Lembar Jawaban Siswa dengan Fitur Koreksi Cepat di Tempat */}
            {assessment && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Lembar Jawaban Siswa & Kunci Jawaban
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Klik huruf untuk mengubah/mengoreksi jawaban secara langsung
                  </span>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0">
                      <tr>
                        <th className="py-2 px-3 text-center w-12">No</th>
                        <th className="py-2 px-3 w-28">TP / Materi</th>
                        <th className="py-2 px-3 text-center w-20">Kunci</th>
                        <th className="py-2 px-3 text-center w-28">Jawaban Siswa</th>
                        <th className="py-2 px-3 text-center w-20">Status</th>
                        <th className="py-2 px-3">Ubah Pilihan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {assessment.questions.map((q) => {
                        const studentAns = (
                          assessment.studentAnswers[detailStudent.id]?.answers?.[q.number] || ''
                        ).toUpperCase();
                        const isCorrect = studentAns && studentAns === q.correctAnswer;
                        const isWrong = studentAns && studentAns !== q.correctAnswer;
                        const options = q.optionsCount === 5 ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];

                        return (
                          <tr
                            key={q.number}
                            className={`hover:bg-slate-50/70 ${
                              isCorrect ? 'bg-emerald-50/30' : isWrong ? 'bg-rose-50/30' : ''
                            }`}
                          >
                            <td className="py-2 px-3 text-center font-mono font-bold">{q.number}</td>
                            <td className="py-2 px-3 text-slate-600 truncate max-w-[120px]">
                              {q.indicator || `Soal ${q.number}`}
                            </td>
                            <td className="py-2 px-3 text-center font-mono font-bold text-emerald-700">
                              {q.correctAnswer}
                            </td>
                            <td className="py-2 px-3 text-center font-mono font-bold text-sm">
                              {studentAns || <span className="text-slate-300">-</span>}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {isCorrect ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                  BENAR
                                </span>
                              ) : isWrong ? (
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                                  SALAH
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">KOSONG</span>
                              )}
                            </td>
                            <td className="py-2 px-3">
                              {q.type === 'PG' && (
                                <div className="flex items-center gap-1">
                                  {options.map((opt) => (
                                    <button
                                      key={opt}
                                      onClick={() => handleDetailAnswerChange(q.number, opt)}
                                      className={`w-5 h-5 rounded text-[11px] font-bold transition-all ${
                                        studentAns === opt
                                          ? 'bg-slate-900 text-white'
                                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tombol Aksi di Modal Detail */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  if (onPrintStudentReport) {
                    onPrintStudentReport(detailStudent.id);
                  }
                  setDetailStudent(null);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Rapor / Kartu Hasil Siswa Ini
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleStartEdit(detailStudent);
                    setDetailStudent(null);
                  }}
                  className="px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg"
                >
                  Edit Data Siswa
                </button>
                <button
                  onClick={() => setDetailStudent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: KONFIRMASI HAPUS SISWA TUNGGAL */}
      {deleteConfirmStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus Siswa dari Asesmen?</h3>
                <p className="text-xs text-slate-500">Konfirmasi tindakan penghapusan data</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <div>
                Nama: <strong>{deleteConfirmStudent.name}</strong>
              </div>
              <div>
                NIS: <span className="font-mono">{deleteConfirmStudent.nis}</span> · Jenis Kelamin:{' '}
                {deleteConfirmStudent.gender}
              </div>
              <p className="text-slate-500 text-[11px] pt-1">
                Seluruh data jawaban ulangan dan nilai milik siswa ini akan dihapus dari perhitungan asesmen.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmStudent(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={executeDeleteStudent}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Ya, Hapus Siswa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: KONFIRMASI HAPUS MASSAL */}
      {isBatchDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus {selectedStudentIds.length} Siswa Terpilih?</h3>
                <p className="text-xs text-slate-500">Penghapusan massal data siswa</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus sebanyak{' '}
              <strong className="text-slate-900">{selectedStudentIds.length} data siswa</strong> yang telah dicentang beserta seluruh lembar jawaban mereka? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBatchDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={executeBatchDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus {selectedStudentIds.length} Siswa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
