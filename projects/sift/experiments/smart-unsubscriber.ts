#!/usr/bin/env ts-node

/**
 * SMART UNSUBSCRIBER DEMO
 *
 * Analyzes newsletters you consistently skip and suggests unsubscribing.
 * Shows the potential time savings and gives one-click unsubscribe.
 */

interface NewsletterStats {
  name: string;
  email: string;
  total_received: number;
  times_queued: number;
  times_skipped: number;
  last_interaction: string; // date
}

const newsletters: NewsletterStats[] = [
  { name: 'Bytes.dev', email: 'newsletter@bytes.dev', total_received: 28, times_queued: 25, times_skipped: 3, last_interaction: '2026-02-17' },
  { name: 'JS Weekly', email: 'weekly@jsweekly.com', total_received: 24, times_queued: 22, times_skipped: 2, last_interaction: '2026-02-17' },
  { name: 'Product Hunt Daily', email: 'newsletter@producthunt.com', total_received: 30, times_queued: 2, times_skipped: 28, last_interaction: '2026-02-16' },
  { name: 'Hacker Newsletter', email: 'hn@hackernewsletter.com', total_received: 26, times_queued: 18, times_skipped: 8, last_interaction: '2026-02-17' },
  { name: 'TechCrunch Daily', email: 'newsletter@techcrunch.com', total_received: 29, times_queued: 1, times_skipped: 28, last_interaction: '2026-02-15' },
  { name: 'Marketing Tips Weekly', email: 'tips@marketingtips.com', total_received: 12, times_queued: 0, times_skipped: 12, last_interaction: '2026-02-10' },
];

console.log(`\n✉️ SMART UNSUBSCRIBER\n`);
console.log(`Analysis of your newsletter engagement over the last 30 days:\n`);

const skipThreshold = 0.8; // skip 80%+ of the time
const candidates = newsletters.filter(n => n.times_skipped / n.total_received >= skipThreshold && n.times_queued === 0);

if (candidates.length === 0) {
  console.log(`✅ No newsletters meet the "consistently skipped" threshold. Good job curating!`);
} else {
  console.log(`📊 Newsletters you consistently skip (${candidates.length} found):\n`);
  candidates.forEach((n, i) => {
    const skipRate = Math.round(n.times_skipped / n.total_received * 100);
    const timeWasted = Math.round(n.total_received * 2.5); // estimate 2.5min per newsletter to skim
    console.log(`  ${i + 1}. ${n.name} <${n.email}>`);
    console.log(`     Received: ${n.total_received}, Queued: ${n.times_queued}, Skipped: ${n.times_skipped} (${skipRate}%)`);
    console.log(`     Est. time wasted: ~${timeWasted} minutes/month\n`);
  });

  console.log(`💡 Suggestion: Unsubscribe to reduce daily noise.`);
  console.log(`   I can generate unsubscribe links for you, or you can click manually.`);
  console.log();

  // Simulate Marvin's response
  console.log(`Marvin, what would you like to do?`);
  console.log(`  1. Unsubscribe ALL of the above (one click, batch)`);
  console.log(`  2. Unsubscribe selectively (choose specific ones)`);
  console.log(`  3. Keep them (maybe I'll start featuring something interesting)`);
  console.log(`  4. Defer decision (I'll ask again in 2 weeks)`);

  const action = '1';
  console.log(`\n→ You chose: ${action}`);

  if (action === '1') {
    console.log(`✂️ Processing batch unsubscribe...`);
    candidates.forEach(n => {
      console.log(`   ✓ Generated unsubscribe link for ${n.name}`);
      // In real life: would fetch the unsubscribe URL from email headers or email-me-unsubscribe service
    });
    console.log(`   Total unsubscribe links ready. Want me to open them or just save for later?`);
  } else if (action === '2') {
    console.log(`Pick which ones to unsubscribe: (list would appear)`);
  }
}

console.log(`\n--- Demo Complete ---\n`);
