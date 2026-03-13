/**
 * Validation logic for dialogue responses
 * 
 * Checks:
 * 1. Valid JSON structure
 * 2. Exactly 2 distinct speakers
 * 3. Each turn under 25 words for natural speech
 */

import { DialogueStructure, DialogueTurn, ValidationResult } from '../types/dialogue';

/**
 * Validates LLM response against dialogue criteria
 */
export function validateDialogueResponse(rawResponse: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // STEP 1: Validate JSON structure
  let parsedData: DialogueStructure;
  try {
    parsedData = JSON.parse(rawResponse);
  } catch (e) {
    errors.push('CRITICAL: Response is not valid JSON. The LLM must return properly formatted JSON.');
    return { isValid: false, errors, warnings };
  }

  // STEP 2: Validate required fields exist
  if (!parsedData.metadata) {
    errors.push('Missing "metadata" field in response structure.');
  }
  
  if (!parsedData.dialogue || !Array.isArray(parsedData.dialogue)) {
    errors.push('Missing or invalid "dialogue" array in response structure.');
    return { isValid: false, errors, warnings };
  }

  // STEP 3: Validate dialogue content
  const dialogueErrors = validateDialogueContent(parsedData.dialogue);
  errors.push(...dialogueErrors);

  // Return final validation result
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates dialogue content for speaker count and word limits
 */
function validateDialogueContent(dialogue: DialogueTurn[]): string[] {
  const errors: string[] = [];

  // Check minimum dialogue length
  if (dialogue.length < 2) {
    errors.push('Dialogue must contain at least 2 turns (one for each character).');
    return errors;
  }

  // CRITERION 1: Extract unique speakers
  const speakers = new Set<string>();
  dialogue.forEach(turn => {
    if (turn.speaker) {
      speakers.add(turn.speaker.trim().toLowerCase());
    }
  });

  // Validate exactly 2 distinct personas
  if (speakers.size !== 2) {
    errors.push(
      `Expected exactly 2 distinct personas, but found ${speakers.size}. ` +
      `Speakers detected: ${Array.from(speakers).join(', ') || 'none'}. ` +
      `Please ensure the dialogue has exactly two characters (e.g., "Character A" and "Character B").`
    );
  }

  // CRITERION 2: Validate word count per turn (< 25 words)
  dialogue.forEach((turn, index) => {
    if (!turn.text) {
      errors.push(`Turn ${index + 1}: Missing "text" field.`);
      return;
    }

    const wordCount = countWords(turn.text);
    if (wordCount > 25) {
      errors.push(
        `Turn ${index + 1} (${turn.speaker}): Contains ${wordCount} words, exceeds the 25-word limit. ` +
        `Please shorten this turn for natural voice flow. ` +
        `Text: "${turn.text.substring(0, 50)}..."`
      );
    }

    // Additional check for empty text
    if (turn.text.trim().length === 0) {
      errors.push(`Turn ${index + 1} (${turn.speaker}): Text field is empty.`);
    }
  });

  return errors;
}

/**
 * Counts words in text by splitting on whitespace
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Safely parses JSON response
 */
export function safeParseDialogue(rawResponse: string): DialogueStructure | null {
  try {
    return JSON.parse(rawResponse);
  } catch {
    return null;
  }
}

/**
 * Formats validation errors for refined prompts
 */
export function generateErrorSummary(errors: string[]): string {
  if (errors.length === 0) return '';
  
  return `The previous response had the following issues:\n${errors.map((err, i) => `${i + 1}. ${err}`).join('\n')}`;
}
