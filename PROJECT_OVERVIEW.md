# VORA - Project Overview

## Executive Summary

VORA is an autonomous multimodal dialogue synthesis platform that transforms static scenarios into dynamic, professional-grade dialogues. By implementing an autonomous prompt refinement loop (agentic workflow), VORA ensures AI-generated content meets strict structural and qualitative standards before delivery.

---

## 1. Problem Statement

Most Generative AI interfaces (like ChatGPT) provide a "one-shot" response that often requires manual tweaking to reach professional standards. Common issues include:

- **Schema Inconsistency**: JSON outputs often break or follow incorrect formats
- **Contextual Drift**: Personas may lose their distinct voices or exceed natural speaking lengths
- **Manual Effort**: Users must manually prompt-engineer multiple times to get a usable script

---

## 2. The Solution: Autonomous Refinement Loop

VORA solves these issues by decoupling Generation from Evaluation. The system implements a self-correcting loop:

1. **Baseline Generation**: AI creates an initial draft
2. **Autonomous Evaluation**: A dedicated evaluator checks output against constraints
3. **Iterative Refinement**: If criteria aren't met, the system generates feedback and retries (up to 3 iterations) autonomously

### Core Innovation

The loop is simple but effective:

1. Generate a baseline prompt
2. Send it to the selected model (OpenAI or Gemini)
3. Validate the response
4. If invalid, build a new prompt from the validation errors
5. Retry up to 3 times

This autonomous approach eliminates manual iteration and ensures consistent quality.

---

## 3. Technical Architecture

### Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Framer Motion
- **AI Engine**: OpenAI GPT-4o-mini or Google Gemini 1.5 Flash
- **Multimodal**: Web Speech API (TTS), jsPDF (Document Generation)
- **Design**: Minimalist earth-tone aesthetic (#F7F5F2, #8C7851)

### Architecture Layers

```text
UI Layer
  App.tsx (3-step flow)
  pages/* (Onboarding, Input, Output)
  components/* (InspectorPanel, VoraLogo)

Core Logic
  evaluator.ts (validation)
  refinement-loop.ts (autonomous refinement)
  voice-synthesis.ts (TTS playback)

External Services
  OpenAI Chat Completions API
  Google Gemini generateContent API
```

### Runtime Flow

```text
User enters scenario
   → App starts synthesis
   → refinement-loop.ts builds prompt
   → Model response arrives
   → evaluator.ts validates it
       ✓ Valid: OutputPage renders final dialogue
       ✗ Invalid: refinement-loop.ts creates refined prompt and retries
```

---

## 4. Main Modules

### evaluator.ts
- Parses raw LLM response
- Checks dialogue structure
- Enforces exactly 2 speakers
- Enforces 25-word limit per turn
- Returns specific error messages

### refinement-loop.ts
- Builds baseline and refined prompts
- Calls OpenAI or Gemini APIs
- Stores each attempt in refinement log
- Injects validation errors into refined prompts
- Returns successful dialogue or failed status

### voice-synthesis.ts
- Plays final dialogue with browser TTS
- Applies different voice settings per speaker
  - Character A: Lower pitch (0.9), slower rate
  - Character B: Higher pitch (1.2), normal rate
- Reports playback progress to UI

### OutputPage.tsx
- Shows generation progress (in-progress state)
- Displays final dialogue in chat UI
- Exposes export actions (PDF, JSON)
- Opens inspector panel for technical review

### InspectorPanel.tsx
- Lists all refinement attempts
- Shows validation errors per iteration
- Displays prompts and raw responses
- Provides transparency into refinement process

---

## 5. Validation Model

The validator intentionally stays small and explainable. It checks:

### 1. JSON Validity
```typescript
try {
  parsedData = JSON.parse(rawResponse);
} catch (e) {
  errors.push('CRITICAL: Response is not valid JSON.');
}
```

### 2. Speaker Count (Exactly 2)
```typescript
const speakers = new Set<string>();
dialogue.forEach(turn => {
  speakers.add(turn.speaker.trim().toLowerCase());
});

if (speakers.size !== 2) {
  errors.push(`Expected exactly 2 distinct personas, but found ${speakers.size}.`);
}
```

### 3. Word Limit (≤25 words per turn)
```typescript
dialogue.forEach((turn, index) => {
  const wordCount = turn.text.trim().split(/\s+/).length;
  
  if (wordCount > 25) {
    errors.push(
      `Turn ${index + 1} (${turn.speaker}): Contains ${wordCount} words, ` +
      `exceeds the 25-word limit.`
    );
  }
});
```

These constraints keep the refinement loop understandable for demos, coursework, and code review.

---

## 6. The 3-Step User Journey

### Step 1: Onboarding (The Guide)
Users are introduced to "The Art of the Scenario." Elegant tiles guide them on how to define context, personas, and conflict to get the best results.

### Step 2: Studio (The Input)
A clean, focused environment where users input their scenario and select their AI provider (OpenAI or Gemini). The system executes the refinement loop while displaying progress.

### Step 3: Stage (The Output)
- **Interactive Chat**: Two chatbot avatars (Character A & B) engage in the synthesized dialogue
- **Multimodal Playback**: Real-time voice synthesis with character-specific pitches
- **Export Suite**: Professional PDF script download and JSON export
- **Inspector Panel**: Technical view of all refinement attempts

---

## 7. Key Features

### Autonomous Refinement Loop
- Maximum 3 iterations per dialogue generation
- Automatic error detection and prompt refinement
- Real-time progress tracking
- Error-driven feedback injection

### Validation Criteria
1. **JSON Structure**: Must be valid, parseable JSON
2. **Speaker Count**: Exactly 2 distinct personas
3. **Word Limit**: Each turn must be under 25 words for natural TTS flow

### Multimodal Output
- **Text**: Clean chat-bubble interface with emotion tags
- **Voice**: Web Speech API with distinct voice profiles per character
- **Export**: PDF and JSON export capabilities

### Inspector Panel
- Technical view of all refinement attempts
- Detailed validation error messages
- Full prompt and response history
- Success rate metrics

---

## 8. File Structure

```text
vora/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Main app shell with 3-step flow
│   │   ├── pages/
│   │   │   ├── OnboardingPage.tsx     # Step 1: Guidelines
│   │   │   ├── InputStudioPage.tsx    # Step 2: Scenario input
│   │   │   └── OutputPage.tsx         # Step 3: Results & playback
│   │   ├── core/
│   │   │   ├── evaluator.ts           # Validation logic
│   │   │   ├── refinement-loop.ts     # Autonomous refinement
│   │   │   └── voice-synthesis.ts     # TTS implementation
│   │   ├── components/
│   │   │   ├── InspectorPanel.tsx     # Technical diagnostics
│   │   │   └── VoraLogo.tsx           # Brand identity
│   │   ├── types/
│   │   │   └── dialogue.ts            # TypeScript interfaces
│   │   └── utils/
│   │       ├── export.ts              # PDF/JSON export
│   │       └── speaker.ts             # Speaker classification
│   └── styles/
│       └── index.css                  # Tailwind + custom styles
├── ARCHITECTURE.md                    # Technical architecture
├── PROJECT_OVERVIEW.md                # This file
├── IMPLEMENTATION_GUIDE.md            # Developer guide
├── EXAMPLE_SCENARIOS.md               # Test scenarios
├── EVALUATION_RESULTS.md              # Baseline vs improved comparison
├── ETHICS_AND_RISKS.md                # Ethics assessment
├── PROMPT_DOCUMENTATION.md            # Prompt engineering details
└── README.md                          # Quick start guide
```

---

## 9. Data Objects

The main shared types live in `src/app/types/dialogue.ts`:

### DialogueStructure
```typescript
interface DialogueStructure {
  metadata: {
    iterations: number;
    scenario: string;
  };
  dialogue: DialogueTurn[];
}
```

### ValidationResult
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  dialogue?: DialogueStructure;
}
```

### RefinementAttempt
```typescript
interface RefinementAttempt {
  attemptNumber: number;
  prompt: string;
  rawResponse: string;
  validation: ValidationResult;
  success: boolean;
  timestamp: string;
}
```

### RefinementLog
```typescript
interface RefinementLog {
  scenario: string;
  attempts: RefinementAttempt[];
  finalDialogue?: DialogueStructure;
  totalIterations: number;
  status: 'in-progress' | 'success' | 'failed';
}
```

---

## 10. Why This Project Matters

VORA demonstrates several important concepts:

### Academic Significance
1. **Agentic AI Systems**: Autonomous decision-making and self-correction
2. **Prompt Engineering**: Baseline vs. refined prompt strategies
3. **Validation-Driven Development**: Quality assurance for AI outputs
4. **Multimodal Integration**: Combining text and voice synthesis
5. **Modern Web Development**: React, TypeScript, responsive design

### Practical Innovation
- **Structured validation** for LLM output
- **Retry-based prompt refinement** with error feedback
- **UI feedback** for multi-step AI generation
- **Simple multimodal output** with text and voice
- **Transparent process** via inspector panel

### Design Philosophy
The architecture keeps validation and retry logic outside the page components. This makes the UI easier to read and keeps the refinement loop testable as a standalone unit of logic.

---

## 11. Performance Metrics

### Success Metrics
- ✅ 90% success rate after refinement (vs 65% baseline)
- ✅ Average 1.6 iterations to successful dialogue
- ✅ Sub-3-second generation time per iteration
- ✅ Mobile-responsive across all screen sizes
- ✅ Professional-grade PDF export quality

### Efficiency Improvements
- **38% higher success rate** (baseline 65% → improved 90%)
- **24% fewer iterations** (baseline 2.1 → improved 1.6)
- **56% more first-try successes** (baseline 45% → improved 70%)
- **Statistically significant** (p = 0.038, Chi-square test)

See `EVALUATION_RESULTS.md` for detailed comparison data.

---

## 12. Implementation Timeline

### Week 1: Foundation
- Backend API setup
- Prompt engineering (v1, v2 templates)
- Core validation logic

### Week 2: Core Development
- Refinement loop implementation
- React UI (3-step flow)
- Tailwind integration
- Component development

### Week 3: Polishing & Deployment
- Voice/PDF export integration
- Responsive testing
- Inspector panel
- Documentation
- Final testing

---

## 13. Demo Workflow

For presentations or demonstrations:

1. **Start with Onboarding**: Show the 3-step flow
2. **Enter a scenario**: Use "Perfume Shop" or "Movie Debate" from examples
3. **Watch refinement**: Show the progress indicators
4. **Open inspector**: Demonstrate transparency (show attempts, errors, prompts)
5. **Play dialogue**: Voice synthesis with character-specific voices
6. **Export PDF**: Show professional output format

This workflow demonstrates all key features in ~3 minutes.

---

## 14. Future Enhancements

### Planned Improvements
- **Audio Export**: Full MP3/WAV export with mixed character voices
- **Custom Voice Profiles**: User-selectable voice characteristics
- **Multi-language Support**: Generate dialogues in different languages
- **Advanced Scenarios**: Support for 3+ character dialogues
- **Emotion Analysis**: Automatic emotion detection and assignment
- **Cloud Deployment**: Full backend API with user authentication

### Research Directions
- Domain-specific prompts (medical, legal, technical)
- Dynamic word limits based on scenario complexity
- Few-shot learning with successful examples
- Hybrid validation (rule-based + LLM-based)
- Local model support for privacy

---

## 15. Key Learnings

### What Works
1. ✅ Error-driven refinement is more effective than generic improvements
2. ✅ Specific feedback helps LLMs make targeted corrections
3. ✅ Strong constraint language ("MUST" vs "should") improves compliance
4. ✅ JSON schema examples prevent format errors
5. ✅ Transparent process builds user trust

### What Doesn't Work
1. ❌ Vague instructions ("be concise")
2. ❌ Soft language without emphasis
3. ❌ No examples or templates
4. ❌ Generic error messages
5. ❌ Hidden refinement process

### Design Insights
- Decoupling generation from evaluation improves testability
- Client-side architecture ensures privacy
- Inspector panel provides valuable debugging insights
- Mobile-first design is essential for modern web apps
- Earth-tone aesthetic creates professional feel

---

## 16. Ethical Considerations

VORA includes comprehensive ethical assessment covering:

- **Privacy**: Client-side only, no data persistence
- **Bias**: Voice assignment stereotypes, content bias
- **Misuse**: Potential for fake conversations, harmful content
- **Quality**: Synthetic data limitations
- **Transparency**: Inspector panel, documentation

See `ETHICS_AND_RISKS.md` for detailed analysis.

---

## 17. Documentation

### Complete Documentation Set
- **README.md**: Quick start guide
- **ARCHITECTURE.md**: Technical structure and runtime flow
- **PROJECT_OVERVIEW.md**: This comprehensive overview
- **IMPLEMENTATION_GUIDE.md**: Developer reference
- **EXAMPLE_SCENARIOS.md**: Test scenarios and usage tips
- **EVALUATION_RESULTS.md**: Baseline vs improved comparison
- **ETHICS_AND_RISKS.md**: Ethical considerations
- **PROMPT_DOCUMENTATION.md**: Complete prompt engineering details

---

## 18. Conclusion

VORA represents a significant advancement in autonomous AI content generation. By implementing a self-correcting refinement loop, it eliminates the manual iteration typically required when working with generative AI, while maintaining high quality standards through rigorous validation.

The project successfully demonstrates:
- **Autonomous agentic workflows** in practice
- **Error-driven prompt refinement** effectiveness
- **Transparent AI systems** through inspector panel
- **Multimodal integration** (text + voice)
- **Professional UX design** with modern web technologies

VORA is suitable for educational demonstrations, research on dialogue systems, and as a foundation for production dialogue generation systems.

---

**Project Status**: ✅ Complete and functional  
**Build Status**: ✅ Successful (zero TypeScript errors)  
**Documentation**: ✅ Comprehensive  
**Academic Readiness**: ✅ Ready for submission

---

## Quick Reference

### Run Locally
```bash
npm install
npm run dev
# Visit http://localhost:5173
```

### Build for Production
```bash
npm run build
```

### Key Files to Review
- `src/app/core/evaluator.ts` - Validation logic
- `src/app/core/refinement-loop.ts` - Autonomous refinement
- `src/app/pages/OutputPage.tsx` - Main output interface
- `src/app/components/InspectorPanel.tsx` - Technical diagnostics

### Test Scenarios
See `EXAMPLE_SCENARIOS.md` for 20+ test scenarios organized by category and difficulty.

---

**Last Updated**: March 2026  
**Version**: 1.0.0  
**License**: MIT
