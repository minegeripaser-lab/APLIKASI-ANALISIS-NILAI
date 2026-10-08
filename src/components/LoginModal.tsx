import React, { useState } from 'react';
import { TeacherProfile } from '../types';
import { User, KeyRound, Check, X, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  onUpdateTeacher: (newTeacher: TeacherProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onUpdateTeacher,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [formName, setFormName] = useState(teacher.teacherName);
  const [formNIP, setFormNIP] = useState(teacher.teacherNIP);
  const [formMapel, setFormMapel] = useState(teacher.subjectSpecialty);
  const [formNewPin, setFormNewPin] = useState(teacher.pin);

  if (!isOpen) return null;

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === teacher.pin || !teacher.pin) {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('PIN yang Anda masukkan salah. Default PIN adalah 1234.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeacher({
      teacherName: formName.trim(),
      teacherNIP: formNIP.trim(),
      subjectSpecialty: formMapel.trim(),
      pin: formNewPin.trim() || '1234',
    });
    setIsEditingProfile(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Autentikasi Guru Pengampu</h2>
              <p className="text-xs text-slate-500">Sistem Keamanan Akses Penilaian</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isUnlocked ? (
          <form onSubmit={handleVerifyPin} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
              Guru Aktif: <strong className="text-slate-900">{teacher.teacherName}</strong>
              <div className="text-[11px] text-slate-400 mt-0.5 font-mono">NIP: {teacher.teacherNIP || '-'}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Masukkan PIN Guru (4 Digit)
              </label>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="1234"
                autoFocus
                className="w-full text-center tracking-widest text-lg font-mono py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1 text-center">
                Default PIN sistem: <strong className="font-mono">1234</strong>
              </p>
            </div>

            {errorMsg && (
              <div className="text-xs text-rose-600 font-medium text-center">
                {errorMsg}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Masuk / Buka Kunci
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-800 text-xs flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Autentikasi Terverifikasi. Anda dapat memperbarui profil dan PIN.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP / NUPTK</label>
              <input
                type="text"
                value={formNIP}
                onChange={(e) => setFormNIP(e.target.value)}
                className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
              <input
                type="text"
                value={formMapel}
                onChange={(e) => setFormMapel(e.target.value)}
                className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ganti PIN Baru</label>
              <input
                type="password"
                maxLength={6}
                value={formNewPin}
                onChange={(e) => setFormNewPin(e.target.value)}
                className="w-32 text-center font-mono tracking-widest text-sm py-1.5 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Tutup
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                Simpan Profil
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
