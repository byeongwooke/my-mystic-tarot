import fs from 'fs';

const filePath = 'src/data/tarot/spread3.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace Interface
content = content.replace(/advice: {\s*love: TimelineAdvice;\s*money: TimelineAdvice;\s*work: TimelineAdvice;\s*};/g, 
  `advice: {\n        love: TimelineAdvice;\n        loveReversed?: TimelineAdvice;\n        money: TimelineAdvice;\n        moneyReversed?: TimelineAdvice;\n        work: TimelineAdvice;\n        workReversed?: TimelineAdvice;\n    };`);

// Add for Card 3 explicitly
const card3Replacement = `"3": {
        "interpretations": {
            "love": "안정적 사랑, 결실의 기미",
            "money": "자산 증식, 물질적 만족",
            "work": "노력의 가시화, 성과",
            "reversed": "집착, 낭비, 창의력 정체"
        },
        "advice": {
            "love": {
                "past": "풍요로운 사랑을 주고받던 때가 있었군요.",
                "present": "지금의 평온함을 소중히 가꾸세요.",
                "future": "관계가 더 깊고 풍성해질 것입니다."
            },
            "loveReversed": {
                "past": "소유욕과 집착으로 상대를 지치게 한 적이 있군요.",
                "present": "조건 없는 사랑과 배려를 되찾아야 할 때입니다.",
                "future": "이기심을 버린다면 관계가 다시 평온해집니다."
            },
            "money": {
                "past": "금전적으로 여유로웠던 시기를 보냈었네요.",
                "present": "풍요를 즐기며 내실을 다질 때입니다.",
                "future": "재물이 안정적으로 쌓이는 시기가 옵니다."
            },
            "moneyReversed": {
                "past": "사치나 낭비로 금전적 손실을 겪은 기억이 있네요.",
                "present": "충동적인 지출을 통제해야 할 시점입니다.",
                "future": "금전 감각을 되찾고 나면 서서히 회복됩니다."
            },
            "work": {
                "past": "뿌린 씨앗이 싹을 틔웠던 순간이 있었군요.",
                "present": "팀워크와 소통에 힘쓰면 성과가 배가됩니다.",
                "future": "진행 중인 일이 풍성한 결실을 맺을 거예요."
            },
            "workReversed": {
                "past": "의욕만 앞서 결실을 맺지 못한 일이 있었군요.",
                "present": "나태함을 버리고 실질적인 행동에 나서세요.",
                "future": "책임감을 가지고 임하면 결국 성과로 이어집니다."
            }
        }`;
        
content = content.replace(/"3": \{\s*"interpretations": \{[\s\S]*?\}\s*\}\s*\},(?=\s*"4":)/, card3Replacement + ',');

fs.writeFileSync(filePath, content);
