import {
  Assessment,
  ClassStatistics,
  DistractorFrequency,
  ItemAnalysisResult,
  QuestionItem,
  StudentGradingResult,
  TPAnalysisResult,
} from '../types';

/**
 * Memeriksa jawaban dan menghitung skor setiap siswa
 */
export function gradeStudents(assessment: Assessment): StudentGradingResult[] {
  const { students, questions, studentAnswers, kktp, remedialPolicy } = assessment;

  const totalMaxScore = questions.reduce((sum, q) => sum + (q.maxScore || 1), 0);

  const results: StudentGradingResult[] = students.map((student) => {
    const studentRecord = studentAnswers[student.id] || { answers: {} };
    let rawScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((q) => {
      const studentAns = (studentRecord.answers?.[q.number] || '').toString().trim().toUpperCase();
      const correctAns = (q.correctAnswer || '').toString().trim().toUpperCase();

      if (q.type === 'PG') {
        if (studentAns && studentAns === correctAns) {
          rawScore += q.maxScore || 1;
          correctCount++;
        } else {
          incorrectCount++;
        }
      } else {
        // Isian atau Uraian
        // Periksa apakah guru memberikan skor khusus di customScores
        const custom = studentRecord.customScores?.[q.number];
        if (custom !== undefined && custom !== null) {
          rawScore += Number(custom);
          if (Number(custom) >= (q.maxScore || 1) * 0.7) {
            correctCount++;
          } else {
            incorrectCount++;
          }
        } else if (studentAns && studentAns === correctAns) {
          rawScore += q.maxScore || 1;
          correctCount++;
        } else {
          incorrectCount++;
        }
      }
    });

    const finalScore = totalMaxScore > 0 ? Math.round(((rawScore / totalMaxScore) * 100) * 10) / 10 : 0;
    const isPassing = finalScore >= kktp;
    const percentageCorrect = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    // Hitung nilai akhir setelah remedial bila ada
    let remedialFinalScore: number | undefined = undefined;
    if (studentRecord.remedialScore !== undefined && studentRecord.remedialScore !== null) {
      const remVal = Number(studentRecord.remedialScore);
      if (remedialPolicy === 'max_kktp') {
        // Nilai maksimal setara KKTP
        remedialFinalScore = remVal >= kktp ? kktp : remVal;
      } else if (remedialPolicy === 'average') {
        // Rata-rata nilai awal dan nilai remedial
        remedialFinalScore = Math.round(((finalScore + remVal) / 2) * 10) / 10;
      } else {
        // Nilai murni remedial
        remedialFinalScore = remVal;
      }
    }

    return {
      student,
      rawScore,
      maxScore: totalMaxScore,
      finalScore,
      correctCount,
      incorrectCount,
      percentageCorrect,
      isPassing,
      rank: 1, // Akan dihitung setelah disortir
      remedialFinalScore,
    };
  });

  // Urutkan siswa berdasarkan skor tertinggi untuk menentukan ranking
  const sorted = [...results].sort((a, b) => b.finalScore - a.finalScore);
  sorted.forEach((item, index) => {
    if (index > 0 && item.finalScore === sorted[index - 1].finalScore) {
      item.rank = sorted[index - 1].rank;
    } else {
      item.rank = index + 1;
    }
  });

  // Kembalikan ke urutan awal siswa
  return students.map((s) => sorted.find((r) => r.student.id === s.id)!);
}

/**
 * Menghitung Statistik Klasikal Kelas
 */
export function calculateClassStatistics(
  results: StudentGradingResult[],
  kktp: number
): ClassStatistics {
  const n = results.length;
  if (n === 0) {
    return {
      participantCount: 0,
      highestScore: 0,
      lowestScore: 0,
      meanScore: 0,
      medianScore: 0,
      standardDeviation: 0,
      passedCount: 0,
      failedCount: 0,
      passedPercentage: 0,
      failedPercentage: 0,
      isClassMastered: false,
    };
  }

  const scores = results.map((r) => r.finalScore).sort((a, b) => a - b);
  const highestScore = scores[scores.length - 1];
  const lowestScore = scores[0];

  const sum = scores.reduce((acc, val) => acc + val, 0);
  const meanScore = Math.round((sum / n) * 10) / 10;

  // Median
  const mid = Math.floor(n / 2);
  const medianScore =
    n % 2 !== 0 ? scores[mid] : Math.round(((scores[mid - 1] + scores[mid]) / 2) * 10) / 10;

  // Standar Deviasi
  const variance = scores.reduce((acc, val) => acc + Math.pow(val - meanScore, 2), 0) / n;
  const standardDeviation = Math.round(Math.sqrt(variance) * 100) / 100;

  // Ketuntasan
  const passedCount = results.filter((r) => r.finalScore >= kktp).length;
  const failedCount = n - passedCount;
  const passedPercentage = Math.round((passedCount / n) * 1000) / 10;
  const failedPercentage = Math.round((failedCount / n) * 1000) / 10;
  // Ketuntasan klasikal tercapai jika minimal 85% siswa tuntas (Standar Kemendikbud)
  const isClassMastered = passedPercentage >= 85;

  return {
    participantCount: n,
    highestScore,
    lowestScore,
    meanScore,
    medianScore,
    standardDeviation,
    passedCount,
    failedCount,
    passedPercentage,
    failedPercentage,
    isClassMastered,
  };
}

/**
 * Analisis Psikometrik Butir Soal (Tingkat Kesukaran, Daya Pembeda, dan Distraktor)
 */
export function analyzeItemPsychometrics(
  assessment: Assessment,
  gradedResults: StudentGradingResult[]
): ItemAnalysisResult[] {
  const { questions, students, studentAnswers, learningObjectives } = assessment;
  const n = students.length;

  if (n === 0 || questions.length === 0) {
    return [];
  }

  // Urutkan siswa dari skor tertinggi ke terendah
  const rankedStudents = [...gradedResults].sort((a, b) => b.finalScore - a.finalScore);

  // Tentukan Kelompok Atas (Upper) dan Kelompok Bawah (Lower)
  // Aturan standar psikometri (Metode Kelly): 27% jika N >= 20, atau 50% median split jika N < 20
  const splitRatio = n >= 20 ? 0.27 : 0.5;
  const groupSize = Math.max(1, Math.round(n * splitRatio));

  const upperGroup = rankedStudents.slice(0, groupSize).map((r) => r.student.id);
  const lowerGroup = rankedStudents.slice(n - groupSize).map((r) => r.student.id);

  const upperSet = new Set(upperGroup);
  const lowerSet = new Set(lowerGroup);

  return questions.map((question) => {
    const qNum = question.number;
    const correctKey = (question.correctAnswer || '').toString().trim().toUpperCase();
    const tp = learningObjectives.find((o) => o.id === question.tpId);

    let correctTotal = 0;
    let correctUpper = 0;
    let correctLower = 0;

    // Untuk Distraktor
    const options = question.optionsCount === 5 ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];
    const optionCountsUpper: Record<string, number> = {};
    const optionCountsLower: Record<string, number> = {};
    const optionCountsTotal: Record<string, number> = {};

    options.forEach((opt) => {
      optionCountsUpper[opt] = 0;
      optionCountsLower[opt] = 0;
      optionCountsTotal[opt] = 0;
    });

    students.forEach((student) => {
      const studentRec = studentAnswers[student.id];
      const ans = (studentRec?.answers?.[qNum] || '').toString().trim().toUpperCase();
      const isUpper = upperSet.has(student.id);
      const isLower = lowerSet.has(student.id);

      // Hitung sebaran pilihan
      if (options.includes(ans)) {
        optionCountsTotal[ans] = (optionCountsTotal[ans] || 0) + 1;
        if (isUpper) {
          optionCountsUpper[ans] = (optionCountsUpper[ans] || 0) + 1;
        }
        if (isLower) {
          optionCountsLower[ans] = (optionCountsLower[ans] || 0) + 1;
        }
      }

      // Periksa kebenaran jawaban
      let isCorrect = false;
      if (question.type === 'PG') {
        isCorrect = ans === correctKey;
      } else {
        const custom = studentRec?.customScores?.[qNum];
        if (custom !== undefined && custom !== null) {
          isCorrect = Number(custom) >= (question.maxScore || 1) * 0.5;
        } else {
          isCorrect = ans === correctKey;
        }
      }

      if (isCorrect) {
        correctTotal++;
        if (isUpper) correctUpper++;
        if (isLower) correctLower++;
      }
    });

    const incorrectTotal = n - correctTotal;

    // 1. Tingkat Kesukaran (P = B / N)
    const pValue = n > 0 ? correctTotal / n : 0;
    const difficultyIndex = Math.round(pValue * 1000) / 1000;

    let difficultyCategory: 'Mudah' | 'Sedang' | 'Sukar' = 'Sedang';
    if (difficultyIndex > 0.7) {
      difficultyCategory = 'Mudah';
    } else if (difficultyIndex < 0.3) {
      difficultyCategory = 'Sukar';
    } else {
      difficultyCategory = 'Sedang';
    }

    // 2. Daya Pembeda (D = (Ba / Na) - (Bb / Nb))
    const propUpper = groupSize > 0 ? correctUpper / groupSize : 0;
    const propLower = groupSize > 0 ? correctLower / groupSize : 0;
    const dValue = propUpper - propLower;
    const discriminationIndex = Math.round(dValue * 1000) / 1000;

    let discriminationCategory: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Jelek' | 'Sangat Buruk';
    if (discriminationIndex >= 0.4) {
      discriminationCategory = 'Sangat Baik';
    } else if (discriminationIndex >= 0.3) {
      discriminationCategory = 'Baik';
    } else if (discriminationIndex >= 0.2) {
      discriminationCategory = 'Cukup';
    } else if (discriminationIndex >= 0.0) {
      discriminationCategory = 'Jelek';
    } else {
      discriminationCategory = 'Sangat Buruk';
    }

    // 3. Efektivitas Distraktor (Pilihan Ganda)
    const distractors: DistractorFrequency[] = options.map((opt) => {
      const countTotal = optionCountsTotal[opt] || 0;
      const countUpper = optionCountsUpper[opt] || 0;
      const countLower = optionCountsLower[opt] || 0;
      const pct = n > 0 ? Math.round((countTotal / n) * 1000) / 10 : 0;
      const isKey = opt === correctKey;

      let isEffective = false;
      let statusNote = '';

      if (isKey) {
        isEffective = countTotal > 0;
        statusNote = `Kunci Jawaban (${pct}%)`;
      } else {
        // Syarat distraktor baik menurut kaidah evaluasi:
        // 1. Dipilih minimal 5% dari seluruh peserta
        // 2. Lebih banyak dipilih oleh kelompok bawah (Lower) daripada kelompok atas (Upper)
        const meetsThreshold = pct >= 5.0;
        const moreLowerThanUpper = countLower >= countUpper;

        if (meetsThreshold && moreLowerThanUpper) {
          isEffective = true;
          statusNote = 'Berfungsi Baik (Pengecoh Efektif)';
        } else if (!meetsThreshold) {
          isEffective = false;
          statusNote = 'Kurang Berfungsi (Dipilih < 5%)';
        } else {
          isEffective = false;
          statusNote = 'Menyesatkan (Lebih banyak dipilih Kelompok Atas)';
        }
      }

      return {
        option: opt,
        countUpper,
        countLower,
        countTotal,
        percentageTotal: pct,
        isKey,
        isEffective,
        statusNote,
      };
    });

    // 4. Rekomendasi Butir Soal (Standar Pusat Penilaian Pendidikan / Kemendikbud)
    let recommendation: 'Dipertahankan' | 'Dipertahankan (Revisi Kecil)' | 'Direvisi' | 'Ditolak/Dibuang' = 'Dipertahankan';
    let recommendationNote = '';

    if (discriminationIndex >= 0.3 && difficultyCategory === 'Sedang') {
      recommendation = 'Dipertahankan';
      recommendationNote = 'Soal sangat berkualitas, tingkat kesukaran proporsional, daya pembeda tajam.';
    } else if (discriminationIndex >= 0.3 && (difficultyCategory === 'Mudah' || difficultyCategory === 'Sukar')) {
      recommendation = 'Dipertahankan (Revisi Kecil)';
      recommendationNote = `Daya pembeda bagus, namun tingkat kesukaran tergolong ${difficultyCategory.toLowerCase()}.`;
    } else if (discriminationIndex >= 0.2 && discriminationIndex < 0.3) {
      recommendation = 'Direvisi';
      recommendationNote = 'Daya pembeda tergolong cukup. Periksa kembali kejelasan kalimat soal atau efektivitas opsi pengecoh.';
    } else if (discriminationIndex < 0.2 && discriminationIndex >= 0) {
      recommendation = 'Ditolak/Dibuang';
      recommendationNote = 'Daya pembeda lemah (jelek). Tidak mampu membedakan siswa pandai dan kurang pandai.';
    } else {
      recommendation = 'Ditolak/Dibuang';
      recommendationNote = 'Daya pembeda negatif! Kunci jawaban mungkin salah, atau soal membingungkan kelompok berprestasi.';
    }

    return {
      questionNumber: qNum,
      question,
      tp,
      totalParticipants: n,
      correctUpper,
      correctLower,
      correctTotal,
      incorrectTotal,
      difficultyIndex,
      difficultyCategory,
      discriminationIndex,
      discriminationCategory,
      distractors,
      recommendation,
      recommendationNote,
    };
  });
}

/**
 * Analisis Ketercapaian per Tujuan Pembelajaran (TP)
 */
export function analyzeLearningObjectives(
  assessment: Assessment,
  itemAnalyses: ItemAnalysisResult[],
  gradedResults: StudentGradingResult[]
): TPAnalysisResult[] {
  const { learningObjectives, questions, studentAnswers, kktp } = assessment;

  return learningObjectives.map((tp) => {
    const linkedQuestions = questions.filter((q) => q.tpId === tp.id);
    const questionNumbers = linkedQuestions.map((q) => q.number);

    if (linkedQuestions.length === 0) {
      return {
        tp,
        questionNumbers: [],
        averageScorePercentage: 0,
        isAchieved: false,
        studentsNotAchieved: [],
      };
    }

    const totalPossibleTpScore = linkedQuestions.reduce((s, q) => s + (q.maxScore || 1), 0);

    // Hitung capaian per siswa pada TP ini
    const studentsNotAchieved: { student: any; scorePercentage: number }[] = [];
    let sumPercentage = 0;

    gradedResults.forEach((res) => {
      const studentRec = studentAnswers[res.student.id];
      let studentTpRaw = 0;

      linkedQuestions.forEach((q) => {
        const studentAns = (studentRec?.answers?.[q.number] || '').toString().trim().toUpperCase();
        const correctAns = (q.correctAnswer || '').toString().trim().toUpperCase();

        if (q.type === 'PG') {
          if (studentAns === correctAns) {
            studentTpRaw += q.maxScore || 1;
          }
        } else {
          const custom = studentRec?.customScores?.[q.number];
          if (custom !== undefined && custom !== null) {
            studentTpRaw += Number(custom);
          } else if (studentAns === correctAns) {
            studentTpRaw += q.maxScore || 1;
          }
        }
      });

      const studentTpPct =
        totalPossibleTpScore > 0 ? Math.round((studentTpRaw / totalPossibleTpScore) * 100) : 0;

      sumPercentage += studentTpPct;

      if (studentTpPct < kktp) {
        studentsNotAchieved.push({
          student: res.student,
          scorePercentage: studentTpPct,
        });
      }
    });

    const averageScorePercentage =
      gradedResults.length > 0 ? Math.round((sumPercentage / gradedResults.length) * 10) / 10 : 0;

    const isAchieved = averageScorePercentage >= kktp;

    return {
      tp,
      questionNumbers,
      averageScorePercentage,
      isAchieved,
      studentsNotAchieved,
    };
  });
}
