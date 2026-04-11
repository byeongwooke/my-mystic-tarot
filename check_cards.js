const fs = require('fs');

const dir = './src/data/tarot/cards';
let faulty = [];

for (let i = 0; i <= 77; i++) {
  const file = `${dir}/card${i}.ts`;
  if (!fs.existsSync(file)) {
      console.log(`card${i}.ts missing`);
      continue;
  }
  const content = fs.readFileSync(file, 'utf8');

  const celticIndex = content.indexOf('celtic:');
  if (celticIndex === -1) {
    faulty.push(`card${i}: missing 'celtic:'`);
    continue;
  }
  const celticBlock = content.substring(celticIndex);

  // Search for past: { or past: { past
  const pastObjectRegex = /past\s*:\s*\{/;
  if (pastObjectRegex.test(celticBlock)) {
    faulty.push(`card${i}: celtic.past appears to be an object (matched "past: {")`);
  }

  const fields = ['core', 'obstacle', 'foundation', 'past', 'goal', 'nearFuture', 'self', 'influence', 'hopes', 'destiny'];
  for (let field of fields) {
      const regex = new RegExp(`\\b${field}\\s*:`, 'g');
      const matches = celticBlock.match(regex);
      if (!matches || matches.length !== 12) {
          faulty.push(`card${i}: '${field}' count is ${matches ? matches.length : 0} (expected 12)`);
      }
  }
}
console.log("Faulty Cards:", Array.from(new Set(faulty)));
