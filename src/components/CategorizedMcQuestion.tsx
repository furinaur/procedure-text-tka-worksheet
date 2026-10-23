import React from 'react';
import { CategorizedQuestion } from '../data/procedureTestData';
import { Check, X, HelpCircle } from 'lucide-react';

interface CategorizedMcQuestionProps {
  question: CategorizedQuestion;
  selectedCategories: Record<string, 'Sesuai' | 'Tidak Sesuai'>;
  onSelectCategory: (statementId: string, category: 'Sesuai' | 'Tidak Sesuai') => void;
  isReviewed?: boolean;
}

export const CategorizedMcQuestionCard: React.FC<CategorizedMcQuestionProps> = ({
  question,
  selectedCategories = {},
  onSelectCategory,
  isReviewed = false
}) => {
  const answeredCount = Object.keys(selectedCategories).length;
  const totalStatements = question.statements.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E468E]" />
            <h3 className="font-bold text-slate-900 text-base">
              {question.title}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-[#1E468E] border border-blue-200">
            TKA Kategorik / Menjodohkan
          </span>
        </div>

        <p className="text-sm sm:text-base font-semibold text-slate-900 mt-2 leading-relaxed">
          {question.question}
        </p>

        {!isReviewed && (
          <div className="mt-2 text-xs text-slate-500">
            Pernyataan terjawab: <span className="font-bold text-[#1E468E]">{answeredCount} dari {totalStatements}</span>
          </div>
        )}
      </div>

      {/* Categorized Matrix Table */}
      <div className="space-y-3">
        {question.statements.map((stmt, index) => {
          const userChoice = selectedCategories[stmt.id];
          const isCorrect = isReviewed && userChoice === stmt.correctCategory;
          const isWrong = isReviewed && userChoice && userChoice !== stmt.correctCategory;

          return (
            <div
              key={stmt.id}
              className={`p-3.5 rounded-lg border transition-all ${
                isReviewed
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-red-300 bg-red-50/40'
                  : userChoice
                  ? 'border-slate-300 bg-slate-50/60'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Statement text */}
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                    {index + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-snug">
                    {stmt.statement}
                  </p>
                </div>

                {/* Categorized Choice Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {(['Sesuai', 'Tidak Sesuai'] as const).map((cat) => {
                    const isSelected = userChoice === cat;
                    const isKeyAnswer = isReviewed && stmt.correctCategory === cat;

                    let btnStyle = 'border-slate-200 bg-white text-slate-700 hover:border-slate-300';
                    if (!isReviewed) {
                      if (isSelected) {
                        btnStyle = cat === 'Sesuai'
                          ? 'border-[#1E468E] bg-[#1E468E] text-white shadow-xs'
                          : 'border-[#3381C3] bg-[#3381C3] text-white shadow-xs';
                      }
                    } else {
                      if (isKeyAnswer) {
                        btnStyle = 'border-emerald-600 bg-emerald-600 text-white font-bold';
                      } else if (isSelected && !isKeyAnswer) {
                        btnStyle = 'border-red-500 bg-red-500 text-white font-bold';
                      } else {
                        btnStyle = 'border-slate-200 bg-slate-100 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={cat}
                        type="button"
                        disabled={isReviewed}
                        onClick={() => onSelectCategory(stmt.id, cat)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all flex items-center gap-1.5 ${btnStyle} ${
                          isReviewed ? 'cursor-default' : 'cursor-pointer active:scale-95'
                        }`}
                      >
                        {isReviewed && isKeyAnswer && <Check className="w-3 h-3 stroke-[3]" />}
                        {isReviewed && isSelected && !isKeyAnswer && <X className="w-3 h-3 stroke-[3]" />}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review explanation for statement */}
              {isReviewed && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs text-slate-600 flex items-start gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">Kunci: {stmt.correctCategory}</strong> — {stmt.explanation}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
