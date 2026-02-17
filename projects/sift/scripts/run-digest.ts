#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { EmailDigest, SiftConfig } from '../src/types';
import { DigestFormatter } from '../src/digest';
import { WildcardGenerator } from '../src/wildcard';

// Configuration
const config: SiftConfig = {
  digest_time: '08:00',
  timezone: 'GMT',
  budget_minutes: 120,
  input_path: '/workspace/email-digest.json',
  state_path: '/workspace/projects/sift/data'
} as const;

// Read the email digest
let digest: EmailDigest;
try {
  const raw = fs.readFileSync(config.input_path, 'utf-8');
  digest = JSON.parse(raw);
} catch (err: any) {
  console.error(`❌ Failed to read email digest: ${err.message}`);
  process.exit(1);
}

// Initialize components
const formatter = new DigestFormatter(config);
const wildcardGen = new WildcardGenerator(path.join(config.state_path, 'wildcard-score.json'));

// Generate wildcard
const wildcard = wildcardGen.pick();

// Format digest
const baseOutput = formatter.formatDigest(digest);

// Inject wildcard
const output = baseOutput.replace('🎁 Wildcard: ...', `🎁 Wildcard: ${wildcard}`);

console.log(output);
