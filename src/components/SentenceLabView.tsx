import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Heart, 
  Zap, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { UserStats } from '../types';
import { SENTENCE_EXERCISES } from '../data/sentenceData';
import { speakGerman } from '../utils/speech';

interface SentenceLabViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

export const SentenceLabView: React.FC<SentenceLabViewProps> = ({
  stats,
  onUpdateStats
}) => {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const currentEx = SENTENCE_EXERCISES[exerciseIndex] || SENTENCE_EXERCISES[0];

  // Placed tokens in target slots
  const [placedSlots, setPlacedSlots] = useState<(string | null)[]>(
    Array(currentEx.targetSlots.length).fill(null)
  );

  // Available tokens in word bank
  const [availableBank, setAvailableBank] = useState<typeof currentEx.wordBank>(
    currentEx.wordBank
  );

  // Evaluation status
  const [checkStatus, setCheckStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Reset slots when exercise changes
  useEffect(() => {
    setPlacedSlots(Array(currentEx.targetSlots.length).fill(null));
    setAvailableBank([...currentEx.wordBank]);
    setCheckStatus('idle');
    setFeedbackMessage('');
  }, [exerciseIndex]);

  // Click word in word bank to place into first empty slot
  const handleBankTokenClick = (item: typeof currentEx.wordBank[0]) => {
    const firstEmptyIndex = placedSlots.findIndex(slot => slot === null);
    if (firstEmptyIndex === -1) return; // All slots filled

    // Place into slot
    const nextSlots = [...placedSlots];
    nextSlots[firstEmptyIndex] = item.text;
    setPlacedSlots(nextSlots);

    // Remove from available bank
    setAvailableBank(availableBank.filter(x => x.id !== item.id));
    setCheckStatus('idle');
  };

  // Click filled slot to return token back to word bank
  const handleSlotClick = (index: number) => {
    const tokenText = placedSlots[index];
    if (!tokenText) return;

    // Find original bank item
    const originalItem = currentEx.wordBank.find(w => w.text === tokenText) || {
      id: tokenText,
      text: tokenText,
      tamilMeaning: ''
    };

    // Return to bank
    setAvailableBank([...availableBank, originalItem]);

    // Clear slot
    const nextSlots = [...placedSlots];
    nextSlots[index] = null;
    setPlacedSlots(nextSlots);
    setCheckStatus('idle');
  };

  // Reset all slots
  const handleResetSlots = () => {
    setPlacedSlots(Array(currentEx.targetSlots.length).fill(null));
    setAvailableBank([...currentEx.wordBank]);
    setCheckStatus('idle');
  };

  // Check the assembled sentence
  const handleCheckSentence = () => {
    // Check if all slots are filled
    if (placedSlots.some(s => s === null)) {
      setFeedbackMessage('Please fill all slots before checking.');
      setCheckStatus('wrong');
      return;
    }

    // Compare with targetSlots
    const isCorrect = placedSlots.every((val, idx) => val === currentEx.targetSlots[idx]);

    if (isCorrect) {
      setCheckStatus('correct');
      setFeedbackMessage('Hervorragend! Correct German syntax & verb position.');
      // Reward XP & stats
      const newCompleted = stats.sentenceDrillsCompleted + 1;
      onUpdateStats({ 
        xp: Math.min(stats.maxXp, stats.xp + 20),
        sentenceDrillsCompleted: newCompleted,
        sentenceAccuracy: Math.min(100, Math.round((newCompleted / (newCompleted + 0.1)) * 100)),
        lives: Math.min(5, stats.lives + 1)
      });
      // Play full sentence audio
      const fullGerman = `${currentEx.prefixTokens.join(' ')} ${placedSlots.join(' ')}`;
      speakGerman(fullGerman, 1.0);
    } else {
      setCheckStatus('wrong');
      setFeedbackMessage('Incorrect word order. In German "weil" clauses, the conjugated verb locks at the absolute end!');
      // Decrement life if > 0
      if (stats.lives > 0) {
        onUpdateStats({ lives: Math.max(0, stats.lives - 1) });
      }
    }
  };

  // Move to next exercise
  const handleNextExercise = () => {
    if (exerciseIndex < SENTENCE_EXERCISES.length - 1) {
      setExerciseIndex(exerciseIndex + 1);
    } else {
      setExerciseIndex(0); // Cycle or loop
    }
  };

  // Listen to full sentence
  const playCurrentGermanSentence = () => {
    const fullGerman = `${currentEx.prefixTokens.join(' ')} ${currentEx.targetSlots.join(' ')}`;
    speakGerman(fullGerman, 1.0);
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1440px] mx-auto pb-16">
      {/* Top Exercise Header Bar */}
      <div className="p-4 md:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200">
              {currentEx.scriptName}
            </span>
            <span className="text-slate-400 font-mono text-xs">•</span>
            <span className="text-sky-700 font-mono text-xs font-semibold">
              {currentEx.tag}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            DevOps Sentence Lab <span className="text-slate-500 font-normal text-base md:text-lg">/ வாக்கிய அமைப்பு ஆய்வகம்</span>
          </h1>
        </div>

        {/* Progress & Lives Bar */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Exercise Index Counter */}
          <div className="font-mono text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            Exercise <strong className="text-emerald-700">0{currentEx.exerciseIndex}</strong> / 0{currentEx.totalExercises}
          </div>

          {/* Lives Counter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="font-mono text-xs font-bold text-slate-950">
              {stats.lives}
            </span>
          </div>

          {/* XP Bounty */}
          <div className="flex items-center gap-1 text-amber-700 font-mono text-xs font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>+20 XP</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 8 Cols Sentence Construction + 4 Cols Grammar Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Runbook Builder */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Exercise Card */}
          <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-6 relative">
            {/* Prompt Section: English & Tamil */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-amber-700 uppercase tracking-wider font-bold">
                  {currentEx.runbookType}
                </span>
                <button
                  onClick={playCurrentGermanSentence}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-700 font-mono text-xs border border-slate-200 transition-colors shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Native Audio</span>
                </button>
              </div>

              {/* English Prompt */}
              <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                "{currentEx.englishPrompt}"
              </h2>

              {/* Tamil Prompt */}
              <p className="text-sm md:text-base text-amber-700 font-medium leading-relaxed">
                "{currentEx.tamilPrompt}"
              </p>
            </div>

            {/* Compiled Terminal Output (Sentence Slot Assembly Area) */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                  COMPILED_GERMAN_RUNBOOK_ENTRY
                </span>
                <button
                  onClick={handleResetSlots}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
                  title="Reset Slots"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET</span>
                </button>
              </div>

              {/* Assembled Sentence Tokens Flow */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-sm md:text-base leading-loose pt-2">
                {/* Fixed Prefix Tokens */}
                {currentEx.prefixTokens.map((token, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 border border-slate-300 select-none text-sm md:text-base font-medium"
                  >
                    {token}
                  </span>
                ))}

                {/* Target Slots */}
                {placedSlots.map((slotContent, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSlotClick(idx)}
                    className={`min-w-[120px] px-3 py-1.5 rounded-lg font-mono text-sm md:text-base font-bold transition-all cursor-pointer select-none flex items-center justify-center border shadow-xs ${
                      slotContent
                        ? checkStatus === 'correct'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                          : checkStatus === 'wrong'
                          ? 'bg-rose-50 text-rose-800 border-rose-500'
                          : 'bg-white text-sky-800 border-sky-300'
                        : 'bg-white text-slate-400 border-dashed border-slate-300 hover:border-emerald-500'
                    }`}
                  >
                    {slotContent || currentEx.slotHints[idx]}
                  </div>
                ))}
              </div>
            </div>

            {/* Word Bank Area (Duolingo-style click to place tokens) */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Available Word Bank Tokens (Click to place in order):
              </span>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {availableBank.length === 0 ? (
                  <span className="font-mono text-xs text-slate-500 italic">
                    All tokens placed in runbook slots above. Ready to verify!
                  </span>
                ) : (
                  availableBank.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleBankTokenClick(item)}
                      className="group flex flex-col items-start px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all text-left shadow-xs active:scale-95"
                    >
                      <span className="font-mono text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                        {item.text}
                      </span>
                      {item.tamilMeaning && (
                        <span className="text-[10px] text-slate-500 font-sans group-hover:text-slate-700">
                          {item.tamilMeaning}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Validation Feedback Banner */}
            {checkStatus !== 'idle' && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  checkStatus === 'correct'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                {checkStatus === 'correct' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                )}
                <div>
                  <h4 className="font-mono text-sm font-bold">
                    {checkStatus === 'correct' ? 'Richtig! / மிகச் சரி!' : 'Syntax Error / தவறான வாக்கிய அமைப்பு'}
                  </h4>
                  <p className="text-xs md:text-sm mt-0.5 leading-relaxed">
                    {feedbackMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Action Bar (Check / Next / Skip) */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-200">
              <button
                onClick={handleNextExercise}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold border border-slate-200 transition-colors shadow-xs"
              >
                Skip / அடுத்தது
              </button>

              <div className="flex items-center gap-3">
                {checkStatus === 'correct' ? (
                  <button
                    onClick={handleNextExercise}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all shadow-xs"
                  >
                    <span>Next Exercise / தொடர்க</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCheckSentence}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all shadow-xs"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>Prüfen / சரிபார்க்கவும்</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Grammar & Tamil Structural Bridge Drawer */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-mono text-sm font-bold text-slate-900">
                {currentEx.explanationTitle}
              </h3>
            </div>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              {currentEx.explanationGerman}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-amber-800 leading-relaxed font-sans">
              {currentEx.explanationTamil}
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry & Sprint Metrics */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Incident Telemetry Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-4">
            <span className="font-mono text-xs text-emerald-700 font-bold uppercase tracking-wider">
              Telemetry & Metadata
            </span>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">DOMAIN:</span>
                <span className="text-slate-900 font-bold">{currentEx.domain}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">SUBDOMAIN:</span>
                <span className="text-sky-700">{currentEx.subdomain}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">CEFR LEVEL:</span>
                <span className="text-emerald-700 font-bold">{currentEx.cefrLevel}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">PATTERN:</span>
                <span className="text-amber-700">{currentEx.patternType}</span>
              </div>
            </div>
          </div>

          {/* 14 Days Clean Streak Spark Chart */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900">
                14-Day Sentence Streak
              </span>
              <span className="font-mono text-xs text-amber-700 font-bold">
                {stats.streakDays > 0 ? `${stats.streakDays} Days On-Track` : '0 Days (Start Today)'}
              </span>
            </div>

            <div className="flex items-end justify-between gap-1 h-16 pt-2">
              {(stats.streakDays > 0 
                ? [65, 70, 75, 80, 85, 78, 90, 82, 88, 92, 95, 91, 94, 98] 
                : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              ).map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-emerald-500 transition-all hover:bg-emerald-600"
                    style={{ height: `${Math.max(4, (val / 100) * 48)}px`, opacity: val === 0 ? 0.25 : 1 }}
                    title={`Day ${i + 1}: ${val}%`}
                  />
                  <span className="text-[9px] font-mono text-slate-400">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar Glossary Cheat Pill */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
            <span className="font-mono text-xs text-slate-600 font-bold uppercase tracking-wider">
              Quick Grammar Glossary
            </span>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-sky-700 font-mono block">Subjekt (எழுவாய்):</strong>
                <span className="text-slate-600">The entity executing the action (e.g. der Worker-Node).</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-emerald-700 font-mono block">Prädikat am Ende (பயனிலை):</strong>
                <span className="text-slate-600">In "weil" clauses, the conjugated verb is pushed to the conclusion!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
