Feature: Daily Digest Presentation

  As a user with a crowded inbox
  I want a morning digest of interesting emails
  So I can decide what to queue for reading without wading through noise

  Background:
    Given an email digest JSON file exists at the expected location
    And the digest contains items with categories, time estimates, and keywords

  Scenario: Digest presents items conversationally
    When Sift reads the email-digest.json for today
    Then I should receive a message listing all items presented as a conversation
    And each item should show: sender, subject, category, time estimate, and a brief summary
    And items should be numbered clearly
    And the total queued time should be shown
    And a daily wildcard should be included

  Scenario: Digest handles empty inbox gracefully
    Given the email-digest.json contains zero items
    When Sift generates the digest
    Then I should receive a message saying something like "No emails came in overnight"
    And no queue total should be presented
    And a wildcard should still be shown

  Scenario: Digest respects auto-skip items
    Given some items in the digest have "auto_skip": true
    When Sift generates the digest
    Then those items should not be presented at all
    And auto-skipped items should be recorded in the feedback log for learning
    And only queue-worthy or discretionary items appear

  Scenario: Digest groups similar categories for readability
    Given the digest contains multiple items from the same category (e.g., multiple newsletters)
    When Sift presents the digest
    Then items might be optionally grouped by category (implementation detail)
    But the numbering and selection still works item-by-item
