const fs = require('fs');
const c = fs.readFileSync('specimen-card-generator.js', 'utf8');
const needle = "return'<section class=\"cg-panel cg-step-panel\" id=\"cg-step-3\"";
const start = c.indexOf(needle);
console.log(c.slice(start, start + 900));
