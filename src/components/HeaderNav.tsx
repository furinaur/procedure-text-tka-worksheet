import React from 'react';
import { Bus, Clock, Flame, BookOpen, AlertCircle } from 'lucide-react';

interface HeaderNavProps {
  timeRemainingSeconds: number;
  streakCount: number;
  currentStage: number;
  totalStages: number;
  onTogglePassageModal: () => void;
  isPassageModalOpen: boolean;
  tierLabel?: string;
  isCompleted?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  timeRemainingSeconds,
  streakCount,
  currentStage,
  totalStages,
  onTogglePassageModal,
  isPassageModalOpen,
  tierLabel,
  isCompleted = false
}) => {
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = timeRemainingSeconds < 180 && !isCompleted;

  return (
    <header className="sticky top-0 z-30 bg-[#1E468E] text-white shadow-md border-b border-[#3381C3]/30">
      {/* Transjakarta subtle signature orange accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FA8A14] via-[#3381C3] to-[#FA8A14]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Wordmark Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Bus className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white whitespace-nowrap">
                  Transjakarta Learning Hub
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded bg-[#3381C3] text-white">
                  TKA English
                </span>
              </div>
              <p className="text-xs text-blue-200 hidden md:block">
                Worksheet Interaktif: Teks Prosedur Adaptif
              </p>
            </div>
          </div>

          {/* Navigation & Status Zone */}
          {!isCompleted ? (
            <div className="flex items-center gap-2 sm:gap-4">
              {/* 15-Minute Countdown Timer */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold transition-colors ${
                  isTimeCritical
                    ? 'bg-red-500/20 border-red-400 text-red-200 animate-pulse'
                    : 'bg-white/10 border-white/15 text-white'
                }`}
                title="Waktu pengerjaan (Batas total 15 menit)"
              >
                <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-red-300' : 'text-blue-300'}`} />
                <span className="tabular-nums tracking-wider">{formattedTime}</span>
              </div>

              {/* Streak Counter */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white text-xs sm:text-sm font-medium"
                title="Streak konsistensi jawaban benar"
              >
                <Flame className={`w-4 h-4 ${streakCount > 0 ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-slate-400'}`} />
                <span className="hidden xs:inline text-blue-200">Streak:</span>
                <span className="font-bold text-amber-300">{streakCount}</span>
              </div>

              {/* Stage Indicator */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#3381C3]/30 border border-blue-400/30 text-xs">
                <span className="text-blue-200">Tahap:</span>
                <span className="font-bold text-white">
                  {currentStage} dari {totalStages}
                </span>
                {tierLabel && (
                  <span className="text-[11px] text-amber-200 font-normal truncate max-w-[150px]">
                    · {tierLabel.replace(/^Stage \d+:\s*/, '')}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-100">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Tes Selesai
              </span>
            </div>
          )}

          {/* Action Button: Quick View Reading Passage */}
          <div className="flex items-center gap-2 shrink-0">
            {!isCompleted && (
              <button
                onClick={onTogglePassageModal}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  isPassageModalOpen
                    ? 'bg-amber-400 text-slate-900 shadow-sm font-semibold'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="whitespace-nowrap">
                  {isPassageModalOpen ? 'Tutup Teks' : 'Buka Teks Bacaan'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
