import React, { useRef, useState } from 'react';
import {
  Assessment,
  SchoolProfile,
  TeacherProfile,
} from '../types';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Check,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';
import {
  exportBackupJSON,
  importBackupJSON,
  sampleAssessment,
  defaultSchoolProfile,
  defaultTeacherProfile,
} from '../utils/storage';

interface BackupResetViewProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  assessments: Assessment[];
  activeAssessment: Assessment;
  onRestoreAll: (
    school: SchoolProfile,
    teacher: TeacherProfile,
    assessments: Assessment[]
  ) => void;
  onReloadSampleData: () => void;
  onDeleteCurrentAssessment: () => void;
}

export const BackupResetView: React.FC<BackupResetViewProps> = ({
  school,
  teacher,
  assessments,
  activeAssessment,
  onRestoreAll,
  onReloadSampleData,
  onDeleteCurrentAssessment,
}) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadBackup = () => {
    exportBackupJSON(school, teacher, assessments);
    setStatusMessage('File cadangan (backup JSON) berhasil diunduh ke komputer/HP Anda!');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setStatusMessage('Memulihkan data dari file...');
      const restored = await importBackupJSON(file);
      onRestoreAll(restored.school, restored.teacher, restored.assessments);
      setStatusMessage('Sukses! Seluruh data asesmen dan profil telah berhasil dipulihkan.');
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`Gagal memulihkan file: ${err?.message || 'Format tidak sesuai'}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const handleResetToSample = () => {
    onReloadSampleData();
    setStatusMessage('Data contoh Kurikulum Merdeka berhasil dimuat kembali!');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDeleteActive = () => {
    if (assessments.length <= 1) {
      setStatusMessage('Tidak dapat menghapus: ini adalah satu-satunya asesmen yang ada.');
      setTimeout(() => setStatusMessage(null), 4000);
      return;
    }

    onDeleteCurrentAssessment();
    setStatusMessage('Asesmen berhasil dihapus.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Manajemen Data Pendidikan</span>
          <span aria-hidden="true">·</span>
          <span>Keamanan & Pencadangan Offline</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Pencadangan, Pemulihan & Kelola Data Asesmen
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Seluruh data tersimpan aman di perangkat browser Anda (Local Storage) tanpa perlu khawatir kebocoran data. Lakukan pencadangan berkala agar file administrasi Anda selalu aman.
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Grid Menu Pencadangan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cadangkan Data (Backup) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Cadangkan Seluruh Data (Backup JSON)
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Unduh berkas JSON yang memuat seluruh identitas sekolah, profil guru, {assessments.length} paket asesmen, bank soal, dan seluruh lembar jawaban siswa. Berkas ini dapat disimpan di flashdisk, Google Drive, atau dipindahkan ke komputer lain.
            </p>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100">
            <button
              onClick={handleDownloadBackup}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              Unduh Cadangan Lengkap (.json)
            </button>
          </div>
        </div>

        {/* Pulihkan Data (Restore) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <Upload className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Pulihkan Data dari Berkas (Restore)
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Unggah file backup (.json) yang sebelumnya telah Anda unduh untuk mengembalikan seluruh penilaian siswa, kunci soal, dan laporan administrasi secara utuh.
            </p>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100">
            <label className="w-full py-2.5 px-4 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-700" />
              Pilih Berkas Cadangan (.json)
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleRestoreFile}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Zona Tindakan Lanjutan & Reset */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          Pemeliharaan & Reset Data
        </h2>

        <div className="divide-y divide-slate-100 text-xs">
          {/* Reload Contoh */}
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-slate-800">
                Muat Ulang Paket Contoh Kurikulum Merdeka
              </div>
              <p className="text-slate-500 text-[11px]">
                Mengembalikan paket asesmen percontohan matematika (20 Soal teranalisis, 24 Siswa) untuk keperluan demonstrasi atau uji coba rumus.
              </p>
            </div>
            <button
              onClick={handleResetToSample}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              Muat Data Contoh
            </button>
          </div>

          {/* Hapus Asesmen Aktif */}
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-rose-700">
                Hapus Asesmen Aktif Ini ({activeAssessment.title})
              </div>
              <p className="text-slate-500 text-[11px]">
                Menghapus paket ujian saat ini beserta butir soal dan jawaban siswanya dari penyimpanan.
              </p>
            </div>
            <button
              disabled={assessments.length <= 1}
              onClick={handleDeleteActive}
              className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0 disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              Hapus Asesmen Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
