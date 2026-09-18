import React, { useState } from 'react';
import { 
  Terminal, 
  Flame, 
  Volume2, 
  VolumeX, 
  Zap, 
  Bell, 
  ChevronDown, 
  BookOpen, 
  Layers, 
  MessageSquare,
  Award,
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
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  stats,
  onToggleSound,
  onOpenStreakModal,
  onOpenQuizModal
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onTabChange('dashboard')} 
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-slate-800 transition-colors shadow-xs">
              <Terminal className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold tracking-tight text-slate-900">
                DevDeutsch
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono tracking-wider uppercase font-semibold border border-slate-200">
                DE • EN • தமிழ்
              </span>
            </div>
          </button>
        </div>

        {/* Main Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1">
          {/* Dashboard */}
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-1.5 transition-all flex items-center gap-1.5 font-mono text-xs rounded-xl ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Dashboard / பலகை</span>
            <span 
              onClick={(e) => {
                e.stopPropagation();
                onOpenStreakModal();
              }}
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono flex items-center gap-1 transition-colors ${
                activeTab === 'dashboard' ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-amber-600'
              }`}
              title="Daily Streak Tracker"
            >
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" /> {stats.streakDays}D
            </span>
          </button>

          {/* Vocabulary */}
          <button
            onClick={() => onTabChange('vocabulary')}
            className={`px-3 py-1.5 transition-all flex items-center gap-1.5 font-mono text-xs rounded-xl ${
              activeTab === 'vocabulary'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tech Vocab / சொல்வங்கி</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
              activeTab === 'vocabulary' ? 'bg-slate-800 text-sky-300' : 'bg-slate-100 text-slate-600'
            }`}>
              {stats.techVocabLearned}
            </span>
          </button>

          {/* Phrase Dump (Image 3) */}
          <button
            onClick={() => onTabChange('phrase-dump')}
            className={`px-3 py-1.5 transition-all flex items-center gap-1.5 font-mono text-xs rounded-xl ${
              activeTab === 'phrase-dump'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Phrase Dump / சொற்றொடர்கள்</span>
          </button>

          {/* Sentence Lab */}
          <button
            onClick={() => onTabChange('sentence-lab')}
            className={`px-3 py-1.5 transition-all flex items-center gap-1.5 font-mono text-xs rounded-xl ${
              activeTab === 'sentence-lab'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sentence Lab / வாக்கியங்கள்</span>
          </button>

          {/* Interview & Daily */}
          <button
            onClick={() => onTabChange('interview-and-daily')}
            className={`px-3 py-1.5 transition-all flex items-center gap-1.5 font-mono text-xs rounded-xl ${
              activeTab === 'interview-and-daily'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Interview & Daily / நேர்காணல்</span>
          </button>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Audio TTS Toggle */}
          <button
            onClick={onToggleSound}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono transition-colors shadow-xs"
            title="Toggle Audio Engine"
          >
            {stats.soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] text-emerald-700 font-semibold">TTS: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] text-slate-500">TTS MUTED</span>
              </>
            )}
          </button>

          {/* XP Progress Bar */}
          <div 
            onClick={onOpenQuizModal}
            className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-amber-400/80 transition-colors shadow-xs"
            title="Click to take Progress Quiz & earn XP"
          >
            <div className="flex items-center gap-1 text-amber-600 font-mono text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{stats.xp}/{stats.maxXp} XP</span>
            </div>
            <div className="w-16 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.xp / stats.maxXp) * 100)}%` }}
              />
            </div>
          </div>

          {/* Notification Bell (Streak & Quiz Trigger) */}
          <button
            onClick={onOpenStreakModal}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200/60 transition-colors"
            title="Daily Streak & Schedule Reminders"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </button>

          {/* Profile Badge with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH6h0k7zQlPbKIRPsnluq_1yT8NNiNrPGB6ybR-ZxA_7BVuR9als-YSuSo_OcPEcQ9Kmkth45xKZjBO24jiIHW7zRquE8fPu3924t4b0YZp73SEB9DIUpcglJVsFmCG2jxrZW-rPoiWQ87JxLTfereq4BMcIfZS-tg5kQgFs279N92osdv5tYlrGmmmuD7qRvdmGkZLvtFhEb_jAufbO9Uinl7fQOXgA1nTu5BdQjN7o70VY7FSOYS"
                alt="Sriram Sugavanam"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="font-mono text-xs font-semibold text-slate-900 leading-tight">
                  Sriram S.
                </span>
                <span className="font-mono text-[10px] text-slate-500 leading-tight">
                  Sr. DevOps Engineer
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown Drawer */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 font-sans text-xs animate-in fade-in slide-in-from-top-2">
                <div className="border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">Sriram Sugavanam</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-semibold border border-emerald-200">EU Blue Card</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">8+ Years AWS, K8s, CI/CD, Terraform</p>
                  <p className="text-amber-600 text-[10px] font-mono mt-1">Tamil (Mother Tongue) • English (B2) • German (Target B2)</p>
                </div>

                <div className="space-y-1 text-slate-700">
                  <button
                    onClick={() => {
                      onOpenQuizModal();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
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
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>Daily Streak Habits</span>
                    </span>
                    <span className="text-amber-600 font-mono font-bold">{stats.streakDays} Days</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-2.5 mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Target: Munich / Berlin SRE</span>
                  <span className="text-sky-600 font-semibold">{stats.readinessLevel} Track</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar for Navigation */}
      <div className="xl:hidden flex items-center justify-around bg-white border-t border-slate-200 px-2 py-2 text-xs font-mono">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'dashboard' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => onTabChange('vocabulary')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'vocabulary' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px]">Vocab</span>
        </button>

        <button
          onClick={() => onTabChange('phrase-dump')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'phrase-dump' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px]">Phrases</span>
        </button>

        <button
          onClick={() => onTabChange('sentence-lab')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'sentence-lab' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px]">Sentence Lab</span>
        </button>

        <button
          onClick={() => onTabChange('interview-and-daily')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'interview-and-daily' ? 'text-slate-900 font-bold' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[10px]">Interview</span>
        </button>
      </div>
    </header>
  );
};
