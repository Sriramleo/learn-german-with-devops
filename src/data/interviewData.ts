import { InterviewScenario } from '../types';

export const INTERVIEW_SCENARIOS: InterviewScenario[] = [
  {
    id: 'sc-1',
    number: 1,
    title: '1. The Daily Standup (Das tägliche Standup)',
    badge: 'ACTIVE',
    badgeColor: 'bg-primary text-on-primary',
    companyContext: 'Zalando SE • Berlin (Hybrid)',
    speakerName: 'Thomas K.',
    speakerRole: 'Scrum Master / Agile Lead',
    speakerTeam: 'Platform Infrastructure Core (Berlin-Mitte)',
    speakerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClMpgYS3W4njlCi-2J7zqMJa0hL0R-7qab38WDJ3lksUj3V9fTy-bb-8SYhntyHmJk5xS5nH4lBcDCYUk1x79orFlRHVp8ashRW3nwC4AvCt2rWNYoZo5FhuseMD3V0uB0aMB3BSl8h-NpUynx4oX93bZeJ0KQxiHjbAiWfAFIpGUWtpp1z7ZeZEvpx5ohMXb2C_AgG8Ib3eXb2iGMa5QNAF0FoW08JaVdDClFEn_YaZUKx2Pa80cD',
    turnText: 'Daily Standup: Turn 03 of 05',
    targetTone: 'Professional Senior Agil',
    squad: 'AWS/K8s Squad',
    germanAudioPrompt: 'Guten Morgen zusammen! Sriram, wie sieht es mit der Terraform-Migration in AWS aus? Gibt es Blocker?',
    highlightWords: ['Terraform-Migration', 'Blocker'],
    englishContext: 'Good morning everyone! Sriram, how does the Terraform migration in AWS look? Are there any blockers?',
    tamilContext: 'அனைவருக்கும் காலை வணக்கம்! ஸ்ரீராம், AWS-ல் டெர்ராஃபார்ம் மைக்ரேஷன் எப்படி போய்க்கொண்டிருக்கிறது? ஏதேனும் தடைகள் (blockers) உள்ளதா?',
    options: [
      {
        id: 'opt-1a',
        label: 'OPTION A // EMPFOHLEN (RECOMMENDED)',
        typeBadge: 'Perfekt + Präsens Syntax',
        recommended: true,
        germanText: 'Gestern habe ich die VPC-Peering-Module fertiggestellt. Heute migriere ich die EKS-Cluster. Keine Blocker meinerseits.',
        tamilText: 'நேற்று நான் VPC-ப்பீரிங் மாட்யூல்களை முடித்தேன். இன்று EKS கிளஸ்டர்களை இடம்பெயர்க்கிறேன். என் தரப்பில் தடைகள் எதுவும் இல்லை.',
        clarityScore: 96,
        wordOrderScore: 100,
        feedbackMsg: 'Perfekt grammar with "habe ... fertiggestellt" and clean direct standup tone!'
      },
      {
        id: 'opt-1b',
        label: 'OPTION B // BLOCKER ESCALATION',
        typeBadge: 'Agile Blocker Protocol',
        recommended: false,
        germanText: 'Ich warte noch auf die Freigabe der IAM-Rollen durch das Security-Team. Das blockiert aktuell das Deployment.',
        tamilText: 'செக்யூரிட்டி குழுவின் IAM ரோல் ஒப்புதலுக்காக காத்திருக்கிறேன். அது தற்போது டெப்ளாய்மென்ட்டை தாமதப்படுத்துகிறது.',
        clarityScore: 93,
        wordOrderScore: 98,
        feedbackMsg: 'Professional escalation phrase for German agile ceremonies.'
      }
    ]
  },
  {
    id: 'sc-2',
    number: 2,
    title: '2. P1 Production Outage (Notfall-Call)',
    badge: 'SEV-1',
    badgeColor: 'bg-error text-on-error',
    companyContext: 'Bavaria Cloud FinTech • München',
    speakerName: 'Claudia M.',
    speakerRole: 'Incident Commander / Principal SRE',
    speakerTeam: 'Critical Production Systems',
    speakerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    turnText: 'Incident War Room: T+12 Minutes',
    targetTone: 'Urgent & Decisive SRE',
    squad: 'Kubernetes Platform',
    germanAudioPrompt: 'Achtung Team! Wir haben einen P1-Ausfall im München-Cluster. Die Latenz liegt bei über 8 Sekunden. Sriram, was zeigen die Logs?',
    highlightWords: ['P1-Ausfall', 'Latenz'],
    englishContext: 'Attention team! We have a P1 outage in the Munich cluster. Latency is over 8 seconds. Sriram, what do the logs show?',
    tamilContext: 'கவனம் குழுவினரே! முனிச் கிளஸ்டரில் P1 முடக்கம் ஏற்பட்டுள்ளது. லேட்டன்சி 8 வினாடிகளுக்கு மேல் உள்ளது. ஸ்ரீராம், லாக்ஸ் என்ன காட்டுகின்றன?',
    options: [
      {
        id: 'opt-2a',
        label: 'OPTION A // RCA DIAGNOSTIC (RECOMMENDED)',
        typeBadge: 'Incident Runbook Response',
        recommended: true,
        germanText: 'Die OpenSearch-Logs zeigen OOMKilled-Fehler auf zwei Worker-Nodes. Ich skaliere jetzt sofort den HPA hoch und starte die betroffenen Pods neu.',
        tamilText: 'ஓபன்செர்ச் லாக்ஸ் இரண்டு ஒர்க்கர் நோடுகளில் OOMKilled பிழைகளைக் காட்டுகின்றன. நான் உடனே HPA-வை உயர்த்தி பாதிக்கப்பட்ட போட்களை மறுதொடக்கம் செய்கிறேன்.',
        clarityScore: 98,
        wordOrderScore: 100,
        feedbackMsg: 'Decisive command of SRE terminology (OOMKilled, HPA, neustarten) in German.'
      },
      {
        id: 'opt-2b',
        label: 'OPTION B // TRAFFIC REDIRECTION',
        typeBadge: 'Failover Strategy',
        recommended: false,
        germanText: 'Der Ingress-Controller ist überlastet. Wir sollten den Traffic temporär auf die Frankfurt-Region umleiten.',
        tamilText: 'இன்கிரெஸ் கன்ட்ரோலர் அதிக சுமையில் உள்ளது. நாம் டிராஃபிக்கை தற்காலிகமாக ஃபிராங்க்ஃபர்ட் பகுதிக்கு திருப்பிவிட வேண்டும்.',
        clarityScore: 92,
        wordOrderScore: 95,
        feedbackMsg: 'Valid architectural mitigation using modal verb "sollten ... umleiten".'
      }
    ]
  },
  {
    id: 'sc-3',
    number: 3,
    title: '3. Cloud Architecture Interview',
    badge: 'C1 TECH',
    badgeColor: 'bg-secondary text-on-secondary',
    companyContext: 'Automotive Cloud Platform • Munich (Bavaria)',
    speakerName: 'Dr. Markus Weber',
    speakerRole: 'Head of Cloud Architecture',
    speakerTeam: 'Autonomous & Telemetry Systems',
    speakerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    turnText: 'Technical Interview: System Design Round',
    targetTone: 'Authoritative Senior Architect',
    squad: 'Multi-Region Infrastructure',
    germanAudioPrompt: 'Sriram, wie haben Sie in Ihrem vorherigen Projekt eine 99.9% Uptime bei über 250.000 monatlich aktiven Nutzern sichergestellt?',
    highlightWords: ['99.9% Uptime', 'sichergestellt'],
    englishContext: 'Sriram, how did you ensure 99.9% uptime with over 250,000 monthly active users in your previous project?',
    tamilContext: 'ஸ்ரீராம், உங்கள் முந்தைய திட்டத்தில் 2.5 லட்சத்திற்கும் மேற்பட்ட மாதாந்திர பயனர்களுடன் 99.9% அப்டைமை எவ்வாறு உறுதி செய்தீர்கள்?',
    options: [
      {
        id: 'opt-3a',
        label: 'OPTION A // ARCHITECTURAL MASTERY (RECOMMENDED)',
        typeBadge: 'Direct Resume Alignment',
        recommended: true,
        germanText: 'Wir haben Multi-AZ-Bereitstellungen mit automatischem HPA-Autoscaling und inter-AZ-Datenübertragungsoptimierung implementiert, was die Ausfallzeiten minimiert hat.',
        tamilText: 'நாங்கள் மல்டி-AZ வெளியீடுகள், தானியங்கி HPA ஆட்டோஸ்கேலிங் மற்றும் இன்டர்-AZ டேட்டா பரிமாற்ற உகப்பாக்கத்தை செயல்படுத்தினோம், இது முடக்க நேரத்தைக் குறைத்தது.',
        clarityScore: 97,
        wordOrderScore: 99,
        feedbackMsg: 'Directly cites achievements from your resume with fluent German relative clauses!'
      },
      {
        id: 'opt-3b',
        label: 'OPTION B // OBSERVABILITY ANGLE',
        typeBadge: 'Proactive Alerting Focus',
        recommended: false,
        germanText: 'Durch proaktive Prometheus- und Grafana-Alarme konnten wir Engpässe erkennen, bevor sie sich auf Endnutzer auswirkten.',
        tamilText: 'செயல்திறன் மிக்க புரொமிதியஸ் மற்றும் கிரஃபானா எச்சரிக்கைகள் மூலம், பயனர்களைப் பாதிக்கும் முன்பே தடைகளை எங்களால் கண்டறிய முடிந்தது.',
        clarityScore: 94,
        wordOrderScore: 96,
        feedbackMsg: 'Strong subordinate clause "bevor sie sich auf Endnutzer auswirkten".'
      }
    ]
  },
  {
    id: 'sc-4',
    number: 4,
    title: '4. Salary & Relocation Negotiation',
    badge: 'HR/DE',
    badgeColor: 'bg-tertiary text-on-tertiary',
    companyContext: 'Munich Tech Recruitment • Bavaria',
    speakerName: 'Katrin Berger',
    speakerRole: 'VP of Talent & People Operations',
    speakerTeam: 'European Cloud Relocation Desk',
    speakerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    turnText: 'Offer Discussion: German Market Alignment',
    targetTone: 'Confident & Diplomatic Negotiation',
    squad: 'EU Blue Card Relocation',
    germanAudioPrompt: 'Sriram, wir sind sehr beeindruckt von Ihren DevOps-Fähigkeiten. Was ist Ihre Gehaltsvorstellung für diese Senior-Rolle in München?',
    highlightWords: ['Gehaltsvorstellung', 'Senior-Rolle'],
    englishContext: 'Sriram, we are very impressed by your DevOps skills. What is your salary expectation for this Senior role in Munich?',
    tamilContext: 'ஸ்ரீராம், உங்கள் DevOps திறமைகளால் நாங்கள் மிகவும் ஈர்க்கப்பட்டுள்ளோம். முனிச்சில் இந்த சீனியர் பணிக்கான உங்கள் சம்பள எதிர்பார்ப்பு என்ன?',
    options: [
      {
        id: 'opt-4a',
        label: 'OPTION A // MARKET BENCHMARK (RECOMMENDED)',
        typeBadge: 'Senior Munich Standard (85k - 95k)',
        recommended: true,
        germanText: 'Basierend auf meinen 8 Jahren Erfahrung in AWS und Kubernetes liegt meine Gehaltsvorstellung zwischen 90.000 und 95.000 Euro brutto pro Jahr, inklusive Umzugspaket.',
        tamilText: 'AWS மற்றும் குபர்னெட்டீஸில் எனது 8 ஆண்டுகால அனுபவத்தின் அடிப்படையில், எனது சம்பள எதிர்பார்ப்பு ஆண்டுக்கு 90,000 முதல் 95,000 யூரோக்கள் (Brutto), இடமாற்ற தொகுப்புடன் (Relocation Package).',
        clarityScore: 98,
        wordOrderScore: 100,
        feedbackMsg: 'Polite, confident, and uses exact German employment terms ("brutto pro Jahr", "Umzugspaket").'
      },
      {
        id: 'opt-4b',
        label: 'OPTION B // FLEXIBLE TOTAL REWARDS',
        typeBadge: 'Base + Bonus Dialogue',
        recommended: false,
        germanText: 'Ich bin flexibel und offen für ein Gesamtpaket, das ein Grundgehalt von 88.000 Euro plus jährlichen Leistungsbonus und Altersvorsorge umfasst.',
        tamilText: 'அடிப்படை சம்பளம் 88,000 யூரோக்கள், ஆண்டு போனஸ் மற்றும் ஓய்வூதியத் திட்டம் (bAV) அடங்கிய மொத்த சலுகை தொகுப்பிற்கு நான் தயாராக உள்ளேன்.',
        clarityScore: 95,
        wordOrderScore: 96,
        feedbackMsg: 'Excellent mention of German corporate benefits ("Altersvorsorge", "Leistungsbonus").'
      }
    ]
  }
];

export const STANDUP_QUICK_ANCHORS = [
  {
    german: 'Keine Blocker meinerseits',
    tamil: 'என் தரப்பில் தடைகள் எதுவும் இல்லை.',
    english: 'No blockers on my end / ready to proceed.',
    ipa: '[ˈkaɪ̯nə ˈblɔkɐ ˈmaɪ̯nɐˌzaɪ̯ts]'
  },
  {
    german: 'Ich bin dabei, die Logs zu analysieren',
    tamil: 'நான் லாக்ஸ்களை ஆய்வு செய்து கொண்டிருக்கிறேன்.',
    english: 'I am currently analyzing the logs (ongoing task).',
    ipa: '[ɪç bɪn daˈbaɪ̯ diː lɔks tsuː ʔanalyˈziːʁən]'
  },
  {
    german: 'Wir haben eine Ausfallzeit von 5 Minuten',
    tamil: 'நமக்கு 5 நிமிட முடக்கம் ஏற்பட்டது.',
    english: 'We incurred a downtime of 5 minutes.',
    ipa: '[viːɐ̯ ˈhaːbn̩ ˈaɪ̯nə ˈaʊ̯sfalˌtsaɪ̯t fɔn fʏnf miˈnuːtn̩]'
  },
  {
    german: 'Kannst du mich kurz entmuten?',
    tamil: 'என்னை அன்மியூட் செய்ய முடியுமா?',
    english: 'Can you briefly unmute me? (Teams / Zoom ritual).',
    ipa: '[kanst duː mɪç kʊʁts ʔɛntˈmjuːtn̩]'
  },
  {
    german: 'Ich übernehme das Ticket heute',
    tamil: 'இன்று இந்த டிக்கெட்டை நான் பொறுப்பேற்கிறேன்.',
    english: 'I will take ownership of the ticket today.',
    ipa: '[ɪç yːbɐˈneːmə das ˈtɪkət ˈhɔɪ̯tə]'
  },
  {
    german: 'Die Pipeline läuft wieder grün',
    tamil: 'பைப்லைன் மீண்டும் வெற்றிகரமாக (பச்சை) இயங்குகிறது.',
    english: 'The pipeline is running green again.',
    ipa: '[diː ˈpaɪ̯plaɪ̯n lɔɪ̯ft ˈviːdɐ ɡʁyːn]'
  }
];
