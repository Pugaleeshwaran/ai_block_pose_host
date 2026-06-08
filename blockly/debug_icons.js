const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(indexHtmlPath, 'utf8');
const lines = html.split('\n');

// Find SMALL_ICONS definition and its surrounding lines
lines.forEach((line, i) => {
  if (line.includes('SMALL_ICONS') || line.includes('buildIconPanel') || line.includes('clone.src')) {
    console.log(`L${i+1}: ${line.trim().substring(0, 150)}`);
  }
});
