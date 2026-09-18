import React, { useState } from 'react';
import { 
  Volume2, 
  Mic, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { UserStats } from '../types';
import { INTERVIEW_SCENARIOS, STANDUP_QUICK_ANCHORS } from '../data/interviewData';
import { speakGerman } from '../utils/speech';

interface InterviewViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

export const InterviewView: React.FC<InterviewViewProps> = ({
  stats,
  onUpdateStats
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(INTERVIEW_SCENARIOS[0].id);
  const currentScenario = INTERVIEW_SCENARIOS.find(s => s.id === selectedScenarioId) || INTERVIEW_SCENARIOS[0];

  const [selectedOptionId, setSelectedOptionId] = useState<string>(currentScenario.options[0].id);
  const [isPromptPlaying, setIsPromptPlaying] = useState(false);
  const [isOptionPlaying, setIsOptionPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechEvaluation, setSpeechEvaluation] = useState<{
    clarity: number;
    wordOrder: number;
    feedback: string;
  } | null>(null);

  // Active anchor audio playing
  const [playingAnchor, setPlayingAnchor] = useState<string | null>(null);

  // Quick Grammatik placement tester state
  const [testVerbPlaced, setTestVerbPlaced] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<'idle' | 'correct' | 'wrong'>('idle');

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
    setIsOptionPlaying(true);
    speakGerman(text, 1.0, () => {
      setIsOptionPlaying(false);
    }, () => {
      setIsOptionPlaying(false);
    });
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

      // Simulate real-time speech evaluation
      setTimeout(() => {
        setIsRecording(false);
        setSpeechEvaluation({
          clarity: 96,
          wordOrder: 100,
          feedback: 'Perfekte Aussprache! Satzklammer (habe ... fertiggestellt) und keine Blocker einwandfrei artikuliert.'
        });
        // Reward XP
        onUpdateStats({ xp: Math.min(stats.maxXp, stats.xp + 35) });
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1440px] mx-auto pb-20">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200">
              DEVOPS WORKPLACE SIMULATOR
            </span>
            <span className="text-slate-400 font-mono text-xs">•</span>
            <span className="text-slate-600 font-mono text-xs">
              INCIDENT CALLS & AGILE CEREMONIES IN TECHNICAL GERMAN
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            DevOps Arbeitsplatz-Simulator <span className="text-slate-500 font-normal text-lg">/ நேர்காணல் & தினசரி சூழல்</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 font-mono text-xs text-amber-700 font-bold shadow-xs">
            ⚡ Scenario XP Bounty: +35 XP
          </span>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {INTERVIEW_SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => {
              setSelectedScenarioId(sc.id);
              setSelectedOptionId(sc.options[0].id);
              setSpeechEvaluation(null);
            }}
            className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between gap-2 shadow-xs ${
              selectedScenarioId === sc.id
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                selectedScenarioId === sc.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                {sc.badge}
              </span>
              <span className={`text-[10px] font-mono ${selectedScenarioId === sc.id ? 'text-slate-400' : 'text-slate-500'}`}>
                {sc.companyContext.split('•')[0]}
              </span>
            </div>

            <div>
              <h3 className={`font-mono text-xs md:text-sm font-bold truncate ${selectedScenarioId === sc.id ? 'text-white' : 'text-slate-900'}`}>
                {sc.title}
              </h3>
              <p className={`text-[11px] font-sans truncate ${selectedScenarioId === sc.id ? 'text-slate-300' : 'text-slate-500'}`}>
                {sc.speakerName} ({sc.speakerRole.split('/')[0]})
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Main Simulation Workspace: 8 Cols Active Dialogue + 4 Cols Standup Anchors & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Dialogue, Spoken Audio Prompt & Interactive Responses */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Central Speaker Audio Prompt Card */}
          <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-6 relative">
            {/* Speaker Bio Row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={currentScenario.speakerAvatar}
                  alt={currentScenario.speakerName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-xs shrink-0"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                      {currentScenario.speakerName}
                    </h2>
                    <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-mono text-[10px] font-bold border border-sky-200">
                      {currentScenario.speakerRole}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-mono mt-0.5">
                    {currentScenario.speakerTeam} • <span className="text-slate-400">{currentScenario.companyContext}</span>
                  </p>
                </div>
              </div>

              {/* Turn Counter */}
              <span className="font-mono text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                {currentScenario.turnText}
              </span>
            </div>

            {/* German Audio Prompt Box */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-4">
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                <span className="text-sky-700 font-bold uppercase tracking-wider">
                  DEUTSCHE SPRACHAUSGABE (GERMAN AUDIO PROMPT):
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayPrompt(1.0)}
                    disabled={isPromptPlaying}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold hover:bg-emerald-700 transition-all shadow-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPromptPlaying ? 'Playing...' : 'Play (1.0x)'}</span>
                  </button>

                  <button
                    onClick={() => handlePlayPrompt(0.8)}
                    disabled={isPromptPlaying}
                    className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-mono text-xs border border-slate-200 transition-colors shadow-xs"
                  >
                    0.8x
                  </button>
                </div>
              </div>

              {/* Spoken Text */}
              <p className="text-base md:text-lg text-slate-900 font-medium leading-relaxed">
                "{currentScenario.germanAudioPrompt}"
              </p>

              {/* Multilingual Context Accordions (EN & Tamil) */}
              <div className="pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="font-mono text-[10px] text-sky-700 font-bold block uppercase mb-1">
                    ENGLISH CONTEXT
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {currentScenario.englishContext}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="font-mono text-[10px] text-amber-700 font-bold block uppercase mb-1">
                    TAMIL CONTEXT (தமிழாக்கம்)
                  </span>
                  <p className="text-slate-800 leading-relaxed font-sans">
                    {currentScenario.tamilContext}
                  </p>
                </div>
              </div>
            </div>

            {/* Candidate Response Options */}
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Select or Speak Your Technical Response (உங்கள் பதில்):
              </span>

              <div className="space-y-3">
                {currentScenario.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 shadow-xs ${
                        isSelected
                          ? 'bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs font-bold ${opt.recommended ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {opt.label}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200">
                            {opt.typeBadge}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayOption(opt.germanText);
                          }}
                          className="flex items-center gap-1 text-xs font-mono text-sky-700 hover:underline"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </button>
                      </div>

                      <p className="text-sm md:text-base font-mono text-slate-900 leading-relaxed">
                        "{opt.germanText}"
                      </p>

                      <p className="text-xs text-slate-600 font-sans">
                        🇮🇳 {opt.tamilText}
                      </p>

                      {isSelected && (
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-emerald-800">
                          <span>✓ {opt.feedbackMsg}</span>
                          <span className="text-slate-500">Clarity: {opt.clarityScore}%</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mic Practice & Pronunciation Benchmark */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleRecord}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-400/30'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                  }`}
                  title={isRecording ? 'Stop Recording' : 'Speak into Microphone'}
                >
                  <Mic className="w-6 h-6" />
                </button>

                <div>
                  <h4 className="font-mono text-sm font-bold text-slate-900">
                    {isRecording ? 'Recording Speech in German...' : 'Record Your Response / உங்கள் குரல்'}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Verbal Clarity, V2 Word Order & Tech Fluency analysis
                  </p>
                </div>
              </div>

              {speechEvaluation ? (
                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                    Clarity: {speechEvaluation.clarity}%
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 font-bold">
                    Word Order: {speechEvaluation.wordOrder}%
                  </div>
                </div>
              ) : (
                <span className="text-xs font-mono text-slate-400">
                  Ready to test
                </span>
              )}
            </div>

            {speechEvaluation && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 font-mono text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{speechEvaluation.feedback}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Standup Quick Anchors & German Grammar Rules */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Standup Quick Anchors (Common Workplace German Phrases) */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-emerald-700 font-bold uppercase tracking-wider">
                Standup Quick Anchors
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                CLICK TO LISTEN
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Commonly used phrases across German software and cloud engineering teams:
            </p>

            <div className="space-y-2.5 pt-1">
              {STANDUP_QUICK_ANCHORS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handlePlayAnchor(item.german)}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 cursor-pointer transition-all flex flex-col gap-1 group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-emerald-700 leading-snug">
                      "{item.german}"
                    </span>
                    <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                  </div>

                  <p className="text-xs text-amber-700 font-medium">
                    {item.tamil}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    {item.english}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* German DevOps Grammatik Rules Engine */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
            <span className="font-mono text-xs text-sky-700 font-bold uppercase tracking-wider">
              Workplace Grammar Rules
            </span>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-emerald-700 font-mono block mb-1">
                  1. Perfekt in Standups (haben/sein + Partizip II):
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Never use Präteritum in spoken standups. Say:
                  <br />
                  <span className="text-slate-900 font-mono">
                    "Ich <strong className="text-emerald-700">habe</strong> die Pipeline <strong className="text-emerald-700">optimiert</strong>"
                  </span>
                  <br />
                  (not "Ich optimierte die Pipeline").
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-sky-700 font-mono block mb-1">
                  2. Modalverben (sollten, müssen, können):
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Infinitiv locks at the end:
                  <br />
                  <span className="text-slate-900 font-mono">
                    "Wir <strong className="text-sky-700">müssen</strong> den Cluster <strong className="text-sky-700">neustarten</strong>."
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Verb Placement Mini-Interactive Test */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2 mt-1">
              <span className="font-mono text-[10px] text-amber-700 font-bold uppercase">
                QUICK VERB PLACEMENT CHECK:
              </span>
              <p className="font-mono text-xs text-slate-900">
                "Heute werde ich das Deployment..."
              </p>

              <div className="flex gap-2 pt-1">
                {['fertigstellen', 'fertiggestellt'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setTestVerbPlaced(opt);
                      if (opt === 'fertigstellen') {
                        setTestResult('correct');
                      } else {
                        setTestResult('wrong');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition-colors shadow-xs ${
                      testVerbPlaced === opt
                        ? testResult === 'correct'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold'
                          : 'bg-rose-50 text-rose-800 border-rose-400 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {testResult === 'correct' && (
                <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                  ✓ Correct! "werden + Infinitiv" requires "fertigstellen".
                </span>
              )}
              {testResult === 'wrong' && (
                <span className="text-[11px] font-mono text-rose-700 font-semibold">
                  ✗ Futur I requires the infinitive form!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
