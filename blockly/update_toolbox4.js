const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the icon HTML using a regex to ignore whitespace/line-ending differences
content = content.replace(
  /icon\.innerHTML = '<i class="fa-solid fa-toolbox"[^>]+><\/i>';/,
  `icon.innerHTML = '<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF8zMzhfNjU0KSI+CjxyZWN0IHg9IjEiIHk9IjEiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcng9IjUiIGZpbGw9IiM0QTc1RDEiLz4KPC9nPgo8cGF0aCBkPSJNMTUuODU1NCAxNS4xNDVMMTUuMTQ1NCAxNS44NTVDMTUuMDUxNyAxNS45NDgxIDE0LjkyNSAxNi4wMDA0IDE0Ljc5MjkgMTYuMDAwNEMxNC42NjA4IDE2LjAwMDQgMTQuNTM0MSAxNS45NDgxIDE0LjQ0MDQgMTUuODU1TDguNTAwNCA5LjkyNUM4LjMzNzgxIDkuOTcyMTYgOC4xNjk2NiA5Ljk5NzM5IDguMDAwNCAxMEM3LjY4MjA1IDkuOTk5NzcgNy4zNjgzNSA5LjkyMzU1IDcuMDg1MzkgOS43Nzc2OEM2LjgwMjQzIDkuNjMxODEgNi41NTgzOCA5LjQyMDUgNi4zNzM1MyA5LjE2MTMxQzYuMTg4NjggOC45MDIxMyA2LjA2ODM3IDguNjAyNTcgNi4wMjI2IDguMjg3NTJDNS45NzY4MyA3Ljk3MjQ4IDYuMDA2OTMgNy42NTEwNyA2LjExMDQgNy4zNUw3LjM4MDQgOC42Mkw3LjY0NTQgOC4zNTVMOC4zNTU0IDcuNjQ1TDguNjIwNCA3LjM4TDcuMzUwNCA2LjExQzcuNjUxNDYgNi4wMDY1NCA3Ljk3Mjg4IDUuOTc2NDQgOC4yODc5MiA2LjAyMjJDOC42MDI5NiA2LjA2Nzk3IDguOTAyNTMgNi4xODgyOCA5LjE2MTcxIDYuMzczMTNDOS40MjA4OSA2LjU1Nzk4IDkuNjMyMjEgNi44MDIwMyA5Ljc3ODA4IDcuMDg1QzkuOTIzOTUgNy4zNjc5NiAxMC4wMDAyIDcuNjgxNjUgMTAuMDAwNCA4QzkuOTk3NzggOC4xNjkyNiA5Ljk3MjU2IDguMzM3NDIgOS45MjU0IDguNUwxNS44NTU0IDE0LjQ0QzE1Ljk0ODUgMTQuNTMzNyAxNi4wMDA4IDE0LjY2MDQgMTYuMDAwOCAxNC43OTI1QzE2LjAwMDggMTQuOTI0NiAxNS45NDg1IDE1LjA1MTMgMTUuODU1NCAxNS4xNDVaTTYuMTQ1NCAxNC40NEM2LjA1MjI3IDE0LjUzMzcgNiAxNC42NjA0IDYgMTQuNzkyNUM2IDE0LjkyNDYgNi4wNTIyNyAxNS4wNTEzIDYuMTQ1NCAxNS4xNDVMNi44NTU0IDE1Ljg1NUM2Ljk0OTA4IDE1Ljk0ODEgNy4wNzU4IDE2LjAwMDQgNy4yMDc5IDE2LjAwMDRDNy4zMzk5OSAxNi4wMDA0IDcuNDY2NzIgMTUuOTQ4MSA3LjU2MDQgMTUuODU1TDEwLjI5NTQgMTMuMTI1TDguODgwNCAxMS43MU0xNS4wMDA0IDZMMTMuMDAwNCA3VjhMMTEuOTE1NCA5LjA4NUwxMi45MTU0IDEwLjA4NUwxNC4wMDA0IDlIMTUuMDAwNEwxNi4wMDA0IDdMMTUuMDAwNCA2WiIgZmlsbD0id2hpdGUiLz4KPGRlZnM+CjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZF8zMzhfNjU0IiB4PSIwIiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldC8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjAuNSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18zMzhfNjU0Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93XzMzOF82NTQiIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+" style="width:24px;height:24px; vertical-align: middle;">';`
);

// Replace the title color assignment using regex
content = content.replace(
  /if \(hTitle\) hTitle\.style\.color = isDark \? '#f8fafc' : '#1e293b';/,
  `if (hTitle) hTitle.style.color = isDark ? '#f8fafc' : '#01427a'; // Figma blue`
);

// Replace the header-icon background color
content = content.replace(
  /\.figma-tb-header-icon\s*\{[^}]*background:\s*#[a-zA-Z0-9]+\s*!important;/g,
  (match) => match.replace(/background:\s*#[a-zA-Z0-9]+\s*!important;/, 'background: transparent !important;')
);

// Replace the title font size and color in the CSS
content = content.replace(
  /\.figma-tb-header-title\s*\{[^}]*font-size:\s*15px\s*!important;/g,
  (match) => match.replace(/font-size:\s*15px\s*!important;/, 'font-size: 18px !important;')
);

content = content.replace(
  /\.figma-tb-header-title\s*\{[^}]*color:\s*#1e293b\s*!important;/g,
  (match) => match.replace(/color:\s*#1e293b\s*!important;/, 'color: #01427a !important;')
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully applied Regex replacements to Toolbox JS and CSS!');
