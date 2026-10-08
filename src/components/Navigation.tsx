import React from 'react';
import {
  LayoutDashboard,
  School,
  Users,
  Target,
  KeyRound,
  FileCheck,
  BarChart2,
  ListChecks,
  AlertCircle,
  Award,
  Printer,
  Database,
} from 'lucide-react';

export type TabKey =
  | 'dashboard'
  | 'school_teacher'
  | 'students'
  | 'objectives'
  | 'questions'
  | 'answers'
  | 'item_analysis'
  | 'tp_analysis'
  | 'remedial'
  | 'enrichment'
  | 'reports'
  | 'backup';

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  remedialCount: number;
  enrichmentCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  remedialCount,
  enrichmentCount,
}) => {
  const tabs: { key: TabKey; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'school_teacher', label: 'Data Sekolah & Guru', icon: School },
    { key: 'students', label: 'Siswa & Kelas', icon: Users },
    { key: 'objectives', label: 'Materi & TP', icon: Target },
    { key: 'questions', label: 'Soal & Kunci', icon: KeyRound },
    { key: 'answers', label: 'Input Jawaban', icon: FileCheck },
    { key: 'item_analysis', label: 'Analisis Butir Soal', icon: BarChart2 },
    { key: 'tp_analysis', label: 'Analisis per TP', icon: ListChecks },
    { key: 'remedial', label: 'Remedial', icon: AlertCircle, badge: remedialCount },
    { key: 'enrichment', label: 'Pengayaan', icon: Award, badge: enrichmentCount },
    { key: 'reports', label: 'Laporan & Cetak', icon: Printer },
    { key: 'backup', label: 'Kelola Data', icon: Database },
  ];

  return (
    <nav className="no-print bg-white border-b border-slate-200 sticky top-16 z-30 overflow-x-auto shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 py-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                      tab.key === 'remedial'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
