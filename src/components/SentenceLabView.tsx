import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Terminal,
  Code2,
  Sparkles,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { UserStats } from '../types';
import { SENTENCE_EXERCISES } from '../data/sentenceData';
import { speakGerman } from '../utils/speech';

interface SentenceLabViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  isTamilActive?: boolean;
}

export const SentenceLabView: React.FC<SentenceLabViewProps> = ({
  stats,
  onUpdateStats,
  isTamilActive = true
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

    const nextSlots = [...placedSlots];
    nextSlots[firstEmptyIndex] = item.text;
    setPlacedSlots(nextSlots);

    setAvailableBank(availableBank.filter(x => x.id !== item.id));
    setCheckStatus('idle');
  };

  // Click filled slot to return token back to word bank
  const handleSlotClick = (index: number) => {
    const tokenText = placedSlots[index];
    if (!tokenText) return;

    const originalItem = currentEx.wordBank.find(w => w.text === tokenText) || {
      id: tokenText,
      text: tokenText,
      tamilMeaning: ''
    };

    setAvailableBank([...availableBank, originalItem]);

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
    if (placedSlots.some(s => s === null)) {
      setFeedbackMessage('Please fill all slots before checking.');
      setCheckStatus('wrong');
      return;
    }

    const isCorrect = placedSlots.every((val, idx) => val === currentEx.targetSlots[idx]);

    if (isCorrect) {
      setCheckStatus('correct');
      setFeedbackMessage('Hervorragend! Correct German syntax & verb position.');
      const newCompleted = stats.sentenceDrillsCompleted + 1;
      onUpdateStats({ 
        xp: Math.min(stats.maxXp, stats.xp + 20),
        sentenceDrillsCompleted: newCompleted,
        sentenceAccuracy: Math.min(100, Math.round((newCompleted / (newCompleted + 0.1)) * 100)),
        streakDays: Math.max(1, stats.streakDays),
        lives: Math.min(5, stats.lives + 1)
      });
      const fullGerman = `${currentEx.prefixTokens.join(' ')} ${placedSlots.join(' ')}`;
      speakGerman(fullGerman, 1.0);
    } else {
      setCheckStatus('wrong');
      setFeedbackMessage('Incorrect word order. In German "weil" clauses, the conjugated verb locks at the absolute end!');
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
      setExerciseIndex(0);
    }
  };

  // Listen to full sentence
  const playCurrentGermanSentence = () => {
    const fullGerman = `${currentEx.prefixTokens.join(' ')} ${currentEx.targetSlots.join(' ')}`;
    speakGerman(fullGerman, 1.0);
  };

  const progressPercent = Math.round(((exerciseIndex + 1) / SENTENCE_EXERCISES.length) * 100);

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 max-w-[1320px] mx-auto pb-16">
      {/* Breadcrumb & Telemetry Header Banner */}
      <section className="w-full p-4 sm:p-5 bg-white border border-border-subtle shadow-xs rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 mb-1 flex-wrap">
            <span>Incident Response Lab</span>
            <span className="text-slate-300">/</span>
            <span>{currentEx.scriptName || 'INC-8492 // Pod Disruption & Node Eviction'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
            Duolingo Tech Sentence Lab <span className="font-normal text-slate-500 text-base sm:text-lg">/ {currentEx.tag}</span>
          </h1>
        </div>

        {/* Lives Counter & Topic Pill */}
        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-border-subtle shadow-2xs self-start md:self-auto">
          <div className="flex items-center gap-1.5 text-rose-600 font-bold font-mono text-sm">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>{stats.lives || 5} Lives</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase font-mono">
            {currentEx.runbookType || 'SEV-2 RUNBOOK'}
          </span>
        </div>
      </section>

      {/* Progress & Quick Telemetry Ribbon */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-border-subtle p-3.5 sm:p-4 rounded-xl shadow-xs">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <span className="text-xs font-bold text-slate-700 font-sans">
            Exercise {exerciseIndex + 1} of {SENTENCE_EXERCISES.length}
          </span>
          <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {progressPercent}% COMPLETE
          </span>
        </div>

        {/* Progress Bar Strip */}
        <div className="flex-1 max-w-xl sm:mx-4">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-border-subtle">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={playCurrentGermanSentence}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition-colors text-xs font-semibold shadow-2xs cursor-pointer"
            title="Hear Target German Audio"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Listen Target</span>
          </button>

          <button
            onClick={handleResetSlots}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-border-subtle text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-xs shadow-2xs cursor-pointer"
            title="Reset Tokens"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Lab Studio */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* LEFT COLUMN: The Interactive Sentence Builder (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col gap-5 min-w-0">
          {/* Exercise Prompt Card */}
          <div className="bg-white rounded-2xl border border-border-subtle shadow-xs p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
              <span className="text-xs font-bold text-slate-900 font-sans">
                {currentEx.title}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold font-mono">
                {currentEx.patternType}
              </span>
            </div>

            {/* English Prompt & Tamil Gloss */}
            <div className="flex flex-col gap-2 bg-slate-50 border border-border-subtle rounded-xl p-3.5 sm:p-4">
              <div className="flex items-start gap-2">
                <span className="text-[10px] text-sky-700 font-bold uppercase font-mono shrink-0 mt-0.5">EN:</span>
                <p className="text-sm sm:text-base font-semibold text-slate-900 font-sans leading-relaxed">
                  "{currentEx.englishPrompt}"
                </p>
              </div>

              {isTamilActive && currentEx.tamilPrompt && (
                <div className="flex items-start gap-2 pt-1 border-t border-border-subtle">
                  <span className="text-[10px] text-amber-700 font-bold uppercase font-mono shrink-0 mt-0.5">தமிழ்:</span>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans">
                    {currentEx.tamilPrompt}
                  </p>
                </div>
              )}
            </div>

            {/* The Target Sentence Assembly Line */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider font-mono">
                Construct the German Clause (Auf Deutsch):
              </span>

              {/* Slot Row */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-border-subtle min-h-[90px] flex flex-wrap items-center gap-2">
                {/* Prefix tokens (Immutable) */}
                {currentEx.prefixTokens.map((token, idx) => (
                  <span
                    key={`prefix-${idx}`}
                    className="px-3 py-2 rounded-xl bg-slate-200/80 text-slate-800 font-mono text-xs sm:text-sm font-semibold select-none border border-slate-300"
                  >
                    {token}
                  </span>
                ))}

                {/* Target Editable Slots */}
                {placedSlots.map((slotWord, slotIdx) => (
                  <button
                    key={`slot-${slotIdx}`}
                    onClick={() => handleSlotClick(slotIdx)}
                    className={`min-w-[80px] sm:min-w-[100px] h-10 px-3 rounded-xl border text-xs sm:text-sm font-mono font-bold transition-all flex items-center justify-center cursor-pointer ${
                      slotWord
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-500 shadow-2xs hover:bg-emerald-100'
                        : 'bg-white border-dashed border-slate-300 text-slate-400 hover:border-slate-400'
                    }`}
                    title={slotWord ? 'Click to remove token' : currentEx.slotHints[slotIdx] || 'Empty Slot'}
                  >
                    {slotWord ? (
                      <span>{slotWord}</span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">
                        {currentEx.slotHints[slotIdx] || `[Slot ${slotIdx + 1}]`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Word Bank Available Tokens */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider font-mono">
                  Word Bank (வார்த்தை வங்கி) - Click to place:
                </span>
                <span className="text-[11px] text-slate-400">
                  {availableBank.length} remaining
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 p-3 rounded-xl bg-slate-50 border border-border-subtle min-h-[64px]">
                {availableBank.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    All words placed in sentence slots above. Click "Check Sentence" below!
                  </span>
                ) : (
                  availableBank.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleBankTokenClick(item)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-900 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 font-mono text-xs sm:text-sm font-bold shadow-2xs transition-all flex flex-col items-center cursor-pointer group"
                    >
                      <span>{item.text}</span>
                      {isTamilActive && item.tamilMeaning && (
                        <span className="text-[9px] font-sans text-slate-500 group-hover:text-emerald-700 font-normal">
                          {item.tamilMeaning}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Feedback & Submission Bar */}
            <div className="flex flex-col gap-3 pt-3 border-t border-border-subtle">
              {checkStatus !== 'idle' && (
                <div
                  className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs sm:text-sm animate-in fade-in ${
                    checkStatus === 'correct'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-rose-50 text-rose-900 border-rose-300'
                  }`}
                >
                  {checkStatus === 'correct' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <span className="font-medium font-sans">{feedbackMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={playCurrentGermanSentence}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-border-subtle transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Audio Hint</span>
                </button>

                {checkStatus !== 'correct' ? (
                  <button
                    onClick={handleCheckSentence}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex-1 sm:flex-initial text-center"
                  >
                    Check Sentence (தீர்வை சரிபார்)
                  </button>
                ) : (
                  <button
                    onClick={handleNextExercise}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-initial text-center animate-bounce"
                  >
                    <span>Next Drill</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Grammar Deep-Dive & Incident Context (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col gap-4 sm:gap-5 min-w-0">
          {/* Explanation Card */}
          <div className="bg-white rounded-2xl border border-border-subtle shadow-xs p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 font-sans">
                {currentEx.explanationTitle}
              </h2>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-border-subtle flex flex-col gap-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">
                GERMAN SYNTAX RULE:
              </span>
              <p className="text-xs sm:text-sm text-slate-900 font-medium font-sans leading-relaxed">
                {currentEx.explanationGerman}
              </p>

              {isTamilActive && currentEx.explanationTamil && (
                <div className="pt-2 border-t border-border-subtle">
                  <span className="text-[10px] text-amber-700 uppercase font-mono font-bold">
                    தமிழ் விளக்கம்:
                  </span>
                  <p className="text-xs text-slate-600 font-sans mt-0.5">
                    {currentEx.explanationTamil}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Incident Runbook Terminal */}
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300 font-semibold ml-1">K8s Live Telemetry</span>
              </div>
              <span className="text-emerald-400 font-mono text-[10px]">PASSIVE // SRE-A1</span>
            </div>

            <div className="font-mono text-xs text-slate-300 space-y-1 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto">
              <p className="text-emerald-400">$ kubectl get pods -n production</p>
              <p className="text-rose-400">auth-service-78f8   0/1   CrashLoopBackOff</p>
              <p className="text-slate-500"># Action Plan: Pod neustarten weil Datenbank überlastet ist</p>
              <p className="text-sky-300">$ echo "Syntax Check: SUCCESS"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
