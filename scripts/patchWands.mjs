import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wandsPath = path.resolve(__dirname, './data/spread3_wands_22_35.ts');
const spread3Path = path.resolve(__dirname, '../src/data/tarot/spread3.ts');

const wandsContent = fs.readFileSync(wandsPath, 'utf8');

let startIndex = wandsContent.indexOf('export const SPREAD3_WANDS: Record<number, any> = {');
let evalString = wandsContent.substring(startIndex);
evalString = evalString.replace('export const SPREAD3_WANDS: Record<number, any> = {', 'return {');
evalString = `(function() { ${evalString} })()`;

const WANDS_DATA = eval(evalString);

const spread3Content = fs.readFileSync(spread3Path, 'utf8');
let spread3Start = spread3Content.indexOf('export const TAROT_SPREAD3: Record<number, Spread3Card> = {');
let spread3Eval = spread3Content.substring(spread3Start);
spread3Eval = spread3Eval.replace('export const TAROT_SPREAD3: Record<number, Spread3Card> = {', 'return {');
spread3Eval = `(function() { ${spread3Eval} })()`;

const SPREAD3_DATA = eval(spread3Eval);

// Override keys 22 to 35 with the new WANDS_DATA
for (let i = 22; i <= 35; i++) {
    const cardId = i.toString();
    if (WANDS_DATA[cardId]) {
        SPREAD3_DATA[cardId] = WANDS_DATA[cardId];
    }
}

let spread3Code = `export interface TimelineAdvice {
    past: string;
    present: string;
    future: string;
}

export interface Spread3Card {
    interpretations: {
        love: string;
        loveReversed: string;
        money: string;
        moneyReversed: string;
        work: string;
        workReversed: string;
    };
    advice: {
        love: TimelineAdvice;
        loveReversed?: TimelineAdvice;
        money: TimelineAdvice;
        moneyReversed?: TimelineAdvice;
        work: TimelineAdvice;
        workReversed?: TimelineAdvice;
    };
}

export const TAROT_SPREAD3: Record<number, Spread3Card> = ${JSON.stringify(SPREAD3_DATA, null, 4)};\n`;

fs.writeFileSync(spread3Path, spread3Code, 'utf8');
console.log('Successfully patched Wands Minor Arcana (22-35) directly into TAROT_SPREAD3!');
