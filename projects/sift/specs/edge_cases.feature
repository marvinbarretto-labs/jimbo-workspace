Feature: Edge Cases and Robustness

  Sift should handle imperfect data, missing fields, and unusual situations gracefully
  Without breaking the digest flow or crashing

  Scenario: Missing required fields in email item
    Given an email item lacks the "time_estimate_min" field
    When the digest is generated
    Then Sift should either:
      - Assign a default estimate (e.g., 5 minutes) based on category
      - Or skip presenting that item with a note: "Unable to estimate time"
    And the error should be logged for debug
    And the overall digest should still proceed

  Scenario: Invalid time estimate (negative or absurdly high)
    Given an item has time_estimate_min = -5 or 999
    When the item is processed
    Then Sift should clamp to reasonable values (1-180 minutes)
    Or treat it as suspect and ask Marvin manually
    And report the data anomaly

  Scenario: Duplicate items in same digest
    Given the same article appears from two different senders
    When the digest is presented
    Then ideally, Sift should detect the duplication (similar title, same link)
    And either merge them or ask: "Seen twice — should I dedupe?"
    Or at minimum, allow skipping both with one signal

  Scenario: Emails with no discernible content type
    Given an email with unclear category (neither newsletter, event, nor transactional)
    When classification is uncertain
    Then assign a default category "uncategorized" but still present it
    And ask Marvin: "What is this? Helps me learn your taxonomy"

  Scenario: Very large day (volume spike)
    Given today's digest contains 250 items (far above normal)
    When digest presentation is triggered
    Then Sift should acknowledge the spike: "Heavy day — 250 items"
    And maybe apply an initial filter: "I've pre-filtered obvious noise, 180 remain"
    Or allow Marvin to say "limit to top 20 by my current interest weights"

  Scenario: Missing entire email-digest.json file
    Given the expected input file does not exist at the path
    When the digest process runs
    Then Sift should handle gracefully: "No email digest available yet. Check your pipeline."
    And not crash or throw errors
    And optionally, generate a wildcard alone

  Scenario: Corrupted JSON in email-digest.json
    Given the digest file contains invalid JSON syntax
    When Sift tries to parse it
    Then the error should be caught and logged
    And Marvin should see a friendly error: "The digest file is corrupted. Please check your classifier output."
    And the system should not break

  Scenario: Category or keyword evolution
    Given Marvin suddenly starts caring about a new topic (e.g., "Web3", "sailing", "baking")
    When first emails of that type appear
    Then Sift should recognize the novel keyword and ask: "New topic: sailing — interested?"
    And create new category/subcategory entries on the fly
    And the learning model should incorporate it from early signals

  Scenario: Sent without permission or accidental queue
    When Marvin inadvertently queues an item they meant to skip
    And says "oops, remove that" shortly after
    Then Sift should support correction and reverse the signal
    And the feedback log should reflect the correction (maybe mark as "ambiguous" rather than commit)

  Scenario: Migration or schema change
    Given we change the email-digest.json field names or structure
    When old format files are encountered
    Then Sift should support legacy format for a transition period
    Or at minimum, fail with clear error telling Marvin to update the classifier
    And the error should not lose any data
