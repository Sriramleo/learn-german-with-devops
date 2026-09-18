/**
 * DevDeutsch Speech Utility
 * Uses Web Speech API (SpeechSynthesis) with safety fallbacks
 */

export function speakGerman(text: string, rate: number = 1.0, onEnd?: () => void, onError?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const deVoice = voices.find(v => v.lang.startsWith('de') || v.lang.includes('German'));
    if (deVoice) {
      utterance.voice = deVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      console.warn('TTS playback note:', err);
      if (onError) onError();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
    if (onEnd) onEnd();
  }
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
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis Tamil error:', err);
    if (onEnd) onEnd();
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
