const fs=require('fs');
const c=fs.readFileSync('specimen-card-generator.js','utf8');
const k=c.indexOf("if(t.hasAttribute('data-sp'))");
console.log(c.slice(k,k+900));
