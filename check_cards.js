const fs = require('fs');
const path = require('path');

const indexContent = fs.readFileSync(path.join(__dirname, 'src/data/tarot/cards/index.ts'), 'utf8');
const lines = indexContent.split('\n');

const metadataLines = lines.filter(line => line.includes('nameKr'));
const nameMap = {};
metadataLines.forEach(line => {
    const matchId = line.match(/"id":\s*(\d+)/);
    const matchName = line.match(/"nameKr":\s*"([^"]+)"/);
    if (matchId && matchName) {
        nameMap[matchId[1]] = matchName[1];
    }
});

for (let i = 0; i <= 77; i++) {
    const cardPath = path.join(__dirname, `src/data/tarot/cards/card${i}.ts`);
    if (fs.existsSync(cardPath)) {
        const content = fs.readFileSync(cardPath, 'utf8');
        const hasExport = content.includes(`export const card${i}: CardContent`);
        let spicyLove = "NOT MODIFIED";
        const match = content.match(/interpretation:\s*'([^']+)'/g);
        let firstSpicy = "";
        
        let spicyLoveMatch = content.match(/spicy:\s*{\s*love:\s*{\s*normal:\s*{\s*interpretation:\s*'([^']+)'/);
        if (spicyLoveMatch) {
            firstSpicy = spicyLoveMatch[1];
        }

        console.log(`card${i}.ts | Expected: ${nameMap[i]} | Export: ${hasExport} | Snippet: ${firstSpicy.substring(0,20)}`);
    } else {
        console.log(`card${i}.ts NOT FOUND`);
    }
}
