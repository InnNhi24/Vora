# Example Scenarios for Testing

## 🎭 Dialogue Scenarios

Use these scenarios to test the autonomous refinement system. Each scenario is designed to demonstrate different aspects of the dialogue generation and refinement process.

---

## Business & Professional

### 1. Perfume Shop Negotiation
```
A negotiation at a perfume shop where a customer is looking for a gift for their partner. The salesperson tries to understand the customer's needs and recommend suitable options.
```
**Expected Iterations:** 1-2  
**Demonstrates:** Natural sales conversation, emotion variations

### 2. Job Interview
```
A job interview for a software engineering position at a startup. The interviewer asks technical questions and the candidate responds with their experience and skills.
```
**Expected Iterations:** 1-2  
**Demonstrates:** Professional dialogue, question-answer flow

### 3. Restaurant Reservation
```
A phone call to a fine dining restaurant where a customer wants to make a reservation for their anniversary. The hostess asks about preferences and special requirements.
```
**Expected Iterations:** 1-2  
**Demonstrates:** Service interaction, detail gathering

### 4. Real Estate Showing
```
A real estate agent showing an apartment to a potential buyer. They discuss the property features, neighborhood, and pricing while walking through the space.
```
**Expected Iterations:** 1-2  
**Demonstrates:** Descriptive dialogue, persuasive communication

---

## Casual & Social

### 5. Movie Debate
```
Two friends debating which movie to watch tonight. One prefers action films while the other wants to watch a romantic comedy. They need to compromise.
```
**Expected Iterations:** 1-2  
**Demonstrates:** Friendly disagreement, negotiation

### 6. Coffee Shop Encounter
```
Two old friends unexpectedly meet at a coffee shop after years apart. They catch up on life, careers, and reminisce about old times.
```
**Expected Iterations:** 1-2  
**Demonstrates:** Nostalgic conversation, emotional connection

### 7. Travel Planning
```
Two travel companions planning their upcoming trip to Japan. They discuss destinations, activities, budget, and create an itinerary together.
```
**Expected Iterations:** 1-2  
**Demonstrates:** Collaborative planning, excitement

### 8. Cooking Together
```
A parent teaching their child how to make pizza from scratch. They discuss ingredients, techniques, and the child asks questions throughout the process.
```
**Expected Iterations:** 1-2  
**Demonstrates:** Educational dialogue, mentorship

---

## Challenging Scenarios (More Iterations Expected)

### 9. Technical Support Call
```
A customer calls technical support because their laptop won't turn on. The support agent needs to troubleshoot the issue step by step while keeping the customer calm and informed.
```
**Expected Iterations:** 2-3  
**Why Challenging:** Technical jargon might cause word limit violations

### 10. Medical Consultation
```
A doctor explains a diagnosis to a patient. The patient asks questions about treatment options, side effects, and recovery timeline. The doctor provides clear, reassuring answers.
```
**Expected Iterations:** 2-3  
**Why Challenging:** Medical terminology and detailed explanations

### 11. Philosophy Debate
```
Two philosophy students debate the concept of free will versus determinism. They present arguments, counter-arguments, and cite various philosophers.
```
**Expected Iterations:** 2-3  
**Why Challenging:** Complex concepts might lead to lengthy explanations

---

## Creative & Entertainment

### 12. Game Show Contestant
```
A contestant on a trivia game show answers questions while the host provides feedback and builds suspense. The contestant is one question away from winning the grand prize.
```
**Expected Iterations:** 1-2  
**Demonstrates:** High energy, excitement

### 13. Pet Adoption
```
A conversation at an animal shelter where a potential adopter meets with a shelter worker to find the perfect pet. They discuss lifestyle, experience, and meet different animals.
```
**Expected Iterations:** 1-2  
**Demonstrates:** Emotional dialogue, decision-making

### 14. Art Gallery Opening
```
An artist at their gallery opening discusses their latest work with an art critic. The critic asks about inspiration, techniques, and the meaning behind specific pieces.
```
**Expected Iterations:** 1-2  
**Demonstrates:** Interpretive discussion, creativity

---

## Educational

### 15. Math Tutoring Session
```
A tutor helps a student understand quadratic equations. The student struggles with the concept, and the tutor breaks it down into simpler steps with examples.
```
**Expected Iterations:** 1-2  
**Demonstrates:** Patient teaching, question-answer format

### 16. Language Exchange
```
Two people practicing a language exchange - one teaches English, the other teaches Spanish. They help each other with pronunciation, grammar, and common phrases.
```
**Expected Iterations:** 1-2  
**Demonstrates:** Educational exchange, correction

### 17. History Presentation
```
A student presents their research on ancient Rome to their professor. The professor asks clarifying questions and provides feedback on the student's findings.
```
**Expected Iterations:** 1-2  
**Demonstrates:** Academic dialogue, knowledge sharing

---

## Testing Edge Cases

### 18. Minimal Dialogue (Tests Lower Bounds)
```
Two hikers reach a mountain summit at sunrise. They share a brief moment of awe and appreciation for the view.
```
**Expected Behavior:** Should generate minimum viable dialogue (6-8 turns)

### 19. Multi-Emotion Dialogue
```
A surprise birthday party where the person being surprised goes through shock, joy, gratitude, and playful annoyance at being deceived. Friends react to these changing emotions.
```
**Expected Behavior:** Tests emotion variety and natural transitions

### 20. High-Stakes Negotiation
```
Two business executives negotiate a merger deal. Both parties have strong positions, make concessions, and work toward a mutually beneficial agreement under time pressure.
```
**Expected Behavior:** Tests professional tension, strategic dialogue

---

## Validation Test Scenarios

### 21. Persona Confusion Test (Should Fail First, Then Succeed)
```
Three people at a dinner party - a chef, a food critic, and a restaurant owner - discuss the evolution of modern cuisine. (This will initially fail the 2-persona requirement)
```
**Expected Iterations:** 2-3  
**Purpose:** Tests the persona validation and refinement

### 22. Verbose Dialogue Test (Should Trigger Word Limit)
```
A university professor explaining the theory of relativity to a curious student who asks detailed questions about time dilation, space-time curvature, and the famous equation E=mc².
```
**Expected Iterations:** 2-3  
**Purpose:** Tests word count validation and automatic shortening

---

## Usage Tips

### For Academic Presentations:

1. **Start with Scenario #1 (Perfume Shop)**
   - Clean, professional
   - Usually succeeds in 1-2 iterations
   - Good baseline demonstration

2. **Then Show Scenario #22 (Verbose Test)**
   - Intentionally triggers word limit errors
   - Demonstrates the refinement loop clearly
   - Shows error feedback injection

3. **End with Scenario #5 (Movie Debate)**
   - Fun, relatable
   - Great for voice playback demonstration
   - Shows emotional variance

### For Development Testing:

- **Quick Test:** Use scenarios 1, 5, or 7
- **Stress Test:** Use scenarios 10, 11, or 22
- **Edge Cases:** Use scenarios 18, 19, or 21

---

## Expected Validation Errors by Scenario Type

| Scenario Type | Common First-Iteration Errors |
|---------------|-------------------------------|
| **Technical** | Word limit violations (too detailed) |
| **Creative** | Emotion inconsistency |
| **Professional** | Usually passes first try |
| **Educational** | Word limit violations (explanations) |
| **Challenging** | Multiple: personas, word limits |

---

## Customizing Your Own Scenarios

### Good Scenario Structure:

✅ **Clear context:** "A job interview..."  
✅ **Two distinct roles:** "interviewer and candidate"  
✅ **Specific goal:** "...for a software position"  
✅ **Natural dialogue potential:** Room for back-and-forth

### Avoid:

❌ **Too broad:** "Two people talking" (no context)  
❌ **More than 2 people:** "Three friends..." (will fail validation)  
❌ **Monologue scenarios:** "A lecture about..." (no dialogue)  
❌ **Overly complex:** "Five-act Shakespeare play..." (unrealistic)

---

## Scenario Template

```
[Setting/Context] where [Character A role] and [Character B role] 
[Action/Goal]. [Additional detail about mood, stakes, or objective].
```

**Example:**
```
A cozy bookstore where a book club moderator and a new member 
discuss their favorite mystery novels. The new member is shy but 
passionate about detective stories.
```

---

## Success Metrics

Track these metrics when testing scenarios:

- **Iterations Needed:** 1, 2, or 3?
- **Error Types:** JSON, Persona, Word Limit?
- **Final Dialogue Quality:** Natural? Engaging?
- **Voice Synthesis:** Clear pronunciation?
- **Emotion Variety:** Multiple emotions used?

---

## Batch Testing Script (For Research)

If collecting data for your academic report:

```
Test each scenario 3 times and record:
1. Average iterations needed
2. Most common error type
3. Final dialogue length (turn count)
4. Subjective quality rating (1-5)

This data can be used to:
- Compare refinement effectiveness
- Identify scenario patterns
- Optimize validation criteria
```

---

Happy Testing! 🎭🚀

These scenarios will help you demonstrate the full capabilities of the autonomous refinement system for your Generative AI course project.
