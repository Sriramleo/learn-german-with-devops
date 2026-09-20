import React, { useState } from 'react';
import { 
  Volume2, 
  Mic, 
  CheckCircle2, 
  Users,
  AlertTriangle,
  Layers,
  CircleDollarSign,
  Play,
  PlayCircle
} from 'lucide-react';
import { UserStats } from '../types';
import { INTERVIEW_SCENARIOS, STANDUP_QUICK_ANCHORS } from '../data/interviewData';
import { speakGerman } from '../utils/speech';

interface InterviewViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  isTamilActive?: boolean;
}

export const InterviewView: React.FC<InterviewViewProps> = ({
  stats,
  onUpdateStats,
  isTamilActive = true
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(INTERVIEW_SCENARIOS[0].id);
  const currentScenario = INTERVIEW_SCENARIOS.find(s => s.id === selectedScenarioId) || INTERVIEW_SCENARIOS[0];

  const [selectedOptionId, setSelectedOptionId] = useState<string>(currentScenario.options[0].id);
  const [isPromptPlaying, setIsPromptPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechEvaluation, setSpeechEvaluation] = useState<{
    clarity: number;
    wordOrder: number;
    feedback: string;
  } | null>(null);

  // Active anchor audio playing
  const [playingAnchor, setPlayingAnchor] = useState<string | null>(null);

  // Play scenario prompt
  const handlePlayPrompt = (speed: number = 1.0) => {
    setIsPromptPlaying(true);
    speakGerman(currentScenario.germanAudioPrompt, speed, () => {
      setIsPromptPlaying(false);
    }, () => {
      setIsPromptPlaying(false);
    });
  };

  // Play option German text
  const handlePlayOption = (text: string) => {
    speakGerman(text, 1.0);
  };

  // Play Standup Anchor
  const handlePlayAnchor = (german: string) => {
    setPlayingAnchor(german);
    speakGerman(german, 1.0, () => {
      setPlayingAnchor(null);
    }, () => {
      setPlayingAnchor(null);
    });
  };

  // Record speech simulation
  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setSpeechEvaluation(null);

      setTimeout(() => {
        setIsRecording(false);
        setSpeechEvaluation({
          clarity: 96,
          wordOrder: 100,
          feedback: 'Perfekte Aussprache! Satzklammer (habe ... fertiggestellt) und keine Blocker einwandfrei artikuliert.'
        });
        onUpdateStats({ 
          xp: Math.min(stats.maxXp, stats.xp + 35),
          streakDays: Math.max(1, stats.streakDays),
          pronunciationScore: stats.pronunciationScore === 0 ? 96 : Math.round((stats.pronunciationScore + 96) / 2),
          phoneticsHours: parseFloat((stats.phoneticsHours + 0.1).toFixed(1))
        });
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 max-w-[1320px] mx-auto pb-24">
      {/* Simulation Terminal Header Banner */}
      <section className="w-full p-4 sm:p-6 bg-white border border-border-subtle shadow-xs rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 flex-wrap">
            <span className="text-sky-700">Simulation Terminal</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700">Ritual: {currentScenario.title}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
            DevOps Arbeitsplatz-Simulator <span className="font-normal text-slate-500 text-base sm:text-lg">/ Workplace Simulation Terminal</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-border-subtle shadow-2xs self-start md:self-auto">
          <div className="flex flex-col text-left md:text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">Company Context</span>
            <span className="text-xs sm:text-sm text-emerald-800 font-bold font-sans">{currentScenario.companyContext}</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5 text-amber-700">
            <Mic className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px] font-bold uppercase font-mono">B2/C1 Speech</span>
          </div>
        </div>
      </section>

      {/* Scenario Selector Navigation Tabs */}
      <div className="w-full overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-2 min-w-max p-1 bg-slate-50 border border-border-subtle rounded-xl">
          {INTERVIEW_SCENARIOS.map((sc, idx) => {
            const isSelected = selectedScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  setSelectedOptionId(sc.options[0].id);
                  setSpeechEvaluation(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white border border-transparent hover:border-border-subtle'
                }`}
              >
                {idx === 0 && <Users className="w-3.5 h-3.5" />}
                {idx === 1 && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                {idx === 2 && <Layers className="w-3.5 h-3.5 text-sky-500" />}
                {idx === 3 && <CircleDollarSign className="w-3.5 h-3.5 text-amber-500" />}
                <span className="font-sans font-medium">{sc.number}. {sc.title}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                  isSelected 
                    ? 'bg-emerald-700 text-white' 
                    : sc.badgeColor || 'bg-slate-100 text-slate-700'
                }`}>
                  {sc.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* LEFT COLUMN: Interactive Simulation Flow (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5 min-w-0">
          {/* Simulation Stage Indicator */}
          <div className="flex items-center justify-between bg-white border border-border-subtle px-4 py-2.5 rounded-xl shadow-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
              <span className="text-xs sm:text-sm font-bold text-slate-900 font-sans">
                {currentScenario.turnText}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Tone: {currentScenario.targetTone}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold font-mono">
                {currentScenario.squad}
              </span>
            </div>
          </div>

          {/* Scrum Master / Lead Dialogue Card */}
          <div className="bg-white rounded-2xl border border-border-subtle shadow-xs p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={currentScenario.speakerAvatar}
                    alt={currentScenario.speakerName}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover ring-2 ring-slate-200"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                    <Volume2 className="w-3 h-3" />
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm sm:text-base font-sans truncate">
                      {currentScenario.speakerName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono">
                      {currentScenario.speakerRole}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-sans">
                    Team: {currentScenario.speakerTeam}
                  </span>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-border-subtle p-1 rounded-xl shrink-0">
                <button
                  onClick={() => handlePlayPrompt(1.0)}
                  disabled={isPromptPlaying}
                  className="px-2.5 py-1 rounded bg-sky-100 text-sky-800 hover:bg-sky-200 transition-colors text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer font-sans"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>1.0x</span>
                </button>
                <button
                  onClick={() => handlePlayPrompt(0.8)}
                  disabled={isPromptPlaying}
                  className="px-2 py-1 rounded hover:bg-white text-slate-600 text-xs font-medium transition-colors cursor-pointer"
                >
                  0.8x
                </button>
              </div>
            </div>

            {/* Audio Waveform Visualization */}
            <div className="bg-slate-50 border border-border-subtle rounded-xl p-2.5 flex items-center gap-3">
              <button
                onClick={() => handlePlayPrompt(1.0)}
                className="w-8 h-8 shrink-0 rounded-lg bg-white border border-border-subtle hover:bg-emerald-600 hover:text-white text-emerald-700 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                aria-label="Play prompt waveform"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
              <div className="flex-1 flex items-center gap-1 h-6 px-1 overflow-hidden">
                <span className="w-1 h-2 bg-sky-300 rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-sky-400 rounded-full" />
                <span className="w-1 h-6 bg-emerald-500 rounded-full" />
                <span className="w-1 h-3 bg-emerald-400 rounded-full" />
                <span className="w-1 h-5 bg-sky-500 rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-sky-400 rounded-full" />
                <span className="w-1 h-2 bg-sky-300 rounded-full" />
                <span className="w-1 h-5 bg-emerald-500 rounded-full" />
                <span className="w-1 h-6 bg-emerald-600 rounded-full" />
                <span className="w-1 h-4 bg-sky-500 rounded-full" />
                <span className="w-1 h-3 bg-sky-400 rounded-full" />
                <span className="w-1 h-5 bg-sky-500 rounded-full" />
                <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                <span className="w-1 h-2 bg-emerald-400 rounded-full" />
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-semibold shrink-0">00:04</span>
            </div>

            {/* Prompt Speech Box */}
            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-border-subtle flex flex-col gap-2">
              <p className="text-sm sm:text-base text-slate-900 font-semibold leading-relaxed font-sans">
                "{currentScenario.germanAudioPrompt}"
              </p>
              <div className="flex items-start gap-2 pt-2 border-t border-border-subtle">
                <span className="text-[10px] text-sky-700 font-bold uppercase shrink-0 mt-0.5 font-mono">EN:</span>
                <p className="text-xs text-slate-600 font-sans">
                  {currentScenario.englishContext}
                </p>
              </div>
              {isTamilActive && currentScenario.tamilContext && (
                <div className="flex items-start gap-2">
                  <span className="text-[10px] text-amber-700 font-bold uppercase shrink-0 mt-0.5 font-mono">தமிழ்:</span>
                  <p className="text-xs text-slate-600 font-sans">
                    {currentScenario.tamilContext}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* User Response Studio */}
          <div className="bg-white rounded-2xl border border-border-subtle shadow-xs p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-sans">
                  Your Voice & Response Options
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold font-mono">
                SELECT OR SPEAK
              </span>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentScenario.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setSelectedOptionId(opt.id);
                      setSpeechEvaluation({
                        clarity: opt.clarityScore,
                        wordOrder: opt.wordOrderScore,
                        feedback: opt.feedbackMsg
                      });
                    }}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-2 ring-emerald-500/10'
                        : 'bg-white border-border-subtle hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="text-xs font-bold text-slate-900 font-sans">
                          {opt.label}
                        </span>
                        {opt.recommended && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold font-mono">
                            RECOMMENDED SENIOR
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayOption(opt.germanText);
                        }}
                        className="text-emerald-600 hover:text-emerald-700 p-1 cursor-pointer shrink-0"
                        title="Hear Option Audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed pl-5 sm:pl-6 font-sans">
                      "{opt.germanText}"
                    </p>

                    {isTamilActive && opt.tamilText && (
                      <p className="text-xs text-slate-600 pl-5 sm:pl-6 font-sans">
                        {opt.tamilText}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Voice Record Action Bar */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleToggleRecord}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer font-sans ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isRecording ? 'Listening to speech (Recording DE)...' : 'Practice Speaking This Response (Mic)'}</span>
              </button>
            </div>

            {/* Speech Evaluation Score Card */}
            {speechEvaluation && (
              <div className="p-4 rounded-xl bg-slate-50 border border-border-subtle flex flex-col gap-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-slate-900 font-sans">
                      AI Recruiter & Grammar Score
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    Score: {speechEvaluation.clarity}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white border border-border-subtle">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block font-mono">Grammar</span>
                    <span className="font-bold text-slate-900 font-mono">{speechEvaluation.clarity}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-border-subtle">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block font-mono">Tone Level</span>
                    <span className="font-bold text-sky-700 font-mono">B2+ Senior</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-border-subtle">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block font-mono">Word Order</span>
                    <span className="font-bold text-emerald-700 font-mono">{speechEvaluation.wordOrder}%</span>
                  </div>
                </div>
                <p className="text-xs text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 font-sans">
                  {speechEvaluation.feedback}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Standup Anchors (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
          <div className="bg-white rounded-2xl border border-border-subtle shadow-xs p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 font-mono">
                Senior DevOps Standup Anchors
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold font-mono">
                GERMAN RITUALS
              </span>
            </div>

            <div className="space-y-2.5">
              {STANDUP_QUICK_ANCHORS.map((anchor, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-border-subtle flex items-start justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">
                      {anchor.english}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-900 font-medium font-sans">
                      "{anchor.german}"
                    </p>
                    {isTamilActive && anchor.tamil && (
                      <p className="text-xs text-slate-500 font-sans">
                        {anchor.tamil}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handlePlayAnchor(anchor.german)}
                    className="p-1.5 text-emerald-700 hover:text-emerald-800 bg-white rounded-lg border border-border-subtle shadow-2xs cursor-pointer shrink-0"
                    title="Hear Audio"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
