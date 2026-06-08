const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// The script inside index.html that contains the header logic
const scriptContent = content.match(/<script>([\s\S]*?)<\/script>/g);
if (scriptContent) {
  scriptContent.forEach((sc, i) => {
    if (sc.includes('figma-tb-header-icon')) {
      // Just try evaluating the script string (without tags) to see if there's a syntax error
      const code = sc.replace(/<\/?script>/g, '');
      try {
        new Function(code);
        console.log("No syntax error in script", i);
      } catch(e) {
        console.error("Syntax Error in script", i, e.message);
      }
    }
  });
}
