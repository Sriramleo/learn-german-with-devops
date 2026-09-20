/**
 * DevDeutsch - German Language Learning for Senior DevOps Engineers
 * Localized with English and Tamil
 */

import React, { useState, useEffect } from 'react';
import { TabType, UserStats } from './types';
import { loadUserStats, saveUserStats, resetUserStats, calculateReadiness, fetchCloudStats, DEFAULT_USER_STATS } from './utils/storage';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { VocabView } from './components/VocabView';
import { PhraseDumpView } from './components/PhraseDumpView';
import { PatternsView } from './components/PatternsView';
import { SentenceLabView } from './components/SentenceLabView';
import { InterviewView } from './components/InterviewView';
import { LearningTipsView } from './components/LearningTipsView';
import { QuizModal } from './components/QuizModal';
import { StreakModal } from './components/StreakModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [stats, setStats] = useState<UserStats>(DEFAULT_USER_STATS);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isTamilActive, setIsTamilActive] = useState(true);

  // Initialize stats from localStorage and sync with MongoDB Atlas
  useEffect(() => {
    const loaded = loadUserStats();
    setStats(loaded);

    fetchCloudStats().then(cloudStats => {
      if (cloudStats) {
        setStats(cloudStats);
      }
    });
  }, []);

  // Update user stats and persist
  const handleUpdateStats = (newPartial: Partial<UserStats>) => {
    setStats(prev => {
      const merged = { ...prev, ...newPartial };
      const { score, level } = calculateReadiness(merged);
      const updated: UserStats = {
        ...merged,
        interviewReadiness: score,
        readinessLevel: level
      };
      saveUserStats(updated);
      return updated;
    });
  };

  // Reset progress completely to 0
  const handleResetProgress = () => {
    const fresh = resetUserStats();
    setStats(fresh);
  };

  const handleToggleSound = () => {
    handleUpdateStats({ soundEnabled: !stats.soundEnabled });
  };

  const handleToggleTamil = () => {
    setIsTamilActive(prev => !prev);
  };

  return (
    <div className="min-h-screen w-full bg-background text-text-primary flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-800">
      {/* Fixed Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={stats}
        onToggleSound={handleToggleSound}
        onOpenStreakModal={() => setIsStreakModalOpen(true)}
        onOpenQuizModal={() => setIsQuizModalOpen(true)}
        onResetProgress={handleResetProgress}
        isTamilActive={isTamilActive}
        onToggleTamil={handleToggleTamil}
      />

      {/* Main Content Area: padding bottom accommodates mobile/tablet bottom navigation */}
      <main className="flex-1 w-full pt-18 sm:pt-20 px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto pb-28 xl:pb-12">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            onNavigate={setActiveTab}
            onOpenQuiz={() => setIsQuizModalOpen(true)}
            onUpdateStats={handleUpdateStats}
            onResetProgress={handleResetProgress}
            isTamilActive={isTamilActive}
          />
        )}

        {activeTab === 'vocabulary' && (
          <VocabView
            stats={stats}
            onUpdateStats={handleUpdateStats}
            isTamilActive={isTamilActive}
          />
        )}

        {activeTab === 'phrase-dump' && (
          <PhraseDumpView
            stats={stats}
            onUpdateStats={handleUpdateStats}
            isTamilActive={isTamilActive}
            onToggleTamil={handleToggleTamil}
          />
        )}

        {activeTab === 'patterns' && (
          <PatternsView
            stats={stats}
            onUpdateStats={handleUpdateStats}
            isTamilActive={isTamilActive}
            onToggleTamil={handleToggleTamil}
          />
        )}

        {activeTab === 'sentence-lab' && (
          <SentenceLabView
            stats={stats}
            onUpdateStats={handleUpdateStats}
            isTamilActive={isTamilActive}
          />
        )}

        {activeTab === 'interview-and-daily' && (
          <InterviewView
            stats={stats}
            onUpdateStats={handleUpdateStats}
            isTamilActive={isTamilActive}
          />
        )}

        {activeTab === 'learning-tips' && (
          <LearningTipsView />
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
