Feature: Weekly Sprint Review

  Every week, Sift and Marvin review how the system is working
  So we can iterate on the model, adjust heuristics, and keep the learning loop tight

  Scenario: Weekly review automatically triggered
    Given it's the designated review day and time (e.g., Monday 9am)
    When the review is triggered
    Then I should send a conversational message summarizing the past week
    And include key metrics, questions, and suggestions
    And ask Marvin for feedback on what is and isn't working

  Scenario: Review includes hit rate analysis
    Given we have signal data for the past week
    When the review message is composed
    Then it should show: "Items presented: N, items queued: M, hit rate: P%"
    And compare it to previous weeks (up/down trend)
    And ask: "What contributed to the improvement/drop?"

  Scenario: Review surfaces redundant sources
    Given we track which senders consistently got skipped
    When the review runs
    Then it should list: "These newsletters you skipped >80% this week: X, Y, Z — consider unsubscribing?"
    And highlight duplicate content patterns (e.g., "Hacker Newsletter and TechCrunch overlap 60%")

  Scenario: Review identifies content gaps
    Given we track keywords and topics of queued items
    When the review analyses interests
    Then it might say: "You queued 10 music-related items this week. Want me to find more live event sources?"
    Or: "No Rust/Sys programming content appeared. Is that intentional or are you missing sources?"

  Scenario: Review includes wildcard scoreboard
    Given the wildcard game runs weekly
    When the review happens
    Then it should say: "Wildcard score last week: Jimbo 5, Marvin 3"
    And ask: "What wildcards landed well? What missed?"
    And note pattern improvements

  Scenario: Review asks about queue health
    Given the queue has accumulated items
    When the review asks about consumption
    Then it should ask: "Did you get through your queue last week? Too much backlog?"
    And possibly suggest: "Your queue hit 3 hours — should I be more ruthless?"

  Scenario: Review adjusts system parameters based on feedback
    When Marvin provides specific feedback (e.g., "give me more events", "skip all marketing newsletters")
    Then the digest configuration should be updated for next week
    And the changes should be noted in the SIFT.md changelog

  Scenario: Review planning for next week
    Given the review is concluding
    When Marvin and I have discussed adjustments
    Then I should commit a brief note to SIFT.md summarizing takeaways
    And any new rules should be put into the classifier (offline) or my presentation logic
