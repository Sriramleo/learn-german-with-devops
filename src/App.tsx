/**
 * DevDeutsch - German Language Learning for Senior DevOps Engineers
 * Localized with English and Tamil
 */

import React, { useState, useEffect } from 'react';
import { TabType, UserStats } from './types';
import { loadUserStats, saveUserStats, DEFAULT_USER_STATS } from './utils/storage';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { VocabView } from './components/VocabView';
import { PhraseDumpView } from './components/PhraseDumpView';
import { SentenceLabView } from './components/SentenceLabView';
import { InterviewView } from './components/InterviewView';
import { QuizModal } from './components/QuizModal';
import { StreakModal } from './components/StreakModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [stats, setStats] = useState<UserStats>(DEFAULT_USER_STATS);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

  // Initialize stats from localStorage
  useEffect(() => {
    const loaded = loadUserStats();
    setStats(loaded);
  }, []);

  // Update user stats and persist
  const handleUpdateStats = (newPartial: Partial<UserStats>) => {
    setStats(prev => {
      const updated = { ...prev, ...newPartial };
      saveUserStats(updated);
      return updated;
    });
  };

  const handleToggleSound = () => {
    handleUpdateStats({ soundEnabled: !stats.soundEnabled });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-800">
      {/* Fixed Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={stats}
        onToggleSound={handleToggleSound}
        onOpenStreakModal={() => setIsStreakModalOpen(true)}
        onOpenQuizModal={() => setIsQuizModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-20 px-4 md:px-6 lg:px-8 max-w-[1440px] mx-auto pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            onNavigate={setActiveTab}
            onOpenQuiz={() => setIsQuizModalOpen(true)}
          />
        )}

        {activeTab === 'vocabulary' && (
          <VocabView
            stats={stats}
            onUpdateStats={handleUpdateStats}
          />
        )}

        {activeTab === 'phrase-dump' && (
          <PhraseDumpView
            stats={stats}
            onUpdateStats={handleUpdateStats}
          />
        )}

        {activeTab === 'sentence-lab' && (
          <SentenceLabView
            stats={stats}
            onUpdateStats={handleUpdateStats}
          />
        )}

        {activeTab === 'interview-and-daily' && (
          <InterviewView
            stats={stats}
            onUpdateStats={handleUpdateStats}
          />
        )}
      </main>

      {/* Progress Quiz Modal */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        stats={stats}
        onUpdateStats={handleUpdateStats}
      />

      {/* Daily Streak & Reminder Modal */}
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        stats={stats}
        onUpdateStats={handleUpdateStats}
      />
    </div>
  );
}
