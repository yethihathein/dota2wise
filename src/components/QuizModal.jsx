import React, { useState } from 'react';
import { X, HelpCircle, Award, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function QuizModal() {
  const { quizOpen, setQuizOpen, quizQuestions, openEntity } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  if (!quizOpen) return null;

  const currentQ = quizQuestions[currentIndex] || quizQuestions[0];
  const isCorrect = selectedOption === currentQ.answer;

  const handleSelectOption = (opt) => {
    if (selectedOption) return;
    setSelectedOption(opt);
    if (opt === currentQ.answer) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % quizQuestions.length);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowHint(false);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={() => setQuizOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Dota 2 Knowledge Quiz"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="nf-modal-animate relative w-full max-w-xl bg-[#181818] border border-white/15 rounded-xl p-6 sm:p-8 shadow-2xl space-y-5"
      >
        <button
          type="button"
          onClick={() => setQuizOpen(false)}
          aria-label="Close quiz"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/70 hover:bg-[#E50914] text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pr-8">
          <div className="flex items-center gap-2 text-[#E50914] text-xs font-bold uppercase tracking-widest">
            <HelpCircle className="w-4 h-4" />
            <span>The Shopkeeper&rsquo;s Trial • {currentQ.type}</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded bg-white/10 text-white font-semibold">
              Score: {score}
            </span>
            <span className="px-2.5 py-1 rounded bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40 font-bold">
              🔥 Streak: {streak}
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[#141414] border border-white/10 rounded-lg p-5 space-y-3">
          <div className="text-[11px] text-[#a3a3a3]">
            Question {currentIndex + 1} of {quizQuestions.length}
          </div>
          <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
            &ldquo;{currentQ.clue}&rdquo;
          </p>

          {showHint ? (
            <p className="text-xs text-[#d4af37] bg-amber-950/30 border border-[#d4af37]/30 p-2.5 rounded">
              💡 Hint: {currentQ.hint}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="text-xs font-semibold text-[#d4af37] hover:underline"
            >
              Need a hint from the Archive?
            </button>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2.5">
          {currentQ.options.map((opt) => {
            let btnStyle = 'bg-[#1f1f1f] hover:bg-white/10 border-white/15 text-white';
            if (selectedOption) {
              if (opt === currentQ.answer) {
                btnStyle = 'bg-emerald-900/60 border-emerald-400 text-white font-bold';
              } else if (opt === selectedOption) {
                btnStyle = 'bg-red-900/60 border-red-400 text-white';
              } else {
                btnStyle = 'bg-[#141414] border-white/5 text-[#a3a3a3] opacity-60';
              }
            }

            return (
              <button
                key={opt}
                type="button"
                disabled={Boolean(selectedOption)}
                onClick={() => handleSelectOption(opt)}
                className={`p-3.5 rounded-lg border text-left text-xs sm:text-sm transition-all ${btnStyle}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Result & Next Actions */}
        {selectedOption && (
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-bold">
              {isCorrect ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Award className="w-4 h-4" /> Correct! The Ancients recognize your wisdom.
                </span>
              ) : (
                <span className="text-red-400">
                  Incorrect — Answer: <strong>{currentQ.answer}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setQuizOpen(false);
                  openEntity(currentQ.entityType, currentQ.entityId);
                }}
                className="text-xs font-semibold px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-[#d4af37]"
              >
                Inspect Entry
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded bg-[#E50914] hover:bg-[#f40612] text-white"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] text-[#a3a3a3] hover:text-white"
          >
            <RotateCcw className="w-3 h-3" /> Reset Score
          </button>
        </div>
      </div>
    </div>
  );
}
