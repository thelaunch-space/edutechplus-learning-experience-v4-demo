# Content Inputs — Fractions Journey

This folder contains the structured content inputs for the "Introduction to Fractions" learning journey. This represents what a content team would provide when creating a journey using the Math Mate platform.

## Folder Structure

```
content-inputs/
├── README.md                       # This file
├── journey-metadata.json           # Journey-level info (title, objectives, vocabulary)
├── node-sequence.json              # Ordered list of all 14 nodes
├── asset-contexts/                 # What each asset teaches (REQUIRED for AI)
│   ├── slide-1-why-fractions.md
│   ├── video-1-what-are-fractions.md
│   ├── applet-a1-cut-and-glue.md
│   └── ... (14 files total)
└── conversations/                  # Conversation config per node
    ├── node-01-slide-1.json
    ├── node-02-video-1.json
    └── ... (14 files total)
```

## What Each File Contains

### journey-metadata.json
- Title, description, grade, subject
- Learning objectives
- Prerequisites
- Target vocabulary

### node-sequence.json
- Ordered array of all nodes
- Node type, title, duration
- Whether node has post-question

### asset-contexts/*.md
**This is critical for AI to work.** Each file describes:
- What happens in the video/applet/slide
- What concepts are taught
- What visual elements appear
- What student should remember

Without these, AI cannot reference content or ask relevant questions.

### conversations/*.json
- Pre-conversation script (intro before content)
- Post-conversation config:
  - Question
  - Correctness filter (acceptable answers)
  - Scaffolding (5 levels: probe1, probe2, hint, scaffold, reveal)
- For interactive slides: additional template config with 3-level scaffolding

## Scaffolding Structure

### Probes (2-5 per question)
```json
{
  "probes": [
    "Turn 1: Probing question",
    "Turn 2: Different angle",
    "Turn 3: Stronger hint",
    "Turn 4: Nearly there...",
    "Turn 5: It's one-fourth! Great job!"
  ]
}
```

**Key points:**
- Content team decides how many probes each question needs (2-5)
- Simple concepts: 2-3 probes
- Harder concepts: 4-5 probes
- Last probe always reveals the answer warmly
- All called "probes" — consistent, easy to understand

## How This Maps to the Platform

When the content authoring GUI is built:
1. Content team enters journey metadata in a form
2. Content team uploads assets and writes descriptions
3. Content team sets node sequence (drag-and-drop)
4. AI drafts conversation config from asset descriptions
5. Content team reviews and edits
6. Platform generates JSON like these files
7. JSON is stored in database

This folder serves as a **reference implementation** proving the framework captures everything needed.

---

*Last updated: 2026-02-02*
