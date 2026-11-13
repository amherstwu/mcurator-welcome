import fs from 'fs';

const src = fs.readFileSync('apps-script/mc-hero-v2.css', 'utf8');
const start = src.indexOf("#mcWelcomeHero[data-hero-version='passport-hero-rebuild-v3'] .mc-passport-card__face {");
const end = src.indexOf("#mcWelcomeHero[data-hero-version='passport-hero-rebuild-v3'] .mc-passport-card__backTitle {");
let block = src.slice(start, end);
const from = /#mcWelcomeHero\[data-hero-version='passport-hero-rebuild-v3'\] /g;
const prefix = '.mc-workflow-screenshot-rebuild .mc-passport-card--workflow ';
block = block.replace(from, prefix);
block = block.replace(/\.mc-passport-card--lead:hover \.mc-passport-card__face::before,/g, '');
block = block.replace(/\.mc-passport-card--lead\.is-tilting \.mc-passport-card__face::before,/g, '');
block = block.replace(
  /\.mc-passport-card--deck-back:hover \.mc-passport-card__face::before \{/g,
  '.mc-passport-card--workflow:hover .mc-passport-card__face::before {'
);
block = block.replace(/\.mc-passport-card--deck-back \.mc-passport-card__face::after,/g, '');
block = block.replace(
  /\.mc-passport-card--lead \.mc-passport-card__face::after \{/g,
  '.mc-passport-card--workflow .mc-passport-card__face::after {'
);

const header = `/* Workflow passport card — copied from mc-hero-v2 passport-hero-rebuild-v3 */
.mc-workflow-screenshot-rebuild .mc-passport-card--workflow {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}
.mc-workflow-screenshot-rebuild .mcwf-card-face--front {
  position: relative;
  inset: auto;
  overflow: visible;
  padding: 0;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.mc-workflow-screenshot-rebuild .mcwf-evolving-card {
  width: clamp(292px, 28vw, 360px);
  height: auto;
  aspect-ratio: 640 / 1010;
  max-height: min(560px, calc(100vh - var(--mcwf-nav-offset) - var(--mcwf-story-reserve) - 88px));
}
.mc-workflow-screenshot-rebuild .mcwf-card-face--front > .passport-card-locked,
.mc-workflow-screenshot-rebuild .passport-card-locked.passport-card-stage {
  display: none !important;
}
`;

fs.writeFileSync('apps-script/mc-passport-card-workflow.css', header + block);
console.log('wrote apps-script/mc-passport-card-workflow.css');
