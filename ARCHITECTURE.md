# VORA - Architecture

## High-level structure

VORA has 3 layers:

```text
UI
  App.tsx
  pages/*
  components/*

Core logic
  evaluator.ts
  refinement-loop.ts
  voice-synthesis.ts

External services
  OpenAI chat completions
  Google Gemini generateContent
```

## Runtime flow

```text
User enters scenario
   App starts synthesis
   refinement-loop.ts builds prompt
   model response arrives
   evaluator.ts validates it
       valid: OutputPage renders final dialogue
       invalid: refinement-loop.ts creates a refined prompt and retries
```

## UI flow

The app uses a simple 3-step flow:

1. onboarding
2. input
3. output

Relevant files:

- src/app/App.tsx
- src/app/pages/OnboardingPage.tsx
- src/app/pages/InputStudioPage.tsx
- src/app/pages/OutputPage.tsx

## Important components

### OutputPage.tsx
- shows in-progress state
- shows final dialogue
- exposes export actions
- opens the inspector panel

### InspectorPanel.tsx
- lists attempts
- shows validation errors
- shows prompt and raw response for each iteration

## Data objects

The main shared types live in src/app/types/dialogue.ts.
The most important objects are:

- DialogueStructure
- ValidationResult
- RefinementAttempt
- RefinementLog

## Design choice

The architecture keeps validation and retry logic outside the page components.
That makes the UI easier to read and keeps the refinement loop testable as a standalone unit of logic.
