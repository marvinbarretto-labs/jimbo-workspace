Feature: Daily Wildcard (Gamified Learning)

  As a curious human
  I get one surprise item each day alongside my digest
  So I can be delighted and the system can learn what unexpected things interest me

  Background:
    Given wildcard-score.json exists with weekly scores starting at 0

  Scenario: Wildcard appears with digest
    When Sift generates the daily digest
    Then it should include exactly one wildcard item after the regular items
    And the wildcard should be formatted distinctly (🎁 or similar)
    And it should be from a category/subject not necessarily related to normal email content

  Scenario: Marvin likes the wildcard
    When Marvin responds positively (e.g., "wildcard good", "nice", "point for you")
    Then Jimbo's score should increment by 1 in wildcard-score.json
    And the wildcard topic/genre should be noted as a "positive" signal
    And I should reply with "Score: Jimbo X, Marvin Y. Nice!"

  Scenario: Marvin doesn't like the wildcard
    When Marvin responds negatively (e.g., "skip", "pointless", "point for me")
    Then Marvin's score should increment by 1
    And the wildcard topic/genre should be noted as a "negative" or "miss"
    And I should reply with "Score: Jimbo X, Marvin Y. Fair enough."

  Scenario: Weekly scoreboard reset
    Given it's Monday morning (or the designated review day)
    When the weekly review is triggered
    Then the scores should be reset to 0,0 in wildcard-score.json
    And the previous week's final score should be recorded in history
    And a summary like "Last week: Jimbo 7, Marvin 3 — congrats to me!" should be in the review

  Scenario: Wildcard learns from pattern
    Given I've noticed Marvin consistently likes wildcards about "obscure tools", "weird history", "lateral thinking"
    And consistently skips "science facts", "pop culture trivia"
    When generating new wildcards
    Then I should bias toward topics that have landed positively
    And avoid or de-emphasize topics he consistently rejects
    But still occasionally try new categories to explore boundaries

  Scenario: Wildcard doesn't break the digest flow
    Given the digest is meant to be quick to process
    When including the wildcard
    Then it should be concise — one sentence of surprise content, maybe two
    Not a paragraph or a long read
    And it should be clearly separated from the actionable digest content
