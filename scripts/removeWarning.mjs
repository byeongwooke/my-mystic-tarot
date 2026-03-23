import fs from 'fs';

const filePath = 'src/data/tarot/today.ts';
let code = fs.readFileSync(filePath, 'utf8');

// Remove warning: string;
code = code.replace(/^[ \t]*warning:[ \t]*string;[ \t]*\n/gm, '');

// Remove warning: "...",
code = code.replace(/^[ \t]*warning:[ \t]*["'][^"']*["'],?[ \t]*\n/gm, '');

fs.writeFileSync(filePath, code);
console.log('Successfully extinguished warning fields from today.ts');
