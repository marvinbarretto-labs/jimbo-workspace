# Sift 🔍

**Email intelligence system — extracting signal from noise**

---

## What Is Sift?

Sift is an AI-powered email digest system that learns what content matters to you over time. It's not just filtering spam — it's building intelligence about your information diet.

### The Core Problem

- **Volume**: 125-150 emails/day (~900-1000/week)
- **Signal buried in noise**: Interesting articles, events, opportunities hidden among duplicates and low-value content
- **Time scarcity**: Even the "good stuff" adds up to more time than available
- **Blind spots**: Missing out on content channels that should be on the radar

### The Solution

**Three layers of intelligence:**

1. **Daily Triage** — What came in today? What's worth your time right now?
2. **Pattern Recognition** — Which sources deliver value? Which duplicate? Which to unsubscribe?
3. **Strategic Gaps** — Based on interests, what content channels are missing?

---

## Architecture

### Security Model (Critical)

- **NO Gmail API credentials on VPS** — controlled blast radius
- **Offline classification** — email bodies never leave laptop
- **Pipeline**: Laptop IMAP sync → local classifier → rsync structured JSON → Sift reads metadata only

### Data Flow

```
┌─────────────────────────────────────────┐
│ LAPTOP (Offline)                        │
├─────────────────────────────────────────┤
│ 1. IMAP sync pulls emails locally       │
│ 2. Classifier extracts metadata         │
│    - sender, subject, category          │
│    - links, time estimates              │
│    - keywords, summaries                │
│ 3. Outputs: email-digest.json           │
└──────────────┬──────────────────────────┘
               │ rsync
               ▼
┌─────────────────────────────────────────┐
│ VPS (Sift)                              │
├─────────────────────────────────────────┤
│ 1. Read email-digest.json               │
│ 2. Present conversationally             │
│ 3. Capture signals (queue/skip)         │
│ 4. Update tracking files                │
│ 5. Learn patterns over time             │
└─────────────────────────────────────────┘
```

---

## Conversations & Decisions Log

### 2026-02-17 — Project Inception

**Key Insights:**

- **Not just tech content** — Personal email spans all interests (music, events, history, food, travel, etc.)
- **Volume reality** — 125-150 emails/day means even 10% interesting = 2 hours of reading time
- **Time budget critical** — Need to track queue against realistic consumption capacity (~2 hours)
- **Conversational learning** — Ask thoughtful questions daily to understand WHY content matters

**Core Features Defined:**

1. **Daily Digest** — Morning conversational presentation of overnight emails
2. **Queue Management** — Track items against time budget (target: ~2 hours)
3. **Signal Capture** — Queue vs. Skip, with context about why
4. **Learning Loop** — Build model of interests, sender reputation, topic relevance
5. **Daily Wildcard** — One surprise item to test curiosity patterns (gamified with weekly score)
6. **Weekly Sprint Review** — Retrospective on what's working, hit rate analysis, redundancy/gaps identified

**Design Principles:**

- Start simple, iterate based on real usage
- Measure improvement (hit rate should climb week-over-week)
- Be ruthless about time — quality over quantity
- Build conversational understanding, not just algorithmic filtering

**Name Choice:** "Sift" — simple, direct, describes the action perfectly

**Next Steps:**
- Review real inbox examples (screenshots incoming)
- Finalize email-digest.json schema based on reality
- Build v0.1 digest reader script
- Create tracking files (queue, feedback, wildcard score)

**BDD Specs Written (2026-02-17)**
Comprehensive Gherkin specifications created in `projects/sift/specs/`:

- **daily_digest.feature** — Digest presentation, auto-skip, empty days
- **signal_capture.feature** — Queue/skip handling, unsubscribe marking, multiple signals
- **learning_loop.feature** — Sender reputation, topic relevance, context awareness, hit rate tracking
- **queue_management.feature** — Time budget, clearing old items, queue persistence
- **daily_wildcard.feature** — Gamified surprise content, scoring, weekly reset, learning preferences
- **weekly_review.feature** — Sprint-like retrospectives, hit rate analysis, redundancy detection, gap identification
- **edge_cases.feature** — Missing fields, malformed JSON, duplicates, volume spikes, schema evolution

**Total lines:** ~650 lines of Gherkin
**Coverage:** Core features + edge cases + robustness
Specs stored in workspace for future automation or manual test runs.

---

## Project Status

**Phase:** Planning & Design  
**Started:** 2026-02-17  
**Current Focus:** Understanding real inbox patterns before building

---

_This document grows with the project. Every significant decision, conversation, and milestone gets captured here._

## Development Diary

🧠 **See also:** `/home/openclaw/.openclaw/workspace/SIFT_DIARY.md` — day-to-day reflections, learnings, and ideas during development.

For broader cross-project diary, check: `/home/openclaw/.openclaw/workspace/JIMBO_DIARY.md`.

