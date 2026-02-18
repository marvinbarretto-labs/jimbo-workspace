#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { DigestFormatter } from '../src/digest';
import { EmailDigest } from '../src/types';

const config = {
  digest_time: '08:00',
  timezone: 'GMT',
  budget_minutes: 120,
  input_path: '/workspace/email-digest.json', // not used here
  state_path: '/workspace/projects/sift/data'
} as const;

const reply = process.argv[2];
if (!reply) {
  console.error('Usage: ts-node scripts/parse-response.ts "<reply text>"');
  process.exit(1);
}

const presentedPath = path.join(config.state_path, 'presented.json');
if (!fs.existsSync(presentedPath)) {
  console.error('❌ No presented items found. Run digest first.');
  process.exit(1);
}

const presentedData = fs.readFileSync(presentedPath, 'utf-8');
const presentedItems: EmailDigest['items'] = JSON.parse(presentedData);

const formatter = new DigestFormatter(config);
const result = formatter.parseResponse(reply, presentedItems);

console.log(result.message);
