Feature: Learning Loop

  As Sift
  I want to build a model of what content Marvin cares about
  So I can improve digests over time and predict what to surface

  Scenario: Sender reputation evolves consistently
    Given a sender "newsletter@bytes.dev" has been queued 5 times and skipped 2 times
    When a new email from that sender arrives with similar content
    Then the digest could optionally highlight it as "high reputation sender" or deprioritize based on net score
    And the reputation score should reflect the signal history

  Scenario: Topic relevance learning
    Given Marvin consistently queues items with keywords like "react", "angular", "signals"
    And consistently skips items with keywords like "python", "data science"
    When a new article about "React server components" appears
    Then the digest could optionally tag it with "likely interested" based on keyword pattern
    And topic weights are updated in feedback tracking

  Scenario: Context awareness from project activity
    Given Marvin has been actively working on Spoons (Angular + Firebase) this week
    And I have read access to his repos and can see recent commits
    When an article about "Firebase caching strategies" arrives
    Then the digest could surface it with higher relevance or ask "This seems relevant to your Firebase work — interested?"
    And repos activity is factored into the learning model

  Scenario: Hit rate tracking over time
    Given we track total items presented vs. items queued per week
    When weekly review happens
    Then the hit rate should be calculated: (queued / total_presented)
    And we should see improvement week over week (target > 80%)
    And stale patterns (persistent low-hit-rate categories) should be flagged for review

  Scenario: Learning handles conflicting signals
    Given Marvin queued a "video tutorial" from Fireship last week
    But this week he skipped the same type of content
    When new Fireship videos arrive
    Then the system shouldn't permanently blacklist or whitelist; it should track recent trends more heavily
    And the learning model considers recency of signals

  Scenario: Weekly review identifies improvement opportunities
    Given we have 4 weeks of signal data
    When I generate the weekly review report
    Then I should be able to report: "Your hit rate improved from 65% to 78% this week"
    And I should surface: "You skipped 8 articles about 'product management' — is that category no longer interesting?"
    And I should suggest: "Consider unsubscribing from X newsletter (you've skipped 12 of last 15)"
