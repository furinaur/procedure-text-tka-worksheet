import React, { useState, useEffect, useRef } from 'react';
import {
  STAGE_1_DATA,
  STAGE_2_ADVANCED,
  STAGE_2_FOUNDATION,
  StageContent,
  SequenceQuestion,
  McSingleQuestion,
  McMultipleQuestion,
  CategorizedQuestion
} from './data/procedureTestData';
import {
  UserStageAnswers,
  StageScoreResult,
  OverallTestResult
} from './types/worksheet';
import {
  calculateStageScore,
  compileOverallResults
} from './utils/worksheetScoring';
import { HeaderNav } from './components/HeaderNav';
import { PassageViewer } from './components/PassageViewer';
import { DragDropSequence } from './components/DragDropSequence';
import { McSingleQuestionCard } from './components/McSingleQuestion';
import { McMultipleQuestionCard } from './components/McMultipleQuestion';
import { CategorizedMcQuestionCard } from './components/CategorizedMcQuestion';
import { StageTransitionModal } from './components/StageTransitionModal';
import { ReportDashboard } from './components/ReportDashboard';
import {
  Bus,
  Clock,
  Flame,
  ArrowRight,
  Sparkles,
  HelpCircle,
  BookOpen,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const TOTAL_TIME_SECONDS = 15 * 60; // 15 minutes

const defaultAnswers = (): UserStageAnswers => ({
  sequenceOrder: [],
  mcSingleAnswers: {},
  mcMultipleAnswers: {},
  categorizedAnswers: {}
});

export default function App() {
  const [studentName, setStudentName] = useState<string>('');
  const [testState, setTestState] = useState<'welcome' | 'in_progress' | 'stage_transition' | 'completed'>('welcome');
  const [currentStageIndex, setCurrentStageIndex] = useState<1 | 2>(1);
  const [adaptiveTier, setAdaptiveTier] = useState<'advanced_hots' | 'foundation_mastery'>('advanced_hots');
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(TOTAL_TIME_SECONDS);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // Answers state
  const [stage1Answers, setStage1Answers] = useState<UserStageAnswers>(defaultAnswers());
  const [stage2Answers, setStage2Answers] = useState<UserStageAnswers>(defaultAnswers());

  // Scoring results
  const [stage1Score, setStage1Score] = useState<StageScoreResult | null>(null);
  const [stage2Score, setStage2Score] = useState<StageScoreResult | null>(null);
  const [overallResult, setOverallResult] = useState<OverallTestResult | null>(null);

  // Streak state
  const [streakCount, setStreakCount] = useState<number>(0);
  const [dailyStreak, setDailyStreak] = useState<number>(1);

  // UI state
  const [isPassageModalOpen, setIsPassageModalOpen] = useState<boolean>(false);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load persistent streak from localStorage
  useEffect(() => {
    try {
      const storedStreak = localStorage.getItem('tj_worksheet_streak');
      const lastDate = localStorage.getItem('tj_worksheet_last_date');
      const today = new Date().toDateString();

      if (storedStreak) {
        const num = parseInt(storedStreak, 10);
        if (!isNaN(num)) {
          if (lastDate === today) {
            setDailyStreak(num);
          } else {
            setDailyStreak(num + 1);
          }
        }
      }
    } catch (e) {
      // Ignore localStorage error in private modes
    }
  }, []);

  // Timer interval countdown
  useEffect(() => {
    if (testState === 'in_progress') {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState]);

  // Determine current active stage content
  const currentStageContent: StageContent =
    currentStageIndex === 1
      ? STAGE_1_DATA
      : adaptiveTier === 'advanced_hots'
      ? STAGE_2_ADVANCED
      : STAGE_2_FOUNDATION;

  const currentAnswers = currentStageIndex === 1 ? stage1Answers : stage2Answers;
  const setCurrentAnswers = currentStageIndex === 1 ? setStage1Answers : setStage2Answers;

  // Handle auto-submit on time expiration
  const handleTimeExpired = () => {
    if (testState !== 'in_progress') return;

    // Grade stage 1 or stage 2 automatically
    if (currentStageIndex === 1) {
      const s1 = calculateStageScore(STAGE_1_DATA, stage1Answers);
      const chosenTier: 'advanced_hots' | 'foundation_mastery' = s1.totalScore >= 75 ? 'advanced_hots' : 'foundation_mastery';
      const stage2Content = chosenTier === 'advanced_hots' ? STAGE_2_ADVANCED : STAGE_2_FOUNDATION;
      const s2 = calculateStageScore(stage2Content, stage2Answers);
      const finalResult = compileOverallResults(studentName, TOTAL_TIME_SECONDS, 0, s1, s2, chosenTier);
      
      setStage1Score(s1);
      setStage2Score(s2);
      setOverallResult(finalResult);
      setTestState('completed');
    } else {
      const s1 = stage1Score || calculateStageScore(STAGE_1_DATA, stage1Answers);
      const s2 = calculateStageScore(currentStageContent, stage2Answers);
      const finalResult = compileOverallResults(studentName, TOTAL_TIME_SECONDS, 0, s1, s2, adaptiveTier);
      
      setStage2Score(s2);
      setOverallResult(finalResult);
      setTestState('completed');
    }
  };

  // Start test
  const handleStartTest = () => {
    setTestState('in_progress');
    setTimeRemaining(TOTAL_TIME_SECONDS);
    setTimeSpent(0);
    setValidationWarning(null);
  };

  // Submit Stage 1
  const handleSubmitStage1 = () => {
    // Check if at least some answers provided
    const hasAnyAnswer =
      stage1Answers.sequenceOrder.length > 0 ||
      Object.keys(stage1Answers.mcSingleAnswers).length > 0 ||
      Object.keys(stage1Answers.mcMultipleAnswers).length > 0 ||
      Object.keys(stage1Answers.categorizedAnswers).length > 0;

    if (!hasAnyAnswer) {
      setValidationWarning('Silakan kerjakan setidaknya salah satu soal sebelum melanjutkan ke tahap berikutnya.');
      return;
    }
    setValidationWarning(null);

    const s1Result = calculateStageScore(STAGE_1_DATA, stage1Answers);
    setStage1Score(s1Result);

    // Update streak based on how many questions in Stage 1 were correct
    const correctCount = s1Result.questionDetails.filter(q => q.isCorrect).length;
    setStreakCount(prev => prev + correctCount);

    // Adaptive threshold: >= 75 points unlocks Advanced HOTS
    const tier: 'advanced_hots' | 'foundation_mastery' =
      s1Result.totalScore >= 75 ? 'advanced_hots' : 'foundation_mastery';
    setAdaptiveTier(tier);

    // Pause timer and show adaptive transition modal
    setTestState('stage_transition');
  };

  // Start Stage 2 after modal
  const handleStartStage2 = () => {
    setCurrentStageIndex(2);
    setTestState('in_progress');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Stage 2
  const handleSubmitStage2 = () => {
    const s2Result = calculateStageScore(currentStageContent, stage2Answers);
    setStage2Score(s2Result);

    const correctCount = s2Result.questionDetails.filter(q => q.isCorrect).length;
    setStreakCount(prev => prev + correctCount);

    const finalResult = compileOverallResults(
      studentName,
      timeSpent,
      timeRemaining,
      stage1Score || calculateStageScore(STAGE_1_DATA, stage1Answers),
      s2Result,
      adaptiveTier
    );
    setOverallResult(finalResult);

    // Save daily streak in localStorage
    try {
      const newStreak = dailyStreak + 1;
      localStorage.setItem('tj_worksheet_streak', String(newStreak));
      localStorage.setItem('tj_worksheet_last_date', new Date().toDateString());
      setDailyStreak(newStreak);
    } catch (e) {
      // Ignore localStorage error
    }

    setTestState('completed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset entire test
  const handleResetTest = () => {
    setTestState('welcome');
    setCurrentStageIndex(1);
    setAdaptiveTier('advanced_hots');
    setTimeRemaining(TOTAL_TIME_SECONDS);
    setTimeSpent(0);
    setStage1Answers(defaultAnswers());
    setStage2Answers(defaultAnswers());
    setStage1Score(null);
    setStage2Score(null);
    setOverallResult(null);
    setStreakCount(0);
    setValidationWarning(null);
  };

  // Handlers for question answers
  const handleSequenceChange = (newOrder: string[]) => {
    setCurrentAnswers(prev => ({ ...prev, sequenceOrder: newOrder }));
  };

  const handleMcSingleChange = (questionId: string, optionId: string) => {
    setCurrentAnswers(prev => ({
      ...prev,
      mcSingleAnswers: { ...prev.mcSingleAnswers, [questionId]: optionId }
    }));
  };

  const handleMcMultipleToggle = (questionId: string, optionId: string) => {
    setCurrentAnswers(prev => {
      const currentList = prev.mcMultipleAnswers[questionId] || [];
      const updated = currentList.includes(optionId)
        ? currentList.filter(id => id !== optionId)
        : [...currentList, optionId];
      return {
        ...prev,
        mcMultipleAnswers: { ...prev.mcMultipleAnswers, [questionId]: updated }
      };
    });
  };

  const handleCategorizedChange = (questionId: string, statementId: string, category: 'Sesuai' | 'Tidak Sesuai') => {
    setCurrentAnswers(prev => {
      const currentMap = prev.categorizedAnswers[questionId] || {};
      return {
        ...prev,
        categorizedAnswers: {
          ...prev.categorizedAnswers,
          [questionId]: { ...currentMap, [statementId]: category }
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['PT_Sans',sans-serif] selection:bg-[#3381C3]/20 selection:text-[#1E468E]">
      {/* Top Header Navigation */}
      <HeaderNav
        timeRemainingSeconds={timeRemaining}
        streakCount={streakCount}
        currentStage={currentStageIndex}
        totalStages={2}
        onTogglePassageModal={() => setIsPassageModalOpen(!isPassageModalOpen)}
        isPassageModalOpen={isPassageModalOpen}
        tierLabel={currentStageContent.tierLabel}
        isCompleted={testState === 'completed'}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome State */}
        {testState === 'welcome' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
            {/* Hero Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#1E468E] via-[#2A61AA] to-[#3381C3] p-6 sm:p-8 text-white relative">
                {/* Subtle Transjakarta Busway Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#FA8A14]" />
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wide border border-white/20">
                    <Bus className="w-3.5 h-3.5 text-amber-300" />
                    Transjakarta English BRT Edition
                  </span>
                  <span className="text-xs text-blue-200">
                    TKA / UTBK Standard
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                  Procedure Text Interactive Worksheet
                </h1>
                <p className="text-sm sm:text-base text-blue-100 mt-2 max-w-2xl leading-relaxed">
                  Asah kemampuan pemahaman teks prosedur bahasa Inggris melalui simulasi autentik transportasi publik Transjakarta. Dilengkapi penilaian adaptif 2 tahap, format soal standar TKA, dan konsultasi tutor via WhatsApp.
                </p>
              </div>

              {/* Instructions and Features Grid */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Struktur & Format Ujian:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#1E468E] flex items-center justify-center font-bold text-xs shrink-0">
                        1
                      </div>
                      <div>
                        <strong className="text-slate-900 text-xs sm:text-sm block">Drag & Drop Sequence</strong>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Menyusun urutan langkah acak menjadi alur kronologis yang tepat.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#1E468E] flex items-center justify-center font-bold text-xs shrink-0">
                        2
                      </div>
                      <div>
                        <strong className="text-slate-900 text-xs sm:text-sm block">Pilihan Ganda Biasa (Single)</strong>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Menganalisis tujuan komunikatif (goal) & sasaran pembaca.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#1E468E] flex items-center justify-center font-bold text-xs shrink-0">
                        3
                      </div>
                      <div>
                        <strong className="text-slate-900 text-xs sm:text-sm block">Pilihan Ganda Kompleks</strong>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Menentukan beberapa opsi yang benar (multi-select checklist).
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#1E468E] flex items-center justify-center font-bold text-xs shrink-0">
                        4
                      </div>
                      <div>
                        <strong className="text-slate-900 text-xs sm:text-sm block">Soal Kategorik (Sesuai / Tidak)</strong>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Menilai kesesuaian pernyataan dengan teks prosedur (matrix table).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Features Banner */}
                <div className="bg-blue-50/60 border border-blue-200/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1E468E]">
                      <Clock className="w-4 h-4 text-[#3381C3]" />
                      <span>Timer 15 Menit Kumulatif & Penilaian Adaptif 2 Tahap</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Performa di Stage 1 menentukan tingkat kesulitan Stage 2 (Jalur HOTS vs Jalur Penguatan Dasar).
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Streak: {dailyStreak} Hari Latihan</span>
                  </div>
                </div>

                {/* Student Name Input */}
                <div className="space-y-2">
                  <label htmlFor="student-name-welcome" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nama Siswa:
                  </label>
                  <input
                    id="student-name-welcome"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Tuliskan nama lengkap kamu di sini..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E468E] text-sm bg-white text-slate-900 placeholder:text-slate-400 shadow-inner"
                  />
                  <p className="text-[11px] text-slate-500">
                    Nama akan dicantumkan secara otomatis pada Laporan Performa dan pesan WhatsApp ke Kak Tutor.
                  </p>
                </div>

                {/* Start Button */}
                <button
                  type="button"
                  onClick={handleStartTest}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#1E468E] hover:bg-[#163469] text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
                >
                  <span>Mulai Worksheet (15 Menit)</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* In-Progress Worksheet State */}
        {testState === 'in_progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Desktop Left Column: Sticky Reading Passage Reference (5 of 12 cols) */}
            <div className="hidden lg:block lg:col-span-5 sticky top-22">
              <PassageViewer
                stageContent={currentStageContent}
                isOpen={true}
              />
            </div>

            {/* Questions Column (7 of 12 cols on desktop, full width on mobile) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Stage Progress Header Bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E468E]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1E468E]">
                      {currentStageContent.tierLabel}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {currentStageContent.readingPassage.title}
                  </h2>
                </div>

                {/* Mobile Button to View Text */}
                <div className="lg:hidden">
                  <button
                    type="button"
                    onClick={() => setIsPassageModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-[#1E468E] border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Baca Teks Prosedur Lengkap</span>
                  </button>
                </div>
              </div>

              {/* Questions Stream */}
              {currentStageContent.questions.map((question) => {
                if (question.type === 'drag_drop_sequence') {
                  return (
                    <DragDropSequence
                      key={question.id}
                      question={question as SequenceQuestion}
                      currentOrder={currentAnswers.sequenceOrder}
                      onChangeOrder={handleSequenceChange}
                    />
                  );
                } else if (question.type === 'mc_single') {
                  return (
                    <McSingleQuestionCard
                      key={question.id}
                      question={question as McSingleQuestion}
                      selectedOption={currentAnswers.mcSingleAnswers[question.id] || ''}
                      onSelectOption={(optId) => handleMcSingleChange(question.id, optId)}
                    />
                  );
                } else if (question.type === 'mc_multiple') {
                  return (
                    <McMultipleQuestionCard
                      key={question.id}
                      question={question as McMultipleQuestion}
                      selectedOptions={currentAnswers.mcMultipleAnswers[question.id] || []}
                      onToggleOption={(optId) => handleMcMultipleToggle(question.id, optId)}
                    />
                  );
                } else if (question.type === 'categorized_mc') {
                  return (
                    <CategorizedMcQuestionCard
                      key={question.id}
                      question={question as CategorizedQuestion}
                      selectedCategories={currentAnswers.categorizedAnswers[question.id] || {}}
                      onSelectCategory={(stmtId, cat) => handleCategorizedChange(question.id, stmtId, cat)}
                    />
                  );
                }
                return null;
              })}

              {/* Validation Warning */}
              {validationWarning && (
                <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{validationWarning}</span>
                </div>
              )}

              {/* Stage Submission Buttons */}
              <div className="pt-2">
                {currentStageIndex === 1 ? (
                  <button
                    type="button"
                    onClick={handleSubmitStage1}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#1E468E] hover:bg-[#163469] text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
                  >
                    <span>Kirim Jawaban & Lanjut ke Stage 2 (Adaptif)</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitStage2}
                    className="w-full py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                    <span>Kumpulkan & Lihat Laporan Hasil Ujian</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Floating Modal for Reading Passage on Small Screens */}
        <PassageViewer
          stageContent={currentStageContent}
          isOpen={isPassageModalOpen}
          onClose={() => setIsPassageModalOpen(false)}
          isFloating={true}
        />

        {/* Stage Transition Modal */}
        {stage1Score && (
          <StageTransitionModal
            isOpen={testState === 'stage_transition'}
            stage1Score={stage1Score}
            adaptiveTier={adaptiveTier}
            onStartStage2={handleStartStage2}
          />
        )}

        {/* Completed State: Report Dashboard */}
        {testState === 'completed' && overallResult && (
          <ReportDashboard
            result={overallResult}
            onResetTest={handleResetTest}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E468E]">Transjakarta Learning Hub</span>
            <span aria-hidden="true">·</span>
            <span>Worksheet Teks Prosedur Adaptif</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">PT Sans Typography</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">Tutor WhatsApp:</span>
            <a
              href="https://wa.me/6281267656463"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E468E] hover:underline font-semibold"
            >
              +62 812-6765-6463
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
