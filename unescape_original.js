const fs = require('fs');

const filePath = 'C:\\Users\\jorda\\.gemini\\antigravity\\brain\\d50e19db-2019-4149-927b-196b859292c5\\scratch\\original_page.tsx';
let content = fs.readFileSync(filePath, 'utf8').trim();

// If it is double-stringified, parse it
if (content.startsWith('"') && content.endsWith('"')) {
  try {
    content = JSON.parse(content);
  } catch (err) {
    // If JSON.parse fails, maybe it has some unescaped quotes inside, let's parse using eval or manual parsing
    content = eval(content);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully unescaped original_page.tsx');
