const fs = require('fs');
const js = fs.readFileSync('evolution-tree-lab.js', 'utf8');
const html = fs.readFileSync('UI.html', 'utf8');
const used = [...js.matchAll(/tx\(['"]?(etl_[a-z0-9_]+)['"]?/g)].map((m) => m[1]);
const unique = [...new Set(used)].sort();
const missing = unique.filter((k) => !html.includes(k + ':'));
console.log('used', unique.length, 'missing', missing.length);
console.log(missing.join('\n'));
