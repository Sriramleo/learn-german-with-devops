import React, { useState } from 'react';
import { 
  BookOpen, 
  Youtube, 
  Target, 
  Clock, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Volume2, 
  BrainCircuit, 
  Calendar,
  Compass,
  Lightbulb,
  Zap,
  Layers
} from 'lucide-react';
import { speakGerman } from '../utils/speech';

interface YouTubeChannel {
  name: string;
  handle: string;
  subscribers: string;
  level: 'Zero to A2' | 'A1 to B1' | 'B1 to B2' | 'All Levels';
  focus: string;
  url: string;
  recommendedPlaylists: { title: string; url: string; badge: string }[];
  description: string;
  whyWatch: string;
}

const YOUTUBE_SOURCES: YouTubeChannel[] = [
  {
    name: 'Easy German',
    handle: '@EasyGerman',
    subscribers: '2.1M+',
    level: 'All Levels',
    focus: 'Real-life street interviews, natural pronunciation & German culture',
    url: 'https://www.youtube.com/@EasyGerman',
    description: 'The gold standard for natural spoken German. Janusz, Cari, and Manuel interview people on the streets of Berlin with dual German/English subtitles.',
    whyWatch: 'Essential for tuning your ear to real-world speed and everyday conversational rhythms beyond dry textbooks.',
    recommendedPlaylists: [
      { title: 'Super Easy German (Slow & Simple for Beginners)', url: 'https://www.youtube.com/playlist?list=PL3936178A38BB50F0', badge: 'Absolute Beginners' },
      { title: 'German Street Interviews (B1 Preparation)', url: 'https://www.youtube.com/playlist?list=PLk1fjX71eE6cM6X6_hX7xVbUe7y0T5x_7', badge: 'B1 Listening' }
    ]
  },
  {
    name: 'Learn German with Anja',
    handle: '@LearnGermanwithAnja',
    subscribers: '1.2M+',
    level: 'Zero to A2',
    focus: 'Energetic beginner lessons, foundational grammar & fun examples',
    url: 'https://www.youtube.com/@LearnGermanwithAnja',
    description: 'Anja teaches German with immense energy and clarity. Perfect if you know zero words and want to grasp basics without feeling overwhelmed.',
    whyWatch: 'Her videos on Nominativ vs. Akkusativ vs. Dativ make complex German cases click instantly.',
    recommendedPlaylists: [
      { title: 'German for Beginners (A1 Complete Course)', url: 'https://www.youtube.com/playlist?list=PL5QycnCU4fg6Z_mQ-BvOqO3Q1U4z5K_Qf', badge: 'Start Here' },
      { title: 'German Grammar Made Easy', url: 'https://www.youtube.com/playlist?list=PL5QycnCU4fg4vB4R2-6QcK_P6W1Q1e-Q6', badge: 'Grammar Hacks' }
    ]
  },
  {
    name: 'YourGermanTeacher',
    handle: '@YourGermanTeacher',
    subscribers: '450K+',
    level: 'A1 to B1',
    focus: 'Systematic grammar breakdowns, B1 exam prep, sentence structure',
    url: 'https://www.youtube.com/@YourGermanTeacher',
    description: 'Luzian and Johannes provide structured classroom-style explanations with precise whiteboard diagrams and clear visual charts.',
    whyWatch: 'The best channel for mastering German word order rules (Verb in position 2, TeKaMoLo, subordinate clauses).',
    recommendedPlaylists: [
      { title: 'German Word Order & Sentence Structure Masterclass', url: 'https://www.youtube.com/@YourGermanTeacher/playlists', badge: 'Sentence Rules' },
      { title: 'B1 German Grammar & Exam Preparation', url: 'https://www.youtube.com/@YourGermanTeacher/playlists', badge: 'B1 Accelerator' }
    ]
  },
  {
    name: 'Lingoni German',
    handle: '@lingonigerman',
    subscribers: '700K+',
    level: 'A1 to B1',
    focus: 'Structured CEFR curriculum (A1.1 to B1.2), vocabulary drills',
    url: 'https://www.youtube.com/@lingonigerman',
    description: 'Organized systematically by official Goethe/CEFR levels. Great for step-by-step progress tracking.',
    whyWatch: 'High production quality with clean graphics and exact pronunciation breakdowns.',
    recommendedPlaylists: [
      { title: 'Complete A1 German Course', url: 'https://www.youtube.com/@lingonigerman/playlists', badge: 'A1 Foundation' },
      { title: 'Complete A2 & B1 German Lessons', url: 'https://www.youtube.com/@lingonigerman/playlists', badge: 'B1 Ladder' }
    ]
  },
  {
    name: 'Benjamin der Deutschlehrer',
    handle: '@BenjaminDerDeutschlehrer',
    subscribers: '380K+',
    level: 'B1 to B2',
    focus: 'Advanced speaking nuances, professional German, accent reduction',
    url: 'https://www.youtube.com/@BenjaminDerDeutschlehrer',
    description: 'Focuses on the bridge between basic A2 German and professional B1/B2 workplace fluency in Germany.',
    whyWatch: 'Ideal once you know the basics and want to sound natural in German IT engineering meetings.',
    recommendedPlaylists: [
      { title: 'How to Speak German Fluently (Mindset & Phrasing)', url: 'https://www.youtube.com/@BenjaminDerDeutschlehrer/playlists', badge: 'Fluency Hacks' }
    ]
  }
];

export const LearningTipsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'youtube' | 'rules' | 'pronunciation'>('roadmap');

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950/40 p-6 md:p-8 border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero to B1 Roadmap for DevOps & IT Engineers</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
            German B1 Mastery & Multi-Source Study Guide
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Starting with <span className="text-amber-400 font-bold">zero German words</span>? Don't panic. German follows logical, predictable rules similar to code syntax. With <span className="text-emerald-400 font-bold">25 minutes a day</span>, spaced repetition, and top YouTube teachers, you can reach conversational B1 professional readiness in 90 days.
          </p>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'roadmap'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            90-Day Zero-to-B1 Roadmap
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'youtube'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Youtube className="w-4 h-4" />
            Curated YouTube Sources
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'rules'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            German Syntax as Code
          </button>
          <button
            onClick={() => setActiveTab('pronunciation')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'pronunciation'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            Slow 0.5x Audio & Pronunciation
          </button>
        </div>
      </div>

      {/* TAB 1: ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              The 3-Phase Acceleration Plan (Zero to B1)
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mb-6">
              German is a Germanic language sharing 60%+ vocabulary roots with English and technical IT terminology. Follow these three 30-day phases:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Phase 1 */}
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-bl">
                  Days 1 - 30
                </div>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                  <span>Phase 1: A1 Foundations</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">Greetings, Numbers & Core Verbs</h3>
                <ul className="text-xs text-slate-300 space-y-2 mb-4">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Master Greetings (Guten Morgen, Hallo, Feierabend).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Count 0-100 and read IP/ports (Port achttausendachtzig).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Core verbs: <span className="text-amber-300 font-mono">sein, haben, machen, prüfen, deployen</span>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>Rule #1: The main verb is ALWAYS position 2.</span>
                  </li>
                </ul>
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                  ⚡ Daily Target: 10 flashcards + 1 YouTube lesson (Anja / Lingoni).
                </div>
              </div>

              {/* Phase 2 */}
              <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl">
                  Days 31 - 60
                </div>
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-1">
                  <span>Phase 2: A2 Expansion</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">Modal Verbs & Incident Calls</h3>
                <ul className="text-xs text-slate-300 space-y-2 mb-4">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>Modal verbs: <span className="text-indigo-300 font-mono">müssen (must), können (can), sollten (should)</span>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>Incident calls: "Wir müssen sofort ein Failover einleiten."</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>Separable verbs: <span className="text-indigo-300 font-mono">durchführen (führen... durch), neu starten</span>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>Past tense (Perfekt): "Ich habe die Logs geprüft."</span>
                  </li>
                </ul>
                <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300">
                  ⚡ Daily Target: 15 phrase flashcards + Sentence Lab practice.
                </div>
              </div>

              {/* Phase 3 */}
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-bl">
                  Days 61 - 90
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                  <span>Phase 3: B1 Fluency</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">Complex Subordinate Clauses & Post-Mortems</h3>
                <ul className="text-xs text-slate-300 space-y-2 mb-4">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Connectors: <span className="text-emerald-300 font-mono">weil (because), wenn (if/when), obwohl (although)</span>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Verb kicks to the very end of subordinate clauses.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Active participation in standups, PR reviews, and post-mortems.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Watch Easy German at 1.0x without English subtitles.</span>
                  </li>
                </ul>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                  ⚡ Daily Target: Real Incident Simulator + 1 Easy German video.
                </div>
              </div>
            </div>
          </div>

          {/* Daily 25-Minute Routine */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              The High-Retention 25-Minute Daily Routine
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">00:00 - 05:00 (5 Min)</span>
                <h4 className="text-sm font-bold text-white mb-1">Spaced Repetition Review</h4>
                <p className="text-xs text-slate-400">Open Vocab tab, flip 10-15 cards using "Hard/Good/Easy" buttons to refresh yesterday's terms.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">05:00 - 15:00 (10 Min)</span>
                <h4 className="text-sm font-bold text-white mb-1">1 Focused YouTube Lesson</h4>
                <p className="text-xs text-slate-400">Watch 1 grammar video (Anja / YourGermanTeacher) or 1 Super Easy German street video.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">15:00 - 20:00 (5 Min)</span>
                <h4 className="text-sm font-bold text-white mb-1">Interactive Word-by-Word</h4>
                <p className="text-xs text-slate-400">In Sentence Lab, play at 0.5x, click individual words to hear them spoken, and repeat out loud 3x.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">20:00 - 25:00 (5 Min)</span>
                <h4 className="text-sm font-bold text-white mb-1">Active Output / Quiz</h4>
                <p className="text-xs text-slate-400">Take 1 Incident Scenario Quiz or translate a simulated Slack message into German.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: YOUTUBE SOURCES */}
      {activeTab === 'youtube' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {YOUTUBE_SOURCES.map((ch, idx) => (
              <div key={idx} className="bg-slate-900/90 border border-slate-800 hover:border-red-500/40 transition-all rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                        <Youtube className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          {ch.name}
                          <span className="text-[10px] text-slate-400 font-normal">({ch.subscribers})</span>
                        </h3>
                        <span className="text-xs text-red-400 font-mono">{ch.handle}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
                      {ch.level}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    {ch.description}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4">
                    <span className="text-[10px] font-bold uppercase text-amber-400 block mb-1">Why Watch For B1:</span>
                    <p className="text-xs text-slate-400">{ch.whyWatch}</p>
                  </div>
                </div>

                <div>
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Recommended Playlists:</span>
                    {ch.recommendedPlaylists.map((pl, pIdx) => (
                      <a
                        key={pIdx}
                        href={pl.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800/60 text-xs text-slate-200 transition-colors group"
                      >
                        <span className="truncate pr-2 group-hover:text-red-300 font-medium">{pl.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20 whitespace-nowrap">
                          {pl.badge}
                        </span>
                      </a>
                    ))}
                  </div>

                  <a
                    href={ch.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Youtube className="w-4 h-4" />
                    Open {ch.name} Channel
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GERMAN SYNTAX AS CODE */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
              German Grammar: The "Code Syntax" Mental Model
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mb-6">
              German is extremely structured. If you treat sentences like functions and variable assignments, word order becomes effortless:
            </p>

            <div className="space-y-4">
              {/* Syntax Rule 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">Rule 1: V2 (Verb in Position 2)</span>
                  <span className="text-xs text-slate-400">In standard main clauses, the conjugated verb is ALWAYS the 2nd element.</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-mono text-xs bg-slate-900 p-3 rounded-lg border border-slate-800 mb-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Element 1 (Topic/Subject/Time)</span>
                    <span className="text-indigo-400 font-bold">Heute</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Position 2 (CONJUGATED VERB)</span>
                    <span className="text-amber-400 font-bold underline">deployen</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Rest of Sentence</span>
                    <span className="text-emerald-400">wir das neue Release.</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Even if you start with time ("Heute"), the verb ("deployen") stays strictly in position 2, and the subject ("wir") flips behind it!
                </p>
              </div>

              {/* Syntax Rule 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">Rule 2: The "Verb Bracket" (Klammer)</span>
                  <span className="text-xs text-slate-400">Modal verbs / separable verbs create a bracket around the entire sentence.</span>
                </div>
                <div className="font-mono text-xs bg-slate-900 p-3 rounded-lg border border-slate-800 mb-2">
                  <div className="text-slate-300">
                    Wir <span className="text-amber-400 font-bold">müssen</span> [sofort die Datenbank-Verbindung] <span className="text-amber-400 font-bold">überprüfen</span>.
                  </div>
                  <div className="text-slate-500 text-[11px] mt-1">
                    ↳ Modal verb ("müssen") goes in Pos 2, Main infinitive ("überprüfen") goes to the very END of the sentence.
                  </div>
                </div>
              </div>

              {/* Syntax Rule 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">Rule 3: "Weil" Subordinate Clause (Verb-Kicker)</span>
                  <span className="text-xs text-slate-400">Words like <code className="text-emerald-400">weil</code>, <code className="text-emerald-400">dass</code>, <code className="text-emerald-400">wenn</code> kick the conjugated verb to the very end.</span>
                </div>
                <div className="font-mono text-xs bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-300">
                    Der Service stürzt ab, <span className="text-emerald-400 font-bold">weil</span> der Pod keine CPU mehr <span className="text-emerald-400 font-bold underline">hat</span>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRONUNCIATION */}
      {activeTab === 'pronunciation' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-emerald-400" />
              German Phonetics & 0.5x Slow Audio Practice
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mb-6">
              German pronunciation is 99% phonetic (spelled exactly how it sounds). Click any sample word below to listen at <span className="text-amber-400 font-bold">0.5x slow rate</span>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { de: 'Guten Morgen', ipa: '[ˈɡuːtn̩ ˈmɔʁɡn̩]', en: 'Good morning', tip: 'Long "u" in Guten, soft rolled "r" in Morgen.' },
                { de: 'achttausendachtzig', ipa: '[axtˈtaʊ̯zn̩tˈʔaxtsɪç]', en: '8080 (Port)', tip: '"ch" sounds like a soft throat scrape (ach-Laut).' },
                { de: 'die Verfügbarkeit', ipa: '[fɛɐ̯ˈfyːkbɪçkaɪ̯t]', en: 'Availability (SLA)', tip: 'Umlaut "ü" shape lips like whistle and say "ee".' },
                { de: 'der Ausfall', ipa: '[deːɐ̯ ˈʔaʊ̯sfal]', en: 'Outage / Downtime', tip: '"au" sounds like "ow" in cow.' },
                { de: 'das Failover einleiten', ipa: '[ˈaɪ̯nˌlaɪ̯tn̩]', en: 'To initiate failover', tip: '"ei" always pronounced like "eye".' },
                { de: 'Schönen Feierabend', ipa: '[ˈfaɪ̯ɐˌʔaːbn̩t]', en: 'Have a good evening after work', tip: '"ö" sound rounded "eh", iconic German farewell.' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-sm">{item.de}</span>
                      <button
                        onClick={() => speakGerman(item.de, 0.5)}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                        title="Listen at 0.5x Slow Rate"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400/80 block mb-1">{item.ipa}</span>
                    <span className="text-xs text-slate-300 font-medium block mb-2">{item.en}</span>
                    <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800/80">
                      💡 {item.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
