Feature: Signal Capture (Queue / Skip)

  As the system
  I need to capture Marvin's signals on each digest item
  So I can learn what content matters to him over time

  Scenario: Queue an item
    When Marvin responds to an item with "queue" (or selects it via UI/buttons)
    Then the item should be added to content-queue.json with status "queued"
    And the queue total time should increase by the item's time_estimate_min
    And the item should be recorded in digest-feedback.json as signal="queue"
    And the sender's reputation in feedback should be incremented positively

  Scenario: Skip an item
    When Marvin skips an item
    Then the item should not be added to the queue
    And the signal should be recorded as signal="skip" in digest-feedback.json
    And the sender's reputation should be decremented (or neutral depending on strategy)

  Scenario: Mark for unsubscribe consideration
    When Marvin signals that a sender is "unsubscribe-worthy"
    Then an entry should be added to a potential-unsubscribes list
    And the sender's reputation should be marked as low priority
    And this should be highlighted in the weekly review

  Scenario: Handle ambiguous signals gracefully
    When Marvin says something vague like "maybe" or "not sure"
    Then Sift should ask a clarifying question to get a definite signal
    Or default to skip if no clarity, and log the ambiguity for later review

  Scenario: Multiple signals in one response
    When Marvin provides a list like "queue 1, 3, 5; skip the rest"
    Then each numbered item should have its signal recorded correctly
    And any unlisted items should default to skip
    And the queue time should update accordingly
