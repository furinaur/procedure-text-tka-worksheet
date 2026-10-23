import React from 'react';
import { McMultipleQuestion } from '../data/procedureTestData';
import { Check, CheckSquare, Square, X } from 'lucide-react';

interface McMultipleQuestionProps {
  question: McMultipleQuestion;
  selectedOptions: string[];
  onToggleOption: (optionId: string) => void;
  isReviewed?: boolean;
}

export const McMultipleQuestionCard: React.FC<McMultipleQuestionProps> = ({
  question,
  selectedOptions = [],
  onToggleOption,
  isReviewed = false
}) => {
  const selectionCount = selectedOptions.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3381C3]" />
            <h3 className="font-bold text-slate-900 text-base">
              {question.title}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#1E468E] border border-blue-200">
            {question.instructionText}
          </span>
        </div>

        <p className="text-sm sm:text-base font-semibold text-slate-900 mt-2 leading-relaxed">
          {question.question}
        </p>

        {!isReviewed && (
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-medium text-slate-700">Status pilihan:</span>
            <span className={selectionCount === question.minSelections ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
              {selectionCount} dari {question.minSelections} opsi dipilih
            </span>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {question.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const isCorrectAnswer = isReviewed && question.correctAnswers.includes(option.id);
          const isWrongSelection = isReviewed && isSelected && !isCorrectAnswer;

          return (
            <button
              key={option.id}
              type="button"
              disabled={isReviewed}
              onClick={() => onToggleOption(option.id)}
              className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 ${
                isSelected && !isReviewed
                  ? 'border-[#3381C3] bg-blue-50/40 shadow-xs ring-1 ring-[#3381C3]/30'
                  : isCorrectAnswer
                  ? 'border-emerald-500 bg-emerald-50/70'
                  : isWrongSelection
                  ? 'border-red-400 bg-red-50/70'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
              } ${isReviewed ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {/* Checkbox Icon */}
              <div className="shrink-0 mt-0.5">
                {isReviewed ? (
                  isCorrectAnswer ? (
                    <div className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : isWrongSelection ? (
                    <div className="w-5 h-5 rounded bg-red-600 text-white flex items-center justify-center">
                      <X className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <Square className="w-5 h-5 text-slate-300" />
                  )
                ) : isSelected ? (
                  <div className="w-5 h-5 rounded bg-[#3381C3] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <Square className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 text-xs sm:text-sm text-slate-800 leading-snug">
                {option.text}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
