# Sift BDD Test Suite

This directory contains Gherkin feature specifications for the Sift email intelligence system.

## Features

- **daily_digest.feature** — Core digest presentation logic
- **signal_capture.feature** — Queue/skip/unsubscribe response handling
- **learning_loop.feature** — Building a model of user interests over time
- **queue_management.feature** — Time budget tracking and queue operations
- **daily_wildcard.feature** — Gamified surprise content delivery
- **weekly_review.feature** — Sprint-like retrospective and system tuning
- **edge_cases.feature** — Error handling, malformed data, volume spikes, schema evolution

## Running the Specs

These specs are written in Gherkin format and can be executed by any BDD framework (Cucumber, Behave, Jest-Cucumber, etc.).

### Recommended approach for Sift v0.1:

Since Sift is a conversational system with both AI and deterministic components, consider:

1. **Unit tests** for data structures (email-digest.json parsing, JSON schema validation)
2. **Integration tests** for the digest reader script (mock email data, verify presentation format)
3. **Contract tests** for signal capture (verify queue updates correctly given various responses)
4. **Manual scenario execution** for the learning loop and wildcards (human-in-the-loop)

### Minimal viable test automation:

```python
# Example: test_digest_reader.py
def test_digest_presents_all_items():
    # Given a sample email-digest.json
    # When digest.generate() runs
    # Then output contains all item titles in order
```

```javascript
// Example: test_queue_update.js
describe('Queue management', () => {
  it('adds item and updates total time')
  it('handles empty queue')
  it('respects budget without hard blocking')
})
```

## Philosophy

- Start simple. v0.1 just needs to *work*, not be perfect.
- Iterate based on real usage. These specs will grow as we discover edge cases.
- The human (Marvin) is in the loop — so errors should be recoverable and understandable.
- Track improvement: hit rate, wildcard score, satisfaction.

---

_Created: 2026-02-17 | Adapted from real conversations with Marvin_
