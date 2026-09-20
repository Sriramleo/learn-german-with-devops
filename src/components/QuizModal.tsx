import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  ArrowRight, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { UserStats } from '../types';
import { PROGRESS_QUIZZES } from '../data/quizData';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  stats,
  onUpdateStats
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = PROGRESS_QUIZZES[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswer === currentQ.correctIndex;
    if (isCorrect) {
      setScore(score + 1);
      onUpdateStats({ 
        xp: Math.min(stats.maxXp, stats.xp + currentQ.xpBounty),
        streakDays: Math.max(1, stats.streakDays)
      });
    }
  };

  const handleNext = () => {
    if (currentIdx < PROGRESS_QUIZZES.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-border-strong rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5 text-slate-900">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="font-sans text-base font-bold text-slate-900">
              Progress Quiz / மதிப்பீட்டு தேர்வு
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close Quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!quizFinished ? (
          <>
            {/* Question Counter & XP indicator */}
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500">
                Question {currentIdx + 1} of {PROGRESS_QUIZZES.length}
              </span>
              <span className="text-amber-700 font-bold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                +{currentQ.xpBounty} XP
              </span>
            </div>

            {/* Question Card */}
            <div className="flex flex-col gap-3">
              <h3 className="font-sans text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>

              {currentQ.contextGerman && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-border-subtle flex flex-col gap-1">
                  <span className="text-[10px] text-sky-700 font-mono font-bold uppercase">
                    German Context:
                  </span>
                  <p className="font-mono text-xs sm:text-sm text-slate-900 font-medium italic">
                    "{currentQ.contextGerman}"
                  </p>
                  {currentQ.contextTamil && (
                    <p className="text-xs text-slate-600 font-sans">
                      {currentQ.contextTamil}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Option Buttons */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrectOption = idx === currentQ.correctIndex;

                let optionStyles = 'bg-white border-border-subtle hover:border-slate-300 text-slate-800';

                if (isAnswerSubmitted) {
                  if (isCorrectOption) {
                    optionStyles = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    optionStyles = 'bg-rose-50 border-rose-500 text-rose-900';
                  } else {
                    optionStyles = 'bg-white border-border-subtle text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyles = 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold shadow-xs';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-3 sm:p-3.5 rounded-xl border text-left font-sans text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyles}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation when submitted */}
            {isAnswerSubmitted && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-border-subtle text-xs text-slate-700 flex flex-col gap-1 animate-in fade-in">
                <span className="text-[10px] text-emerald-700 font-mono font-bold uppercase">
                  Explanation / விளக்கம்:
                </span>
                <p className="font-sans">{currentQ.explanation}</p>
              </div>
            )}

            {/* Footer Action */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border-subtle">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`px-5 py-2.5 rounded-xl font-sans text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedAnswer !== null
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentIdx < PROGRESS_QUIZZES.length - 1 ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        ) : (
          /* Quiz Results Completion Screen */
          <div className="flex flex-col items-center justify-center py-6 text-center gap-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
                Quiz Completed!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-sans">
                You scored {score} out of {PROGRESS_QUIZZES.length} questions correctly.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-border-subtle w-full max-w-sm flex items-center justify-around font-mono text-sm">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Accuracy</span>
                <span className="font-bold text-slate-900">
                  {Math.round((score / PROGRESS_QUIZZES.length) * 100)}%
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase font-bold">XP Earned</span>
                <span className="font-bold text-amber-700">+{score * 25} XP</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-border-subtle transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
