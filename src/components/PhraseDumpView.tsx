import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Volume2, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  AlertCircle, 
  Terminal, 
  MessageSquare, 
  GitPullRequest, 
  Layers, 
  Coffee, 
  BookOpen, 
  Printer, 
  Share2,
  X,
  Radio
} from 'lucide-react';
import { PhraseItem, PhraseCategory, UserStats } from '../types';
import { DEVOPS_PHRASES } from '../data/phraseData';
import { speakGerman } from '../utils/speech';

interface PhraseDumpViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

export const PhraseDumpView: React.FC<PhraseDumpViewProps> = ({
  stats,
  onUpdateStats
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PhraseCategory>('all');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);

  const bookmarkedIds = stats.bookmarkedPhraseIds || [];

  // Toggle Bookmark
  const handleToggleBookmark = (id: string) => {
    const isCurrentlyBookmarked = bookmarkedIds.includes(id);
    const updated = isCurrentlyBookmarked
      ? bookmarkedIds.filter(item => item !== id)
      : [...bookmarkedIds, id];
    onUpdateStats({ bookmarkedPhraseIds: updated });
  };

  // Play Speech
  const handlePlayAudio = (phrase: PhraseItem) => {
    setPlayingId(phrase.id);
    setActiveSpeechText(phrase.german);
    speakGerman(
      phrase.german, 
      0.95, 
      () => {
        setPlayingId(null);
        setActiveSpeechText(null);
      },
      () => {
        setPlayingId(null);
        setActiveSpeechText(null);
      }
    );
  };

  // Copy to Clipboard
  const handleCopyText = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Filter Phrases
  const filteredPhrases = useMemo(() => {
    return DEVOPS_PHRASES.filter(phrase => {
      // Category filter
      if (selectedCategory !== 'all' && phrase.category !== selectedCategory) {
        return false;
      }
      // Bookmark filter
      if (showBookmarkedOnly && !bookmarkedIds.includes(phrase.id)) {
        return false;
      }
      // Search query
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        phrase.german.toLowerCase().includes(query) ||
        phrase.english.toLowerCase().includes(query) ||
        phrase.tamil.toLowerCase().includes(query) ||
        phrase.tamilTranslit.toLowerCase().includes(query) ||
        phrase.scenarioTag.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, selectedCategory, showBookmarkedOnly, bookmarkedIds]);

  // Categories metadata
  const categories: { id: PhraseCategory; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'all', label: 'All Phrases', icon: <Terminal className="w-3.5 h-3.5" />, count: DEVOPS_PHRASES.length },
    { id: 'incident', label: 'P1/P2 Incidents', icon: <AlertCircle className="w-3.5 h-3.5 text-rose-500" />, count: DEVOPS_PHRASES.filter(p => p.category === 'incident').length },
    { id: 'standup', label: 'Daily Standup', icon: <MessageSquare className="w-3.5 h-3.5 text-blue-500" />, count: DEVOPS_PHRASES.filter(p => p.category === 'standup').length },
    { id: 'codereview', label: 'PR & Code Review', icon: <GitPullRequest className="w-3.5 h-3.5 text-emerald-500" />, count: DEVOPS_PHRASES.filter(p => p.category === 'codereview').length },
    { id: 'architecture', label: 'Architecture & HA', icon: <Layers className="w-3.5 h-3.5 text-indigo-500" />, count: DEVOPS_PHRASES.filter(p => p.category === 'architecture').length },
    { id: 'workplace', label: 'Office & Coffee', icon: <Coffee className="w-3.5 h-3.5 text-amber-500" />, count: DEVOPS_PHRASES.filter(p => p.category === 'workplace').length },
    { id: 'idioms', label: 'German Idioms', icon: <Sparkles className="w-3.5 h-3.5 text-purple-500" />, count: DEVOPS_PHRASES.filter(p => p.category === 'idioms').length },
  ];

  return (
    <div className="py-6 space-y-6 max-w-[1440px] mx-auto">
      {/* Top Banner & Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-mono font-semibold border border-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                Phrasenlexikon · DE • EN • தமிழ்
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-mono">
                B2 Professional SRE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
              DevOps & SRE German Phrase Dump
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              Curated quick-reference cheatsheet of mission-critical engineering sentences, live incident callouts, standup status updates, and architectural idioms with native audio and Tamil transliteration.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-medium flex items-center gap-2 transition-all shadow-xs ${
                showBookmarkedOnly
                  ? 'bg-amber-50 text-amber-700 border-amber-300 font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${showBookmarkedOnly ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
              <span>Saved ({bookmarkedIds.length})</span>
            </button>

            <button
              onClick={() => window.print()}
              className="hidden sm:flex px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-mono font-medium items-center gap-2 transition-all shadow-xs"
              title="Print or export cheat sheet to PDF"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Export Cheatsheet</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Total Phrases</span>
            <span className="text-lg font-bold font-mono text-slate-900">{DEVOPS_PHRASES.length} Curated</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/60">
            <span className="text-[11px] font-mono text-rose-600 uppercase tracking-wider block">Incident Ready</span>
            <span className="text-lg font-bold font-mono text-rose-700">P1 / P2 Severity</span>
          </div>
          <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-200/60">
            <span className="text-[11px] font-mono text-sky-600 uppercase tracking-wider block">Audio Synthesis</span>
            <span className="text-lg font-bold font-mono text-sky-700">German DE-99</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
            <span className="text-[11px] font-mono text-emerald-600 uppercase tracking-wider block">Tamil Bridge</span>
            <span className="text-lg font-bold font-mono text-emerald-700">100% Localized</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Control Bar */}
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, German phrases, English meanings, or Tamil transliterations..."
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 shrink-0 transition-all border shadow-xs ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phrases Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Showing {filteredPhrases.length} matching phrases</span>
          {showBookmarkedOnly && <span className="text-amber-600 font-semibold">• Filtered by Bookmarks</span>}
        </div>

        {filteredPhrases.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-semibold text-slate-800">No phrases found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or select a different category from above.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setShowBookmarkedOnly(false); }}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPhrases.map((phrase) => {
              const isBookmarked = bookmarkedIds.includes(phrase.id);
              const isPlaying = playingId === phrase.id;
              const isCopied = copiedId === phrase.id;

              return (
                <div
                  key={phrase.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between group ${
                    phrase.urgencyLevel === 'critical'
                      ? 'border-rose-200 hover:border-rose-300'
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Tag + Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold uppercase tracking-wider border ${
                          phrase.urgencyLevel === 'critical'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : phrase.category === 'standup'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : phrase.category === 'codereview'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : phrase.category === 'architecture'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : phrase.category === 'idioms'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {phrase.scenarioTag}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          #{phrase.id}
                        </span>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-1">
                        {/* Audio Speak */}
                        <button
                          onClick={() => handlePlayAudio(phrase)}
                          disabled={isPlaying}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isPlaying
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-300 animate-pulse'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                          }`}
                          title="Listen to German Pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        {/* Copy to Clipboard */}
                        <button
                          onClick={() => handleCopyText(phrase.german, phrase.id)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isCopied
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                          title="Copy German text to clipboard"
                        >
                          {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>

                        {/* Bookmark */}
                        <button
                          onClick={() => handleToggleBookmark(phrase.id)}
                          className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all"
                          title={isBookmarked ? 'Remove Bookmark' : 'Save to Personal Cheatsheet'}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* German Sentence */}
                    <div className="font-mono text-base font-bold text-slate-900 leading-snug">
                      {phrase.german}
                    </div>

                    {/* English Translation */}
                    <div className="text-sm text-slate-600 flex items-start gap-1.5">
                      <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider shrink-0 mt-0.5">EN:</span>
                      <span>{phrase.english}</span>
                    </div>

                    {/* Tamil Translation & Transliteration */}
                    <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                      <div className="text-xs font-semibold text-slate-800 leading-relaxed">
                        <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase mr-1.5">தமிழ்:</span>
                        {phrase.tamil}
                      </div>
                      <div className="text-[11px] text-slate-500 italic">
                        {phrase.tamilTranslit}
                      </div>
                    </div>

                    {/* Pro-Tip / Grammar Note */}
                    {phrase.proTip && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200/50 flex items-start gap-2 text-xs text-emerald-800 leading-relaxed">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{phrase.proTip}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Audio Status Dock if playing */}
      {activeSpeechText && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Now Playing</span>
            <span className="text-xs font-mono font-medium max-w-sm truncate text-emerald-300">{activeSpeechText}</span>
          </div>
        </div>
      )}
    </div>
  );
};
