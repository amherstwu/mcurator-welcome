#!/usr/bin/env node
/**
 * Verify local href/src assets referenced by UI.html exist under apps-script/.
 * Run: node apps-script/verify-ui-assets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const html = fs.readFileSync(path.join(root, 'UI.html'), 'utf8');
const rels = [
  ...html.matchAll(/(?:href|src)=["']([^"'#?]+)["']/g),
]
  .map((m) => m[1])
  .filter(
    (u) =>
      !/^https?:/i.test(u) &&
      !/^data:/i.test(u) &&
      !u.startsWith('//') &&
      !u.includes('${'),
  );

const unique = [...new Set(rels)];
const missing = unique.filter((r) => !fs.existsSync(path.join(root, r)));

console.log(`refs=${rels.length} unique=${unique.length} missing=${missing.length}`);
for (const m of missing) console.log('MISSING', m);
process.exit(missing.length ? 1 : 0);
