export type TabType = 'dashboard' | 'vocabulary' | 'phrase-dump' | 'sentence-lab' | 'interview-and-daily' | 'learning-tips';

export type ArticleGender = 'DER' | 'DIE' | 'DAS';

export type VocabCategory = 'all' | 'greetings' | 'numbers' | 'general' | 'k8s' | 'cicd' | 'sre' | 'security' | 'standup';

export type PhraseCategory = 
  | 'all' 
  | 'greetings'
  | 'numbers'
  | 'general'
  | 'incident' 
  | 'standup' 
  | 'codereview' 
  | 'architecture' 
  | 'workplace' 
  | 'idioms';

export interface PhraseItem {
  id: string;
  german: string;
  english: string;
  tamil: string;
  tamilTranslit: string;
  category: PhraseCategory;
  categoryLabel: string;
  scenarioTag: string; // e.g. "P1 Outage Call", "PR Review", "Daily Standup"
  proTip?: string;
  highlightWords?: string[];
  urgencyLevel?: 'critical' | 'high' | 'normal' | 'casual';
}

export interface VocabItem {
  id: string;
  word: string; // e.g. "Der Ausfall"
  gender: ArticleGender;
  articleLabel: string; // e.g. "DER · MASKULIN"
  grammaticalNote?: string; // e.g. "AKKUSATIV: DEN AUSFALL" or "SUFFIX: -UNG"
  plural?: string; // e.g. "Pl: die Ausfälle"
  ipa: string; // e.g. "[deːɐ̯ ˈaʊ̯sˌfal]"
  english: string; // e.g. "Outage / Downtime / Failure"
  tamil: string; // e.g. "கணினி முடக்கம் / செயலிழப்பு"
  tamilTranslit?: string; // e.g. "(Kaṇiṉi muṭakkam)"
  category: VocabCategory;
  categoryLabel: string;
  incidentType?: string; // e.g. "P1 Incident", "CI/CD Pipeline", "Observability"
  logContextTitle: string; // e.g. "ENTERPRISE INCIDENT LOG"
  germanSentence: string;
  highlightWord: string;
  englishSentence: string;
  tamilSentence: string;
  pronunciationBenchmark: number; // e.g. 94
  feedbackTip: string;
  tamilSyntacticNote?: string;
}

export interface SentenceExercise {
  id: string;
  scriptName: string; // e.g. "INCIDENT_RESPONSE_L4.sh"
  exerciseIndex: number;
  totalExercises: number;
  tag: string; // e.g. "Grammar Drill: Kausalsatz (weil)"
  runbookType: string; // e.g. "SEV-2 RUNBOOK"
  title: string;
  englishPrompt: string;
  tamilPrompt: string;
  prefixTokens: string[]; // e.g. ["Wir", "müssen", "den", "Kubernetes-Cluster", "neustarten,", "weil"]
  targetSlots: string[]; // correct tokens in order
  slotHints: string[]; // e.g. ["[Subjekt]", "[Prädikat am Ende]"]
  wordBank: {
    id: string;
    text: string;
    tamilMeaning: string;
  }[];
  explanationTitle: string;
  explanationGerman: string;
  explanationTamil: string;
  domain: string;
  subdomain: string;
  cefrLevel: string;
  patternType: string;
}

export interface InterviewScenario {
  id: string;
  number: number;
  title: string;
  badge: string;
  badgeColor?: string;
  companyContext: string;
  speakerName: string;
  speakerRole: string;
  speakerTeam: string;
  speakerAvatar: string;
  turnText: string;
  targetTone: string;
  squad: string;
  germanAudioPrompt: string;
  highlightWords: string[];
  englishContext: string;
  tamilContext: string;
  options: {
    id: string;
    label: string;
    typeBadge: string;
    recommended: boolean;
    germanText: string;
    tamilText: string;
    clarityScore: number;
    wordOrderScore: number;
    feedbackMsg: string;
  }[];
}

export interface SkillTreeModule {
  id: string;
  title: string;
  tamilTitle: string;
  progressPercent: number;
  statusLabel: string;
  statusType: 'done' | 'active' | 'progress' | 'up-next';
  icon: string;
  color: string;
  words: string[];
  solvedCount: number;
  totalCount: number;
}

export interface UserStats {
  xp: number;
  maxXp: number;
  streakDays: number;
  interviewReadiness: number; // 78
  readinessLevel: string; // B2.1
  techVocabLearned: number; // 248
  totalVocab: number; // 500
  sentenceDrillsCompleted: number; // 92
  sentenceAccuracy: number; // 94
  phoneticsHours: number; // 3.5
  pronunciationScore: number; // 89
  lives: number;
  bookmarkedVocabIds: string[];
  bookmarkedPhraseIds?: string[];
  soundEnabled: boolean;
  activeLanguage: 'DE' | 'TA' | 'EN' | 'ALL';
  srsMastery?: Record<string, 'again' | 'hard' | 'good' | 'easy'>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  contextGerman?: string;
  contextTamil?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpBounty: number;
}
