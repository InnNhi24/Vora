# VORA - Implementation Guide

This file is a short reference for the parts of the app that matter most.

## 1. Validation

The validator is the gatekeeper for every model response.
It checks:

- JSON parseability
- speaker count
- word length per turn

Typical flow:

```ts
const validation = validateDialogueResponse(rawResponse)

if (!validation.isValid) {
  previousErrors = validation.errors
}
```

## 2. Prompt refinement

The retry loop uses validation output directly.
When a response fails, the next prompt includes the concrete error messages from the previous attempt.

```ts
const prompt = iteration === 1
  ? generateBaselinePrompt(scenario)
  : generateRefinedPrompt(scenario, previousErrors)
```

This is the main idea behind the project: the prompt becomes more specific after each failed attempt.

## 3. Playback

Voice playback uses the browser speech API.
Each turn is spoken in sequence, and the UI receives the current turn index so it can highlight the active line.

```ts
await playDialogueWithVoices(dialogue, (turnIndex) => {
  setCurrentTurn(turnIndex)
})
```

## 4. Output handling

The output screen has 3 states:

- in progress
- failed
- success

This keeps the generation flow easy to follow and gives the inspector enough context to show each attempt.

## 5. Useful files to review

- `src/app/core/evaluator.ts`
- `src/app/core/refinement-loop.ts`
- `src/app/core/voice-synthesis.ts`
- `src/app/pages/OutputPage.tsx`
- `src/app/components/InspectorPanel.tsx`

## 6. Demo suggestion

If you need one clean demo path:

1. Enter a short but specific scenario
2. Generate dialogue
3. Open the inspector
4. Show a failed attempt and the refined retry
5. Play the final dialogue
