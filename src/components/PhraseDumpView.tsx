import React, { useState, useMemo } from 'react';
import { 
  Volume2, 
  Copy, 
  Check, 
  Bookmark, 
  Sparkles, 
  AlertCircle, 
  Terminal, 
  MessageSquare, 
  GitPullRequest, 
  Layers, 
  Coffee, 
  Star,
  Search,
  X,
  Languages,
  Download,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import { PhraseItem, PhraseCategory, UserStats } from '../types';
import { DEVOPS_PHRASES } from '../data/phraseData';
import { speakGerman } from '../utils/speech';

interface PhraseDumpViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  isTamilActive?: boolean;
  onToggleTamil?: () => void;
}

export const PhraseDumpView: React.FC<PhraseDumpViewProps> = ({
  stats,
  onUpdateStats,
  isTamilActive = true,
  onToggleTamil
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PhraseCategory>('all');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

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
    speakGerman(
      phrase.german, 
      0.95, 
      () => {
        setPlayingId(null);
      }, 
      () => {
        setPlayingId(null);
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

  // Export Trigger
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(DEVOPS_PHRASES, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "devdeutsch_phrases.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter Phrases
  const filteredPhrases = useMemo(() => {
    return DEVOPS_PHRASES.filter(phrase => {
      if (selectedCategory !== 'all' && phrase.category !== selectedCategory) {
        return false;
      }
      if (showBookmarkedOnly && !bookmarkedIds.includes(phrase.id)) {
        return false;
      }
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

  const categories: { id: PhraseCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Phrases', count: DEVOPS_PHRASES.length },
    { id: 'greetings', label: '👋 Greetings', count: DEVOPS_PHRASES.filter(p => p.category === 'greetings').length },
    { id: 'numbers', label: '🔢 Numbers & Metrics', count: DEVOPS_PHRASES.filter(p => p.category === 'numbers').length },
    { id: 'general', label: '💬 General IT & Basics', count: DEVOPS_PHRASES.filter(p => p.category === 'general').length },
    { id: 'incident', label: '🚨 P1/P2 Incidents', count: DEVOPS_PHRASES.filter(p => p.category === 'incident').length },
    { id: 'standup', label: '☕ Daily Standup', count: DEVOPS_PHRASES.filter(p => p.category === 'standup').length },
    { id: 'codereview', label: '🔍 PR & Code Review', count: DEVOPS_PHRASES.filter(p => p.category === 'codereview').length },
    { id: 'architecture', label: '🏗️ Architecture & HA', count: DEVOPS_PHRASES.filter(p => p.category === 'architecture').length },
    { id: 'workplace', label: '🏢 Office & Coffee', count: DEVOPS_PHRASES.filter(p => p.category === 'workplace').length },
    { id: 'idioms', label: '💡 German Idioms', count: DEVOPS_PHRASES.filter(p => p.category === 'idioms').length },
  ];

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 max-w-[1320px] mx-auto pb-20">
      {/* Top Context & Search Section */}
      <section className="w-full p-4 sm:p-6 bg-white border border-border-subtle shadow-xs rounded-2xl flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Directory // Level: B1-C1 DevOps
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600">{DEVOPS_PHRASES.length} Indexed Workplace Entries</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight font-sans">
              DevOps & Workplace German Phrase Dump
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-sans">
              Quick-reference directory for daily office rituals, sprint scheduling, Slack communication, and production-grade cloud native terminology.
            </p>
          </div>

          {/* Global Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Master Tamil Visibility Switch */}
            {onToggleTamil && (
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-border-subtle shadow-2xs" title="Enable optional Tamil pronunciation & meanings">
                <Languages className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-900 font-sans">Tamil (தமிழ்)</span>
                  <span className="text-[9px] text-slate-500 font-mono">Glossing</span>
                </div>
                <button
                  onClick={onToggleTamil}
                  className={`ml-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono border transition-colors cursor-pointer ${
                    isTamilActive 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  {isTamilActive ? 'ON' : 'OFF'}
                </button>
              </div>
            )}

            {/* View Mode Toggle: Grid vs Table */}
            <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-border-subtle shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-emerald-800 shadow-2xs border border-border-subtle'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-emerald-800 shadow-2xs border border-border-subtle'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tabular View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>

            {/* Export JSON Button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-border-subtle text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              title="Download JSON Cheatsheet"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar: Search Bar + Bookmark Switch */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-slate-50 p-2 rounded-xl border border-border-subtle shadow-2xs">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter phrases (e.g., 'Bereitstellung', 'Ausfall', 'PR', 'Standup', 'அவசர நிலை')..."
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

          <div className="flex items-center gap-2 shrink-0">
            {/* Show Bookmarked Switch */}
            <button
              onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors border shadow-2xs cursor-pointer ${
                showBookmarkedOnly
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-border-subtle hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showBookmarkedOnly ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
              <span>Bookmarked ({bookmarkedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-border-subtle shadow-2xs'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                selectedCategory === cat.id ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Phrase Content Area */}
      {viewMode === 'grid' ? (
        /* GRID VIEW */
        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Showing {filteredPhrases.length} Phrases
            </span>
            <span className="text-xs text-slate-500">
              Click speaker to listen or copy to clipboard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filteredPhrases.map((item) => {
              const isBookmarked = bookmarkedIds.includes(item.id);
              const isCopied = copiedId === item.id;
              const isPlaying = playingId === item.id;

              return (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-border-subtle shadow-xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between gap-4"
                >
                  {/* Top Meta */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold font-mono">
                      {item.scenarioTag}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyText(item.german, item.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        title="Copy German Text"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleToggleBookmark(item.id)}
                        className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Phrase'}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* German Phrase Core */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm sm:text-base font-bold text-slate-900 font-sans leading-relaxed">
                        "{item.german}"
                      </p>
                      <div className="flex items-center gap-1 shrink-0 mt-0.5">
                        <button
                          onClick={() => speakGerman(item.german, 0.5)}
                          className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 text-[10px] font-bold transition-all cursor-pointer"
                          title="Play 0.5x Slow Audio"
                        >
                          0.5x 🐢
                        </button>
                        <button
                          onClick={() => handlePlayAudio(item)}
                          disabled={isPlaying}
                          className="w-8 h-8 rounded-xl bg-slate-50 border border-border-subtle hover:bg-emerald-600 hover:text-white text-emerald-700 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                          title="Play German Pronunciation (1.0x)"
                        >
                          <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-emerald-600' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Translations Container */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-border-subtle flex flex-col gap-1.5 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] text-sky-700 font-bold uppercase font-mono shrink-0 mt-0.5">EN:</span>
                      <p className="text-slate-800 font-medium font-sans">
                        {item.english}
                      </p>
                    </div>

                    {isTamilActive && item.tamil && (
                      <div className="flex items-start gap-2 pt-1 border-t border-border-subtle">
                        <span className="text-[10px] text-amber-700 font-bold uppercase font-mono shrink-0 mt-0.5">தமிழ்:</span>
                        <div className="flex flex-col">
                          <p className="text-slate-700 font-sans">
                            {item.tamil}
                          </p>
                          {item.tamilTranslit && (
                            <p className="text-[10px] text-slate-500 italic mt-0.5">
                              {item.tamilTranslit}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pro Tip Callout if present */}
                  {item.proTip && (
                    <div className="text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 font-sans">
                      💡 <strong>Pro Tip:</strong> {item.proTip}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        /* TABLE VIEW */
        <section className="w-full bg-white rounded-2xl border border-border-subtle shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-slate-50 border-b border-border-subtle text-[11px] uppercase tracking-wider font-mono text-slate-500">
                <tr>
                  <th className="p-3.5 sm:p-4">Context Tag</th>
                  <th className="p-3.5 sm:p-4">German Phrase (DE)</th>
                  <th className="p-3.5 sm:p-4">English (EN)</th>
                  {isTamilActive && <th className="p-3.5 sm:p-4">Tamil (தமிழ்)</th>}
                  <th className="p-3.5 sm:p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredPhrases.map((item) => {
                  const isBookmarked = bookmarkedIds.includes(item.id);
                  const isCopied = copiedId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 sm:p-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {item.scenarioTag}
                        </span>
                      </td>
                      <td className="p-3.5 sm:p-4 font-bold text-slate-900 min-w-[200px]">
                        "{item.german}"
                      </td>
                      <td className="p-3.5 sm:p-4 text-slate-700 min-w-[180px]">
                        {item.english}
                      </td>
                      {isTamilActive && (
                        <td className="p-3.5 sm:p-4 text-slate-600 min-w-[180px]">
                          {item.tamil}
                        </td>
                      )}
                      <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handlePlayAudio(item)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-border-subtle transition-colors cursor-pointer"
                            title="Play German Pronunciation"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCopyText(item.german, item.id)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-border-subtle transition-colors cursor-pointer"
                            title="Copy German Text"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleToggleBookmark(item.id)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-400 hover:text-amber-500 border border-border-subtle transition-colors cursor-pointer"
                            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Phrase'}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
