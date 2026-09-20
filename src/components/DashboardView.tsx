import React, { useState } from 'react';
import { 
  Anchor, 
  RefreshCw, 
  AlertTriangle, 
  MessageSquare, 
  Handshake, 
  Volume2, 
  Play, 
  GraduationCap, 
  Bug, 
  Lightbulb, 
  CheckCircle2, 
  Lock,
  ArrowRight,
  ShieldCheck,
  FileText,
  MapPin,
  Mic,
  Terminal,
  Database,
  Flame,
  Activity,
  CheckSquare,
  RotateCcw
} from 'lucide-react';
import { TabType, UserStats } from '../types';
import { SKILL_TREE_MODULES } from '../data/quizData';
import { speakGerman } from '../utils/speech';

interface DashboardViewProps {
  stats: UserStats;
  onNavigate: (tab: TabType) => void;
  onOpenQuiz: () => void;
  onUpdateStats?: (newStats: Partial<UserStats>) => void;
  onResetProgress?: () => void;
  isTamilActive?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  onNavigate,
  onOpenQuiz,
  onUpdateStats,
  onResetProgress,
  isTamilActive = true
}) => {
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordFeedback, setRecordFeedback] = useState<string | null>(null);
  const [standupHintShown, setStandupHintShown] = useState(false);

  // Play Daily Word Audio & Award first drill activity
  const handlePlayDailyWord = (speed: number) => {
    setTtsPlaying(true);
    speakGerman('Die Bereitstellung', speed, () => {
      setTtsPlaying(false);
      if (onUpdateStats && stats.streakDays === 0) {
        onUpdateStats({ 
          streakDays: 1, 
          xp: Math.min(stats.maxXp, stats.xp + 10) 
        });
      }
    }, () => {
      setTtsPlaying(false);
    });
  };

  // Toggle Standup voice drill
  const toggleRecordDrill = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordFeedback(null);
      setTimeout(() => {
        setIsRecording(false);
        setRecordFeedback('Aussprache: 94% • "Die Helm-Charts sind fertig bereitgestellt!"');
        if (onUpdateStats) {
          const newPronScore = stats.pronunciationScore === 0 ? 94 : Math.round((stats.pronunciationScore + 94) / 2);
          onUpdateStats({
            pronunciationScore: newPronScore,
            phoneticsHours: parseFloat((stats.phoneticsHours + 0.1).toFixed(1)),
            streakDays: Math.max(1, stats.streakDays),
            xp: Math.min(stats.maxXp, stats.xp + 25)
          });
        }
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  // Play prompt from Lukas
  const playLukasPrompt = () => {
    speakGerman('Sriram, wie sieht der Status der neuen Helm-Charts aus?', 1.0);
  };

  const readinessPercent = stats.interviewReadiness;
  const vocabCount = stats.techVocabLearned;
  const streakDays = stats.streakDays;
  const pronunciationAcc = stats.pronunciationScore;

  // Calculate actual finished daily goals based on user activity
  const goalsFinished = [
    stats.techVocabLearned > 0,
    stats.sentenceDrillsCompleted > 0,
    stats.pronunciationScore > 0 || stats.phoneticsHours > 0,
    stats.xp >= 30,
    stats.xp >= 75
  ].filter(Boolean).length;

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 max-w-[1320px] mx-auto">
      {/* Top Telemetry & Context Banner */}
      <section className="w-full p-4 sm:p-6 bg-white border border-border-subtle shadow-xs rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 flex-wrap font-sans">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                SYS_PIPELINE: {streakDays > 0 ? 'ACTIVE' : 'READY TO START'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-700 font-semibold font-mono">
                Day {streakDays} • CEFR Track: {stats.readinessLevel}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight font-sans">
              Guten Tag, Sriram! <span className="font-normal text-slate-500 text-base sm:text-lg lg:text-xl">/ Cloud Architecture & SRE Track</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5 flex-wrap">
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Target Role: <strong className="text-slate-900 font-semibold">Senior DevOps Architect</strong> • München (Bavaria) & Berlin Tech Prep</span>
            </p>
          </div>

          {/* Readiness Score Hero Gauge & Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-border-subtle shadow-2xs">
              <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                  <circle className="text-slate-200" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4" />
                  <circle 
                    className="text-emerald-600 transition-all duration-1000" 
                    cx="24" 
                    cy="24" 
                    fill="transparent" 
                    r="20" 
                    stroke="currentColor" 
                    strokeDasharray="125.6" 
                    strokeDashoffset={125.6 * (1 - readinessPercent / 100)} 
                    strokeLinecap="round" 
                    strokeWidth="4.5" 
                  />
                </svg>
                <span className="absolute font-mono text-xs text-emerald-700 font-bold">
                  {readinessPercent}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">Readiness Score</span>
                <span className="text-xs sm:text-sm text-slate-900 font-bold">
                  {readinessPercent}% DevOps Ready
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">
                  {readinessPercent === 0 ? 'Start your first drill to unlock' : `${stats.readinessLevel} CEFR standard`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => onNavigate('learning-tips')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Tips & YouTube Guides</span>
              </button>

              <button 
                onClick={() => onNavigate('interview-and-daily')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-border-subtle hover:bg-slate-50 text-sky-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>3m Standup Drill</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold font-mono">
                  +50 XP
                </span>
              </button>

              <button 
                onClick={onOpenQuiz}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 shrink-0" />
                <span>Run Daily Review</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TODAY'S CLASS / TAGESLEKTION (ZERO-TO-B1 TRACK) */}
      <section className="w-full p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-amber-500/30 shadow-xl rounded-2xl text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>TODAY'S CLASS // TAGESLEKTION (ZERO TO B1)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Lektion 01: Greetings, Numbers & Your First Incident Command
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Know zero German words? Start here. Listen at <span className="text-amber-400 font-bold">0.5x slow speed</span>, click individual words to hear them isolated, and practice out loud.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigate('vocabulary')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg transition-all"
            >
              <span>Open Vocab Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('learning-tips')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              90-Day B1 Roadmap
            </button>
          </div>
        </div>

        {/* 3 Interactive Daily Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Block 1: Greetings */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-amber-400 font-mono">STEP 1: GREETINGS</span>
                <span className="text-[10px] text-slate-400">Office / Standup</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Guten Morgen zusammen!</h3>
              <p className="text-xs text-slate-400 mb-3">Good morning everyone! / காலை வணக்கம்!</p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => speakGerman('Guten Morgen zusammen', 0.5)}
                className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center justify-center gap-1 transition-all"
                title="Hear at 0.5x Slow Rate"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>0.5x Slow</span>
              </button>
              <button
                onClick={() => speakGerman('Guten Morgen zusammen', 1.0)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                1.0x
              </button>
            </div>
          </div>

          {/* Block 2: Numbers */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-indigo-400 font-mono">STEP 2: NUMBERS</span>
                <span className="text-[10px] text-slate-400">Port & Metrics</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Port achttausendachtzig (8080)</h3>
              <p className="text-xs text-slate-400 mb-3">Port 8080 / போர்ட் 8080</p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => speakGerman('Port achttausendachtzig', 0.5)}
                className="flex-1 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center justify-center gap-1 transition-all"
                title="Hear at 0.5x Slow Rate"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>0.5x Slow</span>
              </button>
              <button
                onClick={() => speakGerman('Port achttausendachtzig', 1.0)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                1.0x
              </button>
            </div>
          </div>

          {/* Block 3: Incident Sentence */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-emerald-400 font-mono">STEP 3: LIVE COMMAND</span>
                <span className="text-[10px] text-slate-400">P1 Outage</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1 leading-snug">
                Wir müssen sofort ein Failover einleiten.
              </h3>
              <p className="text-xs text-slate-400 mb-3">We must initiate a failover immediately.</p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => speakGerman('Wir müssen sofort ein Failover einleiten', 0.5)}
                className="flex-1 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center justify-center gap-1 transition-all"
                title="Hear at 0.5x Slow Rate"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>0.5x Slow</span>
              </button>
              <button
                onClick={() => speakGerman('Wir müssen sofort ein Failover einleiten', 1.0)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                1.0x
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Cards Strip (4-Pack) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Technical Vocabulary */}
        <div 
          onClick={() => onNavigate('vocabulary')}
          className="p-4 rounded-xl bg-white border border-border-subtle shadow-xs flex flex-col justify-between hover:border-sky-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Technical Vocabulary</span>
            <Database className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl lg:text-3xl font-bold text-slate-900 font-mono">{vocabCount}</span>
              <span className="text-xs text-slate-500">/ {stats.totalVocab} Mastered</span>
            </div>
            <p className="text-[11px] text-sky-700 font-semibold mt-0.5">
              {vocabCount > 0 ? `${vocabCount} Terms Practiced` : '0 Terms Mastered — Click to Start'}
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-sky-600 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (vocabCount / 20) * 100)}%` }} />
          </div>
        </div>

        {/* Card 2: Active Streak */}
        <div className="p-4 rounded-xl bg-white border border-border-subtle shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Active Streak</span>
            <Flame className={`w-4 h-4 ${streakDays > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-bold text-slate-900 font-mono">{streakDays} Days</span>
              <span className="text-xs text-emerald-700 font-bold font-mono">
                {streakDays > 0 ? 'Active' : 'Day 0'}
              </span>
            </div>
            <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
              {streakDays > 0 ? 'Consistent Daily Practice' : 'Complete 1 drill today to start streak'}
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (streakDays / 7) * 100)}%` }} />
          </div>
        </div>

        {/* Card 3: Pronunciation Accuracy */}
        <div 
          onClick={() => onNavigate('interview-and-daily')}
          className="p-4 rounded-xl bg-white border border-border-subtle shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Pronunciation Accuracy</span>
            <Activity className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-bold text-slate-900 font-mono">{pronunciationAcc}%</span>
              <span className="text-xs text-emerald-700 font-bold font-mono">
                {pronunciationAcc > 0 ? 'Evaluated' : 'Unrated'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {pronunciationAcc > 0 ? `${stats.phoneticsHours}h oral speech logged` : 'Record voice to score accent'}
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${pronunciationAcc}%` }} />
          </div>
        </div>

        {/* Card 4: Daily Goal Status */}
        <div className="p-4 rounded-xl bg-white border border-border-subtle shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Daily Goal Status</span>
            <CheckSquare className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-bold text-slate-900 font-mono">{goalsFinished} / 5</span>
              <span className="text-xs text-slate-500">Drills Finished</span>
            </div>
            <p className="text-[11px] text-sky-700 font-semibold mt-0.5">
              {5 - goalsFinished === 0 ? 'All daily targets met! 🎉' : `${5 - goalsFinished} pending daily activities`}
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-sky-600 h-full rounded-full transition-all duration-500" style={{ width: `${(goalsFinished / 5) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* LEFT COLUMN: Technical Skill Trees (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Domain Skill Trees</span>
                <span className="text-xs sm:text-sm text-slate-500 font-normal">/ Core Engineering Paths</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target architecture vocabulary and syntax structures mapped directly to DevOps workflows
              </p>
            </div>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase font-mono border border-slate-200">
              5 MODULES
            </span>
          </div>

          {/* Modules List */}
          {SKILL_TREE_MODULES.map((mod, idx) => {
            // Compute real dynamic module progress based on user stats
            let modulePercent = 0;
            let solvedCount = 0;
            if (idx === 0) {
              solvedCount = Math.min(mod.totalCount, stats.sentenceDrillsCompleted * 5 + stats.techVocabLearned * 2);
              modulePercent = Math.min(100, Math.round((solvedCount / mod.totalCount) * 100));
            } else if (idx === 1) {
              solvedCount = Math.min(mod.totalCount, Math.floor(stats.techVocabLearned * 1.5));
              modulePercent = Math.min(100, Math.round((solvedCount / mod.totalCount) * 100));
            }

            return (
              <div
                key={mod.id}
                className="p-4 sm:p-5 rounded-xl bg-white border border-border-subtle hover:border-slate-300 transition-all shadow-xs flex flex-col gap-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-border-subtle flex items-center justify-center shrink-0">
                      {mod.icon === 'anchor' && <Anchor className="w-5 h-5 text-emerald-600" />}
                      {mod.icon === 'sync_alt' && <RefreshCw className="w-5 h-5 text-sky-600" />}
                      {mod.icon === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                      {mod.icon === 'forum' && <MessageSquare className="w-5 h-5 text-indigo-600" />}
                      {mod.icon === 'handshake' && <Handshake className="w-5 h-5 text-slate-600" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                          {mod.title}
                        </h3>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold border font-mono"
                          style={{
                            backgroundColor: `${mod.color}15`,
                            color: mod.color,
                            borderColor: `${mod.color}30`
                          }}
                        >
                          {modulePercent}% {modulePercent > 0 ? 'IN PROGRESS' : 'START'}
                        </span>
                      </div>
                      {isTamilActive && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {mod.tamilTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Module Action Button */}
                  <button
                    onClick={() => {
                      if (mod.id === 'mod-1' || mod.id === 'mod-3') {
                        onNavigate('sentence-lab');
                      } else if (mod.id === 'mod-4' || mod.id === 'mod-5') {
                        onNavigate('interview-and-daily');
                      } else {
                        onNavigate('vocabulary');
                      }
                    }}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-border-subtle transition-colors shadow-2xs cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span className="text-amber-800 font-bold">
                      {modulePercent > 0 ? 'Fortsetzen' : 'Starten'}
                    </span>
                  </button>
                </div>

                {/* Wortschatz Tags */}
                <div className="bg-slate-50 p-2.5 rounded-lg text-xs text-slate-700 flex flex-wrap items-center gap-1.5 border border-border-subtle">
                  <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider">Wortschatz:</span>
                  {mod.words.map((w, idx2) => (
                    <span
                      key={idx2}
                      className="px-2 py-0.5 rounded bg-white text-slate-800 border border-border-subtle font-mono text-[11px]"
                    >
                      {w}
                    </span>
                  ))}
                </div>

                {/* Progress metric bar */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-mono flex-wrap gap-1">
                  <span>Progress: {solvedCount} / {mod.totalCount} Sätze gemeistert</span>
                  <div className="w-28 sm:w-36 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-border-subtle">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${modulePercent}%`,
                        backgroundColor: mod.color
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Tageswort & Standup Drill (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 min-w-0">
          {/* CARD 1: DAILY GERMAN AUDIO FLASHCARD */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-border-subtle shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
                  Tageswort // Daily Term
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase border border-border-subtle font-mono">
                SRE Lemma
              </span>
            </div>

            {/* Target Word & Gender Highlight */}
            <div className="bg-slate-50 p-4 rounded-xl mb-3 border border-border-subtle">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 text-[10px] font-bold uppercase border border-rose-200">
                  DIE · FEMININ
                </span>
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                  Bereitstellung
                </span>
                <span className="text-xs text-sky-700 font-mono">[-en]</span>
              </div>

              {/* Phonetics & Audio Triggers */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-border-subtle flex-wrap">
                <span className="text-xs text-sky-800 bg-white px-2 py-0.5 rounded border border-border-subtle font-mono">
                  [diː bəˈʁaɪ̯tˌʃtɛlʊŋ]
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePlayDailyWord(1.0)}
                    disabled={ttsPlaying}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{ttsPlaying ? 'Playing...' : '1.0x'}</span>
                  </button>

                  <button
                    onClick={() => handlePlayDailyWord(0.8)}
                    disabled={ttsPlaying}
                    className="px-2.5 py-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-100 text-xs font-medium border border-border-subtle transition-colors cursor-pointer"
                  >
                    0.8x
                  </button>
                </div>
              </div>

              {/* Multilingual Definitions */}
              <div className="mt-3 pt-2.5 border-t border-border-subtle grid grid-cols-1 gap-1.5 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-[10px] text-sky-700 font-bold uppercase shrink-0 mt-0.5 font-mono">EN:</span>
                  <span className="text-slate-800 font-medium font-sans">
                    Deployment / Provisioning of application artifacts
                  </span>
                </div>
                {isTamilActive && (
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] text-amber-700 font-bold uppercase shrink-0 mt-0.5 font-mono">தமிழ்:</span>
                    <span className="text-slate-600 font-sans">
                      பயன்பாட்டு வெளியீடு / சேவையகத்தில் தொகுப்பு நிறுவல்
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Real Jira Incident Sentence Context */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-border-subtle flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold">
                <span className="flex items-center gap-1 text-amber-800">
                  <Bug className="w-3 h-3 text-amber-600" /> JIRA TICKET: OPS-4109
                </span>
                <span>Context: Production Staging</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-sans font-medium">
                "Die automatische <mark className="bg-rose-100 text-rose-900 px-1 rounded font-bold">Bereitstellung</mark> in der Staging-Umgebung ist fehlgeschlagen."
              </p>

              <p className="text-xs text-slate-600 font-sans">
                The automated deployment in the staging environment has failed.
              </p>
            </div>
          </div>

          {/* CARD 2: STANDUP VOICE DRILL */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-border-subtle shadow-xs flex flex-col gap-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900 font-sans">
                  Daily Standup Voice Drill
                </h3>
              </div>
              <span className="text-[10px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold uppercase font-mono">
                3 MIN DURATION
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Respond to the Scrum Master's prompt in German. You will be evaluated on case accuracy and separable verb positioning.
            </p>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-border-subtle text-xs flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px] uppercase font-bold font-mono">
                  PROMPT VON LUKAS (MÜNCHEN CLOUD LEAD):
                </span>
                <button
                  onClick={playLukasPrompt}
                  className="p-1 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                  title="Hear prompt audio"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-slate-900 font-semibold font-sans">
                "Sriram, wie sieht der Status der neuen Helm-Charts aus?"
              </span>
            </div>

            {/* Mic Record Interactive Row */}
            <div className="p-3 sm:p-3.5 rounded-lg bg-slate-50 border border-border-subtle flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={toggleRecordDrill}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    isRecording
                      ? 'bg-emerald-600 text-white animate-pulse ring-4 ring-emerald-500/30'
                      : 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
                  }`}
                  title={isRecording ? 'Stop Recording' : 'Start Recording'}
                  aria-label="Record standup response"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <div className="flex flex-col min-w-0">
                  <span className={`text-xs font-semibold truncate ${isRecording ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {isRecording ? 'Recording in progress... (DE)' : 'Ready to record'}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
                    {isTamilActive ? 'பதிலை பதிவு செய்க (0 / 30s)' : 'Speak in German (0 / 30s)'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStandupHintShown(!standupHintShown)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-border-subtle transition-colors shadow-2xs cursor-pointer shrink-0"
              >
                Hint
              </button>
            </div>

            {/* Standup Hint Drawer */}
            {standupHintShown && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 animate-in fade-in">
                💡 Tip: Say "Die Helm-Charts sind fertig bereitgestellt" or "Ich migriere die Charts heute."
              </div>
            )}

            {/* Recorded evaluation feedback */}
            {recordFeedback && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{recordFeedback}</span>
              </div>
            )}
          </div>

          {/* CARD 3: GRAMMAR FOCUS */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-border-subtle shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 font-sans">
                  Grammar: Trennbare Verben
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase font-mono">
                INCIDENT COMMANDS
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              In German, prefixes split to the end of main clauses during direct commands and present tense actions.
            </p>

            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-slate-50 border border-border-subtle flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-mono font-bold">
                  <span>VERB: NEUSTARTEN (RESTART)</span>
                  <span className="text-emerald-700">KORREKTE FORM</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-900 font-medium font-sans">
                  "Wir <strong className="text-emerald-700 underline">starten</strong> den defekten Datenbank-Pod sofort <strong className="text-emerald-700 underline">neu</strong>."
                </p>
                {isTamilActive && (
                  <p className="text-xs text-slate-500 font-sans">
                    நாங்கள் செயலிழந்த தரவுத்தள போடை உடனே மீண்டும் துவக்குகிறோம்.
                  </p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-border-subtle flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-mono font-bold">
                  <span>VERB: AUSFALLEN (TO FAIL / GO DOWN)</span>
                  <span className="text-emerald-700">PERFEKT-FORM</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-900 font-medium font-sans">
                  "Der Ingress-Controller ist vor 10 Minuten <strong className="text-amber-700 underline">ausgefallen</strong>."
                </p>
                {isTamilActive && (
                  <p className="text-xs text-slate-500 font-sans">
                    10 நிமிடங்களுக்கு முன்பு நுழைவுக் கட்டுப்படுத்தி செயலிழந்தது.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => onNavigate('sentence-lab')}
              className="w-full mt-1 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-sky-700 text-xs font-semibold border border-border-subtle transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
            >
              <span>Drill 5 Separable Verb Scenarios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Footer Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight font-sans">
              DevOps Deutsch Readiness Milestone
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-sans">
              {streakDays > 0 
                ? `You have logged ${streakDays} practice days on track for German tech recruitment rounds in Munich and Berlin.`
                : 'Start your study streak by running daily vocabulary, sentence drills, or standup rehearsals.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end flex-wrap">
          {onResetProgress && (
            <button
              onClick={onResetProgress}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Reset progress to 0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to 0</span>
            </button>
          )}

          <button 
            onClick={() => onNavigate('phrase-dump')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>DevOps Cheatsheet</span>
          </button>

          <button 
            onClick={() => onNavigate('interview-and-daily')}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
          >
            Simulate Mock Interview
          </button>
        </div>
      </div>
    </div>
  );
};
