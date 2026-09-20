import React, { useState, useMemo } from 'react';
import { 
  Volume2, 
  Mic, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Search, 
  X, 
  Sparkles, 
  Terminal, 
  Bookmark,
  Layers,
  RotateCw,
  CheckCircle2,
  HelpCircle,
  Clock,
  Zap,
  Info
} from 'lucide-react';
import { VocabItem, VocabCategory, UserStats } from '../types';
import { VOCABULARY_LIST } from '../data/vocabData';
import { speakGerman, speakWord, speakTamil, stopSpeech, pauseSpeech, resumeSpeech, isSpeechPaused } from '../utils/speech';

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
  const [isPausedDock, setIsPausedDock] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.5); // Default to 0.5x slow or 1.0x
  const [isLooping, setIsLooping] = useState(false);
  const [recordingWordId, setRecordingWordId] = useState<string | null>(null);
  const [recordedScore, setRecordedScore] = useState<Record<string, number>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'srs'>('grid');
  const [srsIndex, setSrsIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [clickedWordInfo, setClickedWordInfo] = useState<{ word: string; cleanWord: string } | null>(null);

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
    setIsPausedDock(false);
    speakGerman(word.word, rate, () => {
      setIsPlayingDock(false);
      setIsPausedDock(false);
      if (isLooping) {
        setTimeout(() => playWordAudio(word, rate), 400);
      }
    }, () => {
      setIsPlayingDock(false);
      setIsPausedDock(false);
    });
  };

  // Play whole sentence audio with pause & resume support
  const playSentenceAudio = (sentence: string, rate: number = playbackSpeed) => {
    if (isPausedDock) {
      resumeSpeech();
      setIsPausedDock(false);
      setIsPlayingDock(true);
      return;
    }
    setIsPlayingDock(true);
    setIsPausedDock(false);
    speakGerman(sentence, rate, () => {
      setIsPlayingDock(false);
      setIsPausedDock(false);
    }, () => {
      setIsPlayingDock(false);
      setIsPausedDock(false);
    });
  };

  const handlePauseAudio = () => {
    if (isPlayingDock && !isPausedDock) {
      pauseSpeech();
      setIsPausedDock(true);
    } else if (isPausedDock) {
      resumeSpeech();
      setIsPausedDock(false);
    }
  };

  // Interactive single word audio click
  const handleSingleWordClick = (rawWord: string) => {
    // Clean punctuation like commas, dots, quotes, parentheses
    const clean = rawWord.replace(/^[«"'(]+|[»"')!?,.:;]+$/g, '').trim();
    if (!clean) return;
    
    stopSpeech();
    setIsPlayingDock(false);
    setIsPausedDock(false);
    setClickedWordInfo({ word: rawWord, cleanWord: clean });
    speakWord(clean, playbackSpeed);
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
      onUpdateStats({ 
        xp: Math.min(stats.maxXp, stats.xp + 15),
        techVocabLearned: Math.min(stats.totalVocab, stats.techVocabLearned + 1),
        pronunciationScore: stats.pronunciationScore === 0 ? score : Math.round((stats.pronunciationScore + score) / 2),
        phoneticsHours: parseFloat((stats.phoneticsHours + 0.1).toFixed(1)),
        streakDays: Math.max(1, stats.streakDays)
      });
    }, 2000);
  };

  // SRS Mastery rating
  const handleSrsRating = (wordId: string, level: 'again' | 'hard' | 'good' | 'easy') => {
    const currentMastery = stats.srsMastery || {};
    const updatedMastery = { ...currentMastery, [wordId]: level };
    const xpBonus = level === 'easy' ? 25 : level === 'good' ? 15 : level === 'hard' ? 5 : 0;
    
    onUpdateStats({
      srsMastery: updatedMastery,
      xp: Math.min(stats.maxXp, stats.xp + xpBonus),
      techVocabLearned: Math.min(stats.totalVocab, stats.techVocabLearned + (level !== 'again' ? 1 : 0))
    });

    // Move to next card in SRS mode
    setIsFlipped(false);
    if (srsIndex < filteredVocab.length - 1) {
      setSrsIndex(srsIndex + 1);
    } else {
      setSrsIndex(0);
    }
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

  // Helper to render interactive clickable sentence tokens
  const renderInteractiveSentence = (sentence: string) => {
    const words = sentence.split(' ');
    return (
      <div className="flex flex-wrap gap-1 items-center mt-1">
        {words.map((w, idx) => {
          const isClicked = clickedWordInfo?.word === w;
          return (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                handleSingleWordClick(w);
              }}
              className={`px-1.5 py-0.5 rounded text-xs transition-all cursor-pointer inline-flex items-center gap-0.5 ${
                isClicked 
                  ? 'bg-amber-400 text-slate-950 font-bold scale-105 shadow-sm ring-2 ring-amber-300' 
                  : 'bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-800'
              }`}
              title="Click to pronounce this single word"
            >
              <span>{w}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const srsCurrentItem = filteredVocab[srsIndex] || filteredVocab[0];

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 max-w-[1320px] mx-auto pb-44">
      {/* Top Header & Search Section */}
      <section className="w-full p-4 sm:p-6 bg-white border border-border-subtle shadow-xs rounded-2xl flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider flex-wrap">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                GERMAN DEVOPS LEXICON
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-800 font-semibold">
                REPEATABLE SPACED REPETITION & 0.5X SLOW AUDIO
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
              Tech Vocab & Pronunciation Studio <span className="font-normal text-slate-500 text-base sm:text-lg">/ Zero to B1</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              Master Greetings, Numbers, SRE incidents, Kubernetes, and Cloud architecture. Click individual words in incident logs to hear slow pronunciations at <span className="font-bold text-emerald-700">0.5x</span>, <span className="font-bold text-emerald-700">0.75x</span>, or <span className="font-bold text-emerald-700">1.0x</span>.
            </p>
          </div>

          {/* View Mode Toggle: Grid vs SRS Flashcards */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('srs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'srs'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-900" />
              <span>Repeatable Flashcards (SRS)</span>
            </button>
          </div>
        </div>

        {/* Global Playback Speed Selector Bar */}
        <div className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Audio Speed:
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
              {[0.5, 0.75, 1.0].map(spd => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {spd}x {spd === 0.5 ? '(Slow Learner)' : spd === 0.75 ? '(Practice)' : '(Native)'}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-sky-600" />
            <span>Click any individual word in sentence cards to pronounce that single word</span>
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
              placeholder="Search German (Guten Morgen, Ausfall, achttausendachtzig) or English..."
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
            <span className="text-[10px] font-bold font-mono">TOTAL: {VOCABULARY_LIST.length} ENTRIES</span>
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
            <span>All</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
              selectedCategory === 'all' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {VOCABULARY_LIST.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('greetings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'greetings'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-border-subtle shadow-2xs'
            }`}
          >
            <span>👋 Greetings</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold font-mono">
              {VOCABULARY_LIST.filter(v => v.category === 'greetings').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('numbers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'numbers'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-border-subtle shadow-2xs'
            }`}
          >
            <span>🔢 Numbers</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 text-[10px] font-bold font-mono">
              {VOCABULARY_LIST.filter(v => v.category === 'numbers').length}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory('general')}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'general'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-border-subtle shadow-2xs'
            }`}
          >
            <span>💬 General IT</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold font-mono">
              {VOCABULARY_LIST.filter(v => v.category === 'general').length}
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
        </div>
      </section>

      {/* SRS FLASHCARD MODE */}
      {viewMode === 'srs' && srsCurrentItem && (
        <section className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-2xl animate-fade-in">
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span className="font-mono">Card {srsIndex + 1} of {filteredVocab.length}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase text-[10px]">
                {srsCurrentItem.articleLabel} • {srsCurrentItem.category}
              </span>
            </div>

            {/* Flashcard Body */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full min-h-[300px] bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between items-center cursor-pointer transition-all shadow-xl relative group"
            >
              <div className="w-full flex justify-between items-center text-slate-500 text-xs">
                <span className="font-mono">{srsCurrentItem.grammaticalNote || 'DevOps Vocabulary'}</span>
                <span className="text-[11px] text-amber-400 group-hover:underline">Click card to flip ↻</span>
              </div>

              {!isFlipped ? (
                /* FRONT: German Word + Audio */
                <div className="my-auto space-y-3">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    {srsCurrentItem.word}
                  </h2>
                  <p className="text-emerald-400 font-mono text-sm">
                    {srsCurrentItem.ipa}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playWordAudio(srsCurrentItem, playbackSpeed);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      Listen ({playbackSpeed}x)
                    </button>
                  </div>
                </div>
              ) : (
                /* BACK: English, Tamil, and Sentence */
                <div className="my-auto space-y-4 text-left w-full">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">English:</span>
                    <p className="text-xl font-bold text-white">{srsCurrentItem.english}</p>
                  </div>

                  {isTamilActive && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">தமிழ்:</span>
                      <p className="text-base font-semibold text-slate-200">{srsCurrentItem.tamil}</p>
                      {srsCurrentItem.tamilTranslit && (
                        <p className="text-xs text-slate-400 italic">{srsCurrentItem.tamilTranslit}</p>
                      )}
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1">
                      Incident Context (Click words to listen):
                    </span>
                    <p className="text-sm font-medium text-slate-100">
                      "{srsCurrentItem.germanSentence}"
                    </p>
                    {renderInteractiveSentence(srsCurrentItem.germanSentence)}
                    <p className="text-xs text-slate-400 mt-2">
                      {srsCurrentItem.englishSentence}
                    </p>
                  </div>
                </div>
              )}

              <div className="w-full text-center text-[11px] text-slate-500">
                {isFlipped ? 'Rate your recall to schedule next repetition' : 'Test your active memory before flipping'}
              </div>
            </div>

            {/* SRS Action Buttons */}
            {isFlipped && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                <button
                  onClick={() => handleSrsRating(srsCurrentItem.id, 'again')}
                  className="py-2.5 px-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-all"
                >
                  🔴 Again (0 XP)
                </button>
                <button
                  onClick={() => handleSrsRating(srsCurrentItem.id, 'hard')}
                  className="py-2.5 px-2 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-300 text-xs font-bold transition-all"
                >
                  🟠 Hard (+5 XP)
                </button>
                <button
                  onClick={() => handleSrsRating(srsCurrentItem.id, 'good')}
                  className="py-2.5 px-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold transition-all"
                >
                  🟢 Good (+15 XP)
                </button>
                <button
                  onClick={() => handleSrsRating(srsCurrentItem.id, 'easy')}
                  className="py-2.5 px-2 rounded-xl bg-sky-950/60 hover:bg-sky-900 border border-sky-800 text-sky-300 text-xs font-bold transition-all"
                >
                  🔵 Easy (+25 XP)
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Displaying {filteredVocab.length} Lexicon Entries
            </span>
            <span className="text-xs text-slate-500">
              Click individual words in sentences to hear slow pronunciation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filteredVocab.map((item) => {
              const isBookmarked = stats.bookmarkedVocabIds.includes(item.id);
              const isSelected = selectedWord.id === item.id;
              const score = recordedScore[item.id];
              const isRecordingThis = recordingWordId === item.id;
              const mastery = stats.srsMastery?.[item.id];

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
                  {/* Card Top Meta */}
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
                      {mastery && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          mastery === 'easy' ? 'bg-sky-100 text-sky-800' :
                          mastery === 'good' ? 'bg-emerald-100 text-emerald-800' :
                          mastery === 'hard' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          SRS: {mastery}
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
                          playWordAudio(item, playbackSpeed);
                        }}
                        className="w-9 h-9 rounded-xl bg-slate-50 border border-border-subtle hover:bg-emerald-600 hover:text-white text-emerald-700 flex items-center justify-center transition-all shadow-2xs cursor-pointer shrink-0"
                        title={`Play German Audio (${playbackSpeed}x)`}
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

                  {/* Incident Context Log with Clickable Words */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-border-subtle flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-mono font-bold">
                      <span>{item.logContextTitle}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playSentenceAudio(item.germanSentence, playbackSpeed);
                        }}
                        className="text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 cursor-pointer font-bold"
                        title="Hear Full Sentence Audio"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>LISTEN LOG ({playbackSpeed}x)</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-900 font-medium font-sans leading-relaxed">
                      "{item.germanSentence}"
                    </p>

                    {/* Word-by-word interactive pronunciation tokens */}
                    {renderInteractiveSentence(item.germanSentence)}

                    <p className="text-xs text-slate-600 font-sans mt-1">
                      {item.englishSentence}
                    </p>

                    {isTamilActive && item.tamilSentence && (
                      <p className="text-xs text-slate-500 font-sans">
                        {item.tamilSentence}
                      </p>
                    )}
                  </div>

                  {/* Interactive Actions */}
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
                        <span>{isRecordingThis ? 'Listening...' : 'Record Voice'}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playWordAudio(item, 0.5);
                        }}
                        className="px-2.5 py-2 rounded-lg bg-white border border-border-subtle text-slate-700 hover:bg-slate-100 text-xs transition-colors shadow-2xs cursor-pointer font-bold"
                        title="Play 0.5x Slow Speed"
                      >
                        0.5x 🐢
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
      )}

      {/* Floating Audio Studio Dock */}
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
                if (isPlayingDock && !isPausedDock) {
                  handlePauseAudio();
                } else if (isPausedDock) {
                  resumeSpeech();
                  setIsPausedDock(false);
                  setIsPlayingDock(true);
                } else {
                  playWordAudio(selectedWord, playbackSpeed);
                }
              }}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs flex items-center justify-center cursor-pointer"
              title={isPlayingDock && !isPausedDock ? 'Pause' : 'Play Audio'}
              aria-label={isPlayingDock && !isPausedDock ? 'Pause' : 'Play Audio'}
            >
              {isPlayingDock && !isPausedDock ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
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
              {[0.5, 0.75, 1.0].map(spd => (
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
              onClick={() => playSentenceAudio(selectedWord.germanSentence, playbackSpeed)}
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
