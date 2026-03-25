import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spread3Path = path.resolve(__dirname, '../src/data/tarot/spread3.ts');
const celticPath = path.resolve(__dirname, '../src/data/tarot/celtic.ts');

const celticContent = fs.readFileSync(celticPath, 'utf8');

let startIndex = celticContent.indexOf('export const TAROT_CELTIC: Record<number, CelticCard> = {');
let evalString = celticContent.substring(startIndex);
evalString = evalString.replace('export const TAROT_CELTIC: Record<number, CelticCard> = {', 'return {');
evalString = `(function() { ${evalString} })()`;

const CELTIC_DATA = eval(evalString);

// This regex deletes (past), (core) etc properly even with punctuation
const cleanText = (text) => {
  if (!text) return text;
  return text.replace(/\s*\((core|obstacle|goal|foundation|past|nearFuture|self|influence|hopes|destiny)\)/g, "");
};

const joinSentences = (past, present, future) => {
  let p = cleanText(past || "").trim();
  let c = cleanText(present || "").trim();
  let f = cleanText(future || "").trim();
  
  // Make sure they end with proper spacing
  if (p && !p.endsWith(",") && !p.endsWith(".")) p += " ";
  else if (p) p += " ";
  
  if (c && !c.endsWith(",") && !c.endsWith(".")) c += " ";
  else if (c) c += " ";
  
  return (p + c + f).trim();
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
    interpretations: {
      love: joinSentences(cData.love?.past, cData.love?.core, cData.love?.nearFuture),
      loveReversed: joinSentences(cData.loveReversed?.past, cData.loveReversed?.core, cData.loveReversed?.nearFuture),
      money: joinSentences(cData.money?.past, cData.money?.core, cData.money?.nearFuture),
      moneyReversed: joinSentences(cData.moneyReversed?.past, cData.moneyReversed?.core, cData.moneyReversed?.nearFuture),
      work: joinSentences(cData.work?.past, cData.work?.core, cData.work?.nearFuture),
      workReversed: joinSentences(cData.workReversed?.past, cData.workReversed?.core, cData.workReversed?.nearFuture),
    },
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

export const TAROT_SPREAD3: Record<number, Spread3Card> = ${JSON.stringify(newSpread3Data, null, 4)};\n`;

fs.writeFileSync(spread3Path, spread3Code, 'utf8');
console.log('Successfully rebuilt TAROT_SPREAD3 interpretations and removed markers!');
