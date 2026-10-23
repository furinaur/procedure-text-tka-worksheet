import React from 'react';
import { StageContent } from '../data/procedureTestData';
import { Bus, AlertTriangle, CheckSquare, X, BookmarkCheck } from 'lucide-react';

interface PassageViewerProps {
  stageContent: StageContent;
  isOpen: boolean;
  onClose?: () => void;
  isFloating?: boolean;
}

export const PassageViewer: React.FC<PassageViewerProps> = ({
  stageContent,
  isOpen,
  onClose,
  isFloating = false
}) => {
  const { readingPassage } = stageContent;

  const content = (
    <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Transjakarta Passage Header */}
      <div className="bg-gradient-to-r from-[#1E468E] to-[#3381C3] p-4 text-white">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-white/15 text-white border border-white/20">
              <Bus className="w-3.5 h-3.5 text-amber-300" />
              {readingPassage.routeBadge}
            </span>
            <span className="text-xs text-blue-100 font-medium hidden sm:inline">
              Procedure Text Reference
            </span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup teks bacaan"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
          {readingPassage.title}
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 mt-1">
          {readingPassage.subtitle}
        </p>
      </div>

      {/* Main Reading Passage Body */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-slate-800 text-sm leading-relaxed max-h-[calc(100vh-220px)]">
        {/* Materials / Requirements Box */}
        {readingPassage.materials && readingPassage.materials.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E468E] uppercase tracking-wider mb-2">
              <CheckSquare className="w-4 h-4 text-[#3381C3]" />
              Materials & Requirements Needed:
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
              {readingPassage.materials.map((mat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3381C3] mt-2 shrink-0" />
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Steps Section */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            <BookmarkCheck className="w-4 h-4 text-[#1E468E]" />
            Sequential Operating Steps (Prosedur Operasional):
          </div>

          <div className="space-y-3">
            {readingPassage.steps.map((st) => (
              <div
                key={st.number}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-200/70 hover:border-slate-300 transition-colors bg-white"
              >
                <div className="w-7 h-7 rounded-full bg-[#1E468E] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                  {st.number}
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {st.heading}
                  </h4>
                  <p className="text-slate-600 text-xs sm:text-sm">
                    {st.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notice Callout */}
        {readingPassage.importantNotice && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong className="font-semibold text-amber-950">Catatan Kritis: </strong>
              {readingPassage.importantNotice}
            </p>
          </div>
        )}
      </div>
    </article>
  );

  if (isFloating) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
