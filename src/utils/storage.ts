import { UserStats } from '../types';

const STORAGE_KEY = 'devdeutsch_user_stats_v4';

export const DEFAULT_USER_STATS: UserStats = {
  xp: 0,
  maxXp: 500,
  streakDays: 0,
  interviewReadiness: 0,
  readinessLevel: 'A1.0',
  techVocabLearned: 0,
  totalVocab: 480,
  sentenceDrillsCompleted: 0,
  sentenceAccuracy: 0,
  phoneticsHours: 0.0,
  pronunciationScore: 0,
  lives: 5,
  bookmarkedVocabIds: [],
  bookmarkedPhraseIds: [],
  soundEnabled: true,
  activeLanguage: 'ALL'
};

/**
 * Dynamically computes CEFR readiness level and interview readiness % from actual learner activity
 */
export function calculateReadiness(stats: UserStats): { score: number; level: string } {
  // Vocab component (0 to 35 points, maxed out at 20 words learned)
  const vocabScore = Math.min(35, (stats.techVocabLearned / 20) * 35);

  // Sentence Lab component (0 to 35 points, maxed out at 6 drills)
  const sentenceScore = Math.min(35, (stats.sentenceDrillsCompleted / 6) * 35);

  // Pronunciation & Oral Standup component (0 to 30 points)
  const pronScore = stats.pronunciationScore > 0 
    ? (stats.pronunciationScore / 100) * 20 + Math.min(10, stats.phoneticsHours * 10)
    : 0;

  const total = Math.min(100, Math.round(vocabScore + sentenceScore + pronScore));

  let level = 'A1.0';
  if (total >= 90) level = 'B2.2 (Senior Architect)';
  else if (total >= 75) level = 'B2.1 (DevOps Ready)';
  else if (total >= 60) level = 'B1.2';
  else if (total >= 45) level = 'B1.1';
  else if (total >= 30) level = 'A2.2';
  else if (total >= 15) level = 'A2.1';
  else if (total > 0) level = 'A1.1';

  return { score: total, level };
}

const USER_ID_KEY = 'devdeutsch_user_id';
const API_BASE = import.meta.env?.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'https://backend.sriramdevops.site');

export function getUserId(): string {
  if (typeof window === 'undefined') return 'anonymous-user';
  let uid = localStorage.getItem(USER_ID_KEY);
  if (!uid) {
    uid = 'devops-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now().toString(36);
    localStorage.setItem(USER_ID_KEY, uid);
  }
  return uid;
}

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_USER_STATS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged: UserStats = { ...DEFAULT_USER_STATS, ...parsed };
      const { score, level } = calculateReadiness(merged);
      merged.interviewReadiness = score;
      merged.readinessLevel = level;
      return merged;
    }
  } catch (e) {
    console.warn('Could not load user stats from localStorage', e);
  }
  return DEFAULT_USER_STATS;
}

export async function fetchCloudStats(): Promise<UserStats | null> {
  if (!API_BASE || typeof window === 'undefined') return null;
  const userId = getUserId();
  try {
    const res = await fetch(`${API_BASE}/api/stats/${userId}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.exists && data.stats) {
        const merged: UserStats = { ...DEFAULT_USER_STATS, ...data.stats };
        const { score, level } = calculateReadiness(merged);
        merged.interviewReadiness = score;
        merged.readinessLevel = level;
        // Also sync to local storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch {
    // Graceful offline fallback
  }
  return null;
}

let syncTimeout: any = null;

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    const { score, level } = calculateReadiness(stats);
    const enriched = {
      ...stats,
      interviewReadiness: score,
      readinessLevel: level
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));

    // Debounced async background sync to MongoDB Atlas
    if (API_BASE) {
      if (syncTimeout) clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        const userId = getUserId();
        fetch(`${API_BASE}/api/stats/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enriched),
        }).catch(() => {
          // Silent catch for offline mode
        });
      }, 500);
    }
  } catch (e) {
    console.warn('Could not save user stats to localStorage', e);
  }
}

export function resetUserStats(): UserStats {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('devdeutsch_user_stats_v3');
      localStorage.removeItem('devdeutsch_user_stats_v2');
      localStorage.removeItem('devdeutsch_user_stats');

      // Also notify backend API to reset in MongoDB
      if (API_BASE) {
        const userId = getUserId();
        fetch(`${API_BASE}/api/stats/${userId}/reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Could not reset localStorage', e);
    }
  }
  return { ...DEFAULT_USER_STATS };
}
