# Sift 🔍

**Email intelligence system — extracting signal from noise**

*Build: 2026-02-17 | v0.1.0*

---

## What Is Sift?

Sift is an AI-powered email digest system that learns what content matters to you over time. It's not just filtering spam — it's building intelligence about your information diet.

### The Problem

- **Volume**: 125-150 emails/day → too much to read
- **Signal buried**: Interesting articles, events, opportunities hidden in noise
- **Time scarce**: Even good stuff adds up to more time than available
- **Blind spots**: Missing channels you should be subscribed to

### The Solution

Three layers of intelligence:
1. **Daily Triage** — Morning digest with curated items
2. **Pattern Recognition** — Learn senders, topics, redundancy
3. **Strategic Gaps** — Suggest missing content sources

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- Your offline classifier outputting `email-digest.json`

### Installation

```bash
cd projects/sift
npm install
```

### Configuration

Edit `scripts/run-digest.ts` to set paths:

```ts
const config: SiftConfig = {
  budget_minutes: 120,
  input_path: '/home/openclaw/.openclaw/workspace/data/email-digest.json',
  state_path: '/home/openclaw/.openclaw/workspace/projects/sift/data'
};
```

### Running the Digest

```bash
npm run digest
```

This will print the formatted digest to stdout. You can then interact with it via plain English reply (currently manual; later may be automated).

### Files

- `src/types.ts` — TypeScript interfaces for all data structures
- `src/digest.ts` — Digest formatter and queue/feedback integration
- `src/wildcard.ts` — Daily wildcard generator with gamification
- `scripts/run-digest.ts` — CLI entry point
- `data/` — JSON state files:
  - `queue.json` — Your reading queue, time budget tracking
  - `feedback.json` — Learning model (signals, sender reputation, topic patterns)
  - `wildcard-score.json` — Weekly scores for the wildcard game
- `specs/` — BDD test suite (Gherkin)

---

## Input Schema

Sift expects an `email-digest.json` with this structure:

```json
{
  "date": "2026-02-17",
  "generated_at": "2026-02-17T08:00:00Z",
  "total_items": 127,
  "items": [
    {
      "id": "msg_abc123",
      "date": "2026-02-17T21:21:00Z",
      "sender": { "name": "Must Reads", "email": "newsletter@mustreads.com" },
      "subject": "The Value Rotation Is Here: ...",
      "category": "newsletter",
      "subcategory": "finance",
      "keywords": ["investing", "portfolio", "rotation"],
      "summary": "Analysis of market rotation from growth to value stocks...",
      "links": ["https://example.com/article"],
      "time_estimate_min": 8,
      "project_relevance": null,
      "confidence": 0.89,
      "suggested_action": "queue"
    }
  ],
  "stats": { ... }
}
```

Categories: `newsletter`, `event`, `transactional`, `marketing`, `notification`, `personal`, `uncategorized`.

---

## Output Format

The digest is printed conversationally:

```
Morning! 147 emails on 2026-02-17 — here's what matters:

📄 newsletter/finance
1. ★ Must Reads — "The Value Rotation Is Here..." (8min)
   [https://example.com/article] | Analysis of market rotation...
   (finance)

🎵 event/music
2. Songkick — New shows: London this week (2min)
   [https://songkick.com/...] | Event: Sat 22 Feb

...

🎁 Wildcard: The word "spam" comes from Monty Python sketch...

Queue total: 1h 26min / 120min budget

Your call? "queue 1,3" / "skip all" / "details on #?"
```

Reply in plain text (currently manual integration).

---

## Architecture

- **Security first**: No email bodies on VPS, only metadata
- **Simple persistence**: JSON files
- **Conversational**: Designed for human-in-the-loop
- **Learning loop**: Signals improve over time

---

## Roadmap

- [x] v0.1 — Digest formatter, queue, feedback, wildcard generator
- [ ] Response parsing automation
- [ ] Sender reputation breaking into digest scoring
- [ ] Topic evolution detection
- [ ] Weekly review auto-report
- [ ] Gherkin spec automation (Jest-Cucumber)
- [ ] Context integration (repo activity cache)

---

## BDD Specs

Located in `specs/`. Written in Gherkin. Run with `npm test`.

---

_Created by Jimbo for Marvin. Not a corporate product — just good tools._
