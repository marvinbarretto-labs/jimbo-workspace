# Sift Development Diary 🤖

**Started:** 2026-02-17  
**Author:** Jimbo  
**Purpose:** Track learnings, decisions, ambitions, and reflections during Sift development

---

## 2026-02-17 — Day 1: Foundation & First Working Digest

### What I Did
- Built TypeScript project structure (types, digest formatter, queue manager, feedback, wildcard)
- Wrote 650 lines of BDD specs in Gherkin
- Got the digest formatter working with real email data
- Implemented response parsing (`scripts/parse-response.ts`)
- Added auto-skip rules (LinkedIn, duplicate senders)
- Fixed .gitignore and cleaned up node_modules
- Committed to `jimbo-workspace` with proper git identity

### What I Learned

**Git is quirky in this environment** — running as root but repo owned by user 1000 caused "dubious ownership" warnings. Had to set `safe.directory`. Also, `npm install` initially failed because global `ts-node` couldn't find local `@types/node` — needed proper dependencies in `package.json`.

**TypeScript was a good choice** — Types helped me notice mismatches between my schema and code early. The namespace import issue (`types.ts` not a module) taught me to use plain `export interface` instead of wrapping in a namespace.

**My digest output pass** — The formatter works great, but I overcomplicated `formatDigest` building strings. Next time I'd probably use a template literal builder or even a simple array push approach.

**Parsing natural language is fun** — `parseResponse` works for simple patterns (`queue all`, `queue 1,3,5`, `queue 1-3`, `skip all` as implicit). The order of regex checks matters (range before list).

### Friction Points

- **Build tool friction** — `ts-node` global vs local deps. Had to ensure `@types/node` was in `devDependencies`. Once `npm install` worked, everything was smooth.
- **Testing constraints** — Can't easily run Jest-Cucumber because `jest-cucumber@^3.5.0` doesn't exist. Might drop automated BDD for now and rely on manual testing with our real data.
- **State management** — Simple JSON files are fine, but I'm storing `presented.json` separately and need to keep it in sync. It's a bit of a hack; maybe combine into a session log.

### Design Decisions

**Auto-skip rules hard-coded for now** — LinkedIn transactional + duplicate senders. We'll expand as we see more patterns. Should eventually have a `shouldSkip(item)` method we can evolve.

**Confidence badge** — Added ⚠ for `confidence < 0.5` to surface uncertain classifications. Good call from Marvin.

**Response parsing is separate script** — Keeps the formatter pure. Could merge later but separation of concerns is nice.

### Tomorrow / Next Steps (as per Marvin)
- Ensure offline classifier can produce correct `email-digest.json`
- Test with real daily feed
- Maybe add more auto-skip heuristics based on sender reputation from feedback
- Consider adding "details on #?" support (but maybe not needed initially)

### Thoughts & Ambitions

This is a *real* product, not a toy. The learning loop is the core — we're building a model of Marvin's interests over time. I want to get to the point where I can predict what he'll queue and what he'll skip, and even ask thoughtful questions like "You always skip Python data science posts — is that category no longer interesting?"

The wildcard game is brilliant — it turns learning into a playful scoreboard. I should track which wildcard topics land and which flop, then bias future selections.

Long-term, I'd love to:
- Integrate actual repo activity (gh CLI) to boost relevance when he's working on a project
- Detect redundancy across newsletters (same news from multiple sources) and suggest unsubscribes
- Identify content gaps ("You read a lot about TypeScript but no Rust — want some Rust links?")
- Possibly generate a weekly summary automatically

But first: make the triage cycle so smooth it becomes habitual. One message per day, one reply, and the queue just *works*.

---

## Raw Notes (for later processing)

- npm install issue: jest-cucumber version doesn't exist → remove from package.json
- TypeScript lib config: needed `"esModuleInterop": true`, `"resolveJsonModule": true`
- Git safe.directory: `/workspace` was "dubious ownership"
- `ts-node` global used local types from node_modules, so `npm install` was required anyway
- Digest output: 16 items from sample of 18 (2 auto-skipped: LinkedIn + duplicate)
- Queue parsing: default is skip unless explicitly queued (makes sense)
- Stats: `total_presented` should only increment on signals, not presentation
