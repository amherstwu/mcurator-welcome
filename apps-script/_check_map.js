const fs = require('fs');
const c = fs.readFileSync('specimen-card-generator.js', 'utf8');
console.log('mapBlock ref', c.includes('+mapBlock+'));
console.log('passportMapStudioPanel insert', c.includes('passportMapStudioPanel()'));
const i = c.indexOf('var tailCommon=');
console.log('tailCommon snippet', c.slice(i, i + 200));
