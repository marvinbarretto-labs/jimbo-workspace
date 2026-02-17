import * as fs from 'fs';
import * as path from 'path';
import { EmailDigest, SiftConfig, QueueItem, SignalRecord, EmailItem, FeedbackStore } from './types';

export class DigestFormatter {
  private queue: QueueItem[] = [];
  private feedback: FeedbackStore;
  private config: SiftConfig;

  constructor(config: SiftConfig) {
    this.config = config;
    this.feedback = this.loadFeedback();
    this.queue = this.loadQueue();
  }

  private loadQueue(): QueueItem[] {
    try {
      const data = fs.readFileSync(path.join(this.config.state_path, 'queue.json'), 'utf-8');
      return JSON.parse(data).queue || [];
    } catch {
      return [];
    }
  }

  private loadFeedback(): FeedbackStore {
    try {
      const data = fs.readFileSync(path.join(this.config.state_path, 'feedback.json'), 'utf-8');
      return JSON.parse(data);
    } catch {
      return {
        signals: [],
        stats: { total_presented: 0, total_queued: 0, total_skipped: 0, hit_rate: 0 },
        sender_reputation: {},
        topic_patterns: {}
      };
    }
  }

  private saveQueue() {
    const data = JSON.stringify({ 
      queue: this.queue, 
      total_time_min: this.queue.reduce((sum, item) => sum + item.time_min, 0),
      budget_limit_min: this.config.budget_minutes 
    }, null, 2);
    fs.writeFileSync(path.join(this.config.state_path, 'queue.json'), data);
  }

  getQueue(): QueueItem[] {
    return [...this.queue];
  }

  private appendSignal(signal: SignalRecord) {
    this.feedback.signals.push(signal);
    this.feedback.stats.total_presented += 1;
    if (signal.signal === 'queue') this.feedback.stats.total_queued += 1;
    if (signal.signal === 'skip') this.feedback.stats.total_skipped += 1;
    this.feedback.stats.hit_rate = this.feedback.stats.total_presented > 0
      ? this.feedback.stats.total_queued / this.feedback.stats.total_presented
      : 0;
    const file = path.join(this.config.state_path, 'feedback.json');
    fs.writeFileSync(file, JSON.stringify(this.feedback, null, 2));
  }

  private getCategoryEmoji(cat: string): string {
    const map: Record<string, string> = {
      newsletter: '📄',
      event: '📅',
      transactional: '📦',
      marketing: '💰',
      notification: '🔔',
      personal: '💌',
      uncategorized: '❓'
    };
    return map[cat] || '📨';
  }

  private calculateRelevance(item: EmailItem): number {
    let score = item.confidence * 10;
    if (item.project_relevance) score += 20;
    const rep = this.feedback.sender_reputation[item.sender.email];
    if (rep) {
      const ratio = rep.queued / (rep.queued + rep.skipped || 1);
      score += ratio * 15;
    }
    return score;
  }

  formatDigest(digest: EmailDigest): string {
    const output = `Morning! ${digest.total_items} emails on ${digest.date} — here's what matters:\n\n`;
    const itemsByCat = new Map<string, EmailDigest['items']>();
    for (const item of digest.items) {
      const key = `${item.category}/${item.subcategory}`;
      if (!itemsByCat.has(key)) itemsByCat.set(key, []);
      itemsByCat.get(key)!.push(item);
    }

    let itemNumber = 1;
    const presentedItems: EmailDigest['items'] = [];
    let result = '';

    for (const [catKey, items] of itemsByCat) {
      const filtered = items.filter(it => it.suggested_action !== 'skip' && it.suggested_action !== 'unsubscribe_candidate');
      if (filtered.length === 0) continue;
      const [cat, sub] = catKey.split('/');
      result += `${this.getCategoryEmoji(cat)} ${cat}/${sub}\n`;

      for (const item of filtered) {
        const relevance = this.calculateRelevance(item);
        const badge = relevance > 25 ? '★' : '';
        result += `${itemNumber}. ${badge} ${item.sender.name} — "${item.subject}" (${item.time_estimate_min}min)\n`;
        result += `   [${item.links[0] || '🔗'}] | ${item.summary}\n\n`;
        if (item.subcategory) result += `   (${item.subcategory})\n`;
        presentedItems.push(item);
        itemNumber++;
      }
    }

    result += `\n🎁 Wildcard: ...\n\n`;

    const totalQueue = this.queue.reduce((sum, it) => sum + it.time_min, 0);
    const formatMinutes = (min: number) => {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };
    result += `Queue total: ${formatMinutes(totalQueue)} / ${this.config.budget_minutes}min budget\n\n`;
    result += `Your call? "queue 1,3" / "skip all" / "details on #?"`;

    this.feedback.stats.total_presented += presentedItems.length;
    fs.writeFileSync(path.join(this.config.state_path, 'feedback.json'), JSON.stringify(this.feedback, null, 2));

    return result;
  }

  parseResponse(response: string, presentedItems: EmailDigest['items']): { queued: number; skipped: number; message: string } {
    const lower = response.toLowerCase().trim();
    let queuedIndices: number[] = [];
    let skippedCount = 0;

    if (lower.includes('queue all') || lower.includes('all')) {
      queuedIndices = presentedItems.map((_, i) => i + 1);
    } else if (lower.includes('skip all')) {
      skippedCount = presentedItems.length;
    } else if (lower.match(/queue\s+[\d,\s]+/)) {
      const match = lower.match(/queue\s+([\d,\s]+)/);
      if (match) {
        queuedIndices = match[1].split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
      }
    } else if (lower.match(/queue\s+\d+-\d+/)) {
      const match = lower.match(/queue\s+(\d+)-(\d+)/);
      if (match) {
        const start = parseInt(match[1]);
        const end = parseInt(match[2]);
        for (let i = start; i <= end; i++) queuedIndices.push(i);
      }
    }

    const now = new Date().toISOString();
    let queuedCount = 0;

    for (let i = 0; i < presentedItems.length; i++) {
      const item = presentedItems[i];
      const idx = i + 1;
      if (queuedIndices.includes(idx)) {
        this.queue.push({
          id: item.id,
          title: item.subject,
          category: item.category,
          time_min: item.time_estimate_min,
          link: item.links[0] || '',
          added: now,
          source_email: item.sender.name,
          status: 'queued'
        });
        queuedCount++;
        this.appendSignal({
          item_id: item.id,
          sender: item.sender.email,
          category: item.category,
          signal: 'queue',
          timestamp: now
        });
      } else if (!queuedIndices.length && skippedCount === 0) {
        skippedCount++;
        this.appendSignal({
          item_id: item.id,
          sender: item.sender.email,
          category: item.category,
          signal: 'skip',
          timestamp: now
        });
      }
    }

    this.saveQueue();

    const totalQueue = this.queue.reduce((s, it) => s + it.time_min, 0);
    const formatMinutes = (min: number) => {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };
    return {
      queued: queuedCount,
      skipped: skippedCount,
      message: `Queued ${queuedCount} items, skipped ${skippedCount}. Queue total: ${formatMinutes(totalQueue)}`
    };
  }

}
