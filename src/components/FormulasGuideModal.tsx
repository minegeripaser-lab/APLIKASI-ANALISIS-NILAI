import React from 'react';
import { BookOpenCheck, X, CheckCircle, Calculator, Sigma } from 'lucide-react';

interface FormulasGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulasGuideModal: React.FC<FormulasGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <BookOpenCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Transparansi Rumus Psikometrik & Kaidah Evaluasi
              </h2>
              <p className="text-xs text-slate-500">
                Standar Pusat Asesmen Pendidikan (Pusmendik) Kemendikbudristek RI & Teori Tes Klasik (CTT)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Rumus Nilai Akhir */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-600" />
            1. Perhitungan Skor Mentah & Nilai Akhir Siswa
          </h3>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800">
            Nilai Akhir = (Total Skor Mentah Diperoleh / Total Bobot Maksimum) × 100
          </div>
          <p className="text-xs text-slate-600">
            Status <strong>TUNTAS</strong> diberikan jika Nilai Akhir &ge; KKTP (Kriteria Ketercapaian Tujuan Pembelajaran) yang ditetapkan oleh guru mata pelajaran.
          </p>
        </div>

        {/* 2. Rumus Tingkat Kesukaran (P) */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sigma className="w-4 h-4 text-blue-600" />
            2. Indeks Tingkat Kesukaran (Difficulty Index - P)
          </h3>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800">
            P = B / N
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <p>Di mana: <strong>B</strong> = Jumlah siswa yang menjawab benar, <strong>N</strong> = Total peserta ujian.</p>
            <div className="grid grid-cols-3 gap-2 pt-1 font-sans">
              <div className="p-2 bg-blue-50 rounded text-center">
                <span className="font-bold text-blue-900">P &gt; 0.70</span>
                <p className="text-[11px] text-blue-700">Kategori Mudah</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded text-center">
                <span className="font-bold text-emerald-900">0.30 &le; P &le; 0.70</span>
                <p className="text-[11px] text-emerald-700">Kategori Sedang (Ideal)</p>
              </div>
              <div className="p-2 bg-rose-50 rounded text-center">
                <span className="font-bold text-rose-900">P &lt; 0.30</span>
                <p className="text-[11px] text-rose-700">Kategori Sukar</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Rumus Daya Pembeda (D) */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sigma className="w-4 h-4 text-indigo-600" />
            3. Indeks Daya Pembeda (Discrimination Index - D)
          </h3>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800">
            D = (B_A / N_A) - (B_B / N_B)
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <p>
              Menggunakan metode pembagian kelompok <strong>Kelly (27% Upper dan 27% Lower Group)</strong> setelah siswa diurutkan berdasarkan peringkat nilai.
            </p>
            <ul className="list-disc list-inside space-y-1 pt-1">
              <li><strong>D &ge; 0.40:</strong> Sangat Baik (Dapat membedakan siswa pandai dan kurang pandai dengan sangat tajam).</li>
              <li><strong>0.30 &le; D &lt; 0.40:</strong> Baik (Soal berfungsi memuaskan).</li>
              <li><strong>0.20 &le; D &lt; 0.30:</strong> Cukup (Dapat digunakan namun memerlukan perbaikan atau revisi kalimat).</li>
              <li><strong>0.00 &le; D &lt; 0.20:</strong> Jelek (Ditolak / tidak diskriminatif).</li>
              <li><strong>D &lt; 0.00:</strong> Sangat Buruk / Negatif (Kunci jawaban diduga keliru atau soal memiliki pengecoh yang membingungkan siswa berprestasi).</li>
            </ul>
          </div>
        </div>

        {/* 4. Kaidah Efektivitas Distraktor */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-600" />
            4. Kriteria Efektivitas Pengecoh (Distractor Analysis)
          </h3>
          <div className="text-xs text-slate-600 space-y-1">
            <p>Setiap pilihan jawaban salah (bukan kunci) pada butir pilihan ganda dinilai berfungsi efektif jika:</p>
            <ol className="list-decimal list-inside space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <li>Dipilih oleh sekurang-kurangnya <strong>5% dari total seluruh peserta ujian</strong>.</li>
              <li>Lebih banyak dipilih oleh <strong>Kelompok Bawah</strong> daripada <strong>Kelompok Atas</strong> (N_B &ge; N_A).</li>
            </ol>
          </div>
        </div>

        {/* 5. Statistik Klasikal */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sigma className="w-4 h-4 text-purple-600" />
            5. Statistik Deskriptif & Ketuntasan Klasikal
          </h3>
          <div className="text-xs text-slate-600 space-y-1">
            <p><strong>Standar Deviasi (&sigma;):</strong> Akar kuadrat dari variansi sebaran nilai siswa terhadap nilai rata-rata kelas.</p>
            <p><strong>Ketuntasan Klasikal:</strong> Tercapai apabila sekurang-kurangnya <strong>85%</strong> siswa dalam satu rombongan belajar mencapai batas KKTP (Standar Direktorat Jenderal Pendidikan Dasar dan Menengah).</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
