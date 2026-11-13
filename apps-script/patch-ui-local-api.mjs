/**
 * Replace inlined Apps Script / GAS mock in UI.html with local-preview-boot.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uiPath = path.join(__dirname, 'UI.html');
const html = fs.readFileSync(uiPath, 'utf8');

const startMarker = '  <script>\n/**\n * Specimen and demo images:';
const endMarker = '  } catch (e) {}\n\n    const _mcI18nZh = {';

const i0 = html.indexOf(startMarker);
const i1 = html.indexOf(endMarker);
if (i0 < 0 || i1 < 0) {
  console.error('patch-ui-local-api: markers not found', { i0, i1 });
  process.exit(1);
}

const replacement =
  '  <script src="local-preview-boot.js"></script>\n' +
  '  <script>\n' +
  '  if (MC_FLICKR_PICTUREPIZ == null || (MC_FLICKR_PICTUREPIZ && !MC_FLICKR_PICTUREPIZ.length)) {\n' +
  '    (function () {\n' +
  '      var a = typeof mcGetDemoImageUrlPool_ === "function" ? mcGetDemoImageUrlPool_() : [];\n' +
  '      MC_FLICKR_PICTUREPIZ = [];\n' +
  '      if (a && a.length) for (var i = 0; i < 24; i++) MC_FLICKR_PICTUREPIZ[i] = a[i % a.length];\n' +
  '    })();\n' +
  '  }\n' +
  '  try {\n' +
  '    window.MC_DEMO_INSECT_ALBUM_URL = typeof MC_DEMO_INSECT_ALBUM_URL !== "undefined" ? MC_DEMO_INSECT_ALBUM_URL : "";\n' +
  '    window.MC_DEMO_SPECIMEN_IMAGES = MC_FLICKR_PICTUREPIZ;\n' +
  '  } catch (e) {}\n\n' +
  '    const _mcI18nZh = {';

const out = html.slice(0, i0) + replacement + html.slice(i1 + endMarker.length);
fs.writeFileSync(uiPath, out, 'utf8');
console.log('Patched UI.html: removed', i1 - i0, 'bytes of inlined GAS mock');
