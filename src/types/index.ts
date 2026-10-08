export type QuestionType = 'PG' | 'ISIAN' | 'URAIAN';

export interface SchoolProfile {
  schoolName: string;
  npsn: string;
  address: string;
  district: string;
  city: string;
  province: string;
  principalName: string;
  principalNIP: string;
  headmasterTitle: string; // e.g. "Kepala Sekolah" atau "Kepala Madrasah"
}

export interface TeacherProfile {
  teacherName: string;
  teacherNIP: string;
  subjectSpecialty: string;
  pin: string; // 4-digit PIN for quick teacher login
}

export interface LearningObjective {
  id: string;
  code: string; // e.g. "TP 1", "TP 2"
  material: string; // Materi Pokok
  description: string; // Deskripsi Tujuan Pembelajaran
}

export interface QuestionItem {
  number: number;
  type: QuestionType;
  tpId: string; // Foreign key to LearningObjective.id
  indicator: string; // Indikator Soal
  correctAnswer: string; // 'A', 'B', 'C', 'D', 'E' or numeric/text
  maxScore: number; // Bobot / Skor Maksimum
  optionsCount: number; // 4 (A-D) or 5 (A-E)
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
}

export interface StudentAnswerRecord {
  // Key is question number: answer text or letter
  answers: Record<number, string>;
  // For essay/manual scores if applicable: question number -> awarded score
  customScores?: Record<number, number>;
  remedialScore?: number;
  remedialDate?: string;
  remedialNotes?: string;
  enrichmentActivity?: string;
}

export interface Assessment {
  id: string;
  title: string; // e.g. "Sumatif Lingkup Materi 1", "Penilaian Tengah Semester"
  subject: string; // Mata Pelajaran
  className: string; // Kelas, e.g. "VII A", "VIII B", "X MIPA 1"
  academicYear: string; // e.g. "2024/2025"
  semester: 'Ganjil' | 'Genap';
  date: string; // YYYY-MM-DD
  kktp: number; // Kriteria Ketercapaian Tujuan Pembelajaran / KKM (e.g. 75)
  remedialPolicy: 'max_kktp' | 'pure_remedial' | 'average'; // Aturan nilai akhir remedial
  questions: QuestionItem[];
  learningObjectives: LearningObjective[];
  students: Student[];
  studentAnswers: Record<string, StudentAnswerRecord>; // studentId -> StudentAnswerRecord
}

// Psychometric Analysis Types
export interface StudentGradingResult {
  student: Student;
  rawScore: number;
  maxScore: number;
  finalScore: number; // Skala 0-100
  correctCount: number;
  incorrectCount: number;
  percentageCorrect: number;
  isPassing: boolean; // >= KKTP
  rank: number;
  remedialFinalScore?: number;
}

export interface DistractorFrequency {
  option: string;
  countUpper: number;
  countLower: number;
  countTotal: number;
  percentageTotal: number;
  isKey: boolean;
  isEffective: boolean; // Distraktor berfungsi jika dipilih minimal 5% peserta dan lebih banyak kelompok bawah
  statusNote: string;
}

export interface ItemAnalysisResult {
  questionNumber: number;
  question: QuestionItem;
  tp?: LearningObjective;
  totalParticipants: number;
  correctUpper: number;
  correctLower: number;
  correctTotal: number;
  incorrectTotal: number;
  
  // Tingkat Kesukaran (P)
  difficultyIndex: number; // P = B / N
  difficultyCategory: 'Mudah' | 'Sedang' | 'Sukar';
  
  // Daya Pembeda (D)
  discriminationIndex: number; // D = (Ba/Na) - (Bb/Nb)
  discriminationCategory: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Jelek' | 'Sangat Buruk';
  
  // Distraktor Analysis (for Multiple Choice)
  distractors: DistractorFrequency[];
  
  // Rekomendasi
  recommendation: 'Dipertahankan' | 'Dipertahankan (Revisi Kecil)' | 'Direvisi' | 'Ditolak/Dibuang';
  recommendationNote: string;
}

export interface TPAnalysisResult {
  tp: LearningObjective;
  questionNumbers: number[];
  averageScorePercentage: number;
  isAchieved: boolean; // >= KKTP
  studentsNotAchieved: {
    student: Student;
    scorePercentage: number;
  }[];
}

export interface ClassStatistics {
  participantCount: number;
  highestScore: number;
  lowestScore: number;
  meanScore: number;
  medianScore: number;
  standardDeviation: number;
  passedCount: number;
  failedCount: number;
  passedPercentage: number;
  failedPercentage: number;
  isClassMastered: boolean; // >= 75% or 85% tuntas klasikal
}
