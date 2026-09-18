import { QuizQuestion, SkillTreeModule } from '../types';

export const PROGRESS_QUIZZES: QuizQuestion[] = [
  {
    id: 'q-1',
    question: 'What is the correct German definite article for "Bereitstellung" (Deployment)?',
    contextGerman: 'Bereitstellung endet auf "-ung". Welcher Artikel ist korrekt?',
    contextTamil: '"-ung" என்று முடியும் ஜெர்மன் சொற்களுக்கு எந்த Artikel வரும்?',
    options: ['DER', 'DIE', 'DAS', 'DEN'],
    correctIndex: 1,
    explanation: 'German words ending with suffix "-ung" (like Bereitstellung, Überwachung, Trennung) are 100% Feminine (DIE). Suffix Rule: -ung, -heit, -keit = Always DIE.',
    xpBounty: 25
  },
  {
    id: 'q-2',
    question: 'How do you say "No blockers on my end" during a German daily standup?',
    contextGerman: 'Standardphrase für den täglichen Standup:',
    contextTamil: 'ஸ்டாண்டப் கூட்டத்தில் "என் தரப்பில் தடைகள் எதுவும் இல்லை" என எவ்வாறு கூறுவீர்கள்?',
    options: [
      'Keine Blocker meinerseits',
      'Ich blockiere alle Pipeline',
      'Nicht Blocker für heute',
      'Es gibt kein Problem für mich'
    ],
    correctIndex: 0,
    explanation: '"Keine Blocker meinerseits" is the gold standard idiom used daily across German agile engineering departments.',
    xpBounty: 25
  },
  {
    id: 'q-3',
    question: 'In a causal clause with "weil" (because), where does the conjugated verb sit?',
    contextGerman: 'Wortstellung im Kausalsatz mit "weil":',
    contextTamil: '"weil" (ஏனெனில்) வரும் துணை வாக்கியத்தில் வினைச்சொல் எங்கு அமையும்?',
    options: [
      'At position 2 (after the subject)',
      'At the absolute end of the clause',
      'At the beginning before the subject',
      'Directly after the word "weil"'
    ],
    correctIndex: 1,
    explanation: 'In German subordinate clauses introduced by "weil", the conjugated verb always moves to the absolute end. Tamil mirrors this SOV closure naturally!',
    xpBounty: 30
  },
  {
    id: 'q-4',
    question: 'What does the German word "Die Wurzelursachenanalyse" correspond to in DevOps?',
    contextGerman: 'DevOps Fachbegriff Übersetzung:',
    contextTamil: 'இந்த சொல்லின் ஆங்கில/தொழில்நுட்ப அர்த்தம் என்ன?',
    options: [
      'Horizontal Pod Autoscaler (HPA)',
      'Root Cause Analysis (RCA)',
      'VPC Peering Connection',
      'Continuous Integration Build'
    ],
    correctIndex: 1,
    explanation: 'Wurzel (Root) + Ursache (Cause) + Analyse (Analysis) = RCA, essential for incident post-mortems.',
    xpBounty: 25
  },
  {
    id: 'q-5',
    question: 'Which past tense form is exclusively preferred in German daily standups?',
    contextGerman: 'Vergangenheitsform im Standup:',
    contextTamil: 'ஸ்டாண்டப்பில் நேற்றைய பணியை விவரிக்க எந்த காலம் (Tense) பயன்படுத்தப்படுகிறது?',
    options: [
      'Präteritum (Imperfekt: ich optimierte)',
      'Perfekt (haben/sein + Partizip II: ich habe optimiert)',
      'Plusquamperfekt (ich hatte optimiert)',
      'Futur I (ich werde optimieren)'
    ],
    correctIndex: 1,
    explanation: 'Spoken German and standups virtually always use the Perfekt (haben/sein + Partizip II). Präteritum is for written novels/newspapers.',
    xpBounty: 30
  }
];

export const SKILL_TREE_MODULES: SkillTreeModule[] = [
  {
    id: 'mod-1',
    title: 'Kubernetes & Containerisierung',
    tamilTitle: 'கண்டெய்னர் மற்றும் கிளஸ்டர் மேலாண்மை',
    progressPercent: 0,
    statusLabel: '0% START',
    statusType: 'active' as const,
    icon: 'anchor',
    color: '#4edea3',
    words: ['der Pod (-s)', 'die Bereitstellung', 'der Cluster-Neustart', 'der Absturz (Crash)'],
    solvedCount: 0,
    totalCount: 40
  },
  {
    id: 'mod-2',
    title: 'CI/CD Pipelines & Automatisierung',
    tamilTitle: 'தொடர் ஒருங்கிணைப்பு மற்றும் தானியங்கி வெளியீடு',
    progressPercent: 0,
    statusLabel: '0% UP NEXT',
    statusType: 'up-next' as const,
    icon: 'sync_alt',
    color: '#4cd7f6',
    words: ['fehlgeschlagen', 'das Bau-Skript', 'die Freigabe', 'erfolgreich'],
    solvedCount: 0,
    totalCount: 50
  },
  {
    id: 'mod-3',
    title: 'Incident Management & Störungsanalyse',
    tamilTitle: 'சிக்கல் மேலாண்மை மற்றும் மூலக்காரண பகுப்பாய்வு',
    progressPercent: 0,
    statusLabel: '0% UP NEXT',
    statusType: 'up-next' as const,
    icon: 'warning',
    color: '#ffb95f',
    words: ['die Ausfallzeit (Downtime)', 'Wurzelursachenanalyse (RCA)', 'die Dringlichkeit'],
    solvedCount: 0,
    totalCount: 40
  },
  {
    id: 'mod-4',
    title: 'Agile Daily Standups & Retrospektiven',
    tamilTitle: 'தினசரி நிலவர கூட்டங்கள் மற்றும் திட்ட ஆய்வுகள்',
    progressPercent: 0,
    statusLabel: '0% UP NEXT',
    statusType: 'up-next' as const,
    icon: 'forum',
    color: '#acedff',
    words: ['Blocker melden', 'Fortschritt präsentieren', 'die Abhängigkeit'],
    solvedCount: 0,
    totalCount: 40
  },
  {
    id: 'mod-5',
    title: 'Gehalt & Tech Interview Prep',
    tamilTitle: 'தொழில்நுட்ப நேர்காணல் மற்றும் சம்பள பேச்சுவார்த்தை',
    progressPercent: 0,
    statusLabel: '0% UP NEXT',
    statusType: 'up-next' as const,
    icon: 'handshake',
    color: '#86948a',
    words: ['Architektur erklären', 'die Gehaltsvorstellung', 'die Kündigungsfrist'],
    solvedCount: 0,
    totalCount: 30
  }
];
