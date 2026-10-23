import React, { useState } from 'react';
import { SequenceQuestion, DragStep } from '../data/procedureTestData';
import { GripVertical, ChevronUp, ChevronDown, RotateCcw, CheckCircle2, ArrowUpDown } from 'lucide-react';

interface DragDropSequenceProps {
  question: SequenceQuestion;
  currentOrder: string[]; // array of step IDs
  onChangeOrder: (newOrder: string[]) => void;
  isReviewed?: boolean;
}

export const DragDropSequence: React.FC<DragDropSequenceProps> = ({
  question,
  currentOrder,
  onChangeOrder,
  isReviewed = false
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Map step IDs to step objects
  const stepMap = new Map<string, DragStep>();
  question.initialScrambledSteps.forEach(s => stepMap.set(s.id, s));

  // If currentOrder is empty, use initial scrambled order
  const orderedSteps: DragStep[] = (currentOrder.length > 0 ? currentOrder : question.initialScrambledSteps.map(s => s.id))
    .map(id => stepMap.get(id))
    .filter((s): s is DragStep => Boolean(s));

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (isReviewed) return;
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (isReviewed || id === draggedId) return;
    setDragOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (isReviewed || !draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const currentIds = orderedSteps.map(s => s.id);
    const sourceIndex = currentIds.indexOf(draggedId);
    const targetIndex = currentIds.indexOf(targetId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const updated = [...currentIds];
      const [removed] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, removed);
      onChangeOrder(updated);
    }

    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (isReviewed) return;
    const currentIds = orderedSteps.map(s => s.id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentIds.length) return;

    const updated = [...currentIds];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChangeOrder(updated);
  };

  const handleReset = () => {
    if (isReviewed) return;
    onChangeOrder(question.initialScrambledSteps.map(s => s.id));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Title & Instruction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E468E]" />
            <h3 className="font-bold text-slate-900 text-base">
              {question.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {question.instruction}
          </p>
        </div>

        {!isReviewed && (
          <button
            type="button"
            onClick={handleReset}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Urutan</span>
          </button>
        )}
      </div>

      <div className="text-xs text-slate-500 flex items-center gap-2 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100/80">
        <ArrowUpDown className="w-4 h-4 text-[#3381C3] shrink-0" />
        <span>
          Tarik kartu untuk memindahkan urutan, atau gunakan tombol panah (▲ / ▼) di sebelah kanan setiap langkah.
        </span>
      </div>

      {/* Scrambled Steps Container */}
      <div className="space-y-2.5">
        {orderedSteps.map((step, index) => {
          const isDragging = draggedId === step.id;
          const isOver = dragOverId === step.id;
          const isCorrectPosition = isReviewed && question.correctOrderIds[index] === step.id;
          const isWrongPosition = isReviewed && question.correctOrderIds[index] !== step.id;

          return (
            <div
              key={step.id}
              draggable={!isReviewed}
              onDragStart={(e) => handleDragStart(e, step.id)}
              onDragOver={(e) => handleDragOver(e, step.id)}
              onDrop={(e) => handleDrop(e, step.id)}
              onDragEnd={handleDragEnd}
              className={`flex items-center justify-between gap-3 p-3.5 rounded-lg border transition-all ${
                isDragging
                  ? 'opacity-40 border-dashed border-[#1E468E] bg-blue-50/30'
                  : isOver
                  ? 'border-[#3381C3] ring-2 ring-[#3381C3]/20 bg-blue-50/50'
                  : isCorrectPosition
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : isWrongPosition
                  ? 'bg-red-50/60 border-red-300'
                  : 'bg-white hover:border-slate-300 border-slate-200'
              } ${!isReviewed ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Drag Handle */}
                {!isReviewed && (
                  <div className="text-slate-400 hover:text-slate-600 cursor-grab shrink-0">
                    <GripVertical className="w-4 h-4" />
                  </div>
                )}

                {/* Step Position Number Badge */}
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCorrectPosition
                      ? 'bg-emerald-600 text-white'
                      : isWrongPosition
                      ? 'bg-red-600 text-white'
                      : 'bg-[#1E468E] text-white shadow-xs'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Step Text */}
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-snug">
                  {step.text}
                </p>
              </div>

              {/* Move Buttons for Accessibility and Touch */}
              {!isReviewed ? (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                    aria-label={`Pindahkan langkah ke atas`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === orderedSteps.length - 1}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                    aria-label={`Pindahkan langkah ke bawah`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="shrink-0 text-xs font-semibold">
                  {isCorrectPosition ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Posisi Tepat
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Harusnya #{question.correctOrderIds.indexOf(step.id) + 1}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
