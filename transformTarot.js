const fs = require('fs');

let content = fs.readFileSync('src/constants/tarotData.ts', 'utf8');

const dict = [
    [/상대방이/g, '마주하는 에너지가'],
    [/상대방은/g, '마주하는 에너지는'],
    [/상대방을/g, '마주하는 에너지를'],
    [/상대방에게/g, '마주하는 에너지에게'],
    [/상대방의/g, '마주하는 에너지의'],
    [/상대가/g, '마주하는 에너지가'],
    [/상대에게/g, '마주하는 에너지에게'],
    [/상대를/g, '마주하는 에너지를'],
    [/상대의/g, '마주하는 에너지의'],
    [/상대방/g, '마주하는 에너지'],
    [/상대/g, '마주하는 에너지'],
    [/연인이/g, '깊은 인연이'],
    [/연인은/g, '깊은 인연은'],
    [/연인을/g, '깊은 인연을'],
    [/연인에게/g, '깊은 인연에게'],
    [/연인의/g, '깊은 인연의'],
    [/연인과/g, '깊은 인연과'],
    [/연인/g, '인연'],
    [/배우자가/g, '정서적 동반자가'],
    [/배우자에게/g, '정서적 동반자에게'],
    [/배우자를/g, '정서적 동반자를'],
    [/배우자/g, '정서적 동반자'],
    [/결혼/g, '관계의 결실'],
    [/연애가/g, '정서적 교류가'],
    [/연애를/g, '정서적 교류를'],
    [/연애/g, '정서적 유대'],
    [/짝사랑/g, '홀로 품은 감정'],
    [/솔로/g, '독립적인 상태'],
    [/커플/g, '연결된 상태'],

    [/투자 종목/g, '가치 있는 투자 흐름'],
    [/빚이/g, '재정적 책임이'],
    [/빚을/g, '재정적 책임을'],
    [/빚/g, '재정적 짐'],
    [/대출/g, '재정적 부담'],
    [/저축/g, '자원의 비축'],
    [/주식/g, '변동성 있는 자산'],
    [/부동산/g, '안정적인 실물 자산'],
    [/돈/g, '물질적 기운'],
    [/수익/g, '경제적 가능성'],

    [/직장/g, '목표 지점'],
    [/상사/g, '이끄는 주체'],
    [/상관/g, '결정권자'],
    [/부하/g, '따르는 동력'],
    [/동료\/?/g, '협력적 관계'],
    [/승진/g, '커리어의 도약'],
    [/구직/g, '경로 탐색'],
    [/이직/g, '환경의 전환'],
    [/퇴사\/?/g, '현재 환경과의 분리'],
    [/이별/g, '관계의 마무리'],

    [/하고 있(네요|군요|어요)\./g, '할 수 있는 에너지가 강하게 작용합니다.'],
    [/하고 있습니다\./g, '하는 흐름이 강하게 들어오고 있습니다.'],
    [/고 있(네요|군요|어요)\./g, '는 에너지가 뚜렷한 흐름입니다.'],
    [/고 있습니다\./g, '는 에너지가 작용하고 있습니다.'],
    [/할 거예요\./g, '할 가능성이 짙습니다.'],
    [/될 거예요\./g, '될 흐름으로 나아갑니다.'],
    [/될 것입니다\./g, '될 에너지가 뚜렷합니다.'],
    [/하게 됩니다\./g, '하게 되는 길이 열립니다.'],
    [/하게 될 것입니다\./g, '하게 될 가능성이 피어납니다.'],
    [/했었(군요|네요)\./g, '했던 과거의 무의식이 작용하고 있습니다.'],
    [/수 있어요\./g, '수 있는 여지가 존재합니다.'],
    [/수 있습니다\./g, '수 있는 흐름이 작용합니다.'],
    [/해요\./g, '하는 기운을 띱니다.']
];

function applyDictSafely(str) {
    let s = str;
    let placeholders = [];
    
    for (let i = 0; i < dict.length; i++) {
        let regex = dict[i][0];
        let replacement = dict[i][1];
        
        s = s.replace(regex, (match, p1) => {
            let p = `__PLACEHOLDER_${placeholders.length}__`;
            placeholders.push(replacement); // replacement strings don't depend on groups in this simple implementation
            return p;
        });
    }

    for (let i = placeholders.length - 1; i >= 0; i--) {
        s = s.replace(new RegExp(`__PLACEHOLDER_${i}__`, 'g'), placeholders[i]);
    }
    
    return s;
}

let result = '';
let inCeltic = false;
let braceCount = 0;
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.match(/^\s*celtic:\s*\{/)) {
        inCeltic = true;
        braceCount = 1;
        result += line + '\n';
        continue;
    }

    if (inCeltic) {
        for (let char of line) {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
        }

        let newLine = line.replace(/"([^"]+)"/g, (match, p1) => {
            return `"${applyDictSafely(p1)}"`;
        });
        
        result += newLine + '\n';

        if (braceCount === 0) {
            inCeltic = false;
        }
    } else {
        result += line + '\n';
    }
}

if (result.endsWith('\n') && !content.endsWith('\n')) {
    result = result.slice(0, -1);
}

fs.writeFileSync('src/constants/tarotData.ts', result, 'utf8');
console.log('Successfully completed semantic replacement');
