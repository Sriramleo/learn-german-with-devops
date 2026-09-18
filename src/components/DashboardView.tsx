import React, { useState } from 'react';
import { 
  MapPin, 
  Mic, 
  Terminal, 
  Database, 
  Code2, 
  Activity, 
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
  FileText
} from 'lucide-react';
import { TabType, UserStats } from '../types';
import { SKILL_TREE_MODULES } from '../data/quizData';
import { speakGerman } from '../utils/speech';

interface DashboardViewProps {
  stats: UserStats;
  onNavigate: (tab: TabType) => void;
  onOpenQuiz: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  onNavigate,
  onOpenQuiz
}) => {
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordFeedback, setRecordFeedback] = useState<string | null>(null);
  const [standupHintShown, setStandupHintShown] = useState(false);

  // Play Daily Word Audio
  const handlePlayDailyWord = (speed: number) => {
    setTtsPlaying(true);
    speakGerman('Die Bereitstellung', speed, () => {
      setTtsPlaying(false);
    }, () => {
      setTtsPlaying(false);
    });
  };

  // Toggle Standup voice drill
  const toggleRecordDrill = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordFeedback(null);
      // Simulate listening and evaluation
      setTimeout(() => {
        setIsRecording(false);
        setRecordFeedback('Aussprache: 94% • "Die Helm-Charts sind fertig bereitgestellt!"');
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  // Play prompt from Lukas
  const playLukasPrompt = () => {
    speakGerman('Sriram, wie sieht der Status der neuen Helm-Charts aus?', 1.0);
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-[1440px] mx-auto pb-12">
      {/* Top Welcome Card & Telemetry */}
      <div className="relative w-full rounded-2xl overflow-hidden p-6 md:p-8 bg-white border border-slate-200 shadow-xs">
        {/* Welcome & Context Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono text-[11px] font-semibold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                SYS_PIPELINE: ACTIVE
              </span>
              <span className="text-slate-400 font-mono text-xs">•</span>
              <span className="text-amber-600 font-mono text-xs font-semibold">
                {stats.streakDays > 0 
                  ? `Day ${stats.streakDays} on Track / ${stats.streakDays}-வது நாள் தொடர்கிறது` 
                  : 'Day 0 - Start Journey / பயிற்சியைத் தொடங்குங்கள்'}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight font-sans">
              Guten Tag, Sriram! <span className="font-normal text-slate-500 text-xl md:text-2xl">/ காலை வணக்கம் ஸ்ரீராம்!</span>
            </h1>

            <p className="text-sm md:text-base text-slate-600 mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                Ziel: <strong className="text-slate-900 font-semibold">Senior DevOps Architect</strong> • München / Berlin SRE Track / நேர்காணல் தயார்நிலை
              </span>
            </p>
          </div>

          {/* Quick Action Terminal Controls */}
          <div className="flex items-center gap-3 self-start xl:self-auto shrink-0 flex-wrap">
            <button 
              onClick={() => onNavigate('interview-and-daily')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-all font-mono text-xs font-semibold border border-slate-200 shadow-xs"
            >
              <Mic className="w-4 h-4 text-sky-600" />
              <span>3m Standup Drill</span>
              <span className="px-1.5 py-0.5 rounded bg-white text-amber-600 text-[10px] font-mono font-bold border border-slate-200">
                +50 XP
              </span>
            </button>

            <button 
              onClick={onOpenQuiz}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-mono text-xs font-bold hover:bg-emerald-700 transition-all shadow-xs"
            >
              <Terminal className="w-4 h-4" />
              <span>Run Daily Review / திருப்புதல்</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bento Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1: Readiness Score with SVG Ring */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs flex items-center justify-between gap-4 relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="min-w-0">
              <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider block">
                Interview Readiness
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl lg:text-3xl font-bold text-slate-900 font-mono">
                  {stats.interviewReadiness}%
                </span>
                <span className="font-mono text-xs text-emerald-600 font-semibold">
                  {stats.interviewReadiness > 0 ? `▲ +${(stats.interviewReadiness * 0.05).toFixed(1)}%` : '0% Initial'}
                </span>
              </div>
              <span className="font-mono text-xs text-slate-600 truncate block mt-1">
                CI/CD & K8s Deutsch
              </span>
            </div>

            {/* Circular Progress SVG */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="4"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="transparent"
                  stroke="#059669"
                  strokeWidth="4.5"
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 * (1 - stats.interviewReadiness / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute font-mono text-xs text-emerald-700 font-bold">
                {stats.readinessLevel}
              </span>
            </div>
          </div>

          {/* Stat 2: Words Mastered */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider">
                Tech Vocab / சொல்வங்கி
              </span>
              <Database className="w-4 h-4 text-sky-600" />
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-2xl lg:text-3xl font-bold text-slate-900">
                  {stats.techVocabLearned}
                </span>
                <span className="text-xs text-slate-500">/ {stats.totalVocab} Wörter</span>
              </div>
              <p className="font-mono text-[11px] text-sky-700 mt-0.5 font-medium">
                கணிணி சொற்கள் தேர்ச்சி
              </p>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.techVocabLearned / stats.totalVocab) * 100}%` }}
              />
            </div>
          </div>

          {/* Stat 3: Sentence Drills Completed */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider">
                Sentence Drills / வாக்கியங்கள்
              </span>
              <Code2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-2xl lg:text-3xl font-bold text-slate-900">
                  {stats.sentenceDrillsCompleted}
                </span>
                <span className="text-xs text-emerald-700 font-semibold">
                  {stats.sentenceAccuracy}% Genauigkeit
                </span>
              </div>
              <p className="font-mono text-[11px] text-slate-600 mt-0.5">
                சரியான வாக்கிய அமைப்பு
              </p>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.sentenceAccuracy}%` }}
              />
            </div>
          </div>

          {/* Stat 4: Audio Practice & Pronunciation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider">
                Phonetics / உச்சரிப்பு பயிற்சி
              </span>
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-2xl lg:text-3xl font-bold text-slate-900">
                  {stats.phoneticsHours}h
                </span>
                <span className="text-xs text-amber-600 font-semibold">Logged</span>
              </div>
              <p className="font-mono text-[11px] text-slate-600 mt-0.5">
                Aussprache-Score: {stats.pronunciationScore} / 100
              </p>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.pronunciationScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN 2-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: DevOps Technical Skill Trees (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>Domain Skill Trees</span>
                <span className="font-mono text-sm text-slate-500 font-normal">
                  / தொழில்நுட்பத் தொகுதிகள்
                </span>
              </h2>
              <p className="font-mono text-xs text-slate-500 mt-0.5">
                Interactive German mastery paths mapped directly to cloud architecture responsibilities
              </p>
            </div>
            <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-bold border border-slate-200">
              5 MODULEN
            </span>
          </div>

          {/* Modules List */}
          {SKILL_TREE_MODULES.map((mod) => (
            <div
              key={mod.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col gap-3 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    {mod.icon === 'anchor' && <Anchor className="w-5 h-5 text-emerald-600" />}
                    {mod.icon === 'sync_alt' && <RefreshCw className="w-5 h-5 text-sky-600" />}
                    {mod.icon === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                    {mod.icon === 'forum' && <MessageSquare className="w-5 h-5 text-indigo-600" />}
                    {mod.icon === 'handshake' && <Handshake className="w-5 h-5 text-slate-600" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-mono text-sm md:text-base font-bold text-slate-900 truncate">
                        {mod.title}
                      </h3>
                      <span
                        className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border"
                        style={{
                          backgroundColor: `${mod.color}15`,
                          color: mod.color,
                          borderColor: `${mod.color}30`
                        }}
                      >
                        {mod.statusLabel}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-slate-500 truncate mt-0.5">
                      {mod.tamilTitle}
                    </p>
                  </div>
                </div>

                {/* Module Action Trigger */}
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
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-mono text-xs font-semibold border border-slate-200 transition-colors shadow-xs"
                >
                  {mod.statusType === 'done' && (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Audio Drill</span>
                    </>
                  )}
                  {mod.statusType === 'active' && (
                    <>
                      <Play className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      <span className="text-amber-700">Fortsetzen</span>
                    </>
                  )}
                  {mod.statusType === 'progress' && (
                    <>
                      <Mic className="w-3.5 h-3.5 text-sky-600" />
                      <span>Practice</span>
                    </>
                  )}
                  {mod.statusType === 'up-next' && (
                    <>
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500">Open Phase 2</span>
                    </>
                  )}
                </button>
              </div>

              {/* Wortschatz Tags */}
              <div className="bg-slate-50 p-2.5 rounded-xl font-mono text-xs text-slate-700 flex flex-wrap items-center gap-2 border border-slate-200/60">
                <span className="text-slate-500 font-semibold">Wortschatz:</span>
                {mod.words.map((w, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white text-slate-800 border border-slate-200 text-[11px]"
                  >
                    {w}
                  </span>
                ))}
              </div>

              {/* Progress metric bar */}
              <div className="flex items-center justify-between font-mono text-xs text-slate-500 pt-1">
                <span>Progress: {mod.solvedCount} / {mod.totalCount} Sätze gemeistert</span>
                <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${mod.progressPercent}%`,
                      backgroundColor: mod.color
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Tageswort, Daily Voice Challenge & Weak Spots (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6 min-w-0">
          {/* CARD 1: DAILY GERMAN AUDIO FLASHCARD */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span className="font-mono text-xs text-emerald-700 font-bold uppercase tracking-wider">
                  Tageswort / இன்றைய சொல்
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] uppercase font-bold border border-slate-200">
                DevOps Lemma
              </span>
            </div>

            {/* Target Word & Gender Highlight */}
            <div className="bg-slate-50 p-4 rounded-xl mb-3 border border-slate-200">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-mono text-[11px] font-bold uppercase border border-rose-200">
                  DIE (Feminine)
                </span>
                <span className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  Bereitstellung
                </span>
                <span className="font-mono text-sm text-sky-700">[-en]</span>
              </div>

              {/* Phonetics & Audio Triggers */}
              <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-slate-200">
                <span className="font-mono text-xs text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200">
                  /diː bəˈʁaɪ̯tˌʃtɛlʊŋ/
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePlayDailyWord(1.0)}
                    disabled={ttsPlaying}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold hover:bg-emerald-700 transition-all shadow-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{ttsPlaying ? 'Playing...' : '1.0x'}</span>
                  </button>

                  <button
                    onClick={() => handlePlayDailyWord(0.8)}
                    disabled={ttsPlaying}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-mono text-xs font-semibold border border-slate-200 transition-colors"
                  >
                    0.8x
                  </button>
                </div>
              </div>

              {/* Multilingual Definitions */}
              <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-1 gap-2 text-xs md:text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[11px] text-sky-700 font-bold uppercase shrink-0 mt-0.5">
                    EN
                  </span>
                  <span className="text-slate-800 font-medium">
                    Deployment / Provisioning of application artifacts
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[11px] text-amber-700 font-bold uppercase shrink-0 mt-0.5">
                    தமிழ்
                  </span>
                  <span className="text-slate-600">
                    பயன்பாட்டு வெளியீடு / சேவையகத்தில் தொகுப்பு நிறுவல்
                  </span>
                </div>
              </div>
            </div>

            {/* Real Jira Incident Sentence Context */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-2">
              <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
                <span className="flex items-center gap-1 text-amber-700 font-semibold">
                  <Bug className="w-3 h-3 text-amber-600" /> JIRA TICKET: OPS-4109
                </span>
                <span>Context: Production Staging</span>
              </div>

              <p className="font-mono text-xs md:text-sm text-slate-900 italic leading-relaxed">
                "Die automatische <span className="text-emerald-700 font-bold underline decoration-emerald-500">Bereitstellung</span> in der Staging-Umgebung ist fehlgeschlagen."
              </p>

              <p className="text-xs text-slate-600">
                ஸ்டேஜிங் சூழலில் தானியங்கி பயன்பாட்டு வெளியீடு தோல்வியடைந்தது.
              </p>

              <p className="text-xs text-slate-500">
                The automated deployment in the staging environment failed.
              </p>
            </div>
          </div>

          {/* CARD 2: TODAY'S AUDIO CHALLENGE (Standup Simulation) */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h3 className="font-mono text-sm font-bold text-slate-900">
                  Daily Standup Voice Drill
                </h3>
              </div>
              <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-bold">
                3 MIN DURATION
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Respond to the Scrum Master's prompt in German. You will be evaluated on case accuracy and separable verb positioning.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-sky-700 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px] uppercase font-bold">
                  PROMPT VON LUKAS (MÜNCHEN CLOUD LEAD):
                </span>
                <button
                  onClick={playLukasPrompt}
                  className="p-1 text-slate-500 hover:text-emerald-600 transition-colors"
                  title="Hear prompt audio"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-slate-900 font-semibold">
                "Sriram, wie sieht der Status der neuen Helm-Charts aus?"
              </span>
            </div>

            {/* Mic Record Interactive Row */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleRecordDrill}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-emerald-600 text-white animate-pulse ring-4 ring-emerald-500/30'
                      : 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
                  }`}
                  title={isRecording ? 'Stop Recording' : 'Start Recording'}
                >
                  <Mic className="w-5 h-5" />
                </button>

                <div className="flex flex-col">
                  <span className={`font-mono text-xs font-semibold ${isRecording ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {isRecording ? 'Recording in progress... (DE)' : 'Ready to record'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    பதிலை பதிவு செய்க (0 / 30s)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStandupHintShown(!standupHintShown)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-mono text-xs font-semibold border border-slate-200 transition-colors"
              >
                Hint / குறிப்பு
              </button>
            </div>

            {/* Standup Hint Drawer */}
            {standupHintShown && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 font-mono text-xs text-amber-800">
                💡 Tip: Say "Die Helm-Charts sind fertig bereitgestellt" or "Ich migriere die Charts heute."
              </div>
            )}

            {/* Recorded evaluation feedback */}
            {recordFeedback && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 font-mono text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{recordFeedback}</span>
              </div>
            )}
          </div>

          {/* CARD 3: RECENT WEAK SPOTS (Incident Separable Verbs) */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="font-mono text-sm font-bold text-slate-900">
                  Grammar Focus: Trennbare Verben
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[10px] font-bold">
                INCIDENT COMMANDS
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In German, prefixes split to the end of main clauses during direct commands and present tense actions.
            </p>

            {/* Grammar Demonstration Cards */}
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                  <span>VERB: NEUSTARTEN (RESTART)</span>
                  <span className="text-emerald-700 font-bold">KORREKTE FORM</span>
                </div>
                <p className="font-mono text-xs md:text-sm text-slate-900">
                  "Wir <strong className="text-emerald-700 underline">starten</strong> den defekten Datenbank-Pod sofort <strong className="text-emerald-700 underline">neu</strong>."
                </p>
                <p className="text-xs text-slate-500">
                  நாங்கள் செயலிழந்த தரவுத்தள போடை உடனே மீண்டும் துவக்குகிறோம்.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                  <span>VERB: AUSFALLEN (TO FAIL / GO DOWN)</span>
                  <span className="text-emerald-700 font-bold">PERFEKT-FORM</span>
                </div>
                <p className="font-mono text-xs md:text-sm text-slate-900">
                  "Der Ingress-Controller ist vor 10 Minuten <strong className="text-amber-700 underline">ausgefallen</strong>."
                </p>
                <p className="text-xs text-slate-500">
                  10 நிமிடங்களுக்கு முன்பு நுழைவுக் கட்டுப்படுத்தி செயலிழந்தது.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('sentence-lab')}
              className="w-full mt-1 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-sky-700 font-mono text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Drill 5 Separable Verb Scenarios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Readiness Telemetry Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white tracking-tight">
              DevOps Deutsch Readiness Milestone
            </h4>
            <p className="text-sm text-slate-400 mt-0.5">
              {stats.streakDays > 0 
                ? `You are ${stats.streakDays} practice days on track for German tech recruitment rounds.`
                : 'Start your daily practice today to prepare for German tech recruitment rounds.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
          <button 
            onClick={() => onNavigate('phrase-dump')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>DevOps Cheatsheet</span>
          </button>

          <button 
            onClick={() => onNavigate('interview-and-daily')}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-xs"
          >
            Simulate Mock Interview
          </button>
        </div>
      </div>
    </div>
  );
};
