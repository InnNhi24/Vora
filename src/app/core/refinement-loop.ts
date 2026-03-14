/**
 * Autonomous refinement loop implementation
 * 
 * Flow: Generate → Evaluate → Refine → Retry (max 3 attempts)
 * Each failed attempt produces a refined prompt with specific error feedback
 */

import {
  RefinementLog,
  RefinementAttempt
} from '../types/dialogue';
import {
  validateDialogueResponse,
  safeParseDialogue,
  generateErrorSummary
} from './evaluator';

// Maximum number of refinement iterations
const MAX_ITERATIONS = 3;

/**
 * Generates dialogue with autonomous refinement
 */
export async function generateDialogueWithRefinement(
  scenario: string,
  apiKey: string,
  provider: 'openai',
  onProgress?: (attempt: RefinementAttempt) => void
): Promise<RefinementLog> {
  
  // Get API key from environment if not provided
  const effectiveApiKey = apiKey || 
    (typeof window !== 'undefined' ? (import.meta as any).env?.VITE_OPENAI_API_KEY : undefined) ||
    (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.OPENAI_API_KEY);
  
  if (!effectiveApiKey) {
    throw new Error('OpenAI API key not found. Please set OPENAI_API_KEY environment variable.');
  }
  
  // Initialize refinement log
  const log: RefinementLog = {
    scenario,
    attempts: [],
    totalIterations: 0,
    status: 'in-progress'
  };

  let previousErrors: string[] = [];
  
  // THE REFINEMENT LOOP - Heart of the autonomous system
  for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
    console.log(`\n=== ITERATION ${iteration} ===`);
    
    // STEP 1: Generate prompt (baseline or refined)
    const prompt = iteration === 1 
      ? generateBaselinePrompt(scenario)
      : generateRefinedPrompt(scenario, previousErrors);
    
    console.log('Prompt:', prompt.substring(0, 200) + '...');
    
    // STEP 2: Call LLM API
    let rawResponse: string;
    try {
      rawResponse = await callLLMAPI(prompt, effectiveApiKey, provider);
      console.log('Response received:', rawResponse.substring(0, 200) + '...');
    } catch (error) {
      // Handle API errors
      const attempt: RefinementAttempt = {
        attemptNumber: iteration,
        prompt,
        rawResponse: '',
        validation: {
          isValid: false,
          errors: [`API Error: ${error instanceof Error ? error.message : 'Unknown error'}`]
        },
        timestamp: new Date(),
        success: false
      };
      log.attempts.push(attempt);
      if (onProgress) onProgress(attempt);
      
      // Don't continue if API fails
      log.status = 'failed';
      log.totalIterations = iteration;
      return log;
    }
    
    // STEP 3: Evaluate the response
    const validation = validateDialogueResponse(rawResponse);
    console.log('Validation result:', validation.isValid ? 'PASS' : 'FAIL');
    if (!validation.isValid) {
      console.log('Errors:', validation.errors);
    }
    
    // Parse dialogue if valid JSON
    const parsedDialogue = safeParseDialogue(rawResponse);
    
    // STEP 4: Create attempt record
    const attempt: RefinementAttempt = {
      attemptNumber: iteration,
      prompt,
      rawResponse,
      parsedDialogue: parsedDialogue || undefined,
      validation,
      timestamp: new Date(),
      success: validation.isValid
    };
    
    log.attempts.push(attempt);
    if (onProgress) onProgress(attempt);
    
    // STEP 5: Check if successful
    if (validation.isValid && parsedDialogue) {
      // SUCCESS! Update metadata with iteration count
      parsedDialogue.metadata.iterations = iteration;
      
      log.finalDialogue = parsedDialogue;
      log.status = 'success';
      log.totalIterations = iteration;
      
      console.log(`✓ Success on iteration ${iteration}`);
      return log;
    }
    
    // STEP 6: Prepare for next iteration (if not last attempt)
    if (iteration < MAX_ITERATIONS) {
      previousErrors = validation.errors;
      console.log(`✗ Failed, preparing refined prompt for iteration ${iteration + 1}`);
    }
  }
  
  // All iterations exhausted without success
  log.status = 'failed';
  log.totalIterations = MAX_ITERATIONS;
  console.log('✗ All iterations exhausted without success');
  
  return log;
}

/**
 * Generates initial prompt for first attempt
 */
function generateBaselinePrompt(scenario: string): string {
  return `You are a dialogue generation system. Generate a natural conversation between two characters based on the following scenario.

**Scenario:** ${scenario}

**Requirements:**
1. Create a dialogue between exactly 2 characters (Character A and Character B)
2. Each character should have distinct personality and speaking style
3. Keep each dialogue turn concise (under 25 words) for natural voice synthesis
4. Include 6-10 dialogue turns total
5. Add appropriate emotions to each turn

**Output Format (STRICT JSON):**
{
  "metadata": {
    "iterations": 1,
    "scenario": "${scenario}"
  },
  "dialogue": [
    {
      "speaker": "Character A",
      "text": "First line of dialogue here",
      "emotion": "neutral"
    },
    {
      "speaker": "Character B", 
      "text": "Response here",
      "emotion": "friendly"
    }
  ]
}

Return ONLY the JSON, no additional text.`;
}

/**
 * Generates refined prompt with error feedback from previous attempt
 */
function generateRefinedPrompt(scenario: string, previousErrors: string[]): string {
  const errorSummary = generateErrorSummary(previousErrors);
  
  return `You are a dialogue generation system. Your previous attempt had errors. Please fix them.

**Scenario:** ${scenario}

**ERRORS FROM PREVIOUS ATTEMPT:**
${errorSummary}

**Critical Requirements (YOU MUST FOLLOW THESE):**
1. Output MUST be valid JSON (check your brackets and quotes!)
2. Use EXACTLY 2 distinct characters: "Character A" and "Character B"
3. Each dialogue turn MUST be under 25 words (count them!)
4. Include 6-10 dialogue turns total
5. Every turn must have: speaker, text, and emotion fields

**Output Format (STRICT JSON):**
{
  "metadata": {
    "iterations": 1,
    "scenario": "${scenario}"
  },
  "dialogue": [
    {
      "speaker": "Character A",
      "text": "Short dialogue under 25 words",
      "emotion": "neutral"
    },
    {
      "speaker": "Character B",
      "text": "Short response under 25 words", 
      "emotion": "friendly"
    }
  ]
}

**IMPORTANT:** Fix the specific errors mentioned above. Return ONLY valid JSON, no markdown, no explanation.`;
}

/**
 * Calls LLM API based on selected provider
 */
async function callLLMAPI(
  prompt: string,
  apiKey: string,
  _provider: 'openai'
): Promise<string> {
  
  return await callOpenAI(prompt, apiKey);
}

/**
 * Calls OpenAI GPT-4 API
 */
async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // Using GPT-4 for better JSON adherence
      messages: [
        {
          role: 'system',
          content: 'You are a precise JSON generator. Always return valid JSON with no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API Error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content;
  
  // Clean up response - remove markdown code blocks if present
  content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  
  return content;
}
