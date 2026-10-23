import React from 'react';
import { McSingleQuestion } from '../data/procedureTestData';
import { Check, X } from 'lucide-react';

interface McSingleQuestionProps {
  question: McSingleQuestion;
  selectedOption: string;
  onSelectOption: (optionId: string) => void;
  isReviewed?: boolean;
}

export const McSingleQuestionCard: React.FC<McSingleQuestionProps> = ({
  question,
  selectedOption,
  onSelectOption,
  isReviewed = false
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Question Header */}
      <div className="pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1E468E]" />
          <h3 className="font-bold text-slate-900 text-base">
            {question.title}
          </h3>
          <span className="text-xs text-slate-500 font-medium ml-auto">
            Pilihan Ganda Biasa (Pilih 1)
          </span>
        </div>
        <p className="text-sm sm:text-base font-semibold text-slate-900 mt-2 leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {question.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrectAnswer = isReviewed && option.id === question.correctAnswer;
          const isWrongSelection = isReviewed && isSelected && !isCorrectAnswer;

          return (
            <button
              key={option.id}
              type="button"
              disabled={isReviewed}
              onClick={() => onSelectOption(option.id)}
              className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 ${
                isSelected && !isReviewed
                  ? 'border-[#1E468E] bg-blue-50/50 shadow-xs ring-1 ring-[#1E468E]/20'
                  : isCorrectAnswer
                  ? 'border-emerald-500 bg-emerald-50/70'
                  : isWrongSelection
                  ? 'border-red-400 bg-red-50/70'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
              } ${isReviewed ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {/* Radio Indicator */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                  isSelected && !isReviewed
                    ? 'bg-[#1E468E] text-white'
                    : isCorrectAnswer
                    ? 'bg-emerald-600 text-white'
                    : isWrongSelection
                    ? 'bg-red-600 text-white'
                    : 'border border-slate-300 text-slate-600 bg-slate-50'
                }`}
              >
                {isCorrectAnswer ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isWrongSelection ? (
                  <X className="w-3.5 h-3.5" />
                ) : (
                  option.id
                )}
              </div>

              {/* Option text */}
              <div className="flex-1 text-xs sm:text-sm text-slate-800 leading-snug font-normal">
                {option.text}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
