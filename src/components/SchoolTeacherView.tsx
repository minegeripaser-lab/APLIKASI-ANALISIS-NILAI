import React, { useState } from 'react';
import { SchoolProfile, TeacherProfile } from '../types';
import { School, User, Check, Building2, MapPin, KeyRound, Award } from 'lucide-react';

interface SchoolTeacherViewProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  onSaveSchool: (profile: SchoolProfile) => void;
  onSaveTeacher: (profile: TeacherProfile) => void;
}

export const SchoolTeacherView: React.FC<SchoolTeacherViewProps> = ({
  school,
  teacher,
  onSaveSchool,
  onSaveTeacher,
}) => {
  const [schoolForm, setSchoolForm] = useState<SchoolProfile>({ ...school });
  const [teacherForm, setTeacherForm] = useState<TeacherProfile>({ ...teacher });
  const [schoolSuccess, setSchoolSuccess] = useState(false);
  const [teacherSuccess, setTeacherSuccess] = useState(false);

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchool(schoolForm);
    setSchoolSuccess(true);
    setTimeout(() => setSchoolSuccess(false), 2500);
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTeacher(teacherForm);
    setTeacherSuccess(true);
    setTimeout(() => setTeacherSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Identitas Satuan Pendidikan & Data Guru
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Informasi ini digunakan otomatis pada KOP Surat, lembar rekapitulasi nilai, berita acara asesmen, dan pengesahan tanda tangan dokumen resmi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulir Data Satuan Pendidikan */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Data Sekolah / Madrasah</h2>
              <p className="text-xs text-slate-500">Identitas lembaga pendidikan resmi</p>
            </div>
          </div>

          <form onSubmit={handleSchoolSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Sekolah / Madrasah *
              </label>
              <input
                type="text"
                required
                value={schoolForm.schoolName}
                onChange={(e) => setSchoolForm({ ...schoolForm, schoolName: e.target.value })}
                placeholder="Contoh: SMP NEGERI 1 NUSANTARA"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NPSN *
                </label>
                <input
                  type="text"
                  required
                  value={schoolForm.npsn}
                  onChange={(e) => setSchoolForm({ ...schoolForm, npsn: e.target.value })}
                  placeholder="Contoh: 30401892"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sebutan Pimpinan *
                </label>
                <select
                  value={schoolForm.headmasterTitle}
                  onChange={(e) => setSchoolForm({ ...schoolForm, headmasterTitle: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Kepala Sekolah">Kepala Sekolah</option>
                  <option value="Kepala Madrasah">Kepala Madrasah</option>
                  <option value="Plt. Kepala Sekolah">Plt. Kepala Sekolah</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Lembaga *
              </label>
              <input
                type="text"
                required
                value={schoolForm.address}
                onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                placeholder="Contoh: Jl. Pemuda Pendidikan No. 12"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kecamatan
                </label>
                <input
                  type="text"
                  value={schoolForm.district}
                  onChange={(e) => setSchoolForm({ ...schoolForm, district: e.target.value })}
                  placeholder="Kecamatan"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kota / Kabupaten *
                </label>
                <input
                  type="text"
                  required
                  value={schoolForm.city}
                  onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                  placeholder="Kab. Paser"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Provinsi *
                </label>
                <input
                  type="text"
                  required
                  value={schoolForm.province}
                  onChange={(e) => setSchoolForm({ ...schoolForm, province: e.target.value })}
                  placeholder="Kalimantan Timur"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama {schoolForm.headmasterTitle} (Lengkap Gelar) *
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolForm.principalName}
                    onChange={(e) => setSchoolForm({ ...schoolForm, principalName: e.target.value })}
                    placeholder="Drs. H. Ahmad Sudrajat, M.Pd."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP {schoolForm.headmasterTitle}
                  </label>
                  <input
                    type="text"
                    value={schoolForm.principalNIP}
                    onChange={(e) => setSchoolForm({ ...schoolForm, principalNIP: e.target.value })}
                    placeholder="19710315 199702 1 004 / -"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {schoolSuccess && (
                <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Data Sekolah berhasil disimpan!
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Simpan Data Sekolah
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Formulir Data Guru Pengampu */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Data Guru Pengampu</h2>
                <p className="text-xs text-slate-500">Profil pengajar & penanggung jawab penilaian</p>
              </div>
            </div>

            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Guru (Lengkap dengan Gelar) *
                </label>
                <input
                  type="text"
                  required
                  value={teacherForm.teacherName}
                  onChange={(e) => setTeacherForm({ ...teacherForm, teacherName: e.target.value })}
                  placeholder="Contoh: Nurul Hidayati, S.Pd., M.Ed."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP / NUPTK Guru
                </label>
                <input
                  type="text"
                  value={teacherForm.teacherNIP}
                  onChange={(e) => setTeacherForm({ ...teacherForm, teacherNIP: e.target.value })}
                  placeholder="Contoh: 19880422 201101 2 015 / -"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bidang Studi / Mata Pelajaran Utama *
                </label>
                <input
                  type="text"
                  required
                  value={teacherForm.subjectSpecialty}
                  onChange={(e) => setTeacherForm({ ...teacherForm, subjectSpecialty: e.target.value })}
                  placeholder="Contoh: Matematika"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PIN Keamanan Guru (4 Digit)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={teacherForm.pin}
                  onChange={(e) => setTeacherForm({ ...teacherForm, pin: e.target.value })}
                  placeholder="1234"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-widest max-w-[120px]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Digunakan untuk proteksi edit data nilai di HP atau komputer bersama.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {teacherSuccess && (
                  <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Profil Guru berhasil diperbarui!
                  </span>
                )}
                <div className="ml-auto">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Simpan Data Guru
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Pratinjau KOP Dokumen Resmi */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Pratinjau KOP Surat & Titi Mangsa Laporan
            </div>
            <div className="text-center font-serif py-2 border-b border-double border-slate-800">
              <div className="text-sm font-bold uppercase">{schoolForm.schoolName}</div>
              <div className="text-[11px] text-slate-600 font-sans">
                {schoolForm.address}, {schoolForm.city}, {schoolForm.province} · NPSN: {schoolForm.npsn}
              </div>
            </div>
            <div className="pt-3 text-[11px] text-slate-600 flex justify-between font-sans">
              <div>
                Mengetahui,<br />
                {schoolForm.headmasterTitle}<br /><br /><br />
                <strong>{schoolForm.principalName}</strong><br />
                NIP. {schoolForm.principalNIP || '-'}
              </div>
              <div className="text-right">
                {schoolForm.city}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br />
                Guru Mata Pelajaran<br /><br /><br />
                <strong>{teacherForm.teacherName}</strong><br />
                NIP. {teacherForm.teacherNIP || '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
