/**
 * Type definitions for dialogue system
 */

/**
 * Single dialogue turn
 */
export interface DialogueTurn {
  speaker: string;      // Character identifier (e.g., "Character A", "Character B")
  text: string;         // The actual dialogue text
  emotion?: string;     // Optional emotion tag (e.g., "neutral", "excited", "angry")
}

/**
 * Complete dialogue structure
 */
export interface DialogueStructure {
  metadata: {
    iterations: number; // Number of refinement iterations required
    scenario?: string;  // Original scenario description
  };
  dialogue: DialogueTurn[];
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;           // Overall validation status
  errors: string[];           // List of specific validation errors
  warnings?: string[];        // Optional warnings (non-blocking issues)
}

/**
 * Single refinement attempt
 */
export interface RefinementAttempt {
  attemptNumber: number;      // Iteration counter (1, 2, 3...)
  prompt: string;             // The exact prompt sent to the LLM
  rawResponse: string;        // Raw text response from LLM
  parsedDialogue?: DialogueStructure; // Successfully parsed dialogue (if valid JSON)
  validation: ValidationResult;       // Validation results
  timestamp: Date;                    // When this attempt was made
  success: boolean;                   // Whether this attempt passed validation
}

/**
 * Complete refinement log
 */
export interface RefinementLog {
  scenario: string;                 // Original user input
  attempts: RefinementAttempt[];    // All refinement attempts
  finalDialogue?: DialogueStructure; // The successful result (if any)
  totalIterations: number;           // Total number of attempts made
  status: 'success' | 'failed' | 'in-progress'; // Overall process status
}

/**
 * Configuration for voice synthesis
 */
export interface VoiceConfig {
  characterA: {
    pitch: number;      // Voice pitch (0.0 - 2.0, default 1.0)
    rate: number;       // Speech rate (0.1 - 10, default 1.0)
    voice?: string;     // Specific voice name (browser-dependent)
  };
  characterB: {
    pitch: number;
    rate: number;
    voice?: string;
  };
}
