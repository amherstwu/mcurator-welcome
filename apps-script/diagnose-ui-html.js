#!/usr/bin/env node
/**
 * 從 UI.html 抽出第 4 個內嵌 <script>（主程式）並用 Node 做語法檢查。
 * 若出現 SyntaxError（例如多一個 )），主程式整段不會執行 → onclick 的 setUiExperience 等會「未定義」。
 *
 * 用法：node apps-script/diagnose-ui-html.js
 * 或：  node apps-script/diagnose-ui-html.js path/to/UI.html
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const defaultHtml = path.join(__dirname, 'UI.html');
const htmlPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultHtml;

function extractMainScriptSource(html) {
  const open = '<script>';
  let idx = 0;
  let n = 0;
  let body = null;
  while (idx < html.length) {
    const s = html.indexOf(open, idx);
    if (s === -1) break;
    const start = s + open.length;
    const e = html.indexOf('</script>', start);
    if (e === -1) break;
    n++;
    if (n === 4) {
      body = html.slice(start, e);
      break;
    }
    idx = e + 9;
  }
  return body;
}

function main() {
  if (!fs.existsSync(htmlPath)) {
    console.error('File not found:', htmlPath);
    process.exit(1);
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  const body = extractMainScriptSource(html);
  if (body == null) {
    console.error('Could not find 4th <script> block (expected main app bundle).');
    process.exit(1);
  }

  const tmp = path.join(require('os').tmpdir(), 'mcurator-ui-main-script-check.js');
  fs.writeFileSync(tmp, body, 'utf8');
  console.log('Wrote extracted script to', tmp, '(' + body.length + ' chars)');

  const r = spawnSync(process.execPath, ['--check', tmp], { encoding: 'utf8' });
  if (r.status === 0) {
    console.log('OK: main script parses (no SyntaxError).');
    process.exit(0);
  }
  console.error(r.stderr || r.stdout || 'check failed');
  console.error('\nTip: fix the reported line in the TEMP file, then search the same pattern in UI.html.');
  process.exit(1);
}

main();
