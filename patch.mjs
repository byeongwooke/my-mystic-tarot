import fs from 'fs';

const v2 = fs.readFileSync('scripts/generateCelticV2.mjs', 'utf8');
const patch = `const celticStr = fs.readFileSync('src/data/tarot/celtic.ts', 'utf8');
const celticMatch = celticStr.match(/export const TAROT_CELTIC[^=]*=\\s*({[\\s\\S]*});/m);
let celticData;
eval('celticData = ' + celticMatch[1]);

for (let i = 0; i < 78; i++) {
    const cardBase = baseData[i];
    const prevCeltic = celticData[i] || celticData[i.toString()];
    NEW_CELTIC[i] = generateFullCelticData(i, cardBase);
    if(prevCeltic && prevCeltic.interpretations) {
        NEW_CELTIC[i].interpretations = prevCeltic.interpretations;
    }
}`;

const finalSrc = v2.replace(/for \(let i = 0; i < 78; i\+\+\) \{[\s\S]*?\}/, patch);
fs.writeFileSync('scripts/generateCelticV2.mjs', finalSrc);
