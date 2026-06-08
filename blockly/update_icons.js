const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
const bigIconDir = path.join(__dirname, '..', 'big_icon');
const smallIconDir = path.join(__dirname, '..', 'small_icon');

// ─── Category → big_icon file (for blocklyToolbox CSS) ───────────────────────
const bigIconMappings = {
  'Digital':       'digital.svg',
  'Analog':        'analog.svg',
  'I2c':           'i2c.svg',
  'PWM':           'pwm.svg',
  'LEDs':          'leds.svg',
  'Tx-Rx':         'tx-rx.svg',
  'SPI':           'spi.svg',
  'Loop':          'loop.svg',
  'Delay':         'delay.svg',
  'Logic':         'logic.svg',
  'Maths':         'math.svg',
  'AI blocks':     'ai-blocks.svg',
  'Variable':      'variable.svg',
  'Function':      'function.svg',
  'List':          'list.svg',
  'Display-3.js':  'display.svg',
  'Display-lotte': 'display.svg',
  'default block': 'default.svg',
  'A.I. Vision':   'ai-vision.svg',
  'A.I. Pose':     'display.svg'
};

// ─── Category → small_icon file (for toolbox-icon-panel) ─────────────────────
const smallIconMappings = {
  'Digital':       'Variables.svg',
  'Analog':        'Variables-1.svg',
  'I2c':           'Variables-2.svg',
  'PWM':           'Variables-3.svg',
  'LEDs':          'Variables-4.svg',
  'Tx-Rx':         'Variables-5.svg',
  'SPI':           'Variables-6.svg',
  'Loop':          'Variables-7.svg',
  'Delay':         'Variables-8.svg',
  'Logic':         'Variables-9.svg',
  'Maths':         'Variables-10.svg',
  'AI blocks':     'Variables-11.svg',
  'Variable':      'Variables-12.svg',
  'Function':      'Variables-13.svg',
  'List':          'Variables-14.svg',
  'Display-3.js':  'Variables-15.svg',
  'Display-lotte': 'Variables-15.svg',
  'default block': 'Variables-16.svg',
  'A.I. Vision':   'Variables-11.svg',
  'A.I. Pose':     'Variables-15.svg'
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function svgToDataUri(filePath) {
  const svgContent = fs.readFileSync(filePath, 'utf8').trim();
  const base64Data = Buffer.from(svgContent).toString('base64');
  return `data:image/svg+xml;base64,${base64Data}`;
}

console.log('Reading index.html...');
let content = fs.readFileSync(indexHtmlPath, 'utf8');
let cssCount = 0, jsCount = 0;

// ══════════════════════════════════════════════════════════════════════════════
// STEP 1: Restore CSS icons with big_icon (for blocklyToolbox main sidebar)
// ══════════════════════════════════════════════════════════════════════════════
console.log('\n── Step 1: Restore CSS icons → big_icon (for blocklyToolbox) ──');

for (const [category, filename] of Object.entries(bigIconMappings)) {
  const filePath = path.join(bigIconDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  big_icon not found: ${filePath}`);
    continue;
  }

  const dataUri = svgToDataUri(filePath);
  const escapedCategory = escapeRegExp(category);
  const cssRegex = new RegExp(
    `\\.blocklyToolboxCategory\\[data-figma="${escapedCategory}"\\]\\s+\\[class\\*="blocklyToolboxCategoryIcon"\\]\\s*\\{\\s*background-image:\\s*url\\("[^"]+"\\)\\s*!important;\\s*\\}`,
    'g'
  );

  const newCss = `.blocklyToolboxCategory[data-figma="${category}"] [class*="blocklyToolboxCategoryIcon"] {
      background-image: url("${dataUri}") !important;
    }`;

  if (cssRegex.test(content)) {
    content = content.replace(cssRegex, newCss);
    console.log(`  ✅ CSS → "${category}" = ${filename}`);
    cssCount++;
  } else {
    console.warn(`  ⚠️  CSS pattern not found for: "${category}"`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 2: Update ICONS JS map with big_icon (feeds .fg-icon in blocklyToolbox)
// ══════════════════════════════════════════════════════════════════════════════
console.log('\n── Step 2: Update ICONS JS map → big_icon (feeds .fg-icon in blocklyToolbox) ──');

for (const [category, filename] of Object.entries(bigIconMappings)) {
  const filePath = path.join(bigIconDir, filename);
  if (!fs.existsSync(filePath)) continue;

  const dataUri = svgToDataUri(filePath);
  const escapedCategory = escapeRegExp(category);

  const jsMapRegex = new RegExp(`'${escapedCategory}':\\s*'data:image/svg\\+xml;base64,[^']+'`, 'g');
  const jsSearchRegex = new RegExp(`ICONS\\[['"]${escapedCategory}['"]\\]\\s*=\\s*'data:image/svg\\+xml;base64,[^']+'`, 'g');

  let updated = false;
  if (jsMapRegex.test(content)) {
    content = content.replace(jsMapRegex, `'${category}': '${dataUri}'`);
    updated = true;
  }
  if (jsSearchRegex.test(content)) {
    content = content.replace(jsSearchRegex, `ICONS['${category}'] = '${dataUri}'`);
    updated = true;
  }
  if (updated) {
    console.log(`  ✅ ICONS JS → "${category}" = ${filename}`);
    jsCount++;
  } else {
    console.warn(`  ⚠️  ICONS JS pattern not found for: "${category}"`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP 3: Inject SMALL_ICONS map + patch buildIconPanel() to use small_icon
// ══════════════════════════════════════════════════════════════════════════════
console.log('\n── Step 3: Inject SMALL_ICONS map + patch buildIconPanel() → small_icon ──');

// Build the SMALL_ICONS map as a JS string
const smallIconsEntries = [];
// Track which categories we've added (avoid duplicates in the map)
const seen = new Set();
for (const [category, filename] of Object.entries(smallIconMappings)) {
  if (seen.has(category)) continue;
  seen.add(category);
  const filePath = path.join(smallIconDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  small_icon not found: ${filePath}`);
    continue;
  }
  const dataUri = svgToDataUri(filePath);
  smallIconsEntries.push(`          '${category}': '${dataUri}'`);
}

const smallIconsMap = `var SMALL_ICONS = {\n${smallIconsEntries.join(',\n')}\n        };`;

// Check if SMALL_ICONS is already injected
if (content.includes('var SMALL_ICONS =')) {
  // Replace the existing SMALL_ICONS map
  const smallIconsRegex = /var SMALL_ICONS = \{[^}]+\};/g;
  content = content.replace(smallIconsRegex, smallIconsMap);
  console.log('  ✅ Replaced existing SMALL_ICONS map');
} else {
  // Inject SMALL_ICONS right after the ICONS map definition
  // Find "var ICONS = {" and insert SMALL_ICONS after its closing
  const iconsMapEndRegex = /(var ICONS = \{[^}]+(?:\}[^;])*\};)/;
  if (iconsMapEndRegex.test(content)) {
    content = content.replace(iconsMapEndRegex, (match) => {
      return match + '\n        ' + smallIconsMap;
    });
    console.log('  ✅ Injected SMALL_ICONS map after ICONS map');
  } else {
    console.warn('  ⚠️  Could not find ICONS map to inject SMALL_ICONS after');
  }
}

// Now patch buildIconPanel() to use SMALL_ICONS instead of cloning .fg-icon
// Original pattern:
//   var clone = document.createElement('img');
//   clone.src = img.src;
//   clone.style.cssText = 'width:37px;height:34px;border-radius:8px;pointer-events:none;';
// Replace with SMALL_ICONS lookup by category label:
const oldBuildPanel = `            var clone = document.createElement('img');
            clone.src = img.src;
            clone.style.cssText = 'width:37px;height:34px;border-radius:8px;pointer-events:none;';`;

const newBuildPanel = `            var clone = document.createElement('img');
            var _lbl = lbl ? lbl.textContent.trim() : '';
            clone.src = (window.SMALL_ICONS && window.SMALL_ICONS[_lbl]) ? window.SMALL_ICONS[_lbl] : img.src;
            clone.style.cssText = 'width:37px;height:34px;border-radius:8px;pointer-events:none;';`;

if (content.includes(oldBuildPanel)) {
  content = content.replace(oldBuildPanel, newBuildPanel);
  console.log('  ✅ Patched buildIconPanel() to use SMALL_ICONS for toolbox-icon-panel');
} else {
  // Try with slightly different whitespace (e.g. \r\n)
  const oldBuildPanelCR = oldBuildPanel.replace(/\n/g, '\r\n');
  if (content.includes(oldBuildPanelCR)) {
    content = content.replace(oldBuildPanelCR, newBuildPanel.replace(/\n/g, '\r\n'));
    console.log('  ✅ Patched buildIconPanel() (CRLF) to use SMALL_ICONS for toolbox-icon-panel');
  } else {
    console.warn('  ⚠️  buildIconPanel() clone pattern not found — manual check needed');
    // Try a fallback: find just clone.src = img.src
    const fallback = "clone.src = img.src;";
    const fallbackNew = "var _lbl2 = lbl ? lbl.textContent.trim() : ''; clone.src = (window.SMALL_ICONS && window.SMALL_ICONS[_lbl2]) ? window.SMALL_ICONS[_lbl2] : img.src;";
    if (content.includes(fallback)) {
      content = content.replace(fallback, fallbackNew);
      console.log('  ✅ Patched buildIconPanel() using fallback (clone.src only)');
    } else {
      console.warn('  ⚠️  Fallback also not found');
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Write output
// ══════════════════════════════════════════════════════════════════════════════
fs.writeFileSync(indexHtmlPath, content, 'utf8');
console.log(`\n🎉 Done!`);
console.log(`   CSS icons restored: ${cssCount} (blocklyToolbox ← big_icon)`);
console.log(`   JS ICONS restored:  ${jsCount} (blocklyToolbox .fg-icon ← big_icon)`);
console.log(`   toolbox-icon-panel ← small_icon (via SMALL_ICONS map + patched buildIconPanel)`);
