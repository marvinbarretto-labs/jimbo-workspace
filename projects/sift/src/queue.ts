import * as fs from 'fs';
import * as path from 'path';
import { ContentQueue, QueueItem } from './types';

export class QueueManager {
  private queueFile: string;
  private config: { budget_minutes: number };
  private data: ContentQueue;

  constructor(statePath: string, budgetMinutes: number = 120) {
    this.queueFile = path.join(statePath, 'queue.json');
    this.config = { budget_minutes: budgetMinutes };
    this.data = this.load();
  }

  private load(): ContentQueue {
    try {
      const text = fs.readFileSync(this.queueFile, 'utf-8');
      const parsed = JSON.parse(text);
      return {
        queue: parsed.queue || [],
        total_time_min: parsed.total_time_min || 0,
        budget_limit_min: parsed.budget_limit_min || this.config.budget_minutes
      };
    } catch {
      return { queue: [], total_time_min: 0, budget_limit_min: this.config.budget_minutes };
    }
  }

  private save() {
    this.data.total_time_min = this.data.queue.reduce((sum, item) => sum + item.time_min, 0);
    fs.writeFileSync(this.queueFile, JSON.stringify({
      queue: this.data.queue,
      total_time_min: this.data.total_time_min,
      budget_limit_min: this.data.budget_limit_min
    }, null, 2));
  }

  add(item: QueueItem): void {
    this.data.queue.push(item);
    this.save();
  }

  removeByIndices(indices: number[]): void {
    indices.sort((a,b) => b - a);
    for (const idx of indices) {
      if (idx > 0 && idx <= this.data.queue.length) {
        this.data.queue.splice(idx-1, 1);
      }
    }
    this.save();
  }

  clear(): void {
    this.data.queue = [];
    this.save();
  }

  getQueue(): QueueItem[] {
    return [...this.data.queue];
  }

  getTotalTime(): number {
    return this.data.total_time_min;
  }

  getBudget(): number {
    return this.data.budget_limit_min;
  }

  getBudgetStatus(): { remaining: number; over_budget: boolean } {
    const remaining = this.data.budget_limit_min - this.data.total_time_min;
    return { remaining, over_budget: remaining < 0 };
  }

  pruneOlderThan(days: number = 30): number {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const beforeCount = this.data.queue.length;
    this.data.queue = this.data.queue.filter(item => {
      const added = new Date(item.added);
      return added >= cutoff;
    });
    this.save();
    return beforeCount - this.data.queue.length;
  }

}
