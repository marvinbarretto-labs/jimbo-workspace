import * as fs from 'fs';
import * as path from 'path';
import { WildcardScore } from './types';

export class WildcardGenerator {
  private score: WildcardScore;
  private scorePath: string;

  private static defaultWildcards: string[] = [
    "The word 'spam' comes from a Monty Python sketch where Vikings sing about Spam (the canned meat) drowning out conversation — hence junk email.",
    "The QWERTY keyboard layout was designed to slow typists down — early typewriters jammed if you typed too fast.",
    "The shortest war in history: Britain vs. Zanzibar, 38 minutes (1896).",
    "Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.",
    "Octopuses have three hearts, nine brains, and blue blood.",
    "The phrase 'rule of thumb' comes from an old law allowing men to beat their wives with sticks no wider than their thumb.",
    "The first computer bug was an actual bug — a moth trapped in a Harvard Mark II relay (1947).",
    "Venus is the only planet in our solar system that rotates clockwise (retrograde rotation).",
    "The 🍎 emoji is actually a Red Delicious apple, the most widely cultivated apple variety in the US.",
    "Scotland's national animal is the unicorn.",
    "The dot over an 'i' or 'j' is called a tittle.",
    "A group of flamingos is called a flamboyance.",
    "The 'Joseph Gap' is a UK traffic engineering term for the time gap between two trains on single-track sections.",
    "In 2007, a man in Australia tried to sell New Zealand on eBay — bidding reached $3,000 before eBay shut it down.",
    "The '-berg' in 'iceberg' means 'mountain' in Dutch — 'ice mountain'.",
    "Cats have 32 muscles in each ear, allowing them to rotate them 180 degrees.",
    "The Fibonacci sequence appears in the arrangement of seeds in a sunflower.",
    "The 'pound' symbol (#) is called an octothorpe.",
    "The first Zoom video call was held on August 21, 2012, with just 15 participants.",
    "The ancient Romans used urine as a mouthwash (it contains ammonia, a disinfectant)."
  ];

  constructor(scorePath: string) {
    this.scorePath = scorePath;
    this.score = this.loadScore();
  }

  private loadScore(): WildcardScore {
    try {
      const data = fs.readFileSync(this.scorePath, 'utf-8');
      const parsed = JSON.parse(data);
      // Ensure structure
      if (!parsed.week_start) {
        const now = new Date();
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() || 7) - 1)).toISOString().split('T')[0];
        parsed.week_start = weekStart;
        parsed.history = parsed.history || [];
      }
      return parsed;
    } catch {
      const now = new Date();
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() || 7) - 1)).toISOString().split('T')[0];
      return { week_start: weekStart, jimbo_score: 0, marvin_score: 0, history: [] };
    }
  }

  private saveScore() {
    fs.writeFileSync(this.scorePath, JSON.stringify(this.score, null, 2));
  }

  pick(): string {
    const idx = Math.floor(Math.random() * WildcardGenerator.defaultWildcards.length);
    return WildcardGenerator.defaultWildcards[idx];
  }

  recordSignal(landed: boolean) {
    if (landed) {
      this.score.jimbo_score++;
    } else {
      this.score.marvin_score++;
    }
    this.saveScore();
  }

  getScore(): { jimbo: number; marvin: number } {
    return { jimbo: this.score.jimbo_score, marvin: this.score.marvin_score };
  }

}
