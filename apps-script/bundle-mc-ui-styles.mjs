/**
 * Build mc-ui-styles-bundle.html (optional CSS bundle for single-file deploy; local uses <link> tags).
 * Run from MCurator-App: node apps-script/bundle-mc-ui-styles.mjs
 *
 * Do not concatenate legacy/alternate stacks into this bundle:
 *   mcurator-landing-v4.css, v5, v6; mcurator-museum-v2.css, v3; mcurator-landing-trio-cab-v1.css;
 *   mc-specimen-wall-interactive.css; welcome-museum-v1.js / v3.js; diagnose-ui-html.js; forum-runtime.js
 * (forum is inlined in UI.html; specimen wall interactive is separate if ever needed).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files = [
  'mcurator-museum.css',
  'mcurator-landing.css',
  'sat-unified.css',
  'specimen-record-card.css',
  'mc-clean-hero.css',
  'specimen-card-feature-section.css',
  'workflow-quest-section.css',
  'herbarium-workflow-scene.css',
  'specimen-workflow-page.css',
  'entry-choice-section.css',
  'specimen-coverflow-section.css',
  'specimen-image-system.css',
  'mc-asset-theme.css',
  'mc-homepage-narrative.css',
  'mc-homepage-arrow-path.css',
  'mc-workflow-screenshot-rebuild.css',
  'mc-passport-card-workflow.css',
  'passport-intro-section.css',
  'mc-flicker-stabilize.css',
  'mc-workbench-bento.css'
];

let css = '';
for (const f of files) {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) {
    console.warn('skip missing', f);
    continue;
  }
  css += `\n/* ===== ${f} ===== */\n`;
  css += fs.readFileSync(p, 'utf8');
}

const out = `<style id="mc-gas-bundled-css">\n${css}\n</style>\n`;
const dest = path.join(__dirname, 'mc-ui-styles-bundle.html');
fs.writeFileSync(dest, out, 'utf8');
console.log('Wrote', dest, '(' + out.length + ' chars)');
