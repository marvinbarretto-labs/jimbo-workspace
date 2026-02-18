#!/usr/bin/env ts-node

/**
 * REDUNDANCY RADAR DEMO
 *
 * Scenario: Over the last 7 days, the same news about "React 19 server actions"
 * has appeared in 4 different newsletters. Sift detects the duplication and
 * asks Marvin which source he wants to keep.
 */

interface Article {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
}

// Simulated duplicate articles (same story, different publishers)
const duplicates: Article[] = [
  { id: '1', title: 'React 19 Server Actions are now stable', source: 'Bytes.dev', url: 'https://bytes.dev/react-19', date: '2026-02-15' },
  { id: '2', title: 'React 19: Server Actions production ready', source: 'JavaScript Weekly', url: 'https://jsweekly.com/react-19', date: '2026-02-16' },
  { id: '3', title: 'Server Actions in React 19: What you need to know', source: 'Frontend Focus', url: 'https://frontendfocus.com/react-19', date: '2026-02-16' },
  { id: '4', title: 'React 19 stability: Server Actions edition', source: 'Hacker Newsletter', url: 'https://hackernewsletter.com/react-19', date: '2026-02-17' },
];

console.log(`\n🔍 REDUNDANCY RADAR\n`);
console.log(`I've detected that the same article topic has appeared in multiple newsletters over the last week:`);

duplicates.forEach((art, i) => {
  console.log(`  ${i + 1}. ${art.source} — "${art.title}"`);
  console.log(`     ${art.url}\n`);
});

console.log(`Analysis:`);
console.log(`  - All 4 articles cover the same core story (React 19 Server Actions stable)`);
console.log(`  - Total reading time if you read all: ~16 minutes`);
console.log(`  - You only need to read ONE of them to get the key insights`);
console.log();

console.log(`💡 Suggestion:`);
console.log(`  Keep only your preferred source and let me auto-skip the others in future digests.`);

// Simulate Marvin's choice
console.log(`\nMarvin, which source would you like to keep?`);
console.log(`  1. Bytes.dev (your most-queued newsletter)`);
console.log(`  2. JavaScript Weekly (highest open rate)`);
console.log(`  3. Frontend Focus (local relevance to your projects)`);
console.log(`  4. Hacker Newsletter (broad audience)`);
console.log(`  5. Actually, I want to keep ALL of them (different angles)`);
console.log(`  6. Unsubscribe from all of them (I'll follow this topic elsewhere)`);

// Simulate a choice
const choice = '1';
console.log(`\n→ You chose: ${choice}`);

if (choice === '1') {
  console.log(`✅ Done! I'll add a rule: when duplicate "React server" stories appear,`);
  console.log(`   prioritize Bytes.dev and auto-skip the others.`);
  console.log(`   Override rule: if you specifically queue one of the others, I'll still present it.`);
} else if (choice === '6') {
  console.log(`✂️ Unsubscribing from all 4 newsletters. This topic will be missed.`);
}

console.log(`\nRedundancy Radar can run weekly and identify patterns like:`);
console.log(`  - "You've seen 12 articles about Firebase this month from 5 different senders"`);
console.log(`  - "Three newsletters cover the same Product Hunt launches — pick your favorite"`);
console.log(`  - "This marketing tip appears in every business newsletter — want to kill it?"`);

console.log(`\n--- Demo Complete ---\n`);
