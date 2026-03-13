/**
 * Text-to-speech playback using Web Speech API
 * Character A: Lower pitch (0.9), Character B: Higher pitch (1.2)
 */

import { DialogueStructure, DialogueTurn } from '../types/dialogue';
import { isSpeakerA } from '../utils/speaker';

/**
 * Plays dialogue with distinct voices for each character
 */
export async function playDialogueWithVoices(
  dialogue: DialogueStructure,
  onProgress?: (turnIndex: number) => void
): Promise<void> {
  // Check if Web Speech API is supported
  if (!('speechSynthesis' in window)) {
    throw new Error('Web Speech API is not supported in this browser.');
  }

  const synth = window.speechSynthesis;
  
  // Cancel any ongoing speech
  synth.cancel();

  // Play each dialogue turn sequentially
  for (let i = 0; i < dialogue.dialogue.length; i++) {
    const turn = dialogue.dialogue[i];
    
    // Notify progress
    if (onProgress) {
      onProgress(i);
    }

    // Speak this turn and wait for completion
    await speakTurn(turn, synth);
    
    // Small pause between turns (300ms)
    await sleep(300);
  }

  // Final callback to indicate completion
  if (onProgress) {
    onProgress(-1); // -1 indicates playback complete
  }
}

/**
 * Speaks a single dialogue turn with configured voice
 */
function speakTurn(turn: DialogueTurn, synth: SpeechSynthesis): Promise<void> {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(turn.text);
    
    // Configure voice based on speaker
    const isCharacterA = isSpeakerA(turn.speaker);
    
    if (isCharacterA) {
      // Character A: Male voice (lower pitch, slightly slower)
      utterance.pitch = 0.9;
      utterance.rate = 0.95;
      utterance.volume = 1.0;
      
      // Try to select a male voice if available
      const voices = synth.getVoices();
      const maleVoice = voices.find(v => 
        v.name.toLowerCase().includes('male') || 
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('james')
      );
      if (maleVoice) {
        utterance.voice = maleVoice;
      }
    } else {
      // Character B: Female voice (higher pitch, normal rate)
      utterance.pitch = 1.2;
      utterance.rate = 1.0;
      utterance.volume = 1.0;
      
      // Try to select a female voice if available
      const voices = synth.getVoices();
      const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('karen')
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
    }

    // Event handlers
    utterance.onend = () => resolve();
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      reject(new Error('Speech synthesis failed'));
    };

    // Speak!
    synth.speak(utterance);
  });
}

/**
 * Pauses execution for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Stops any ongoing speech playback
 */
export function stopPlayback(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Returns available speech synthesis voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

/**
 * Initializes and loads available voices
 */
export function initializeVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    let voices = synth.getVoices();

    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Wait for voices to load
    synth.onvoiceschanged = () => {
      voices = synth.getVoices();
      resolve(voices);
    };
  });
}
