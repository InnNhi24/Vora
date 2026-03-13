# VORA

VORA is a React app that generates short two-person dialogues, validates the result, and retries with a refined prompt when the first answer fails.

## What it does

- Accepts a user scenario and sends it to OpenAI or Gemini
- Validates each response before showing it in the UI
- Retries up to 3 times using concrete validation errors
- Plays the final dialogue with browser text-to-speech
- Shows each attempt in an inspector panel for review

## Validation rules

The generated response must:

1. Be valid JSON
2. Contain exactly 2 speakers
3. Keep each turn under 25 words

These constraints keep the output structured and make playback more natural.

## App flow

```text
Scenario input
   baseline prompt
   LLM response
   validation
       pass: show dialogue
       fail: build refined prompt from errors and retry
```

## Main files

```text
src/app/App.tsx                  step-based app shell
src/app/pages/                   onboarding, input, output pages
src/app/core/evaluator.ts        validation logic
src/app/core/refinement-loop.ts  prompt refinement loop
src/app/core/voice-synthesis.ts  browser TTS playback
src/app/utils/export.ts          PDF / JSON export helpers
src/app/utils/speaker.ts         speaker classification helper
src/app/components/InspectorPanel.tsx
```

## Run notes

- Configure an API key in the UI before generating dialogue
- Voice playback depends on browser support for `speechSynthesis`
- Audio export is intentionally disabled for now

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md): structure and runtime flow
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md): comprehensive project overview
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md): implementation notes
- [EXAMPLE_SCENARIOS.md](EXAMPLE_SCENARIOS.md): scenario ideas for demos and testing
- [PROMPT_DOCUMENTATION.md](PROMPT_DOCUMENTATION.md): prompt engineering details
- [EVALUATION_RESULTS.md](EVALUATION_RESULTS.md): baseline vs improved comparison
- [ETHICS_AND_RISKS.md](ETHICS_AND_RISKS.md): ethical considerations
- [ATTRIBUTIONS.md](ATTRIBUTIONS.md): third-party credits
