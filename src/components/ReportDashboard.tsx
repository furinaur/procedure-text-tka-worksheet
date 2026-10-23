import React, { useState, useEffect } from 'react';
import { OverallTestResult } from '../types/worksheet';
import { buildWhatsAppTutorUrl } from '../utils/worksheetScoring';
import {
  Award,
  CheckCircle2,
  Clock,
  Flame,
  Send,
  RotateCcw,
  Copy,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReportDashboardProps {
  result: OverallTestResult;
  onResetTest: () => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  result,
  onResetTest
}) => {
  const [studentName, setStudentName] = useState(result.studentName || '');
  const [copied, setCopied] = useState(false);
  const [expandedStage, setExpandedStage] = useState<number | null>(1);

  // Trigger celebration confetti on high score
  useEffect(() => {
    if (result.totalScore >= 75) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1E468E', '#3381C3', '#FA8A14', '#ffffff']
        });
      } catch (e) {
        // Safe fallback if canvas not available
      }
    }
  }, [result.totalScore]);

  // Update current result with latest student name for WA URL
  const updatedResult: OverallTestResult = {
    ...result,
    studentName: studentName.trim() || 'Siswa Transjakarta'
  };

  const whatsappUrl = buildWhatsAppTutorUrl(updatedResult, '6281267656463');

  const handleCopyText = () => {
    // Extract plain message text from WA url
    const urlObj = new URL(whatsappUrl);
    const textParam = urlObj.searchParams.get('text') || '';
    navigator.clipboard.writeText(textParam);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const minutesUsed = Math.floor(result.timeSpentSeconds / 60);
  const secondsUsed = result.timeSpentSeconds % 60;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-[#1E468E] via-[#2A61AA] to-[#3381C3] rounded-2xl text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
        {/* Subtle decorative busway line accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FA8A14]" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wide uppercase border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Laporan Evaluasi Pembelajaran
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Personal Performance Report
            </h1>
            <p className="text-sm text-blue-100 max-w-xl">
              Hasil asesmen teks prosedur adaptif TKA Transjakarta Learning Hub. Skor, penguasaan kompetensi, dan analisis kelemahan siap dikonsultasikan.
            </p>
          </div>

          {/* Grand Total Score Circle */}
          <div className="shrink-0 bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-5 text-center flex flex-col items-center justify-center min-w-[160px]">
            <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
              Total Skor Akhir
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white my-1 tabular-nums">
              {result.totalScore}
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow-xs">
              {result.insights.grade}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row: Time, Stages, Streak */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Time Spent */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E468E]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Waktu Digunakan</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              {minutesUsed}m {secondsUsed}s
            </span>
            <span className="text-[11px] text-slate-400 block">dari batas 15 menit</span>
          </div>
        </div>

        {/* Adaptive Tier & Stage Scores */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Hasil Per Tahap</span>
            <span className="text-base font-bold text-slate-900">
              S1: {result.stage1Result.totalScore} · S2: {result.stage2Result.totalScore}
            </span>
            <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
              {result.adaptiveTierChosen === 'advanced_hots' ? 'Jalur HOTS (Advanced)' : 'Jalur Core (Mastery)'}
            </span>
          </div>
        </div>

        {/* Streak Consistency */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Status Ujian</span>
            <span className="text-base font-bold text-slate-900">
              Semua Soal Tuntas
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block">
              100% Bagian Dikerjakan
            </span>
          </div>
        </div>
      </div>

      {/* Competency Mastery Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Award className="w-5 h-5 text-[#1E468E]" />
          <h2 className="font-bold text-slate-900 text-base">
            Analisis Penguasaan Kompetensi Teks Prosedur
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Competency 1: Structure & Goal */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-800">1. Struktur & Tujuan Komunikatif Teks</span>
              <span className="font-bold text-[#1E468E]">{result.competencies.structure_goal}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#1E468E] rounded-full transition-all duration-500"
                style={{ width: `${result.competencies.structure_goal}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Kemampuan mengidentifikasi Goal, Materials, dan sasaran pembaca.
            </p>
          </div>

          {/* Competency 2: Temporal Sequence */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-800">2. Alur Kronologis & Drag-Drop Urutan</span>
              <span className="font-bold text-[#3381C3]">{result.competencies.temporal_sequence}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#3381C3] rounded-full transition-all duration-500"
                style={{ width: `${result.competencies.temporal_sequence}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Kepekaan menyusun tahapan langkah berurutan secara sistematis.
            </p>
          </div>

          {/* Competency 3: Imperative Language */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-800">3. Kata Kerja Perintah & Kalimat Larangan</span>
              <span className="font-bold text-[#1E468E]">{result.competencies.imperative_language}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#1E468E] rounded-full transition-all duration-500"
                style={{ width: `${result.competencies.imperative_language}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Analisis ciri kebahasaan (imperative verbs, prohibitions, modals).
            </p>
          </div>

          {/* Competency 4: Inference & Troubleshoot */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-800">4. Inferensi Kontekstual & Penalaran Kritis (HOTS)</span>
              <span className="font-bold text-[#3381C3]">{result.competencies.inference_troubleshoot}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#3381C3] rounded-full transition-all duration-500"
                style={{ width: `${result.competencies.inference_troubleshoot}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Penarikan kesimpulan logis, validasi kondisi, dan troubleshooting.
            </p>
          </div>
        </div>
      </div>

      {/* Pedagogical Insights: Strengths, Weaknesses, Tutor Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Kekuatan Utama yang Terdeteksi</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {result.insights.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Needs Improvement Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Area Fokus Pendampingan</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {result.insights.weaknesses.map((wkn, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                <span>{wkn}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* WhatsApp Send to Tutor Section (Explicit Requirement) */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50/50 rounded-2xl border-2 border-emerald-500/30 p-6 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
              <Send className="w-3.5 h-3.5" />
              Layanan Konsultasi & Feedback Personal
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Kirimkan Laporan Performa ke Kak Tutor
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Kirimkan ringkasan hasil latihan dan analisis kompetensi langsung via WhatsApp ke nomor tutor <strong>+62 812-6765-6463</strong> untuk mendapatkan bimbingan lanjutan.
            </p>
          </div>
        </div>

        {/* Student Name Input */}
        <div className="space-y-1.5">
          <label htmlFor="student-name-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Nama Lengkap Siswa:
          </label>
          <input
            id="student-name-input"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Masukkan nama kamu (contoh: Muhammad Farhan)..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E468E] text-sm bg-white text-slate-900 shadow-inner"
          />
        </div>

        {/* WhatsApp Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md transition-all active:scale-98"
          >
            <Send className="w-4 h-4 fill-white" />
            <span>Send to Tutor (+62 812-6765-6463)</span>
          </a>

          <button
            type="button"
            onClick={handleCopyText}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            <Copy className="w-4 h-4 text-slate-500" />
            <span>{copied ? 'Teks Berhasil Disalin!' : 'Salin Format Pesan'}</span>
          </button>
        </div>
      </div>

      {/* Answer Key & Pembahasan Review Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1E468E]" />
            <h2 className="font-bold text-slate-900 text-base">
              Review Kunci Jawaban & Pembahasan Lengkap
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            8 Soal Komprehensif
          </span>
        </div>

        {/* Stage 1 Questions Review */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedStage(expandedStage === 1 ? null : 1)}
            className="w-full p-4 bg-slate-50 hover:bg-slate-100/70 flex items-center justify-between text-left transition-colors"
          >
            <div>
              <span className="text-xs font-bold text-[#1E468E] uppercase tracking-wider block">
                Tahap 1: Diagnostik
              </span>
              <span className="text-sm font-semibold text-slate-900">
                How to Board Transjakarta BRT (Skor: {result.stage1Result.totalScore}/100)
              </span>
            </div>
            {expandedStage === 1 ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
          </button>

          {expandedStage === 1 && (
            <div className="p-4 space-y-4 divide-y divide-slate-100 bg-white">
              {result.stage1Result.questionDetails.map((q, idx) => (
                <div key={q.questionId} className={`pt-3 first:pt-0 space-y-2`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700">
                      Soal #{idx + 1}: {q.title}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${q.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {q.score} / {q.maxScore} Poin
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/60">
                    <p><strong className="text-slate-800">Jawaban Kamu:</strong> {q.userAnswerSummary}</p>
                    <p><strong className="text-slate-800">Kunci Jawaban:</strong> {q.correctAnswerSummary}</p>
                  </div>
                  <p className="text-xs text-slate-700 bg-blue-50/50 p-2.5 rounded border border-blue-100">
                    <strong className="text-[#1E468E]">Pembahasan: </strong>{q.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stage 2 Questions Review */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedStage(expandedStage === 2 ? null : 2)}
            className="w-full p-4 bg-slate-50 hover:bg-slate-100/70 flex items-center justify-between text-left transition-colors"
          >
            <div>
              <span className="text-xs font-bold text-[#3381C3] uppercase tracking-wider block">
                Tahap 2: {result.stage2Result.tierLabel}
              </span>
              <span className="text-sm font-semibold text-slate-900">
                Skor: {result.stage2Result.totalScore}/100
              </span>
            </div>
            {expandedStage === 2 ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
          </button>

          {expandedStage === 2 && (
            <div className="p-4 space-y-4 divide-y divide-slate-100 bg-white">
              {result.stage2Result.questionDetails.map((q, idx) => (
                <div key={q.questionId} className={`pt-3 first:pt-0 space-y-2`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700">
                      Soal #{idx + 1}: {q.title}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${q.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {q.score} / {q.maxScore} Poin
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/60">
                    <p><strong className="text-slate-800">Jawaban Kamu:</strong> {q.userAnswerSummary}</p>
                    <p><strong className="text-slate-800">Kunci Jawaban:</strong> {q.correctAnswerSummary}</p>
                  </div>
                  <p className="text-xs text-slate-700 bg-blue-50/50 p-2.5 rounded border border-blue-100">
                    <strong className="text-[#1E468E]">Pembahasan: </strong>{q.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Restart Worksheet Button */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onResetTest}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Ulangi Worksheet dari Awal (Reset & Latihan Lagi)</span>
        </button>
      </div>
    </div>
  );
};
