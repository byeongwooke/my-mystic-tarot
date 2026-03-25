import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cupsPath1 = path.resolve(__dirname, './data/spread3_cups_36_42.ts');
const cupsPath2 = path.resolve(__dirname, './data/spread3_cups_43_49.ts');
const spread3Path = path.resolve(__dirname, '../src/data/tarot/spread3.ts');

const getObj = (filePath, exportName) => {
    const content = fs.readFileSync(filePath, 'utf8');
    let startIndex = content.indexOf(`export const ${exportName}: Record<number, any> = {`);
    let evalString = content.substring(startIndex);
    evalString = evalString.replace(`export const ${exportName}: Record<number, any> = {`, 'return {');
    evalString = `(function() { ${evalString} })()`;
    return eval(evalString);
};

const CUPS_1 = getObj(cupsPath1, 'SPREAD3_CUPS');
const CUPS_2 = getObj(cupsPath2, 'SPREAD3_CUPS_2');
const CUPS_DATA = { ...CUPS_1, ...CUPS_2 };

const spread3Content = fs.readFileSync(spread3Path, 'utf8');
let spread3Start = spread3Content.indexOf('export const TAROT_SPREAD3: Record<number, Spread3Card> = {');
let spread3Eval = spread3Content.substring(spread3Start);
spread3Eval = spread3Eval.replace('export const TAROT_SPREAD3: Record<number, Spread3Card> = {', 'return {');
spread3Eval = `(function() { ${spread3Eval} })()`;

const SPREAD3_DATA = eval(spread3Eval);

for (let i = 36; i <= 49; i++) {
    const cardId = i.toString();
    if (CUPS_DATA[cardId]) {
        SPREAD3_DATA[cardId] = CUPS_DATA[cardId];
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
console.log('Successfully patched Cups Minor Arcana (36-49) directly into TAROT_SPREAD3!');
