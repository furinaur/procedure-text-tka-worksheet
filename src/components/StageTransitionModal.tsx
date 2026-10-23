import React from 'react';
import { StageScoreResult } from '../types/worksheet';
import { Award, Zap, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StageTransitionModalProps {
  isOpen: boolean;
  stage1Score: StageScoreResult;
  adaptiveTier: 'advanced_hots' | 'foundation_mastery';
  onStartStage2: () => void;
}

export const StageTransitionModal: React.FC<StageTransitionModalProps> = ({
  isOpen,
  stage1Score,
  adaptiveTier,
  onStartStage2
}) => {
  if (!isOpen) return null;

  const isAdvanced = adaptiveTier === 'advanced_hots';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Banner with Transjakarta colors */}
        <div className={`p-6 text-white ${isAdvanced ? 'bg-gradient-to-r from-[#1E468E] via-[#3381C3] to-[#1E468E]' : 'bg-gradient-to-r from-[#1E468E] to-[#3381C3]'}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              {isAdvanced ? (
                <Zap className="w-6 h-6 text-amber-300 fill-amber-300" />
              ) : (
                <Compass className="w-6 h-6 text-blue-200" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-blue-200">
                Sistem Evaluasi Adaptif
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Hasil Tahap 1 Selesai
              </h2>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {/* Score Snapshot */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Skor Tahap 1 (Diagnostik):</span>
              <div className="text-2xl font-bold text-[#1E468E]">
                {stage1Score.totalScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium">Akurasi:</span>
              <div className="text-lg font-bold text-slate-800">
                {stage1Score.percentage}%
              </div>
            </div>
          </div>

          {/* Adaptive Tier Explanation */}
          <div className={`p-4 rounded-xl border ${isAdvanced ? 'bg-amber-50/70 border-amber-200 text-amber-950' : 'bg-blue-50/70 border-blue-200 text-slate-900'}`}>
            <div className="flex items-center gap-2 mb-2 font-bold text-sm">
              <Award className={`w-4 h-4 ${isAdvanced ? 'text-amber-600' : 'text-[#1E468E]'}`} />
              <span>
                {isAdvanced
                  ? 'Jalur Lanjutan Terbuka: Stage 2 HOTS (Advanced Transit Master)'
                  : 'Jalur Penguatan Terbuka: Stage 2 Core (Foundation & Procedural Mastery)'}
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
              {isAdvanced
                ? 'Luar biasa! Skor Stage 1 kamu mencapai ambang batas tinggi (≥ 75%). Sistem mengarahkan kamu ke teks prosedur HOTS mengenai navigasi transfer koridor transit terpusat dan aturan tarif integrasi JakLingko.'
                : 'Pencapaian yang baik! Untuk memperkuat penguasaan struktur dasar teks prosedur, kata kerja imperatif, dan penanda urutan waktu, kamu diarahkan ke materi pengoperasian mesin tiket otomatis di halte.'}
            </p>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Waktu timer 15 menit tetap berjalan secara kumulatif untuk kedua tahap.</span>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onStartStage2}
            className="w-full py-3 px-5 rounded-xl bg-[#1E468E] hover:bg-[#163469] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Mulai Pengerjaan Stage 2</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
