import {
  StageContent,
  SequenceQuestion,
  McSingleQuestion,
  McMultipleQuestion,
  CategorizedQuestion
} from '../data/procedureTestData';
import {
  UserStageAnswers,
  StageScoreResult,
  QuestionScoreDetail,
  OverallTestResult
} from '../types/worksheet';

export function calculateStageScore(stage: StageContent, answers: UserStageAnswers): StageScoreResult {
  const details: QuestionScoreDetail[] = [];
  let totalScore = 0;
  const maxScore = 100;

  for (const q of stage.questions) {
    if (q.type === 'drag_drop_sequence') {
      const seqQ = q as SequenceQuestion;
      const userOrder = answers.sequenceOrder.length > 0
        ? answers.sequenceOrder
        : seqQ.initialScrambledSteps.map(s => s.id);
      
      let correctCount = 0;
      userOrder.forEach((stepId, idx) => {
        if (stepId === seqQ.correctOrderIds[idx]) {
          correctCount++;
        }
      });

      const questionMax = 25;
      const score = Math.round((correctCount / seqQ.correctOrderIds.length) * questionMax * 10) / 10;
      const isCorrect = correctCount === seqQ.correctOrderIds.length;
      totalScore += score;

      details.push({
        questionId: q.id,
        type: q.type,
        title: q.title,
        competency: 'temporal_sequence',
        score,
        maxScore: questionMax,
        percentage: Math.round((score / questionMax) * 100),
        isCorrect,
        userAnswerSummary: `${correctCount} dari ${seqQ.correctOrderIds.length} langkah pada posisi yang benar`,
        correctAnswerSummary: `Urutan lengkap 1 s.d. ${seqQ.correctOrderIds.length}`,
        explanation: seqQ.explanation
      });
    } else if (q.type === 'mc_single') {
      const singleQ = q as McSingleQuestion;
      const userAns = answers.mcSingleAnswers[q.id] || '';
      const isCorrect = userAns === singleQ.correctAnswer;
      const score = isCorrect ? 25 : 0;
      totalScore += score;

      const userOpt = singleQ.options.find(o => o.id === userAns);
      const correctOpt = singleQ.options.find(o => o.id === singleQ.correctAnswer);

      details.push({
        questionId: q.id,
        type: q.type,
        title: q.title,
        competency: singleQ.competency,
        score,
        maxScore: 25,
        percentage: isCorrect ? 100 : 0,
        isCorrect,
        userAnswerSummary: userAns ? `Pilihan (${userAns}): ${userOpt?.text.slice(0, 45)}...` : 'Belum dijawab',
        correctAnswerSummary: `Pilihan (${singleQ.correctAnswer}): ${correctOpt?.text.slice(0, 45)}...`,
        explanation: singleQ.explanation
      });
    } else if (q.type === 'mc_multiple') {
      const multiQ = q as McMultipleQuestion;
      const userSelected = answers.mcMultipleAnswers[q.id] || [];
      const correctSet = new Set(multiQ.correctAnswers);
      
      let matchedCount = 0;
      let incorrectCount = 0;
      userSelected.forEach(ans => {
        if (correctSet.has(ans)) {
          matchedCount++;
        } else {
          incorrectCount++;
        }
      });

      // Scoring: 2 correct required.
      let score = 0;
      if (incorrectCount === 0 && matchedCount === multiQ.correctAnswers.length) {
        score = 25;
      } else if (incorrectCount === 0 && matchedCount === 1) {
        score = 12.5;
      } else if (incorrectCount === 1 && matchedCount === 2) {
        score = 12.5;
      } else {
        score = 0;
      }
      totalScore += score;

      const isCorrect = score === 25;
      details.push({
        questionId: q.id,
        type: q.type,
        title: q.title,
        competency: multiQ.competency,
        score,
        maxScore: 25,
        percentage: Math.round((score / 25) * 100),
        isCorrect,
        userAnswerSummary: userSelected.length > 0 ? `${userSelected.length} opsi terpilih` : 'Belum dijawab',
        correctAnswerSummary: `${multiQ.correctAnswers.length} opsi yang benar`,
        explanation: multiQ.explanation
      });
    } else if (q.type === 'categorized_mc') {
      const catQ = q as CategorizedQuestion;
      const userChoices = answers.categorizedAnswers[q.id] || {};
      const totalStatements = catQ.statements.length;
      let correctStatements = 0;

      catQ.statements.forEach(stmt => {
        if (userChoices[stmt.id] === stmt.correctCategory) {
          correctStatements++;
        }
      });

      const score = Math.round((correctStatements / totalStatements) * 25 * 10) / 10;
      totalScore += score;
      const isCorrect = correctStatements === totalStatements;

      details.push({
        questionId: q.id,
        type: q.type,
        title: q.title,
        competency: catQ.competency,
        score,
        maxScore: 25,
        percentage: Math.round((score / 25) * 100),
        isCorrect,
        userAnswerSummary: `${correctStatements} dari ${totalStatements} pernyataan tepat`,
        correctAnswerSummary: `Semua ${totalStatements} pernyataan sesuai kunci`,
        explanation: 'Evaluasi kesesuaian setiap pernyataan dengan teks prosedur.'
      });
    }
  }

  return {
    stageId: stage.stageId,
    tier: stage.tier,
    tierLabel: stage.tierLabel,
    totalScore: Math.round(totalScore),
    maxScore,
    percentage: Math.round((totalScore / maxScore) * 100),
    questionDetails: details
  };
}

export function compileOverallResults(
  studentName: string,
  timeSpentSeconds: number,
  timeRemainingSeconds: number,
  stage1Result: StageScoreResult,
  stage2Result: StageScoreResult,
  adaptiveTierChosen: 'advanced_hots' | 'foundation_mastery'
): OverallTestResult {
  const combinedScore = Math.round((stage1Result.totalScore + stage2Result.totalScore) / 2);

  // Collect all question details across both stages
  const allQuestions = [...stage1Result.questionDetails, ...stage2Result.questionDetails];

  const competencyTotals: Record<string, { earned: number; max: number }> = {
    structure_goal: { earned: 0, max: 0 },
    temporal_sequence: { earned: 0, max: 0 },
    imperative_language: { earned: 0, max: 0 },
    inference_troubleshoot: { earned: 0, max: 0 }
  };

  allQuestions.forEach(q => {
    if (competencyTotals[q.competency]) {
      competencyTotals[q.competency].earned += q.score;
      competencyTotals[q.competency].max += q.maxScore;
    }
  });

  const competencies = {
    structure_goal: competencyTotals.structure_goal.max > 0
      ? Math.round((competencyTotals.structure_goal.earned / competencyTotals.structure_goal.max) * 100)
      : 0,
    temporal_sequence: competencyTotals.temporal_sequence.max > 0
      ? Math.round((competencyTotals.temporal_sequence.earned / competencyTotals.temporal_sequence.max) * 100)
      : 0,
    imperative_language: competencyTotals.imperative_language.max > 0
      ? Math.round((competencyTotals.imperative_language.earned / competencyTotals.imperative_language.max) * 100)
      : 0,
    inference_troubleshoot: competencyTotals.inference_troubleshoot.max > 0
      ? Math.round((competencyTotals.inference_troubleshoot.earned / competencyTotals.inference_troubleshoot.max) * 100)
      : 0
  };

  // Generate qualitative pedagogical insights
  let grade = 'A';
  let headline = 'Performa Sangat Unggul (Master of Procedure Text)';
  if (combinedScore >= 85) {
    grade = 'A (Sangat Baik)';
    headline = 'Penguasaan Teks Prosedur Sangat Mendalam & Cermat';
  } else if (combinedScore >= 70) {
    grade = 'B (Baik)';
    headline = 'Pemahaman Prosedural Kuat dengan Sedikit Aspek Penajaman';
  } else if (combinedScore >= 55) {
    grade = 'C (Cukup)';
    headline = 'Fondasi Prosedur Cukup Baik, Perlu Latihan HOTS Tambahan';
  } else {
    grade = 'D (Perlu Pendampingan)';
    headline = 'Perlu Bimbingan Intensif pada Urutan Kronologis & Kata Kerja Perintah';
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const tutorRecommendations: string[] = [];

  if (competencies.temporal_sequence >= 75) {
    strengths.push('Kemampuan mengidentifikasi alur kronologis dan penanda urutan waktu (first, then, subsequent) sangat tajam.');
  } else {
    weaknesses.push('Masih sering tertukar pada urutan langkah operasional perantara versus langkah final.');
    tutorRecommendations.push('Latih siswa mengidentifikasi kata sambung urutan (sequence connectors) seperti "prior to", "subsequently", dan "meanwhile".');
  }

  if (competencies.structure_goal >= 75) {
    strengths.push('Sangat memahami tujuan komunikatif (goal/aim), sasaran pembaca, dan alat/bahan yang disyaratkan dalam teks prosedur.');
  } else {
    weaknesses.push('Perlu melatih ketelitian dalam membedakan tujuan inti teks dengan detail sekunder.');
    tutorRecommendations.push('Perkuat pemahaman struktur generik: Aim/Goal, Materials/Ingredients, dan Steps/Methods.');
  }

  if (competencies.imperative_language >= 75) {
    strengths.push('Mampu menganalisis kalimat imperatif (action verbs) dan instruksi pencegahan/peringatan (prohibitions) secara presisi.');
  } else {
    weaknesses.push('Kurang teliti pada batasan imperatif negatif (misal "do not move or remove the card").');
    tutorRecommendations.push('Berikan latihan fokus pada kalimat perintah imperatif positif vs larangan negatif dalam panduan teknis.');
  }

  if (competencies.inference_troubleshoot >= 75) {
    strengths.push('Daya analisis HOTS tinggi: mampu menarik inferensi logis dari aturan peron dan kebijakan tarif integrasi.');
  } else {
    weaknesses.push('Tantangan pada pertanyaan inferensi kontekstual (kondisional "jika... maka...") dan klasifikasi pernyataan multi-aspek.');
    tutorRecommendations.push('Simulasikan studi kasus "troubleshooting" dalam teks prosedur (kondisi gagal, pengecualian, dan error handling).');
  }

  // Ensure at least 1 strength & recommendation
  if (strengths.length === 0) {
    strengths.push('Memiliki antusiasme dan komitmen tinggi dalam menyelesaikan seluruh tahapan teks prosedur tepat waktu.');
  }
  if (tutorRecommendations.length === 0) {
    tutorRecommendations.push('Pertahankan ketelitian membaca detail instruksi teks prosedur berbahasa Inggris untuk persiapan ujian TKA / UTBK.');
  }

  return {
    studentName: studentName.trim() || 'Siswa Transjakarta Hub',
    timestamp: new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    totalScore: combinedScore,
    timeSpentSeconds,
    timeRemainingSeconds,
    stage1Result,
    stage2Result,
    adaptiveTierChosen,
    competencies,
    insights: {
      grade,
      headline,
      strengths,
      weaknesses: weaknesses.length > 0 ? weaknesses : ['Tidak ada kelemahan mendasar yang signifikan.'],
      tutorRecommendations
    }
  };
}

export function buildWhatsAppTutorUrl(results: OverallTestResult, tutorPhone = '6281267656463'): string {
  const minutes = Math.floor(results.timeSpentSeconds / 60);
  const seconds = results.timeSpentSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds}s`;

  const tierName = results.adaptiveTierChosen === 'advanced_hots'
    ? 'Stage 2 HOTS (Advanced Transit Master)'
    : 'Stage 2 Core (Foundation & Mastery)';

  const text = `Halo Kak Tutor, saya telah menyelesaikan Worksheet TKA Procedure Text di Transjakarta Hub! 🚍✨

📋 *LAPORAN PERFORMA SISWA*
• *Nama Siswa*: ${results.studentName}
• *Waktu Selesai*: ${results.timestamp}
• *Total Skor Akhir*: ${results.totalScore}/100 [Grade: ${results.insights.grade}]
• *Hasil Stage 1 (Diagnostik)*: ${results.stage1Result.totalScore}/100
• *Hasil Stage 2 (${tierName})*: ${results.stage2Result.totalScore}/100
• *Waktu Pengerjaan*: ${timeFormatted} (dari batas 15 menit)

📊 *PENGUASAAN KOMPETENSI TKA:*
1. Struktur & Tujuan Teks: ${results.competencies.structure_goal}%
2. Urutan Kronologis (Sequencing): ${results.competencies.temporal_sequence}%
3. Bahasa Imperatif & Larangan: ${results.competencies.imperative_language}%
4. Inferensi Kontekstual & HOTS: ${results.competencies.inference_troubleshoot}%

💡 *RINGKASAN INSIGHT PEDAGOGIS:*
• *Kekuatan Utama*: ${results.insights.strengths[0] || '-'}
• *Area Perlu Bimbingan*: ${results.insights.weaknesses[0] || 'Pertahankan performa'}
• *Rekomendasi Tutor*: ${results.insights.tutorRecommendations[0] || '-'}

Mohon arahan, feedback personal, dan ulasan performa saya ya Kak Tutor. Terima kasih banyak! 🙏`;

  const cleanPhone = tutorPhone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
