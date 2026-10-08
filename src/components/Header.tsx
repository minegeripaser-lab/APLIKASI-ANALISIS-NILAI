import React from 'react';
import {
  SchoolProfile,
  TeacherProfile,
  Assessment,
} from '../types';
import {
  School,
  User,
  PlusCircle,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  BookOpenCheck,
} from 'lucide-react';

interface HeaderProps {
  school: SchoolProfile;
  teacher: TeacherProfile;
  assessments: Assessment[];
  activeAssessment: Assessment;
  onSelectAssessment: (id: string) => void;
  onOpenNewAssessmentModal: () => void;
  onOpenSchoolTeacherModal: () => void;
  onOpenFormulasModal: () => void;
  onExportExcel: () => void;
  onQuickPrint: () => void;
  onOpenLoginModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  school,
  teacher,
  assessments,
  activeAssessment,
  onSelectAssessment,
  onOpenNewAssessmentModal,
  onOpenSchoolTeacherModal,
  onOpenFormulasModal,
  onExportExcel,
  onQuickPrint,
  onOpenLoginModal,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element Brand */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                AG
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  AnalisGuru
                </span>
                <span className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:inline">
                  Sistem Analisis Asesmen & Butir Soal
                </span>
              </div>
            </a>

            {/* Assessment Selector Dropdown */}
            <div className="relative ml-2 sm:ml-4">
              <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg p-1 transition-colors">
                <select
                  value={activeAssessment.id}
                  onChange={(e) => onSelectAssessment(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 pr-6 pl-2 py-1 outline-none cursor-pointer appearance-none truncate max-w-[140px] sm:max-w-[220px]"
                >
                  {assessments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.className} - {a.subject})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none -ml-5 mr-1" />
                <button
                  onClick={onOpenNewAssessmentModal}
                  title="Buat Asesmen Baru"
                  className="p-1 hover:bg-white rounded text-emerald-700 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Zone 2: Contextual Metadata (No pills, clean unboxed text) */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600">
            <span className="font-medium text-slate-800">{school.schoolName}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{activeAssessment.subject} {activeAssessment.className}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>KKTP: <strong className="font-semibold text-slate-900">{activeAssessment.kktp}</strong></span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{activeAssessment.academicYear} ({activeAssessment.semester})</span>
          </div>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenFormulasModal}
              title="Rumus Psikometri & Panduan"
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <BookOpenCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Rumus Analisis</span>
            </button>

            <button
              onClick={onExportExcel}
              title="Ekspor Laporan Lengkap ke Excel (.xlsx)"
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Ekspor Excel</span>
            </button>

            <button
              onClick={onQuickPrint}
              title="Cetak Berkas Resmi / Simpan PDF"
              className="px-3 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak Dokumen</span>
            </button>

            {/* Teacher Profile / Login */}
            <button
              onClick={onOpenLoginModal}
              title={`Guru: ${teacher.teacherName}`}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px]">
                {teacher.teacherName ? teacher.teacherName.charAt(0) : 'G'}
              </div>
              <span className="hidden xl:inline truncate max-w-[110px]">{teacher.teacherName}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
