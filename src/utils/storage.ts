import { UserStats } from '../types';

const STORAGE_KEY = 'devdeutsch_user_stats_v2';

export const DEFAULT_USER_STATS: UserStats = {
  xp: 0,
  maxXp: 500,
  streakDays: 0,
  interviewReadiness: 0,
  readinessLevel: 'A1.0',
  techVocabLearned: 0,
  totalVocab: 500,
  sentenceDrillsCompleted: 0,
  sentenceAccuracy: 0,
  phoneticsHours: 0,
  pronunciationScore: 0,
  lives: 0,
  bookmarkedVocabIds: [],
  bookmarkedPhraseIds: [],
  soundEnabled: true,
  activeLanguage: 'ALL'
};

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_USER_STATS;
  try {
    if (localStorage.getItem('devdeutsch_user_stats_v1')) {
      localStorage.removeItem('devdeutsch_user_stats_v1');
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_USER_STATS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Could not load user stats from localStorage', e);
  }
  return DEFAULT_USER_STATS;
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn('Could not save user stats to localStorage', e);
  }
}
