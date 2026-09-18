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
      onUpdateStats({ xp: Math.min(stats.maxXp, stats.xp + currentQ.xpBounty) });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 text-slate-900">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="font-mono text-base font-bold text-slate-900">
              Progress Quiz / மதிப்பீட்டு தேர்வு
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!quizFinished ? (
          <>
            {/* Question Counter & XP indicator */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">
                Question {currentIdx + 1} of {PROGRESS_QUIZZES.length}
              </span>
              <span className="text-amber-700 font-bold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                +{currentQ.xpBounty} XP
              </span>
            </div>

            {/* Question Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
              <h3 className="text-base font-semibold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>
              {currentQ.contextGerman && (
                <p className="font-mono text-xs text-sky-700">
                  {currentQ.contextGerman}
                </p>
              )}
              {currentQ.contextTamil && (
                <p className="text-xs text-amber-700 font-sans">
                  {currentQ.contextTamil}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrect = i === currentQ.correctIndex;

                let optStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300';
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    optStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-sky-50 border-sky-400 text-sky-900 font-bold';
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full p-3.5 rounded-xl border text-left font-mono text-sm transition-all flex items-center justify-between shadow-xs ${optStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after submit */}
            {isAnswerSubmitted && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <strong className="text-emerald-700 font-mono block mb-1">Explanation:</strong>
                {currentQ.explanation}
              </div>
            )}

            {/* Submit / Next button */}
            <div className="flex justify-end gap-3 pt-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all shadow-xs"
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all shadow-xs"
                >
                  <span>{currentIdx < PROGRESS_QUIZZES.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        ) : (
          /* Quiz Results View */
          <div className="flex flex-col items-center text-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Quiz Completed! / தேர்வு நிறைவடைந்தது!
            </h3>

            <p className="text-sm text-slate-600">
              You scored <strong className="text-emerald-700">{score}</strong> out of {PROGRESS_QUIZZES.length} on technical DevOps German concepts.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-amber-700 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Streak Protected! +{score * 25} XP Earned</span>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs border border-slate-200 shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold shadow-xs"
              >
                Back to App
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
