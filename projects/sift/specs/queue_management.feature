Feature: Queue Management & Time Budget

  As Marvin
  I want a running total of queued content duration
  So I can see at a glance if I've got 2 hours of reading material and need to carve out time

  Scenario: Queued time remains under budget
    Given the time budget is set to 120 minutes
    And the current queue total is 90 minutes
    When an item with 15 minute estimate is queued
    Then the new total should be 105 minutes
    And no warning should be raised

  Scenario: Queue exceeds budget, but doesn't block
    Given the queue already shows 115 minutes
    When an item with 20 minutes is queued
    Then the new total should be 135 minutes
    And a message should say "Queue now exceeds your 2h budget — consider clearing some"
    But the item is still added (no hard blocking, user is in control)

  Scenario: Viewing queue details
    When Marvin asks "What's in my queue?"
    Then Sift should list all queued items with title, category, time estimate, and date added
    And show the total time
    And possibly suggest items to remove or defer

  Scenario: Clearing old queued items
    When Marvin says "clear my queue" or "remove oldest 5 items"
    Then those items should be removed from content-queue.json or marked as archived
    And the total time should be recalculated
    And a confirmation reported

  Scenario: Queue persists across sessions
    Given the queue has items from previous days
    When a new digest is presented
    The existing queue should still be there (unless cleared)
    And the total should include both old and new items
    And old items should be clearly marked with their original date

  Scenario: Queue item marked as complete
    When Marvin says "I finished reading article X"
    Then that item should be removed from the active queue
    And optionally moved to a consumption history log
    And the total time reduced accordingly
    And the learning signal might be reinforced (if it was queued and then consumed, hit rate justification)
