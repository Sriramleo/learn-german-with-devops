import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Volume2, 
  Mic, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  BookOpen, 
  Bookmark,
  CheckCircle2, 
  Info, 
  Sparkles,
  Terminal,
  Clock
} from 'lucide-react';
import { VocabItem, VocabCategory, UserStats } from '../types';
import { VOCABULARY_LIST } from '../data/vocabData';
import { speakGerman, speakTamil, stopSpeech } from '../utils/speech';

interface VocabViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

export const VocabView: React.FC<VocabViewProps> = ({
  stats,
  onUpdateStats
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
        phoneticsHours: parseFloat((stats.phoneticsHours + 0.1).toFixed(1))
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
    <div className="w-full flex flex-col gap-6 max-w-[1440px] mx-auto pb-32">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200">
              SRE-01 RUNBOOK
            </span>
            <span className="text-slate-400 font-mono text-xs">•</span>
            <span className="text-slate-600 font-mono text-xs">
              TECHNICAL GERMAN FOR CLOUD PLATFORM ENGINEERS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            DevOps Lexicon: Core Vocabulary <span className="text-slate-500 text-lg font-normal">/ கணிணி சொல்வங்கி</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-600 shadow-xs">
            Showing <strong className="text-emerald-700">{filteredVocab.length}</strong> of {VOCABULARY_LIST.length} Words
          </span>
        </div>
      </div>

      {/* Search & Category Filter Row */}
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by German, English, or Tamil (e.g. Ausfall, Bottleneck, முடக்கம், Bereitstellung)..."
            className="w-full pl-12 pr-10 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 transition-colors font-sans text-sm md:text-base shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-slate-700"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
          {[
            { id: 'all', label: `All (${VOCABULARY_LIST.length})` },
            { id: 'k8s', label: 'Kubernetes & Cloud' },
            { id: 'cicd', label: 'CI/CD & Git' },
            { id: 'sre', label: 'Monitoring & SRE' },
            { id: 'security', label: 'Security & IAM' },
            { id: 'standup', label: 'Daily Standup' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as VocabCategory)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: 8 Columns Word Cards + 4 Columns Right Grammar Cheat Sheets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Vocabulary Word Cards Grid */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {filteredVocab.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-900 font-mono text-sm">No vocabulary found for "{searchQuery}"</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-3 px-4 py-1.5 rounded-lg bg-slate-900 text-white font-mono text-xs shadow-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredVocab.map((item) => {
              const isBookmarked = stats.bookmarkedVocabIds.includes(item.id);
              const isSelected = selectedWord.id === item.id;
              const isRecordingThis = recordingWordId === item.id;
              const recordedScoreVal = recordedScore[item.id];

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl bg-white border transition-all shadow-xs flex flex-col gap-4 relative group ${
                    isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header: Gender badge, Word, IPA, Audio Trigger, Bookmark */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Gender Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-extrabold uppercase border ${
                            item.gender === 'DER'
                              ? 'bg-sky-50 text-sky-700 border-sky-200'
                              : item.gender === 'DIE'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {item.articleLabel}
                        </span>

                        {item.grammaticalNote && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200">
                            {item.grammaticalNote}
                          </span>
                        )}

                        <span className="text-slate-500 font-mono text-[11px]">
                          {item.plural}
                        </span>
                      </div>

                      {/* Main Word */}
                      <div className="flex items-baseline gap-3 mt-1 flex-wrap">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                          {item.word}
                        </h2>
                        <span className="font-mono text-xs text-slate-500">
                          {item.ipa}
                        </span>
                      </div>
                    </div>

                    {/* Audio & Bookmark Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => playWordAudio(item, 1.0)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-700 border border-slate-200 transition-colors shadow-xs"
                        title="Listen Normal Speed (1.0x)"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => playWordAudio(item, 0.75)}
                        className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-sky-700 font-mono text-[11px] border border-slate-200 transition-colors shadow-xs"
                        title="Slow Speed (0.75x)"
                      >
                        0.75x
                      </button>

                      <button
                        onClick={() => toggleBookmark(item.id)}
                        className={`p-2 rounded-xl border transition-colors shadow-xs ${
                          isBookmarked
                            ? 'bg-amber-50 text-amber-600 border-amber-300'
                            : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-600'
                        }`}
                        title={isBookmarked ? 'Bookmarked' : 'Bookmark word'}
                      >
                        <Bookmark className="w-4 h-4" fill={isBookmarked ? '#d97706' : 'transparent'} />
                      </button>
                    </div>
                  </div>

                  {/* Dual Translations (English + Tamil with Transliteration) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <span className="font-mono text-[10px] text-sky-700 font-bold block uppercase mb-0.5">
                        ENGLISH
                      </span>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.english}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-amber-700 font-bold block uppercase mb-0.5">
                          தமிழ் (TAMIL)
                        </span>
                        <button
                          onClick={() => playTamilAudio(item.tamil)}
                          className="text-[10px] font-mono text-amber-700 hover:underline"
                        >
                          🔊 உச்சரிப்பு
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.tamil}
                      </p>
                      {item.tamilTranslit && (
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {item.tamilTranslit}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Enterprise Log Context / Real Workplace Sentence */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
                    <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-emerald-600" />
                        {item.logContextTitle}
                      </span>
                      <button
                        onClick={() => playSentenceAudio(item)}
                        className="flex items-center gap-1 text-sky-700 hover:underline"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen Sentence</span>
                      </button>
                    </div>

                    <p className="font-mono text-xs md:text-sm text-slate-900 leading-relaxed">
                      "{item.germanSentence.split(item.highlightWord)[0]}
                      <span className="text-emerald-700 font-bold underline decoration-emerald-500">
                        {item.highlightWord}
                      </span>
                      {item.germanSentence.split(item.highlightWord)[1]}"
                    </p>

                    <div className="text-xs text-slate-600 border-t border-slate-200 pt-2 flex flex-col gap-1">
                      <p>
                        <strong className="text-slate-400 font-mono text-[10px]">EN:</strong> {item.englishSentence}
                      </p>
                      <p>
                        <strong className="text-slate-400 font-mono text-[10px]">TA:</strong> {item.tamilSentence}
                      </p>
                    </div>
                  </div>

                  {/* Pronunciation Recording Test Row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRecordPractice(item)}
                        disabled={isRecordingThis}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold border transition-all shadow-xs ${
                          isRecordingThis
                            ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                            : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isRecordingThis ? 'Listening in German...' : 'Record Voice Test'}</span>
                      </button>

                      {recordedScoreVal && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {recordedScoreVal}% Match
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-xs text-slate-500 flex items-center gap-2">
                      <span>Benchmark: <strong className="text-amber-700">{item.pronunciationBenchmark}%</strong></span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">{item.feedbackTip}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Sidebar: Gender Rules, German-Tamil Bridge & Weekly Goals */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* German Suffix Gender Cheat Sheet */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-mono text-sm font-bold text-slate-900 uppercase tracking-wider">
                DevOps Suffix Cheat Sheet
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              95% of technical German nouns follow these reliable ending patterns:
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between">
                <span className="text-rose-700 font-bold">DIE (-ung, -keit, -heit)</span>
                <span className="text-slate-600">Bereitstellung, Skalierbarkeit</span>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-200/80 flex items-center justify-between">
                <span className="text-sky-700 font-bold">DER (-er, -or, -fall)</span>
                <span className="text-slate-600">Lastverteiler, Ausfall, Blocker</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
                <span className="text-emerald-700 font-bold">DAS (-ment, -ing, -tool)</span>
                <span className="text-slate-600">Deployment, Tool, Peering</span>
              </div>
            </div>
          </div>

          {/* German-Tamil Grammar Bridge */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <h3 className="font-mono text-sm font-bold text-slate-900 uppercase tracking-wider">
                German ⇄ Tamil Bridge
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Tamil and German share an intuitive structural pattern in dependent clauses: <strong>the main verb locks at the phrase conclusion (SOV)!</strong>
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 font-mono text-xs">
              <div className="text-sky-800">
                🇩🇪 "... weil der Worker-Node <span className="text-emerald-700 font-bold">abgestürzt ist</span>."
              </div>
              <div className="text-amber-800">
                🇮🇳 "... ஒர்க்கர் நோட் <span className="text-emerald-700 font-bold">செயலிழந்ததால்</span>."
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Unlike English (which puts verb before object), both Tamil and German subordinate grammar delay the action word until the predicate terminates.
            </p>
          </div>

          {/* Weekly Pronunciation Goal Tracker */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-slate-900">
                Weekly Vocab Audio Goal
              </span>
              <span className="font-mono text-xs text-emerald-700 font-bold">
                {stats.techVocabLearned} / 50 Words
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Maintain your daily Bavarian tech accent score above 85% to unlock mock interview sessions.
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3 border border-slate-200/60">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (stats.techVocabLearned / 50) * 100)}%` }} 
              />
            </div>
            <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>3 days remaining in current sprint</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Audio Player Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg py-3 px-4 text-slate-900">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Active Word Info */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-emerald-700 shrink-0 font-mono text-xs font-bold shadow-xs">
              {selectedWord.gender}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-900 truncate">
                  {selectedWord.word}
                </span>
                <span className="font-mono text-xs text-slate-500 hidden sm:inline">
                  {selectedWord.ipa}
                </span>
              </div>
              <p className="text-xs text-slate-600 truncate">
                {selectedWord.english} • <span className="text-amber-700">{selectedWord.tamil}</span>
              </p>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevWord}
              className="p-2 text-slate-500 hover:text-slate-800 transition-colors"
              title="Previous Word"
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
              className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-all shadow-xs"
              title={isPlayingDock ? 'Pause' : 'Play German Audio'}
            >
              {isPlayingDock ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>

            <button
              onClick={handleNextWord}
              className="p-2 text-slate-500 hover:text-slate-800 transition-colors"
              title="Next Word"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Loop Toggle */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2 rounded-lg border transition-colors ${
                isLooping
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'text-slate-400 border-transparent hover:text-slate-700'
              }`}
              title="Repeat Loop"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Speed & Tamil Tooltip Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 font-mono text-xs">
              {[0.75, 1.0, 1.25].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    setPlaybackSpeed(spd);
                    if (isPlayingDock) playWordAudio(selectedWord, spd);
                  }}
                  className={`px-2 py-1 rounded transition-colors ${
                    playbackSpeed === spd
                      ? 'bg-white text-emerald-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              onClick={() => playTamilAudio(selectedWord.tamil)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-amber-700 font-mono text-xs border border-slate-200 transition-colors flex items-center gap-1 shadow-xs"
              title="Play Tamil Meaning Voice"
            >
              <span>தமிழ் TTS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
