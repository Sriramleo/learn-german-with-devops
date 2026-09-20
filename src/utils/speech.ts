/**
 * DevDeutsch Speech Utility
 * Uses Web Speech API (SpeechSynthesis) with speed controls and word-by-word playback
 */

export type PlaybackRate = 0.5 | 0.75 | 1.0;

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakGerman(
  text: string,
  rate: number = 1.0,
  onEnd?: () => void,
  onError?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    
    // Clean text of technical punctuation that may distort TTS
    const cleanText = text.replace(/[`*_#]/g, '').trim();
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'de-DE';
    utterance.rate = Math.max(0.4, Math.min(1.5, rate));
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const deVoice = voices.find(v => v.lang.startsWith('de') || v.lang.includes('German') || v.lang.includes('de_DE'));
    if (deVoice) {
      utterance.voice = deVoice;
    }

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      console.warn('TTS playback note:', err);
      currentUtterance = null;
      if (onError) onError();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
    if (onEnd) onEnd();
  }
}

export function speakWord(word: string, rate: number = 0.75) {
  // Strip punctuation like commas, periods, quotes for clean single-word audio
  const cleanWord = word.replace(/^[.,/#!$%^&*;:{}=\-_`~()"]+|[.,/#!$%^&*;:{}=\-_`~()"]+$/g, '');
  speakGerman(cleanWord, rate);
}

export function speakTamil(text: string, rate: number = 1.0, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ta-IN';
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    const taVoice = voices.find(v => v.lang.startsWith('ta') || v.lang.includes('Tamil'));
    if (taVoice) {
      utterance.voice = taVoice;
    }

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis Tamil error:', err);
    if (onEnd) onEnd();
  }
}

export function pauseSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  }
}

export function resumeSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeechPaused(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused;
}

export function isSpeaking(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking;
}
