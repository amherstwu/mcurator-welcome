/**
 * Writes welcome-museum-inline.fragment.html from welcome-museum.js (optional static include).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsPath = path.join(__dirname, 'welcome-museum.js');
const outPath = path.join(__dirname, 'welcome-museum-inline.fragment.html');
const js = fs.readFileSync(jsPath, 'utf8');
fs.writeFileSync(outPath, js, 'utf8');
console.log('Wrote', outPath, '(' + js.length + ' bytes)');
