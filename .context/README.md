# .context/ — Living Context System

This folder contains all project context for AI agents and developers. Organized into evergreen docs (always relevant), client feedback (per-iteration), and deferred platform docs.

## Structure

```
.context/
├── README.md                              # This file
│
│  # Evergreen — always relevant
├── prd.md                                 # Product requirements, user persona, architecture
├── progress.md                            # Iteration history, scope decisions, "Next Up" task queue
├── conversation-design.md                 # Voice/LLM design, character system, expression mapping
├── bugs-and-recurring-issues.md           # Known bugs, patterns to avoid
├── feature-wishlist.md                    # Completed + deferred features
├── learning-journey.md                    # 20-node content roadmap with implementation status
│
│  # Client feedback — raw feedback after each iteration (keeps growing)
├── client-feedback/
│   ├── iteration-1.md                     # Post-Iteration 1 (Jan 6, 2026)
│   ├── iteration-2-transcript.txt         # Meeting transcript (Jan 21, 2026)
│   ├── iteration-3.md                     # Post-Iteration 3 (Jan 23, 2026)
│   ├── iteration-4.md                     # Post-Iteration 4 (Feb 3, 2026)
│   └── iteration-5.md                     # Post-Iteration 5 (Feb 12, 2026)
│
│  # Platform — future scalable build (deferred, not current work)
└── platform/
    ├── framework-client-facing.md         # What content teams control (client-friendly)
    └── framework-technical.md             # Schemas, architecture, migration plan
```

## How to add new docs

- **New client feedback** goes in `client-feedback/iteration-N.md`
- **Scope decisions and implementation progress** get recorded in `progress.md`
- **Character/voice/interaction design changes** go in `conversation-design.md`
- **New bugs** get recorded in `bugs-and-recurring-issues.md`
