import {
  Assessment,
  LearningObjective,
  QuestionItem,
  SchoolProfile,
  Student,
  TeacherProfile,
} from '../types';

export const STORAGE_KEY_SCHOOL = 'analisguru_school_v1';
export const STORAGE_KEY_TEACHER = 'analisguru_teacher_v1';
export const STORAGE_KEY_ASSESSMENTS = 'analisguru_assessments_v1';
export const STORAGE_KEY_ACTIVE_ASSESSMENT_ID = 'analisguru_active_assessment_id_v1';

export const defaultSchoolProfile: SchoolProfile = {
  schoolName: 'SMP NEGERI 1 NUSANTARA',
  npsn: '30401892',
  address: 'Jl. Pemuda Pendidikan No. 12, Kel. Tana Paser',
  district: 'Paser',
  city: 'Kabupaten Paser',
  province: 'Kalimantan Timur',
  principalName: 'Drs. H. Ahmad Sudrajat, M.Pd.',
  principalNIP: '19710315 199702 1 004',
  headmasterTitle: 'Kepala Sekolah',
};

export const defaultTeacherProfile: TeacherProfile = {
  teacherName: 'Nurul Hidayati, S.Pd., M.Ed.',
  teacherNIP: '19880422 201101 2 015',
  subjectSpecialty: 'Matematika',
  pin: '1234',
};

// 4 Tujuan Pembelajaran realistis Kurikulum Merdeka Matematika SMP Kelas VIII
export const sampleObjectives: LearningObjective[] = [
  {
    id: 'tp-1',
    code: 'TP 1',
    material: 'Pola Bilangan & Barisan',
    description: 'Menentukan suku ke-n dan jumlah suku pada barisan aritmetika serta geometri.',
  },
  {
    id: 'tp-2',
    code: 'TP 2',
    material: 'Koordinat Kartesius',
    description: 'Menentukan posisi titik dan relasi kedudukan garis terhadap sumbu-X dan sumbu-Y.',
  },
  {
    id: 'tp-3',
    code: 'TP 3',
    material: 'Relasi dan Fungsi',
    description: 'Mendefinisikan relasi, menentukan daerah hasil fungsi, dan menyajikan dalam grafik.',
  },
  {
    id: 'tp-4',
    code: 'TP 4',
    material: 'Persamaan Garis Lurus',
    description: 'Menganalisis gradien kemiringan garis dan menyusun persamaan garis lurus.',
  },
];

// 20 Soal Pilihan Ganda & Isian terkalibrasi dengan kunci dan indikator
export const sampleQuestions: QuestionItem[] = [
  { number: 1, type: 'PG', tpId: 'tp-1', indicator: 'Menentukan suku berikutnya dari pola barisan bertingkat', correctAnswer: 'C', maxScore: 1, optionsCount: 4 },
  { number: 2, type: 'PG', tpId: 'tp-1', indicator: 'Menghitung suku ke-25 dari barisan aritmetika sederhana', correctAnswer: 'B', maxScore: 1, optionsCount: 4 },
  { number: 3, type: 'PG', tpId: 'tp-1', indicator: 'Menentukan rumus suku ke-n pada barisan geometri', correctAnswer: 'A', maxScore: 1, optionsCount: 4 },
  { number: 4, type: 'PG', tpId: 'tp-1', indicator: 'Menyelesaikan masalah kontekstual pola kursi gedung pertunjukan', correctAnswer: 'D', maxScore: 1, optionsCount: 4 },
  { number: 5, type: 'PG', tpId: 'tp-1', indicator: 'Menghitung jumlah 10 suku pertama deret aritmetika', correctAnswer: 'B', maxScore: 1, optionsCount: 4 },
  { number: 6, type: 'PG', tpId: 'tp-2', indicator: 'Menentukan kuadran letak titik koordinat (-4, 6)', correctAnswer: 'B', maxScore: 1, optionsCount: 4 },
  { number: 7, type: 'PG', tpId: 'tp-2', indicator: 'Menghitung jarak antara dua titik koordinat pada bidang kartesius', correctAnswer: 'C', maxScore: 1, optionsCount: 4 },
  { number: 8, type: 'PG', tpId: 'tp-2', indicator: 'Menentukan kedudukan garis yang sejajar dengan sumbu-X', correctAnswer: 'A', maxScore: 1, optionsCount: 4 },
  { number: 9, type: 'PG', tpId: 'tp-2', indicator: 'Menentukan titik potong dua garis saling tegak lurus', correctAnswer: 'D', maxScore: 1, optionsCount: 4 },
  { number: 10, type: 'PG', tpId: 'tp-2', indicator: 'Menentukan luas bangun datar segitiga dari 3 titik sudut koordinat', correctAnswer: 'C', maxScore: 1, optionsCount: 4 },
  { number: 11, type: 'PG', tpId: 'tp-3', indicator: 'Membedakan relasi yang merupakan pemetaan/fungsi', correctAnswer: 'A', maxScore: 1, optionsCount: 4 },
  { number: 12, type: 'PG', tpId: 'tp-3', indicator: 'Menghitung nilai f(5) pada rumus fungsi linear f(x) = 3x - 7', correctAnswer: 'B', maxScore: 1, optionsCount: 4 },
  { number: 13, type: 'PG', tpId: 'tp-3', indicator: 'Menentukan rumus fungsi jika diketahui f(2) dan f(4)', correctAnswer: 'D', maxScore: 1, optionsCount: 4 },
  { number: 14, type: 'PG', tpId: 'tp-3', indicator: 'Menghitung banyaknya korespondensi satu-satu antara dua himpunan', correctAnswer: 'C', maxScore: 1, optionsCount: 4 },
  { number: 15, type: 'PG', tpId: 'tp-3', indicator: 'Menganalisis domain dan kodomain dari diagram panah', correctAnswer: 'B', maxScore: 1, optionsCount: 4 },
  { number: 16, type: 'PG', tpId: 'tp-4', indicator: 'Menghitung kemiringan (gradien) garis yang melalui dua titik', correctAnswer: 'A', maxScore: 1, optionsCount: 4 },
  { number: 17, type: 'PG', tpId: 'tp-4', indicator: 'Menentukan gradien dari persamaan 4x - 2y + 8 = 0', correctAnswer: 'C', maxScore: 1, optionsCount: 4 },
  { number: 18, type: 'PG', tpId: 'tp-4', indicator: 'Menyusun persamaan garis melalui titik (2, -3) bergradien 4', correctAnswer: 'D', maxScore: 1, optionsCount: 4 },
  { number: 19, type: 'PG', tpId: 'tp-4', indicator: 'Menentukan persamaan garis yang tegak lurus terhadap garis lain', correctAnswer: 'B', maxScore: 1, optionsCount: 4 },
  { number: 20, type: 'PG', tpId: 'tp-4', indicator: 'Menyelesaikan permasalahan grafik tarif taksi online berbasis fungsi linear', correctAnswer: 'A', maxScore: 1, optionsCount: 4 },
];

export const sampleStudents: Student[] = [
  { id: 's-01', nis: '8101', nisn: '0091234501', name: 'Aditya Pratama', gender: 'L' },
  { id: 's-02', nis: '8102', nisn: '0091234502', name: 'Aisyah Rahmawati', gender: 'P' },
  { id: 's-03', nis: '8103', nisn: '0091234503', name: 'Bayu Saputra', gender: 'L' },
  { id: 's-04', nis: '8104', nisn: '0091234504', name: 'Citra Kirana', gender: 'P' },
  { id: 's-05', nis: '8105', nisn: '0091234505', name: 'Dimas Anggara', gender: 'L' },
  { id: 's-06', nis: '8106', nisn: '0091234506', name: 'Dinda Permata', gender: 'P' },
  { id: 's-07', nis: '8107', nisn: '0091234507', name: 'Fajar Nugroho', gender: 'L' },
  { id: 's-08', nis: '8108', nisn: '0091234508', name: 'Fitri Handayani', gender: 'P' },
  { id: 's-09', nis: '8109', nisn: '0091234509', name: 'Galih Ramadhan', gender: 'L' },
  { id: 's-10', nis: '8110', nisn: '0091234510', name: 'Hana Safitri', gender: 'P' },
  { id: 's-11', nis: '8111', nisn: '0091234511', name: 'Ilham Kurniawan', gender: 'L' },
  { id: 's-12', nis: '8112', nisn: '0091234512', name: 'Intan Nuraini', gender: 'P' },
  { id: 's-13', nis: '8113', nisn: '0091234513', name: 'Joko Susilo', gender: 'L' },
  { id: 's-14', nis: '8114', nisn: '0091234514', name: 'Kartika Sari', gender: 'P' },
  { id: 's-15', nis: '8115', nisn: '0091234515', name: 'Lukman Hakim', gender: 'L' },
  { id: 's-16', nis: '8116', nisn: '0091234516', name: 'Melati Indah', gender: 'P' },
  { id: 's-17', nis: '8117', nisn: '0091234517', name: 'Naufal Rizky', gender: 'L' },
  { id: 's-18', nis: '8118', nisn: '0091234518', name: 'Putri Wulandari', gender: 'P' },
  { id: 's-19', nis: '8119', nisn: '0091234519', name: 'Rendy Pangestu', gender: 'L' },
  { id: 's-20', nis: '8120', nisn: '0091234520', name: 'Rina Kusuma', gender: 'P' },
  { id: 's-21', nis: '8121', nisn: '0091234521', name: 'Satria Dewa', gender: 'L' },
  { id: 's-22', nis: '8122', nisn: '0091234522', name: 'Tiara Andini', gender: 'P' },
  { id: 's-23', nis: '8123', nisn: '0091234523', name: 'Wahyu Hidayat', gender: 'L' },
  { id: 's-24', nis: '8124', nisn: '0091234524', name: 'Zahra Aulia', gender: 'P' },
];

// Pola jawaban siswa yang menghasilkan sebaran nilai realistis (ada siswa tinggi, sedang, dan butuh remedial)
// Kunci: [1:C, 2:B, 3:A, 4:D, 5:B, 6:B, 7:C, 8:A, 9:D, 10:C, 11:A, 12:B, 13:D, 14:C, 15:B, 16:A, 17:C, 18:D, 19:B, 20:A]
const rawAnswerPatterns: Record<string, string> = {
  // Kelompok Atas (Skor 90 - 100)
  's-02': 'CBADBBCADABCDCBACDBA', // Aisyah: 20/20 = 100
  's-24': 'CBADBBCADABCDCBACDBB', // Zahra: 19/20 = 95 (no 20 B)
  's-17': 'CBADBBCADABCDCAACDBA', // Naufal: 19/20 = 95 (no 15 A)
  's-10': 'CBADBBCADABCDCBACDDA', // Hana: 19/20 = 95 (no 19 D)
  's-04': 'CBADBBCBDABCDCBACDBA', // Citra: 19/20 = 95 (no 8 B)
  's-01': 'CBADBBCADACDCBACDBAA', // Aditya: 18/20 = 90
  's-22': 'CBADBACADABCDCBACDBA', // Tiara: 19/20 = 95

  // Kelompok Menengah Atas (Skor 75 - 85 - Tuntas)
  's-06': 'CBADBBCADBBCDCBACDBA', // Dinda: 17/20 = 85
  's-08': 'CBACBBCADABCDCBCCDBA', // Fitri: 17/20 = 85
  's-12': 'CBADABCADABCDCBACDCA', // Intan: 17/20 = 85
  's-14': 'CBBDBBCADABCDCBACDBA', // Kartika: 18/20 = 90
  's-16': 'CBADBBCADACBCBACDBAA', // Melati: 17/20 = 85
  's-18': 'CBADBBCADDBBDCBACDBA', // Putri: 16/20 = 80
  's-20': 'CBADBBCADABCBCBACDCA', // Rina: 17/20 = 85
  's-03': 'CBADBBCACABCDCBACDBB', // Bayu: 17/20 = 85
  's-07': 'CBAABBCADABCDCBABDBA', // Fajar: 16/20 = 80
  's-11': 'CBADBBCADABCDCBAADBA', // Ilham: 16/20 = 80

  // Kelompok Bawah / Perlu Remedial (Skor di bawah KKTP 75: 50 - 70)
  's-05': 'CAADBBCDDABCACBACDBB', // Dimas: 13/20 = 65
  's-09': 'DBADBBCADABCBCBACCCA', // Galih: 14/20 = 70
  's-13': 'CBADBCCADABCDCBBADBA', // Joko: 14/20 = 70
  's-15': 'ABADBBCDDABCCCBACDAA', // Lukman: 12/20 = 60
  's-19': 'CAADABCADABCCCBAADBA', // Rendy: 11/20 = 55
  's-21': 'CAADBACDDABCCCBAADBA', // Satria: 10/20 = 50
  's-23': 'DAADABCADABCCCBAADAA', // Wahyu: 11/20 = 55
};

export const sampleStudentAnswers: Record<string, { answers: Record<number, string>; remedialScore?: number; remedialDate?: string; remedialNotes?: string; enrichmentActivity?: string }> = {};

Object.entries(rawAnswerPatterns).forEach(([studentId, str]) => {
  const ansMap: Record<number, string> = {};
  for (let i = 0; i < str.length; i++) {
    ansMap[i + 1] = str[i];
  }

  // Pre-seed remedial data for struggling students to showcase the feature
  let remedialScore: number | undefined = undefined;
  let remedialDate: string | undefined = undefined;
  let remedialNotes: string | undefined = undefined;
  let enrichmentActivity: string | undefined = undefined;

  if (studentId === 's-05') {
    remedialScore = 78;
    remedialDate = '2024-10-14';
    remedialNotes = 'Bimbingan pola barisan geometri & penugasan mandiri';
  } else if (studentId === 's-15') {
    remedialScore = 75;
    remedialDate = '2024-10-14';
    remedialNotes = 'Tutor sebaya koordinat kartesius dan gradien garis';
  } else if (studentId === 's-02') {
    enrichmentActivity = 'Tutor Sebaya & Pemecahan Soal Olimpiade OSN Matematika';
  } else if (studentId === 's-24') {
    enrichmentActivity = 'Penyusunan modul ringkasan rumus matematika untuk mading kelas';
  }

  sampleStudentAnswers[studentId] = {
    answers: ansMap,
    remedialScore,
    remedialDate,
    remedialNotes,
    enrichmentActivity,
  };
});

export const sampleAssessment: Assessment = {
  id: 'asm-mat-viii-sts-1',
  title: 'Sumatif Tengah Semester (STS) Ganjil',
  subject: 'Matematika',
  className: 'VIII A',
  academicYear: '2024/2025',
  semester: 'Ganjil',
  date: '2024-10-08',
  kktp: 75,
  remedialPolicy: 'max_kktp',
  questions: sampleQuestions,
  learningObjectives: sampleObjectives,
  students: sampleStudents,
  studentAnswers: sampleStudentAnswers,
};

// Storage helper functions
export function loadSchoolProfile(): SchoolProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCHOOL);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse school profile from storage', e);
  }
  return defaultSchoolProfile;
}

export function saveSchoolProfile(profile: SchoolProfile): void {
  localStorage.setItem(STORAGE_KEY_SCHOOL, JSON.stringify(profile));
}

export function loadTeacherProfile(): TeacherProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEACHER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse teacher profile from storage', e);
  }
  return defaultTeacherProfile;
}

export function saveTeacherProfile(profile: TeacherProfile): void {
  localStorage.setItem(STORAGE_KEY_TEACHER, JSON.stringify(profile));
}

export function loadAssessments(): Assessment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ASSESSMENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse assessments from storage', e);
  }
  return [sampleAssessment];
}

export function saveAssessments(assessments: Assessment[]): void {
  localStorage.setItem(STORAGE_KEY_ASSESSMENTS, JSON.stringify(assessments));
}

export function loadActiveAssessmentId(): string {
  const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_ASSESSMENT_ID);
  if (activeId) return activeId;
  return sampleAssessment.id;
}

export function saveActiveAssessmentId(id: string): void {
  localStorage.setItem(STORAGE_KEY_ACTIVE_ASSESSMENT_ID, id);
}

/**
 * Backup all data to a single JSON file
 */
export function exportBackupJSON(
  school: SchoolProfile,
  teacher: TeacherProfile,
  assessments: Assessment[]
) {
  const backupData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    system: 'AnalisGuru - Asesmen & Butir Soal',
    school,
    teacher,
    assessments,
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Backup_AnalisGuru_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Restore data from a JSON file
 */
export async function importBackupJSON(file: File): Promise<{
  school: SchoolProfile;
  teacher: TeacherProfile;
  assessments: Assessment[];
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.assessments || !Array.isArray(parsed.assessments)) {
          throw new Error('Format file backup tidak valid: data asesmen tidak ditemukan.');
        }

        const school = parsed.school || defaultSchoolProfile;
        const teacher = parsed.teacher || defaultTeacherProfile;
        const assessments = parsed.assessments;

        saveSchoolProfile(school);
        saveTeacherProfile(teacher);
        saveAssessments(assessments);
        if (assessments.length > 0) {
          saveActiveAssessmentId(assessments[0].id);
        }

        resolve({ school, teacher, assessments });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}
