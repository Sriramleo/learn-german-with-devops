import React, { useState, useMemo } from 'react';
import { 
  Volume2, 
  Mic, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Star, 
  Search, 
  X, 
  Sparkles, 
  Terminal, 
  Layers, 
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { VocabItem, VocabCategory, UserStats } from '../types';
import { VOCABULARY_LIST } from '../data/vocabData';
import { speakGerman, speakTamil, stopSpeech } from '../utils/speech';

interface VocabViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  isTamilActive?: boolean;
}

export const VocabView: React.FC<VocabViewProps> = ({
  stats,
  onUpdateStats,
  isTamilActive = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VocabCategory>('all');
  const [selectedWord, setSelectedWord] = useState<VocabItem>(VOCABULARY_LIST[0]);
  const [isPlayingDock, setIsPlayingDock] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState(false);
  const [recordingWordId, setRecordingWordId] = useState<string | null>(null);
  const [recordedScore, setRecordedScore] = useState<Record<string, number>>({});

  // Filter vocabulary by search query and category
  const filteredVocab = useMemo(() => {
    return VOCABULARY_LIST.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch = 
        item.word.toLowerCase().includes(q) ||
        item.english.toLowerCase().includes(q) ||
        item.tamil.includes(q) ||
        item.ipa.toLowerCase().includes(q) ||
        item.germanSentence.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Audio Play helper for a word
  const playWordAudio = (word: VocabItem, rate: number = playbackSpeed) => {
    setSelectedWord(word);
    setIsPlayingDock(true);
    speakGerman(word.word, rate, () => {
      setIsPlayingDock(false);
      if (isLooping) {
        setTimeout(() => playWordAudio(word, rate), 400);
      }
    }, () => {
      setIsPlayingDock(false);
    });
  };

  // Play whole sentence audio
  const playSentenceAudio = (word: VocabItem) => {
    setIsPlayingDock(true);
    speakGerman(word.germanSentence, 1.0, () => {
      setIsPlayingDock(false);
    }, () => {
      setIsPlayingDock(false);
    });
  };

  // Play Tamil pronunciation
  const playTamilAudio = (text: string) => {
    speakTamil(text, 1.0);
  };

  // Toggle bookmarking
  const toggleBookmark = (id: string) => {
    const exists = stats.bookmarkedVocabIds.includes(id);
    const updated = exists 
      ? stats.bookmarkedVocabIds.filter(x => x !== id)
      : [...stats.bookmarkedVocabIds, id];
    onUpdateStats({ bookmarkedVocabIds: updated });
  };

  // Practice pronunciation simulation
  const handleRecordPractice = (word: VocabItem) => {
    setRecordingWordId(word.id);
    setTimeout(() => {
      const score = Math.floor(Math.random() * 8) + 91; // 91-98%
      setRecordedScore(prev => ({ ...prev, [word.id]: score }));
      setRecordingWordId(null);
      // Give XP reward & update real progress
      onUpdateStats({ 
        xp: Math.min(stats.maxXp, stats.xp + 15),
        techVocabLearned: Math.min(stats.totalVocab, stats.techVocabLearned + 1),
        pronunciationScore: stats.pronunciationScore === 0 ? score : Math.round((stats.pronunciationScore + score) / 2),
        phoneticsHours: parseFloat((stats.phoneticsHours + 0.1).toFixed(1)),
        streakDays: Math.max(1, stats.streakDays)
      });
    }, 2500);
  };

  // Next / Previous navigation in audio dock
  const handleNextWord = () => {
    const currentIndex = filteredVocab.findIndex(w => w.id === selectedWord.id);
    if (currentIndex >= 0 && currentIndex < filteredVocab.length - 1) {
      const next = filteredVocab[currentIndex + 1];
      playWordAudio(next);
    } else if (filteredVocab.length > 0) {
      playWordAudio(filteredVocab[0]);
    }
  };

  const handlePrevWord = () => {
    const currentIndex = filteredVocab.findIndex(w => w.id === selectedWord.id);
    if (currentIndex > 0) {
      const prev = filteredVocab[currentIndex - 1];
      playWordAudio(prev);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 max-w-[1320px] mx-auto pb-44">
      {/* Top Header & Search Section */}
      <section className="w-full p-4 sm:p-6 bg-white border border-border-subtle shadow-xs rounded-2xl flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                MODUL // SRE-01
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-800 font-semibold">
                PROD INCIDENT RUNBOOK PHRASING
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
              Tech Vocab & Terminal Lexicon <span className="font-normal text-slate-500 text-base sm:text-lg">/ Interactive Phrasing Studio</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              Master precise SRE, Kubernetes, and Cloud architecture terminology in German. Powered by phonetics, contextual enterprise Jira/Slack telemetry sentences, and direct English technical mappings.
            </p>
          </div>

          {/* Gender Color Legend Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-slate-50 p-2 rounded-xl border border-border-subtle shadow-2xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 shadow-xs" />
              <span className="text-[10px] text-sky-900 font-bold uppercase font-mono">DER · Maskulin</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-xs" />
              <span className="text-[10px] text-rose-900 font-bold uppercase font-mono">DIE · Feminin</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
              <span className="text-[10px] text-amber-900 font-bold uppercase font-mono">DAS · Neutrum</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-slate-50 p-2 rounded-xl border border-border-subtle shadow-2xs">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search German (Ausfall, Skalierbarkeit) or English (Outage, Bottleneck)..."
              className="w-full bg-white text-slate-900 text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-2xs placeholder:text-slate-400 font-sans"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700 absolute right-3 cursor-pointer p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 px-3 py-2 bg-white rounded-lg text-slate-700 text-xs border border-border-subtle shadow-2xs">
            <Terminal className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-[10px] font-bold font-mono">DE / EN SRE INDEXED</span>
          </div>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-border-subtle shadow-2xs'
            }`}
          >
            <span>All Words</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
              selectedCategory === 'all' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {VOCABULARY_LIST.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('k8s')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'k8s'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-border-subtle shadow-2xs'
            }`}
          >
            <span>Kubernetes & Cloud</span>
            <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold font-mono">
              {VOCABULARY_LIST.filter(v => v.category === 'k8s').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('cicd')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'cicd'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-border-subtle shadow-2xs'
            }`}
          >
            <span>CI/CD & Git</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold font-mono">
              {VOCABULARY_LIST.filter(v => v.category === 'cicd').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('sre')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'sre'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-border-subtle shadow-2xs'
            }`}
          >
            <span>SRE & Incidents</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold font-mono">
              {VOCABULARY_LIST.filter(v => v.category === 'sre').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('security')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'security'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-border-subtle shadow-2xs'
            }`}
          >
            <span>Security & Compliance</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold font-mono">
              {VOCABULARY_LIST.filter(v => v.category === 'security').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('standup')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'standup'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-border-subtle shadow-2xs'
            }`}
          >
            <span>Standup & Rituals</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 text-[10px] font-bold font-mono">
              {VOCABULARY_LIST.filter(v => v.category === 'standup').length}
            </span>
          </button>
        </div>
      </section>

      {/* Vocabulary Card Grid */}
      <section className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Displaying {filteredVocab.length} Lexicon Entries
          </span>
          <span className="text-xs text-slate-500">
            Click speaker to hear native audio
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredVocab.map((item) => {
            const isBookmarked = stats.bookmarkedVocabIds.includes(item.id);
            const isSelected = selectedWord.id === item.id;
            const score = recordedScore[item.id];
            const isRecordingThis = recordingWordId === item.id;

            // Gender badge colors
            const genderBadge = item.gender === 'DER'
              ? 'bg-sky-50 text-sky-800 border-sky-200'
              : item.gender === 'DIE'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-amber-50 text-amber-900 border-amber-200';

            return (
              <article
                key={item.id}
                onClick={() => setSelectedWord(item)}
                className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all shadow-xs flex flex-col justify-between gap-4 cursor-pointer relative group ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-border-subtle hover:border-slate-300'
                }`}
              >
                {/* Card Top Meta: Gender + Category + Bookmark */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${genderBadge}`}>
                      {item.articleLabel}
                    </span>
                    {item.grammaticalNote && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-mono font-medium">
                        {item.grammaticalNote}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item.id);
                      }}
                      className="p-1 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Term'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Primary Term Word & IPA Phonetics */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                      {item.word}
                    </h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playWordAudio(item, 1.0);
                      }}
                      className="w-9 h-9 rounded-xl bg-slate-50 border border-border-subtle hover:bg-emerald-600 hover:text-white text-emerald-700 flex items-center justify-center transition-all shadow-2xs cursor-pointer shrink-0"
                      title="Play German Audio"
                      aria-label={`Play audio for ${item.word}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-sky-800 bg-sky-50/70 px-2 py-0.5 rounded border border-sky-200">
                      {item.ipa}
                    </span>
                    {item.plural && (
                      <span className="text-[11px] text-slate-500 font-mono">
                        {item.plural}
                      </span>
                    )}
                  </div>
                </div>

                {/* English & Tamil Translation Mappings */}
                <div className="p-3 rounded-xl bg-slate-50 border border-border-subtle flex flex-col gap-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] text-sky-700 font-bold uppercase font-mono shrink-0 mt-0.5">EN:</span>
                    <span className="font-semibold text-slate-900 font-sans">
                      {item.english}
                    </span>
                  </div>
                  {isTamilActive && (
                    <div className="flex items-start gap-2 pt-1 border-t border-border-subtle">
                      <span className="text-[10px] text-amber-700 font-bold uppercase font-mono shrink-0 mt-0.5">தமிழ்:</span>
                      <div className="flex flex-col">
                        <span className="text-slate-700 font-sans">
                          {item.tamil}
                        </span>
                        {item.tamilTranslit && (
                          <span className="text-[10px] text-slate-500 italic">
                            {item.tamilTranslit}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Enterprise Incident Context Log */}
                <div className="p-3 rounded-xl bg-slate-50 border border-border-subtle flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-mono font-bold">
                    <span>{item.logContextTitle}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSentenceAudio(item);
                      }}
                      className="text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 cursor-pointer"
                      title="Hear Full Sentence Audio"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>LISTEN LOG</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-900 font-medium font-sans leading-relaxed">
                    "{item.germanSentence}"
                  </p>

                  <p className="text-xs text-slate-600 font-sans">
                    {item.englishSentence}
                  </p>

                  {isTamilActive && item.tamilSentence && (
                    <p className="text-xs text-slate-500 font-sans">
                      {item.tamilSentence}
                    </p>
                  )}
                </div>

                {/* Interactive Mic Practice Action */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecordPractice(item);
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 border border-border-subtle transition-all shadow-2xs cursor-pointer ${
                        isRecordingThis
                          ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse font-bold'
                          : 'bg-white hover:bg-slate-100 text-slate-900 font-semibold'
                      }`}
                    >
                      <Mic className={`w-3.5 h-3.5 ${isRecordingThis ? 'text-rose-600 animate-spin' : 'text-rose-600'}`} />
                      <span>{isRecordingThis ? 'Listening...' : 'Record My Voice'}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playWordAudio(item, 0.75);
                      }}
                      className="px-2.5 py-2 rounded-lg bg-white border border-border-subtle text-slate-700 hover:bg-slate-100 text-xs transition-colors shadow-2xs cursor-pointer"
                      title="Play 0.75x Slow Speed"
                    >
                      0.75x 🐢
                    </button>
                  </div>
                  {score && (
                    <div className="text-xs text-emerald-800 p-1.5 rounded bg-emerald-50 border border-emerald-200 mt-1 font-sans">
                      "{item.feedbackTip || 'Great German accent and sharp phonetic timing!'}"
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Floating Audio Studio Dock (Positioned above mobile nav on small screens) */}
      <aside className="fixed bottom-16 xl:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl bg-white/98 backdrop-blur-xl border border-border-strong rounded-2xl shadow-xl p-3 md:p-4 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Active Word Info */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-slate-900 text-xs sm:text-sm truncate font-sans">
                  {selectedWord.word}
                </span>
                <span className="text-[11px] text-sky-800 bg-slate-50 px-1.5 py-0.2 rounded border border-border-subtle font-mono truncate">
                  {selectedWord.ipa}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 truncate font-sans">
                {selectedWord.english} {isTamilActive && `• ${selectedWord.tamil}`}
              </span>
            </div>
          </div>

          {/* Audio Playback Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap justify-center">
            <button
              onClick={handlePrevWord}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Previous Word"
              aria-label="Previous Word"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (isPlayingDock) {
                  stopSpeech();
                  setIsPlayingDock(false);
                } else {
                  playWordAudio(selectedWord);
                }
              }}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs flex items-center justify-center cursor-pointer"
              title={isPlayingDock ? 'Pause' : 'Play Audio'}
              aria-label={isPlayingDock ? 'Pause' : 'Play Audio'}
            >
              {isPlayingDock ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={handleNextWord}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Next Word"
              aria-label="Next Word"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Loop Toggle */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isLooping ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Toggle Infinite Audio Loop"
              aria-label="Toggle Infinite Audio Loop"
            >
              <Repeat className="w-4 h-4" />
            </button>

            {/* Speed Control Pill */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-border-subtle">
              {[0.8, 1.0, 1.25].map(spd => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Play Whole Sentence Button */}
            <button
              onClick={() => playSentenceAudio(selectedWord)}
              className="hidden md:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white border border-border-subtle text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-2xs cursor-pointer font-sans"
            >
              <Terminal className="w-3.5 h-3.5 text-sky-600" />
              <span>Full Incident Log</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
