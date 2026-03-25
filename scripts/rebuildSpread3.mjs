import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const celticPath = path.resolve(__dirname, '../src/data/tarot/celtic.ts');
const spread3Path = path.resolve(__dirname, '../src/data/tarot/spread3.ts');

const celticContent = fs.readFileSync(celticPath, 'utf8');

let startIndex = celticContent.indexOf('export const TAROT_CELTIC: Record<number, CelticCard> = {');
let evalString = celticContent.substring(startIndex);
evalString = evalString.replace('export const TAROT_CELTIC: Record<number, CelticCard> = {', 'return {');
evalString = `(function() { ${evalString} })()`;

const CELTIC_DATA = eval(evalString);

const cleanText = (text) => {
  if (!text) return text;
  return text.replace(/\s*\([\w]+\)$/g, "");
};

const newSpread3Data = {};

for (let i = 0; i <= 77; i++) {
  const cardId = i.toString();
  const cData = CELTIC_DATA[cardId];
  if (!cData) continue;

  const buildAdvice = (cat) => {
    return {
      past: cleanText(cData[cat]?.past || ""),
      present: cleanText(cData[cat]?.core || ""),
      future: cleanText(cData[cat]?.nearFuture || ""),
    };
  };

  newSpread3Data[cardId] = {
    interpretations: cData.interpretations || { love: "", money: "", work: "", reversed: "" },
    advice: {
      love: buildAdvice('love'),
      loveReversed: buildAdvice('loveReversed'),
      money: buildAdvice('money'),
      moneyReversed: buildAdvice('moneyReversed'),
      work: buildAdvice('work'),
      workReversed: buildAdvice('workReversed'),
    }
  };
}

let spread3Code = `export interface TimelineAdvice {
    past: string;
    present: string;
    future: string;
}

export interface Spread3Card {
    interpretations: {
        love: string;
        money: string;
        work: string;
        reversed: string;
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

export const TAROT_SPREAD3: Record<number, Spread3Card> = ${JSON.stringify(newSpread3Data, null, 4)};\n`;

fs.writeFileSync(spread3Path, spread3Code, 'utf8');
console.log('Successfully rebuilt TAROT_SPREAD3 with Hocis-Mystic narrative paradigm from celtic.ts!');
