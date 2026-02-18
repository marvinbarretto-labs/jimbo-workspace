#!/usr/bin/env ts-node

/**
 * "WHAT DID I MISS?" DEMO
 *
 * Marvin asks: "What was interesting last week that I skipped?"
 * Sift searches feedback log for items from high-reputation senders
 * that were skipped, but normally he queues.
 */

interface Item {
  id: string;
  title: string;
  source: string;
  category: string;
  date: string;
  reason: 'skipped';
}

// Simulated feedback log with skip events
const skippedItems: Item[] = [
  { id: 'a1', title: 'React 19 Server Actions Deep Dive', source: 'Bytes.dev', category: 'tech/frontend', date: '2026-02-12', reason: 'skipped' },
  { id: 'a2', title: 'Firebase Performance Optimization', source: 'Firebase Blog', category: 'tech/backend', date: '2026-02-11', reason: 'skipped' },
  { id: 'a3', title: 'TypeScript 5.4 Release Notes', source: 'TypeScript Weekly', category: 'tech/languages', date: '2026-02-10', reason: 'skipped' },
  { id: 'a4', title: 'London Tech Events This Week', source: 'Tech London', category: 'event', date: '2026-02-13', reason: 'skipped' },
];

// Simulated sender reputation (learned from past behavior)
const senderReputation: Record<string, { queued: number; skipped: number; score: number }> = {
  'Bytes.dev': { queued: 25, skipped: 3, score: 0.89 },
  'Firebase Blog': { queued: 12, skipped: 1, score: 0.92 },
  'TypeScript Weekly': { queued: 8, skipped: 4, score: 0.67 },
  'Tech London': { queued: 5, skipped: 2, score: 0.71 },
};

console.log(`\n🔎 WHAT DID I MISS?\n`);
console.log(`Marvin asks: "What was interesting last week that I skipped but would normally queue?"\n`);

console.log(`Sift scans your feedback and notices:`);
console.log(`  - You consistently QUEUE items from Bytes.dev, Firebase Blog, TypeScript Weekly`);
console.log(`  - Last week, you SKIPPED some items from these same senders`);
console.log(`  - Maybe you were busy, or they arrived at a bad time.\n`);

const likelyInteresting = skippedItems.filter(item => {
  const rep = senderReputation[item.source];
  return rep && rep.score >= 0.7; // high-reputation sender
});

if (likelyInteresting.length === 0) {
  console.log(`✅ No high-reputation items were skipped last week. Good attention!`);
} else {
  console.log(`🎯 Here are items you probably wanted to read:\n`);
  likelyInteresting.forEach(item => {
    console.log(`  [${item.source}] ${item.title}`);
    console.log(`  Category: ${item.category} | Date: ${item.date}`);
    console.log(`  Why: You've queued ${senderReputation[item.source]?.queued || 0} items from ${item.source} before.\n`);
  });

  console.log(`💡 Actions:`);
  console.log(`  - "queue all" — add these to your current reading queue`);
  console.log(`  - "queue #1, #3" — pick specific ones`);
  console.log(`  - "more like this" — find similar articles from other sources`);
  console.log(`  - "not interested" — tell me to stop surfacing ${likelyInteresting[0]?.source} tips`);
}

console.log(`\n--- Demo Complete ---\n`);
