import React, { useState, useMemo } from 'react';
import {
  Volume2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Search,
  X,
  Languages,
  Copy,
  Check,
  Filter,
  Play,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  Coffee,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Shuffle
} from 'lucide-react';
import { PatternItem, PatternCategory, UserStats } from '../types';
import { SPOKEN_PATTERNS_100 } from '../data/patternsData';
import { speakGerman, speakWord } from '../utils/speech';

interface PatternsViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  isTamilActive?: boolean;
  onToggleTamil?: () => void;
}

export const PatternsView: React.FC<PatternsViewProps> = ({
  stats,
  onUpdateStats,
  isTamilActive = true,
  onToggleTamil
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PatternCategory>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'A1' | 'A2' | 'B1'>('all');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [activePlaybackRate, setActivePlaybackRate] = useState<0.5 | 1.0>(1.0);
  const [contextMode, setContextMode] = useState<'devops' | 'anchor' | 'both'>('devops');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [expandedPatternIds, setExpandedPatternIds] = useState<Record<string, boolean>>({});
  const [spotlightPatternIndex, setSpotlightPatternIndex] = useState(0);

  const bookmarkedIds = stats.bookmarkedPhraseIds || [];

  // Toggle Bookmark
  const handleToggleBookmark = (id: string) => {
    const isCurrentlyBookmarked = bookmarkedIds.includes(id);
    const updated = isCurrentlyBookmarked
      ? bookmarkedIds.filter(item => item !== id)
      : [...bookmarkedIds, id];
    onUpdateStats({ bookmarkedPhraseIds: updated });
  };

  // Toggle drill expansion
  const toggleExpand = (id: string) => {
    setExpandedPatternIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Play audio for a sentence
  const handlePlayAudio = (id: string, text: string, rate: number = activePlaybackRate) => {
    setPlayingId(id);
    speakGerman(
      text,
      rate,
      () => setPlayingId(null),
      () => setPlayingId(null)
    );
  };

  // Copy text to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Pick random pattern for spotlight
  const handleShuffleSpotlight = () => {
    const randomIndex = Math.floor(Math.random() * SPOKEN_PATTERNS_100.length);
    setSpotlightPatternIndex(randomIndex);
  };

  // Filtered patterns
  const filteredPatterns = useMemo(() => {
    return SPOKEN_PATTERNS_100.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'all' && item.level !== selectedLevel) {
        return false;
      }
      // Bookmark filter
      if (showBookmarkedOnly && !bookmarkedIds.includes(item.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const numMatch = item.patternNumber.toString() === q || `#${item.patternNumber}` === q;
        const formulaMatch = item.formula.toLowerCase().includes(q);
        const anchorMatch = item.anchorGerman.toLowerCase().includes(q) || item.anchorEnglish.toLowerCase().includes(q);
        const devopsMatch = item.devopsGerman.toLowerCase().includes(q) || item.devopsEnglish.toLowerCase().includes(q);
        const tamilMatch = item.tamil.toLowerCase().includes(q) || (item.tamilTranslit && item.tamilTranslit.toLowerCase().includes(q));
        const grammarMatch = item.grammarNote.toLowerCase().includes(q);
        return numMatch || formulaMatch || anchorMatch || devopsMatch || tamilMatch || grammarMatch;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedLevel, showBookmarkedOnly, bookmarkedIds]);

  const spotlightPattern = SPOKEN_PATTERNS_100[spotlightPatternIndex] || SPOKEN_PATTERNS_100[0];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SPOKEN_PATTERNS_100.length };
    SPOKEN_PATTERNS_100.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Title */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700">
        <div className="absolute top-0 right-0 translate-x-12 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100 Spoken German Patterns · A1 to B1 Blueprint</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              100 Spoken Sentence Patterns
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Master the core conversational engine of spoken German. Every formula includes both the everyday anchor sentence from the workbook and an engineering context designed for DevOps, SRE, and tech standups in Germany.
            </p>
            {isTamilActive && (
              <p className="text-sky-300/90 text-xs sm:text-sm font-sans pt-1">
                அன்றாட ஜெர்மன் உரையாடல் மற்றும் டெவொப்ஸ் பணிகளுக்கான 100 முக்கிய வாக்கிய அமைப்புகள்.
              </p>
            )}
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-3 gap-2.5 bg-slate-800/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/80 shrink-0">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-emerald-400 font-mono">100</div>
              <div className="text-[11px] text-slate-400 font-medium">Patterns</div>
            </div>
            <div className="text-center px-2 border-x border-slate-700">
              <div className="text-2xl font-black text-sky-400 font-mono">5</div>
              <div className="text-[11px] text-slate-400 font-medium">Categories</div>
            </div>
            <div className="text-center px-2">
              <div className="text-2xl font-black text-amber-400 font-mono">A1–B1</div>
              <div className="text-[11px] text-slate-400 font-medium">CEFR Range</div>
            </div>
          </div>
        </div>
      </div>

      {/* Spotlight Feature: Pattern of the Moment */}
      {spotlightPattern && (
        <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-slate-50 border border-amber-200/80 rounded-2xl p-5 shadow-xs transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/60">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-xs">
                PATTERN #{String(spotlightPattern.patternNumber).padStart(2, '0')}
              </span>
              <span className="text-xs font-bold text-slate-800 font-mono bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs">
                {spotlightPattern.formula}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                {spotlightPattern.level}
              </span>
            </div>
            <button
              onClick={handleShuffleSpotlight}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-amber-50 text-slate-700 text-xs font-semibold border border-amber-300 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-600" />
              <span>Shuffle Next Pattern</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3.5">
            {/* DevOps Context */}
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" /> DevOps Context
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePlayAudio(`spot-dev-05-${spotlightPattern.id}`, spotlightPattern.devopsGerman, 0.5)}
                    className="p-1 rounded text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 text-[10px] font-bold font-mono cursor-pointer"
                    title="Play at 0.5x Slow"
                  >
                    0.5x
                  </button>
                  <button
                    onClick={() => handlePlayAudio(`spot-dev-10-${spotlightPattern.id}`, spotlightPattern.devopsGerman, 1.0)}
                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer"
                    title="Play at Normal Speed"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900">
                {spotlightPattern.devopsGerman}
              </p>
              <p className="text-xs text-slate-600 font-medium">
                {spotlightPattern.devopsEnglish}
              </p>
              {isTamilActive && (
                <p className="text-xs text-emerald-800 font-sans pt-0.5">
                  {spotlightPattern.tamil}
                </p>
              )}
            </div>

            {/* Daily Life Anchor */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5" /> Daily Life Anchor
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePlayAudio(`spot-anc-05-${spotlightPattern.id}`, spotlightPattern.anchorGerman, 0.5)}
                    className="p-1 rounded text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 text-[10px] font-bold font-mono cursor-pointer"
                    title="Play at 0.5x Slow"
                  >
                    0.5x
                  </button>
                  <button
                    onClick={() => handlePlayAudio(`spot-anc-10-${spotlightPattern.id}`, spotlightPattern.anchorGerman, 1.0)}
                    className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs cursor-pointer"
                    title="Play at Normal Speed"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900">
                {spotlightPattern.anchorGerman}
              </p>
              <p className="text-xs text-slate-600 font-medium">
                {spotlightPattern.anchorEnglish}
              </p>
              <p className="text-[11px] text-slate-500 italic">
                Rule: {spotlightPattern.grammarNote}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Controls & Filters */}
      <div className="bg-white rounded-2xl border border-border-subtle p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Bar & Mode Switches */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patterns (#01, formula, German, English, Tamil, grammar)..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Context Mode Toggle (DevOps vs Anchor vs Both) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0 self-start md:self-auto border border-slate-200/80">
            <button
              onClick={() => setContextMode('devops')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                contextMode === 'devops'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>DevOps Mode</span>
            </button>
            <button
              onClick={() => setContextMode('anchor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                contextMode === 'anchor'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Daily Anchor</span>
            </button>
            <button
              onClick={() => setContextMode('both')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                contextMode === 'both'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Speed Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 px-1.5">Speed:</span>
              <button
                onClick={() => setActivePlaybackRate(1.0)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono transition-all cursor-pointer ${
                  activePlaybackRate === 1.0 ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1.0x
              </button>
              <button
                onClick={() => setActivePlaybackRate(0.5)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono transition-all cursor-pointer ${
                  activePlaybackRate === 0.5 ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                0.5x Slow
              </button>
            </div>

            {/* Bookmark Filter */}
            <button
              onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                showBookmarkedOnly
                  ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Show Bookmarked Patterns Only"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            All Patterns ({categoryCounts['all'] || 100})
          </button>
          <button
            onClick={() => setSelectedCategory('foundations')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'foundations'
                ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            1. Foundations #01–#20 ({categoryCounts['foundations'] || 20})
          </button>
          <button
            onClick={() => setSelectedCategory('cases')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'cases'
                ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            2. Fixed Cases #21–#40 ({categoryCounts['cases'] || 20})
          </button>
          <button
            onClick={() => setSelectedCategory('daily')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'daily'
                ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            3. Daily Priorities #41–#60 ({categoryCounts['daily'] || 20})
          </button>
          <button
            onClick={() => setSelectedCategory('opinions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'opinions'
                ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            4. Opinions & Intentions #61–#80 ({categoryCounts['opinions'] || 20})
          </button>
          <button
            onClick={() => setSelectedCategory('social')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'social'
                ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            5. Questions & Social #81–#100 ({categoryCounts['social'] || 20})
          </button>
        </div>

        {/* Level Filters & Active Result Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">CEFR Level:</span>
            {(['all', 'A1', 'A2', 'B1'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2 py-0.5 rounded-md font-mono font-bold uppercase transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="text-slate-500 text-xs font-medium">
            Showing <strong className="text-slate-900 font-mono">{filteredPatterns.length}</strong> of 100 patterns
          </div>
        </div>
      </div>

      {/* Pattern Cards List */}
      <div className="space-y-4">
        {filteredPatterns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching patterns found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your search keywords or resetting the category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLevel('all');
                setShowBookmarkedOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredPatterns.map(pattern => {
            const isBookmarked = bookmarkedIds.includes(pattern.id);
            const isExpanded = !!expandedPatternIds[pattern.id];

            return (
              <div
                key={pattern.id}
                className="bg-white rounded-2xl border border-border-subtle shadow-xs hover:border-emerald-300/80 transition-all p-4 sm:p-5 space-y-4"
              >
                {/* Pattern Card Header */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-mono font-black text-xs">
                      #{String(pattern.patternNumber).padStart(2, '0')}
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {pattern.formula}
                    </span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {pattern.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Grammar Rule Tag */}
                    <span className="hidden sm:inline-block text-[11px] text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-100 italic">
                      {pattern.grammarNote}
                    </span>

                    {/* Bookmark */}
                    <button
                      onClick={() => handleToggleBookmark(pattern.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-100 border-amber-300 text-amber-700'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-amber-600 hover:bg-slate-50'
                      }`}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Pattern'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Grammar Rule for Mobile */}
                <div className="sm:hidden text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100 italic">
                  Rule: {pattern.grammarNote}
                </div>

                {/* Sentences Container: Switchable between DevOps, Anchor, or Both */}
                <div className={`grid gap-3.5 ${contextMode === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                  {/* DevOps Context Block */}
                  {(contextMode === 'devops' || contextMode === 'both') && (
                    <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/80 space-y-2 relative group">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1 font-mono">
                          <Cpu className="w-3 h-3" /> DevOps & Engineering Context
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(`dev-${pattern.id}`, pattern.devopsGerman)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
                            title="Copy sentence"
                          >
                            {copiedId === `dev-${pattern.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handlePlayAudio(`dev-05-${pattern.id}`, pattern.devopsGerman, 0.5)}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-600 hover:text-emerald-700 hover:bg-white border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                            title="Play Slow (0.5x)"
                          >
                            0.5x
                          </button>
                          <button
                            onClick={() => handlePlayAudio(`dev-10-${pattern.id}`, pattern.devopsGerman, 1.0)}
                            className={`p-1.5 rounded-lg text-white shadow-2xs transition-colors cursor-pointer ${
                              playingId === `dev-10-${pattern.id}` ? 'bg-emerald-800 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                            title="Play German Audio (1.0x)"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* German Sentence with Clickable Words for instant audio */}
                      <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug flex flex-wrap items-center gap-1.5">
                        {pattern.devopsGerman.split(' ').map((word, wIdx) => (
                          <span
                            key={wIdx}
                            onClick={() => speakWord(word, 0.75)}
                            className="hover:text-emerald-700 hover:underline hover:bg-emerald-100/60 px-0.5 py-0.2 rounded transition-colors cursor-pointer"
                            title={`Pronounce "${word}"`}
                          >
                            {word}
                          </span>
                        ))}
                      </div>

                      {/* English Meaning */}
                      <p className="text-xs sm:text-sm text-slate-600 font-medium">
                        {pattern.devopsEnglish}
                      </p>

                      {/* Tamil Meaning & Transliteration */}
                      {isTamilActive && (
                        <div className="pt-1 border-t border-emerald-200/50 space-y-0.5">
                          <p className="text-xs text-emerald-900 font-sans font-medium">
                            {pattern.tamil}
                          </p>
                          {pattern.tamilTranslit && (
                            <p className="text-[11px] text-slate-500 font-sans italic">
                              {pattern.tamilTranslit}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Daily Life Anchor Block */}
                  {(contextMode === 'anchor' || contextMode === 'both') && (
                    <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-200/80 space-y-2 relative group">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1 font-mono">
                          <Coffee className="w-3 h-3" /> Daily Life Anchor
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(`anc-${pattern.id}`, pattern.anchorGerman)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
                            title="Copy sentence"
                          >
                            {copiedId === `anc-${pattern.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handlePlayAudio(`anc-05-${pattern.id}`, pattern.anchorGerman, 0.5)}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-600 hover:text-indigo-700 hover:bg-white border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                            title="Play Slow (0.5x)"
                          >
                            0.5x
                          </button>
                          <button
                            onClick={() => handlePlayAudio(`anc-10-${pattern.id}`, pattern.anchorGerman, 1.0)}
                            className={`p-1.5 rounded-lg text-white shadow-2xs transition-colors cursor-pointer ${
                              playingId === `anc-10-${pattern.id}` ? 'bg-indigo-800 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                            title="Play German Audio (1.0x)"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* German Sentence */}
                      <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug flex flex-wrap items-center gap-1.5">
                        {pattern.anchorGerman.split(' ').map((word, wIdx) => (
                          <span
                            key={wIdx}
                            onClick={() => speakWord(word, 0.75)}
                            className="hover:text-indigo-700 hover:underline hover:bg-indigo-100/60 px-0.5 py-0.2 rounded transition-colors cursor-pointer"
                            title={`Pronounce "${word}"`}
                          >
                            {word}
                          </span>
                        ))}
                      </div>

                      {/* English Meaning */}
                      <p className="text-xs sm:text-sm text-slate-600 font-medium">
                        {pattern.anchorEnglish}
                      </p>

                      <div className="pt-1 border-t border-indigo-200/50">
                        <span className="text-[11px] text-indigo-900/80 font-mono">
                          Formula Anchor: {pattern.formula}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* "Your Turn" Practice Recitation Drills */}
                {pattern.yourTurnPrompts && pattern.yourTurnPrompts.length > 0 && (
                  <div className="pt-2">
                    <button
                      onClick={() => toggleExpand(pattern.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        {isExpanded ? 'Hide' : 'Show'} "Your Turn" Practice Drills ({pattern.yourTurnPrompts.length} variations)
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Train Your Mouth · Say These Out Loud:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {pattern.yourTurnPrompts.map((drill, dIdx) => (
                            <div
                              key={dIdx}
                              className="p-2.5 rounded-lg bg-white border border-slate-200/80 hover:border-emerald-300 shadow-2xs flex items-center justify-between gap-2"
                            >
                              <span className="text-xs font-medium text-slate-800">
                                {drill}
                              </span>
                              <button
                                onClick={() => handlePlayAudio(`drill-${pattern.id}-${dIdx}`, drill, 0.9)}
                                className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
                                title="Listen to drill"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
