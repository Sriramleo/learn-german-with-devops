import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  ChevronDown, 
  Award, 
  Zap, 
  Volume2, 
  VolumeX, 
  Languages, 
  Sun, 
  Bell, 
  LayoutDashboard, 
  BookOpen, 
  Code2, 
  Users, 
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { TabType, UserStats } from '../types';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  stats: UserStats;
  onToggleSound: () => void;
  onOpenStreakModal: () => void;
  onOpenQuizModal: () => void;
  onResetProgress?: () => void;
  isTamilActive?: boolean;
  onToggleTamil?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  stats,
  onToggleSound,
  onOpenStreakModal,
  onOpenQuizModal,
  onResetProgress,
  isTamilActive = true,
  onToggleTamil
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
        setResetConfirmOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [profileDropdownOpen]);

  const handleConfirmReset = () => {
    if (onResetProgress) {
      onResetProgress();
    }
    setResetConfirmOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border-subtle shadow-2xs">
        <div className="h-16 w-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 max-w-[1440px] mx-auto">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={() => onTabChange('dashboard')} 
              className="flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none group cursor-pointer"
              aria-label="DevDeutsch Home"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs font-mono font-bold text-sm tracking-tighter">
                DD
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg lg:text-xl font-sans">
                  DevDeutsch
                </span>
                <span className="hidden xs:inline-flex px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase font-mono">
                  DE • EN
                </span>
                <span className="hidden md:inline-flex px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold font-sans">
                  தமிழ்
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs (xl+) */}
          <nav className="hidden xl:flex items-center gap-1.5 shrink-0" aria-label="Main Navigation">
            {/* Dashboard */}
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-3 py-1.5 transition-all text-xs font-medium rounded-lg flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dashboard</span>
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStreakModal();
                }}
                className={`px-1.5 py-0.5 rounded font-bold text-[10px] cursor-pointer transition-colors ${
                  stats.streakDays > 0 
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                title="Daily Streak Tracker"
              >
                🔥 {stats.streakDays}D
              </span>
            </button>

            {/* Tech Vocab */}
            <button
              onClick={() => onTabChange('vocabulary')}
              className={`px-3 py-1.5 transition-all text-xs font-medium rounded-lg flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'vocabulary'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>Tech Vocab</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                activeTab === 'vocabulary' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : stats.techVocabLearned > 0
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {stats.techVocabLearned}
              </span>
            </button>

            {/* Sentence Lab */}
            <button
              onClick={() => onTabChange('sentence-lab')}
              className={`px-3 py-1.5 transition-all text-xs font-medium rounded-lg flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'sentence-lab'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sentence Lab</span>
              {stats.sentenceDrillsCompleted > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                  {stats.sentenceDrillsCompleted}
                </span>
              )}
            </button>

            {/* Interview & Daily */}
            <button
              onClick={() => onTabChange('interview-and-daily')}
              className={`px-3 py-1.5 transition-all text-xs font-medium rounded-lg flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'interview-and-daily'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Interview & Daily</span>
            </button>

            {/* Keyword & Phrase Dump */}
            <button
              onClick={() => onTabChange('phrase-dump')}
              className={`px-3 py-1.5 transition-all text-xs font-medium rounded-lg flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'phrase-dump'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Keyword & Phrase Dump</span>
            </button>

            {/* Tips & YouTube Guide (Zero-to-B1) */}
            <button
              onClick={() => onTabChange('learning-tips')}
              className={`px-3 py-1.5 transition-all text-xs font-medium rounded-lg flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'learning-tips'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tips & YouTube Guide</span>
              <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-700 text-[9px] font-bold uppercase font-mono">
                B1 🚀
              </span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Audio TTS DE/EN Toggle */}
            <button
              onClick={onToggleSound}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-50 border border-border-subtle text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
              title="Toggle Audio Engine (TTS)"
              aria-label="Toggle Audio Engine"
            >
              {stats.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span className="hidden md:inline text-[11px] text-slate-600 font-medium whitespace-nowrap">
                {stats.soundEnabled ? 'TTS: ON' : 'TTS: OFF'}
              </span>
            </button>

            {/* Tamil Glossing Toggle Button */}
            {onToggleTamil && (
              <button
                onClick={onToggleTamil}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors border border-border-subtle shadow-2xs cursor-pointer"
                title="Toggle Tamil Glossing & Translations"
                aria-label="Toggle Tamil Translations"
              >
                <Languages className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="hidden sm:inline text-[11px] text-slate-500 font-medium">தமிழ்</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border font-bold font-mono ${
                  isTamilActive 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {isTamilActive ? 'ON' : 'OFF'}
                </span>
              </button>
            )}

            {/* XP Progress Bar */}
            <div 
              onClick={onOpenQuizModal}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-border-subtle shadow-2xs cursor-pointer hover:border-amber-400 transition-colors"
              title="Click to take Progress Quiz"
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-1 text-amber-700 font-bold text-xs font-mono">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                <span>{stats.xp}/{stats.maxXp} XP</span>
              </div>
              <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (stats.xp / stats.maxXp) * 100)}%` }}
                />
              </div>
            </div>

            {/* Active Light Mode Badge */}
            <div 
              className="hidden 2xl:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-50 border border-border-subtle text-slate-700 shadow-2xs" 
              title="Theme: Light Mode Active"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-[10px] text-slate-600 font-bold uppercase font-mono">LIGHT</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={onOpenStreakModal}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-border-subtle transition-colors cursor-pointer"
              title="Daily Habits & Streak Alarm"
              aria-label="Daily Habits & Notifications"
            >
              <Bell className="w-4 h-4" />
              {stats.streakDays > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* User Profile Avatar with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 pl-0.5 cursor-pointer focus:outline-none p-1 rounded-lg hover:bg-slate-50 transition-colors"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
                aria-label="User profile menu"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH6h0k7zQlPbKIRPsnluq_1yT8NNiNrPGB6ybR-ZxA_7BVuR9als-YSuSo_OcPEcQ9Kmkth45xKZjBO24jiIHW7zRquE8fPu3924t4b0YZp73SEB9DIUpcglJVsFmCG2jxrZW-rPoiWQ87JxLTfereq4BMcIfZS-tg5kQgFs279N92osdv5tYlrGmmmuD7qRvdmGkZLvtFhEb_jAufbO9Uinl7fQOXgA1nTu5BdQjN7o70VY7FSOYS"
                  alt="Sriram Profile"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <div className="hidden 2xl:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 leading-tight">
                    Sriram S.
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Sr. DevOps / SRE
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Profile Dropdown Drawer */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] bg-white border border-border-subtle rounded-xl shadow-xl p-4 z-50 text-xs font-sans animate-in fade-in slide-in-from-top-2">
                  <div className="border-b border-border-subtle pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Sriram Sugavanam</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        {stats.interviewReadiness}% Ready
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">8+ Years AWS, K8s, CI/CD, Terraform</p>
                    <p className="text-amber-700 text-[10px] mt-1 font-semibold">
                      German {stats.readinessLevel} Track • Tamil & English
                    </p>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        onOpenQuizModal();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium text-slate-800">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>Take Progress Quiz</span>
                      </span>
                      <span className="text-emerald-600 font-mono font-bold">+25 XP</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenStreakModal();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-medium text-slate-800">
                        <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>Daily Streak Habits</span>
                      </span>
                      <span className="text-amber-700 font-mono font-bold">{stats.streakDays} Days</span>
                    </button>

                    {/* Reset Progress to 0 Action */}
                    {!resetConfirmOpen ? (
                      <button
                        onClick={() => setResetConfirmOpen(true)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-rose-50 text-left text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <RotateCcw className="w-4 h-4 text-slate-400" />
                          <span>Reset Stats to 0</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Start Fresh</span>
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 flex flex-col gap-1.5 animate-in fade-in">
                        <span className="font-bold text-[11px]">Reset all learning progress to 0?</span>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={handleConfirmReset}
                            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] cursor-pointer"
                          >
                            Yes, Reset to 0
                          </button>
                          <button
                            onClick={() => setResetConfirmOpen(false)}
                            className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border-subtle pt-2.5 mt-2.5 flex items-center justify-between text-slate-500">
                    <span>Target: Munich / Berlin</span>
                    <span className="text-sky-600 font-semibold">{stats.readinessLevel}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Bottom Navigation Bar (Fixed bottom on screens < xl) */}
      <nav 
        className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border-subtle px-2 py-1 shadow-lg flex items-center justify-around safe-area-bottom"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors cursor-pointer min-w-[56px] ${
            activeTab === 'dashboard' ? 'text-emerald-700 font-bold bg-emerald-50/60' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>

        <button
          onClick={() => onTabChange('vocabulary')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors cursor-pointer min-w-[56px] ${
            activeTab === 'vocabulary' ? 'text-emerald-700 font-bold bg-emerald-50/60' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px] font-medium">Vocab</span>
        </button>

        <button
          onClick={() => onTabChange('sentence-lab')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors cursor-pointer min-w-[56px] ${
            activeTab === 'sentence-lab' ? 'text-emerald-700 font-bold bg-emerald-50/60' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span className="text-[10px] font-medium">Sentence</span>
        </button>

        <button
          onClick={() => onTabChange('interview-and-daily')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors cursor-pointer min-w-[56px] ${
            activeTab === 'interview-and-daily' ? 'text-emerald-700 font-bold bg-emerald-50/60' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[10px] font-medium">Interview</span>
        </button>

        <button
          onClick={() => onTabChange('phrase-dump')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors cursor-pointer min-w-[56px] ${
            activeTab === 'phrase-dump' ? 'text-emerald-700 font-bold bg-emerald-50/60' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px] font-medium">Phrases</span>
        </button>

        <button
          onClick={() => onTabChange('learning-tips')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors cursor-pointer min-w-[56px] ${
            activeTab === 'learning-tips' ? 'text-amber-800 font-bold bg-amber-100' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-[10px] font-medium">Tips</span>
        </button>
      </nav>
    </>
  );
};
