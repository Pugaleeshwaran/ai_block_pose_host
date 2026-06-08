const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Restore toolboxConfig Tool_CATEGORY
content = content.replace(
  /\{\s*kind:\s*'category',\s*name:\s*'Toolbox',\s*custom:\s*'Tool_CATEGORY',\s*colour:\s*'white',\s*id:\s*'cat_toolbox'\s*\},\s*/g,
  "{ kind: 'category', name: 'Toolbox', custom: 'Tool_CATEGORY', colour: 'white', id: 'cat_search' },\n        "
);

// 2. Remove the dummy callback
content = content.replace(
  /\n\s*workspace\.registerToolboxCategoryCallback\('Tool_CATEGORY',\s*function\(\)\s*\{\s*return\s*\[\];\s*\}\);\n/g,
  ""
);

// 3. Remove Figma CSS block for Tool_CATEGORY
const figmaCSS = `
    /* Toolbox category custom styles */
    .blocklyToolboxCategory[data-figma="Toolbox"] {
      pointer-events: none !important; /* Prevent clicking to avoid confusion */
      border-bottom: 1px solid rgba(148, 163, 184, 0.4) !important;
      margin-bottom: 8px !important;
      padding-bottom: 12px !important;
      padding-top: 12px !important;
    }
    .blocklyToolboxCategory[data-figma="Toolbox"] [class*="blocklyToolboxCategoryIcon"] {
      background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF8zMzhfNjU0KSI+CjxyZWN0IHg9IjEiIHk9IjEiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcng9IjUiIGZpbGw9IiM0QTc1RDEiLz4KPC9nPgo8cGF0aCBkPSJNMTUuODU1NCAxNS4xNDVMMTUuMTQ1NCAxNS44NTVDMTUuMDUxNyAxNS45NDgxIDE0LjkyNSAxNi4wMDA0IDE0Ljc5MjkgMTYuMDAwNEMxNC42NjA4IDE2LjAwMDQgMTQuNTM0MSAxNS45NDgxIDE0LjQ0MDQgMTUuODU1TDguNTAwNCA5LjkyNUM4LjMzNzgxIDkuOTcyMTYgOC4xNjk2NiA5Ljk5NzM5IDguMDAwNCAxMEM3LjY4MjA1IDkuOTk5NzcgNy4zNjgzNSA5LjkyMzU1IDcuMDg1MzkgOS43Nzc2OEM2LjgwMjQzIDkuNjMxODEgNi41NTgzOCA5LjQyMDUgNi4zNzM1MyA5LjE2MTMxQzYuMTg4NjggOC45MDIxMyA2LjA2ODM3IDguNjAyNTcgNi4wMjI2IDguMjg3NTJDNS45NzY4MyA3Ljk3MjQ4IDYuMDA2OTMgNy42NTEwNyA2LjExMDQgNy4zNUw3LjM4MDQgOC42Mkw3LjY0NTQgOC4zNTVMOC4zNTU0IDcuNjQ1TDguNjIwNCA3LjM4TDcuMzUwNCA2LjExQzcuNjUxNDYgNi4wMDY1NCA3Ljk3Mjg4IDUuOTc2NDQgOC4yODc5MiA2LjAyMjJDOC42MDI5NiA2LjA2Nzk3IDguOTAyNTMgNi4xODgyOCA5LjE2MTcxIDYuMzczMTNDOS40MjA4OSA2LjU1Nzk4IDkuNjMyMjEgNi44MDIwMyA5Ljc3ODA4IDcuMDg1QzkuOTIzOTUgNy4zNjc5NiAxMC4wMDAyIDcuNjgxNjUgMTAuMDAwNCA4QzkuOTk3NzggOC4xNjkyNiA5Ljk3MjU2IDguMzM3NDIgOS45MjU0IDguNUwxNS44NTU0IDE0LjQ0QzE1Ljk0ODUgMTQuNTMzNyAxNi4wMDA4IDE0LjY2MDQgMTYuMDAwOCAxNC43OTI1QzE2LjAwMDggMTQuOTI0NiAxNS45NDg1IDE1LjA1MTMgMTUuODU1NCAxNS4xNDVaTTYuMTQ1NCAxNC40NEM2LjA1MjI3IDE0LjUzMzcgNiAxNC42NjA0IDYgMTQuNzkyNUM2IDE0LjkyNDYgNi4wNTIyNyAxNS4wNTEzIDYuMTQ1NCAxNS4xNDVMNi44NTU0IDE1Ljg1NUM2Ljk0OTA4IDE1Ljk0ODEgNy4wNzU4IDE2LjAwMDQgNy4yMDc5IDE2LjAwMDRDNy4zMzk5OSAxNi4wMDA0IDcuNDY2NzIgMTUuOTQ4MSA3LjU2MDQgMTUuODU1TDEwLjI5NTQgMTMuMTI1TDguODgwNCAxMS43MU0xNS4wMDA0IDZMMTMuMDAwNCA3VjhMMTEuOTE1NCA5LjA4NUwxMi45MTU0IDEwLjA4NUwxNC4wMDA0IDlIMTUuMDAwNEwxNi4wMDA0IDdMMTUuMDAwNCA2WiIgZmlsbD0id2hpdGUiLz4KPGRlZnM+CjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZF8zMzhfNjU0IiB4PSIwIiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldC8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjAuNSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18zMzhfNjU0Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93XzMzOF82NTQiIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+") !important;
      background-size: contain !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      opacity: 1 !important;
      display: inline-block !important;
      margin-right: 8px !important;
      border-radius: 4px !important;
    }
    .blocklyToolboxCategory[data-figma="Toolbox"] .blocklyToolboxCategoryLabel {
      font-size: 18px !important;
      font-weight: 700 !important;
      fill: #4A75D1 !important;
      text-transform: capitalize !important;
      letter-spacing: normal !important;
    }
`;
if (content.includes(figmaCSS)) {
  content = content.replace(figmaCSS, '');
}

// 4. Restore header title color
content = content.replace(
  /if \(hTitle\) hTitle\.style\.color = isDark \? '#f8fafc' : '#01427a'; \/\/ Figma blue/g,
  "if (hTitle) hTitle.style.color = isDark ? '#f8fafc' : '#1e293b';"
);

// 5. Restore figma-tb-header-icon CSS
content = content.replace(
  /\.figma-tb-header-icon\s*\{\s*width:\s*30px\s*!important;\s*height:\s*30px\s*!important;\s*background:\s*transparent\s*!important;\s*border-radius:\s*8px\s*!important;\s*display:\s*flex\s*!important;\s*align-items:\s*center\s*!important;\s*justify-content:\s*center\s*!important;\s*\}/,
  `.figma-tb-header-icon {
      width: 30px !important;
      height: 30px !important;
      background: #007bff !important;
      border-radius: 8px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }`
);

// 6. Restore figma-tb-header-title CSS
content = content.replace(
  /\.figma-tb-header-title\s*\{\s*font-size:\s*18px\s*!important;\s*font-weight:\s*700\s*!important;\s*color:\s*#01427a\s*!important;\s*font-family:\s*Inter,\s*system-ui,\s*sans-serif\s*!important;\s*\}/,
  `.figma-tb-header-title {
      font-size: 15px !important;
      font-weight: 700 !important;
      color: #1e293b !important;
      font-family: Inter, system-ui, sans-serif !important;
    }`
);

// 7. Restore header JS innerHTML
const newJs = `var icon = document.createElement('div');
          icon.className = 'figma-tb-header-icon';
          icon.innerHTML = '<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF8zMzhfNjU0KSI+CjxyZWN0IHg9IjEiIHk9IjEiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcng9IjUiIGZpbGw9IiM0QTc1RDEiLz4KPC9nPgo8cGF0aCBkPSJNMTUuODU1NCAxNS4xNDVMMTUuMTQ1NCAxNS44NTVDMTUuMDUxNyAxNS45NDgxIDE0LjkyNSAxNi4wMDA0IDE0Ljc5MjkgMTYuMDAwNEMxNC42NjA4IDE2LjAwMDQgMTQuNTM0MSAxNS45NDgxIDE0LjQ0MDQgMTUuODU1TDguNTAwNCA5LjkyNUM4LjMzNzgxIDkuOTcyMTYgOC4xNjk2NiA5Ljk5NzM5IDguMDAwNCAxMEM3LjY4MjA1IDkuOTk5NzcgNy4zNjgzNSA5LjkyMzU1IDcuMDg1MzkgOS43Nzc2OEM2LjgwMjQzIDkuNjMxODEgNi41NTgzOCA5LjQyMDUgNi4zNzM1MyA5LjE2MTMxQzYuMTg4NjggOC45MDIxMyA2LjA2ODM3IDguNjAyNTcgNi4wMjI2IDguMjg3NTJDNS45NzY4MyA3Ljk3MjQ4IDYuMDA2OTMgNy42NTEwNyA2LjExMDQgNy4zNUw3LjM4MDQgOC42Mkw3LjY0NTQgOC4zNTVMOC4zNTU0IDcuNjQ1TDguNjIwNCA3LjM4TDcuMzUwNCA2LjExQzcuNjUxNDYgNi4wMDY1NCA3Ljk3Mjg4IDUuOTc2NDQgOC4yODc5MiA2LjAyMjJDOC42MDI5NiA2LjA2Nzk3IDguOTAyNTMgNi4xODgyOCA5LjE2MTcxIDYuMzczMTNDOS40MjA4OSA2LjU1Nzk4IDkuNjMyMjEgNi44MDIwMyA5Ljc3ODA4IDcuMDg1QzkuOTIzOTUgNy4zNjc5NiAxMC4wMDAyIDcuNjgxNjUgMTAuMDAwNCA4QzkuOTk3NzggOC4xNjkyNiA5Ljk3MjU2IDguMzM3NDIgOS45MjU0IDguNUwxNS44NTU0IDE0LjQ0QzE1Ljk0ODUgMTQuNTMzNyAxNi4wMDA4IDE0LjY2MDQgMTYuMDAwOCAxNC43OTI1QzE2LjAwMDggMTQuOTI0NiAxNS45NDg1IDE1LjA1MTMgMTUuODU1NCAxNS4xNDVaTTYuMTQ1NCAxNC40NEM2LjA1MjI3IDE0LjUzMzcgNiAxNC42NjA0IDYgMTQuNzkyNUM2IDE0LjkyNDYgNi4wNTIyNyAxNS4wNTEzIDYuMTQ1NCAxNS4xNDVMNi44NTU0IDE1Ljg1NUM2Ljk0OTA4IDE1Ljk0ODEgNy4wNzU4IDE2LjAwMDQgNy4yMDc5IDE2LjAwMDRDNy4zMzk5OSAxNi4wMDA0IDcuNDY2NzIgMTUuOTQ4MSA3LjU2MDQgMTUuODU1TDEwLjI5NTQgMTMuMTI1TDguODgwNCAxMS43MU0xNS4wMDA0IDZMMTMuMDAwNCA3VjhMMTEuOTE1NCA5LjA4NUwxMi45MTU0IDEwLjA4NUwxNC4wMDA0IDlIMTUuMDAwNEwxNi4wMDA0IDdMMTUuMDAwNCA2WiIgZmlsbD0id2hpdGUiLz4KPGRlZnM+CjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZF8zMzhfNjU0IiB4PSIwIiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldC8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjAuNSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18zMzhfNjU0Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93XzMzOF82NTQiIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+" style="width:24px;height:24px; vertical-align: middle;">';
          h.appendChild(icon);

          var title = document.createElement('span');
          title.className = 'figma-tb-header-title';
          title.textContent = 'Toolbox';
          h.appendChild(title);`;
const origJs = `h.innerHTML = '<div class="figma-tb-header-icon"><i class="fa-solid fa-toolbox" style="color:white;font-size:14px;"></i></div><span class="figma-tb-header-title">Toolbox</span>';`;

if (content.includes(newJs)) {
  content = content.replace(newJs, origJs);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Revoked changes successfully!');
