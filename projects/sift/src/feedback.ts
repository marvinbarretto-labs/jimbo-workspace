import * as fs from 'fs';
import * as path from 'path';
import { FeedbackStore, SignalRecord, EmailItem } from './types';

export class FeedbackManager {
  private file: string;
  private data: FeedbackStore;

  constructor(statePath: string) {
    this.file = path.join(statePath, 'feedback.json');
    this.data = this.load();
  }

  private load(): FeedbackStore {
    try {
      const text = fs.readFileSync(this.file, 'utf-8');
      return JSON.parse(text);
    } catch {
      return {
        signals: [],
        stats: { total_presented: 0, total_queued: 0, total_skipped: 0, hit_rate: 0 },
        sender_reputation: {},
        topic_patterns: {}
      };
    }
  }

  private save() {
    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
  }

  recordSignal(item: EmailItem, signal: 'queue' | 'skip' | 'unsubscribe'): void {
    const record: SignalRecord = {
      item_id: item.id,
      sender: item.sender.email,
      category: item.category,
      signal,
      timestamp: new Date().toISOString()
    };
    this.data.signals.push(record);

    this.data.stats.total_presented += 1;
    if (signal === 'queue') this.data.stats.total_queued += 1;
    if (signal === 'skip') this.data.stats.total_skipped += 1;
    this.data.stats.hit_rate = this.data.stats.total_presented > 0
      ? this.data.stats.total_queued / this.data.stats.total_presented
      : 0;

    const email = item.sender.email;
    if (!this.data.sender_reputation[email]) {
      this.data.sender_reputation[email] = { queued: 0, skipped: 0, last_seen: record.timestamp };
    }
    if (signal === 'queue') this.data.sender_reputation[email].queued++;
    if (signal === 'skip') this.data.sender_reputation[email].skipped++;
    this.data.sender_reputation[email].last_seen = record.timestamp;

    for (const keyword of item.keywords) {
      if (!this.data.topic_patterns[keyword]) {
        this.data.topic_patterns[keyword] = { queued: 0, skipped: 0 };
      }
      if (signal === 'queue') this.data.topic_patterns[keyword].queued++;
      if (signal === 'skip') this.data.topic_patterns[keyword].skipped++;
    }

    this.save();
  }

  getSenderReputation(email: string): { queued: number; skipped: number; score: number } | null {
    const rep = this.data.sender_reputation[email];
    if (!rep) return null;
    const total = rep.queued + rep.skipped;
    const score = total > 0 ? rep.queued / total : 0.5;
    return { queued: rep.queued, skipped: rep.skipped, score };
  }

  getTopicInterest(keyword: string): { queued: number; skipped: number; score: number } | null {
    const pattern = this.data.topic_patterns[keyword];
    if (!pattern) return null;
    const total = pattern.queued + pattern.skipped;
    const score = total > 0 ? pattern.queued / total : 0.5;
    return { queued: pattern.queued, skipped: pattern.skipped, score };
  }

  getStats() {
    return this.data.stats;
  }

}
