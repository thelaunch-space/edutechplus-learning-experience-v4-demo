# Math Mate Platform — Technical Framework

**Document Purpose:** Technical specification for AI agents (Claude Code) and developers building the scalable platform.

**Last updated:** 2026-02-02

---

## Architecture Overview

### Current State (Demo)
- Frontend-only React app
- Config in `src/config/challenges.ts`
- No persistence, no auth, no multi-user

### Target State (Platform)
- Web app with authentication (Clerk)
- Backend + database (Convex)
- Content authoring GUI for content team
- Student-facing learning experience
- AI-assisted content generation

---

## Data Schemas

### Journey (Container)

```typescript
interface Journey {
  id: string;
  title: string;                    // "Introduction to Fractions"
  description: string;
  grade: string;                    // "Grade 4"
  subject: string;                  // "Math"
  thumbnailUrl?: string;
  estimatedDuration: string;        // "20 min"

  // Learning objectives (content team provides)
  learningObjectives: string[];     // What student will learn
  prerequisites?: string[];         // What student should know before
  targetVocabulary?: string[];      // Key terms introduced

  // Content
  nodes: Node[];                    // Ordered sequence

  // Metadata
  status: 'draft' | 'review' | 'published';
  createdBy: string;                // Content team member ID
  createdAt: number;                // Timestamp
  updatedAt: number;
  publishedAt?: number;
}
```

### Node (Atomic Content Unit)

```typescript
interface Node {
  id: string;
  sequenceNumber: number;           // Position in journey
  type: 'video' | 'applet' | 'slide' | 'interactive-slide';

  // Asset reference
  assetUrl: string;                 // Video URL, applet path, or slide image
  youtubeId?: string;               // For YouTube videos

  // Metadata
  title: string;
  duration: string;

  // CRITICAL: Asset context (content team MUST provide)
  assetContext: AssetContext;

  // Conversation config
  preConversation: ConversationConfig | null;
  postConversation: ConversationConfig | null;

  // Interactive slide specific
  interactiveTemplate?: InteractiveSlideTemplate;
}

// What the asset teaches - required for AI to understand context
interface AssetContext {
  description: string;              // What happens in this video/applet/slide
  conceptsTaught: string[];         // Key concepts (e.g., ["numerator", "equal parts"])
  visualElements?: string;          // What's shown visually (for slides)
  interactionType?: string;         // For applets: what student does
}
```

**Why AssetContext is critical:**
- LLM needs to know what student just experienced
- Without it, AI can't reference content ("Remember the pizza in the video?")
- Content team MUST provide this — we can't extract it from assets automatically
- AI can help draft these descriptions, but content team must verify

### ConversationConfig

```typescript
interface ConversationConfig {
  // Opening (what AI says first)
  script: string;                   // Exact TTS text, content-team authored

  // For question-based conversations
  question?: string;                // The comprehension question
  correctnessFilter?: string;       // Regex pattern for correct answers
  scaffolding?: Scaffolding;        // Teaching hints
  maxTurns?: number;                // Default: 3

  // Flags
  isNarrationOnly: boolean;         // If true, just speak script and advance
}

interface Scaffolding {
  probes: string[];                 // Array of 1-5 probing questions
                                    // Last probe should warmly reveal the answer
                                    // Length determines maxTurns
}

// Examples:
// 2 probes: ["What do you think?", "It's one-fourth! Great try!"]
// 5 probes: ["probe...", "different angle...", "hint...", "nearly there...", "It's one-fourth!"]
//
// Flexibility: Content team decides how many levels each concept needs
// Consistency: All called "probes" — no confusing hint/scaffold/reveal naming
// Last probe: Always reveals the answer warmly if student hasn't gotten it
```

### InteractiveSlideTemplate

```typescript
interface InteractiveSlideTemplate {
  templateId: 'comparison' | 'drag-drop' | 'fill-blank' | 'tap-sequence';

  // Template-specific config (varies by template)
  config: Record<string, unknown>;
}

// Example: Comparison template config
interface ComparisonTemplateConfig {
  question: string;                 // "Which has MORE pieces - 1/4 or 1/6?"
  leftLabel: string;                // "1/4"
  rightLabel: string;               // "1/6"
  correctSide: 'left' | 'right';

  // Visual config
  leftPieces: number;               // 4
  rightPieces: number;              // 6

  // Scaffolding for interactive slides (typically 3-4 probes)
  scaffolding: Scaffolding;         // Same structure, just fewer probes typically
}
```

### Buddy (AI Persona)

```typescript
interface Buddy {
  id: string;
  name: string;                     // "Math Mate"
  description: string;              // For student selection screen
  avatarUrl: string;

  // Persona definition (injected into LLM prompts)
  personaPrompt: string;            // Defines personality, tone, speech patterns

  // Voice config
  ttsVoice: string;                 // Deepgram voice ID

  // Availability
  isDefault: boolean;
  isActive: boolean;
}
```

### Student Progress

```typescript
interface StudentProgress {
  id: string;
  userId: string;                   // Clerk user ID
  journeyId: string;

  // Progress tracking
  currentNodeIndex: number;
  completedNodes: string[];         // Node IDs
  startedAt: number;
  lastActiveAt: number;
  completedAt?: number;

  // Selected buddy
  buddyId: string;
}

interface NodeAttempt {
  id: string;
  progressId: string;               // Links to StudentProgress
  nodeId: string;

  // Conversation data
  turns: ConversationTurn[];
  wasCorrect: boolean;
  turnsToCorrect: number;           // How many attempts before correct

  // Timing
  startedAt: number;
  completedAt: number;
}

interface ConversationTurn {
  role: 'assistant' | 'student';
  content: string;
  timestamp: number;
}
```

---

## AI-Assisted Content Generation

### Default Workflow

Content team provides minimal input, AI drafts the rest.

### What Content Team MUST Provide (Cannot be AI-generated)

| Input | Why Required | Example |
|-------|--------------|---------|
| **Assets** | Physical files | Videos, applets, slide images |
| **Asset context descriptions** | AI can't watch videos | "This video teaches fractions using pizza. Shows cutting into 4 equal slices." |
| **Learning objectives** | Defines what to test | "Student can identify numerator and denominator" |
| **Node sequence** | Pedagogical decision | Video 1 → Applet → Slide → Video 2 |

### What AI Can Generate (Content team reviews/edits)

| Output | How AI Generates | Content Team Action |
|--------|------------------|---------------------|
| Node titles | From asset context | Review, edit if needed |
| Pre-conversation scripts | From learning objectives + asset context | Review, edit tone |
| Post-conversation questions | From concepts taught in asset | Review, ensure alignment |
| Correctness filters | From expected answers | Add edge cases |
| Scaffolding hints | From question + correct answer | Refine pedagogy |

### The Handoff

```
Content Team                          AI                              Content Team
     │                                 │                                   │
     │  Uploads assets                 │                                   │
     │  Writes asset descriptions      │                                   │
     │  Sets learning objectives       │                                   │
     │─────────────────────────────────>│                                   │
     │                                 │  Generates all conversation       │
     │                                 │  config (scripts, questions,      │
     │                                 │  filters, scaffolding)            │
     │                                 │─────────────────────────────────> │
     │                                 │                                   │  Reviews
     │                                 │                                   │  Edits
     │                                 │                                   │  Approves
```

---

## Content Input Structure

When content team creates a journey, they provide inputs in a structured format. This maps to what they'd enter in the authoring GUI.

### Folder Structure (Reference Implementation)

```
content-inputs/
├── journey-metadata.json           # Title, grade, subject, objectives
├── node-sequence.json              # Ordered list of nodes with types
├── asset-contexts/                 # Descriptions of each asset
│   ├── video-1.md                  # What happens in video 1
│   ├── applet-a1.md                # What student does in applet A1
│   ├── slide-1.md                  # What's shown on slide 1
│   └── ...
├── conversations/                  # Per-node conversation config
│   ├── node-01-video-1.json        # Pre/post config for node 1
│   ├── node-02-applet-a1.json
│   └── ...
└── assets/                         # Actual files (or references)
    ├── videos/
    ├── applets/
    └── slides/
```

### File Formats

**journey-metadata.json**
```json
{
  "title": "Introduction to Fractions",
  "description": "Learn what fractions are using pizza, cake, and fun activities",
  "grade": "Grade 4",
  "subject": "Math",
  "estimatedDuration": "20 min",
  "learningObjectives": [
    "Understand fractions as parts of a whole",
    "Identify numerator and denominator",
    "Compare simple fractions"
  ],
  "targetVocabulary": ["fraction", "numerator", "denominator", "equal parts"]
}
```

**node-sequence.json**
```json
[
  { "id": "node-01", "type": "slide", "assetRef": "slide-1", "title": "Why Fractions?" },
  { "id": "node-02", "type": "video", "assetRef": "video-1", "title": "What are Fractions?" },
  { "id": "node-03", "type": "applet", "assetRef": "applet-a1", "title": "Cut and Glue Practice" }
]
```

**asset-contexts/video-1.md**
```markdown
# Video 1: What are Fractions?

## Duration
2.5 minutes

## What Happens
- Opens with a pizza being cut into 4 equal slices
- Shows one slice highlighted, introduces "one-fourth"
- Transitions to a cake cut into 6 pieces
- Emphasizes "equal parts" concept throughout

## Concepts Taught
- Fractions are parts of a whole
- Parts must be equal
- One-fourth means 1 out of 4

## Visual Elements
- Pizza with 4 slices
- Cake with 6 slices
- Fraction notation 1/4 appears on screen

## Key Vocabulary
- Fraction
- Equal parts
- One-fourth
- Quarter
```

**conversations/node-02-video-1.json**
```json
{
  "preConversation": {
    "script": "Let's start our first challenge! Watch this video about fractions.",
    "isNarrationOnly": true
  },
  "postConversation": {
    "script": null,
    "question": "You just learned that fractions have special names. If a pizza is cut into 4 equal slices, what is the fraction name for ONE slice?",
    "correctnessFilter": "one fourth|quarter|1/4|one-fourth|a fourth",
    "scaffolding": {
      "probes": [
        "Fractions have special names! When there are 4 equal pieces, what's the fraction name for just ONE piece?",
        "Think about the number FOUR. Each piece is called a 'fourth'. So what do we call ONE of them?",
        "Think about it — one piece, out of four. Put those together!",
        "It's one-fourth! Or you can say 'one quarter'. That's the special fraction name. Great job!"
      ]
    },
    "isNarrationOnly": false
  }
}
```

---

### AI Generation Prompts

Store prompt templates for generating content:

```typescript
interface ContentGenerationPrompt {
  id: string;
  type: 'pre-script' | 'post-question' | 'correctness-filter' | 'scaffolding';
  promptTemplate: string;           // With placeholders for context
}
```

**Example: Scaffolding generation prompt**
```
You are helping create teaching content for Grade {grade} {subject}.

Topic: {topic}
Question: {question}
Correct answer: {correctAnswer}

Generate 2-5 progressive probing questions for when a student answers incorrectly.
The LAST probe should warmly reveal the answer.

Guidelines for each probe:
1. First probe: A probing question that helps them think about the concept
2. Next probes: Different angles, analogies, stronger hints (escalating help)
3. Final probe: Warmly reveal the answer and explain why

Rules:
- Use simple English (ESL students)
- Max 2 sentences per probe
- Be encouraging, never say "wrong"
- Reference concrete examples (pizza, cake, sharing)
- Use fewer probes for simpler concepts, more for harder ones

Output as JSON:
{
  "probes": [
    "First probing question...",
    "Different angle...",
    "Stronger hint...",
    "It's one-fourth! The top number counts your pieces. Great job!"
  ]
}
```

---

## Content Team Input Checklist

### Journey-Level (Required)
- [ ] Title and description
- [ ] Grade level
- [ ] Subject area
- [ ] Learning objectives (list)
- [ ] Target vocabulary (list)
- [ ] Estimated duration

### Per-Node (Required)
- [ ] Node type (video / applet / slide / interactive-slide)
- [ ] Asset file or reference
- [ ] **Asset context description** (what it teaches, what happens)

### Per-Node Conversations (AI Can Draft)
- [ ] Pre-conversation script
- [ ] Post-conversation question
- [ ] Correctness filter (acceptable answers)
- [ ] Scaffolding (3 hints + reveal)

### Interactive Slides (If Applicable)
- [ ] Template selection
- [ ] Template parameters (question, labels, correct answer)

---

## Interactive Slide Templates

### Template: Comparison (v1)

Based on current `FractionCompareSlide`. Simplified for content authoring.

**Content team provides:**
- Question text
- Two items to compare (labels)
- Correct answer (left or right)
- Scaffolding hints

**System handles:**
- Visual rendering (rectangles, split animations)
- Tap interactions
- Voice-visual synchronization
- Auto-advance on correct first try

**State machine (simplified from current 5-frame):**
1. `question` — Show question + labels
2. `interact` — If wrong: tap indicators, student interacts
3. `reveal` — Show answer with celebration

### Future Templates

- **Drag-Drop** — Drag items to correct positions
- **Fill-Blank** — Complete the fraction/equation
- **Tap-Sequence** — Tap items in correct order
- **Sorting** — Arrange items by size/value

---

## Tech Stack Decisions

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React + Vite + TypeScript | Already built, works well |
| State | Zustand | Already built |
| Backend | Convex | Real-time, schema-first, serverless, familiar to team |
| Auth | Clerk | Easy integration, handles all auth complexity |
| STT | Deepgram Nova-2 | Already integrated |
| TTS | Deepgram Aura-2 | Already integrated |
| LLM | OpenRouter (GPT-4.1-nano) | Already integrated |
| Storage | `/public` → Cloudflare R2 (later) | CDN for assets at scale |
| Native wrapper | Capacitor (future) | For app store distribution |

---

## Migration Path from Demo

### Phase 1: Add Backend (Convex + Clerk)
- [ ] Set up Convex project
- [ ] Define schemas (Journey, Node, StudentProgress)
- [ ] Migrate `challenges.ts` config to Convex
- [ ] Add Clerk authentication
- [ ] Student login flow

### Phase 2: Persist Progress
- [ ] Save student progress to Convex
- [ ] Resume interrupted sessions
- [ ] Track node attempts and correctness

### Phase 3: Content Authoring GUI
- [ ] Journey list view (for content team)
- [ ] Journey editor (add/edit/reorder nodes)
- [ ] Node editor (configure conversations)
- [ ] AI-assisted content generation
- [ ] Preview mode (test journey before publish)

### Phase 4: Polish
- [ ] Analytics dashboard
- [ ] Buddy selection (student chooses persona)
- [ ] Asset upload UI
- [ ] Additional interactive slide templates

---

## V1 Scope Decisions

| Feature | V1 Status | Notes |
|---------|-----------|-------|
| Linear node sequence | ✅ Included | No branching logic |
| AI persona | Math Mate only | Buddy system deferred |
| Dynamic slides | Comparison template only | More templates later |
| Language | English only | Multi-language deferred |
| Branching/corrective paths | ❌ Deferred | Linear sequence for v1 |
| Offline/PWA | ❌ Deferred | Online-only for v1 |
| Native app | ❌ Deferred | Web-first, Capacitor later |
| Asset CDN | ❌ Deferred | Use /public for v1, migrate later |

---

## Files to Reference (Current Demo)

| File | Relevance |
|------|-----------|
| `src/types/index.ts` | Current type definitions (evolve into schemas) |
| `src/config/challenges.ts` | Current node config (migrate to DB) |
| `src/config/prompts.ts` | LLM prompts (keep, add persona injection) |
| `src/hooks/useVoiceInteraction.ts` | Voice loop logic (keep) |
| `src/components/FractionCompareSlide/` | Reference for Comparison template |
| `src/services/` | STT, TTS, LLM services (keep) |

---

## Technical Decisions Made

| Question | Decision | Notes |
|----------|----------|-------|
| Backend | Convex | Familiar to team, real-time, serverless |
| Offline | Online-only (v1) | Simplifies architecture |
| Platform | Web-first, plan for native | Use Capacitor later if needed |

## Asset Storage — Client Decision Required

**Current state:** Assets in `/public` folder (bundled with app)

**Problem at scale:**
- Large video files bloat app bundle
- Content updates require app redeploy
- No CDN = slower load times globally

**Recommendation:** Cloudflare R2 or AWS S3 + CloudFront

| Option | Pros | Cons | Cost |
|--------|------|------|------|
| **Cloudflare R2** | No egress fees, global CDN included, simple | Newer service | Storage only (~$0.015/GB/month) |
| **AWS S3 + CloudFront** | Battle-tested, extensive tooling | Egress fees add up | Storage + bandwidth |
| **Convex file storage** | All-in-one, simple | Less control, potentially pricier at scale | Included in Convex pricing |

**For v1:** Keep using `/public` folder. Migrate to CDN before production scale.

**Action for client:** Decide on CDN provider based on expected usage and budget. R2 recommended for cost-efficiency.

## Open Technical Questions

1. **Convex pricing tier** — Which plan for expected user count?
2. **Clerk pricing tier** — Which plan for expected student accounts?

---

*This document guides Claude Code and AI agents when building the platform. Update as decisions are made.*
