// All Sift type definitions

export interface EmailDigest {
  date: string;
  generated_at: string;
  total_items: number;
  items: EmailItem[];
  stats: DigestStats;
}

export interface EmailItem {
  id: string;
  date: string;
  sender: {
    name: string;
    email: string;
  };
  subject: string;
  category: Category;
  subcategory: string;
  keywords: string[];
  summary: string;
  body_snippet: string;
  links: string[];
  time_estimate_min: number;
  project_relevance?: ProjectKey | null;
  confidence: number;
  suggested_action: SuggestedAction;
}

export type Category =
  | 'newsletter'
  | 'transactional'
  | 'event'
  | 'marketing'
  | 'notification'
  | 'personal'
  | 'uncategorized';

export type ProjectKey = 'spoons' | 'localshout' | 'pomodoro' | null;

export type SuggestedAction = 'queue' | 'skip' | 'unsubscribe_candidate';

export interface DigestStats {
  by_category: Record<Category, number>;
  by_suggested_action: Record<SuggestedAction, number>;
  total_queue_time_min: number;
}

export interface QueueItem {
  id: string;
  title: string;
  category: string;
  time_min: number;
  link: string;
  added: string;
  source_email?: string;
  status: 'queued' | 'consumed' | 'archived';
}

export interface ContentQueue {
  queue: QueueItem[];
  total_time_min: number;
  budget_limit_min: number;
}

export interface SignalRecord {
  item_id: string;
  sender: string;
  category: string;
  signal: 'queue' | 'skip' | 'unsubscribe';
  timestamp: string;
  reason?: string;
}

export interface FeedbackStore {
  signals: SignalRecord[];
  stats: {
    total_presented: number;
    total_queued: number;
    total_skipped: number;
    hit_rate: number;
  };
  sender_reputation: Record<string, {
    queued: number;
    skipped: number;
    last_seen: string;
  }>;
  topic_patterns: Record<string, {
    queued: number;
    skipped: number;
  }>;
}

export interface WildcardScore {
  week_start: string;
  jimbo_score: number;
  marvin_score: number;
  history: Array<{
    week_start: string;
    jimbo_score: number;
    marvin_score: number;
  }>;
}

export interface SiftConfig {
  digest_time: string;
  timezone: string;
  budget_minutes: number;
  input_path: string;
  state_path: string;
  wildcard_source?: string;
}
