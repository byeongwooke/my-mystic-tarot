import { CardContent, TarotBase } from '../base';

import { card0 } from './card0';
import { card1 } from './card1';
import { card2 } from './card2';
import { card3 } from './card3';
import { card4 } from './card4';
import { card5 } from './card5';
import { card6 } from './card6';
import { card7 } from './card7';
import { card8 } from './card8';
import { card9 } from './card9';
import { card10 } from './card10';
import { card11 } from './card11';
import { card12 } from './card12';
import { card13 } from './card13';
import { card14 } from './card14';
import { card15 } from './card15';
import { card16 } from './card16';
import { card17 } from './card17';
import { card18 } from './card18';
import { card19 } from './card19';
import { card20 } from './card20';
import { card21 } from './card21';
import { card22 } from './card22';
import { card23 } from './card23';
import { card24 } from './card24';
import { card25 } from './card25';
import { card26 } from './card26';
import { card27 } from './card27';
import { card28 } from './card28';
import { card29 } from './card29';
import { card30 } from './card30';
import { card31 } from './card31';
import { card32 } from './card32';
import { card33 } from './card33';
import { card34 } from './card34';
import { card35 } from './card35';
import { card36 } from './card36';
import { card37 } from './card37';
import { card38 } from './card38';
import { card39 } from './card39';
import { card40 } from './card40';
import { card41 } from './card41';
import { card42 } from './card42';
import { card43 } from './card43';
import { card44 } from './card44';
import { card45 } from './card45';
import { card46 } from './card46';
import { card47 } from './card47';
import { card48 } from './card48';
import { card49 } from './card49';
import { card50 } from './card50';
import { card51 } from './card51';
import { card52 } from './card52';
import { card53 } from './card53';
import { card54 } from './card54';
import { card55 } from './card55';
import { card56 } from './card56';
import { card57 } from './card57';
import { card58 } from './card58';
import { card59 } from './card59';
import { card60 } from './card60';
import { card61 } from './card61';
import { card62 } from './card62';
import { card63 } from './card63';
import { card64 } from './card64';
import { card65 } from './card65';
import { card66 } from './card66';
import { card67 } from './card67';
import { card68 } from './card68';
import { card69 } from './card69';
import { card70 } from './card70';
import { card71 } from './card71';
import { card72 } from './card72';
import { card73 } from './card73';
import { card74 } from './card74';
import { card75 } from './card75';
import { card76 } from './card76';
import { card77 } from './card77';

export type TarotCardData = TarotBase & CardContent;

const TAROT_METADATA: Record<number, TarotBase> = {
  "0": { "id": 0, "name": "The Fool", "nameKr": "광대", "keywords": ["시작", "무경계", "변수"], "keywordsReversed": ["주저함", "재검토", "미숙함"], "score": 88.5, "warningScore": 35.2, "polarity": "positive", "reversePolarity": "negative" },
  "1": { "id": 1, "name": "The Magician", "nameKr": "마법사", "keywords": ["구현", "기술", "주도권"], "keywordsReversed": ["망설임", "기술미숙", "계획수정"], "score": 93.8, "warningScore": 42.1, "polarity": "positive", "reversePolarity": "negative" },
  "2": { "id": 2, "name": "The High Priestess", "nameKr": "고위 여사제", "keywords": ["통찰", "비밀", "침묵"], "keywordsReversed": ["혼란", "드러남", "불통"], "score": 85.0, "warningScore": 55.4, "polarity": "positive", "reversePolarity": "positive" },
  "3": { "id": 3, "name": "The Empress", "nameKr": "여황제", "keywords": ["풍요", "결실", "포용"], "keywordsReversed": ["정체", "낭비", "소홀"], "score": 96.2, "warningScore": 38.5, "polarity": "positive", "reversePolarity": "negative" },
  "4": { "id": 4, "name": "The Emperor", "nameKr": "황제", "keywords": ["질서", "책임", "권위"], "keywordsReversed": ["독단", "과부하", "불안정"], "score": 91.5, "warningScore": 58.2, "polarity": "positive", "reversePolarity": "positive" },
  "5": { "id": 5, "name": "The Hierophant", "nameKr": "교황", "keywords": ["전통", "가이드", "믿음"], "keywordsReversed": ["편협", "의구심", "소통부재"], "score": 80.4, "warningScore": 45.0, "polarity": "positive", "reversePolarity": "negative" },
  "6": { "id": 6, "name": "The Lovers", "nameKr": "연인", "keywords": ["선택", "조화", "결합"], "keywordsReversed": ["갈등", "불일치", "선택보류"], "score": 95.8, "warningScore": 32.4, "polarity": "positive", "reversePolarity": "negative" },
  "7": { "id": 7, "name": "The Chariot", "nameKr": "전차", "keywords": ["승리", "의지", "추진력"], "keywordsReversed": ["폭주", "방향상실", "속도조절"], "score": 89.7, "warningScore": 48.6, "polarity": "positive", "reversePolarity": "negative" },
  "8": { "id": 8, "name": "Strength", "nameKr": "힘", "keywords": ["인내", "용기", "부드러움"], "keywordsReversed": ["자기검열", "인내한계", "감정폭발"], "score": 88.2, "warningScore": 50.1, "polarity": "positive", "reversePolarity": "positive" },
  "9": { "id": 9, "name": "The Hermit", "nameKr": "은둔자", "keywords": ["성찰", "고독", "진리"], "keywordsReversed": ["고립", "현실회피", "소통단절"], "score": 65.5, "warningScore": 28.4, "polarity": "positive", "reversePolarity": "negative" },
  "10": { "id": 10, "name": "Wheel of Fortune", "nameKr": "운명의 수레바퀴", "keywords": ["변화", "순환", "전환점"], "keywordsReversed": ["지연", "정체", "타이밍조율"], "score": 82.0, "warningScore": 45.0, "polarity": "positive", "reversePolarity": "negative" },
  "11": { "id": 11, "name": "Justice", "nameKr": "정의", "keywords": ["균형", "공정", "결단"], "keywordsReversed": ["편견", "불균형", "결정보류"], "score": 80.5, "warningScore": 62.1, "polarity": "positive", "reversePolarity": "positive" },
  "12": { "id": 12, "name": "The Hanged Man", "nameKr": "매달린 사람", "keywords": ["인내", "정체", "관점 전환"], "keywordsReversed": ["헛된희생", "정체지속", "고집"], "score": 42.5, "warningScore": 68.4, "polarity": "negative", "reversePolarity": "positive" },
  "13": { "id": 13, "name": "Death", "nameKr": "죽음", "keywords": ["종결", "변화", "새로운 시작"], "keywordsReversed": ["지연됨", "미련", "서서히 변화"], "score": 12.4, "warningScore": 75.0, "polarity": "negative", "reversePolarity": "positive" },
  "14": { "id": 14, "name": "Temperance", "nameKr": "절제", "keywords": ["조화", "균형", "중용"], "keywordsReversed": ["불균형", "과잉", "조율실패"], "score": 90.2, "warningScore": 38.4, "polarity": "positive", "reversePolarity": "negative" },
  "15": { "id": 15, "name": "The Devil", "nameKr": "악마", "keywords": ["유혹", "집착", "속박"], "keywordsReversed": ["각성", "해방준비", "의존탈피"], "score": 10.5, "warningScore": 82.4, "polarity": "negative", "reversePolarity": "positive" },
  "16": { "id": 16, "name": "The Tower", "nameKr": "탑", "keywords": ["격변", "해방", "충격"], "keywordsReversed": ["혼란지속", "충격완화", "재건시작"], "score": 5.2, "warningScore": 90.0, "polarity": "negative", "reversePolarity": "negative" },
  "17": { "id": 17, "name": "The Star", "nameKr": "별", "keywords": ["희망", "치유", "영감"], "keywordsReversed": ["현실자각", "치유지연", "기대조절"], "score": 97.5, "warningScore": 22.1, "polarity": "positive", "reversePolarity": "negative" },
  "18": { "id": 18, "name": "The Moon", "nameKr": "달", "keywords": ["불안", "혼돈", "잠재의식"], "keywordsReversed": ["진실드러남", "불안해소", "직관회복"], "score": 28.5, "warningScore": 78.4, "polarity": "negative", "reversePolarity": "positive" },
  "19": { "id": 19, "name": "The Sun", "nameKr": "태양", "keywords": ["성공", "활력", "명료함"], "keywordsReversed": ["일시적위축", "활력저하", "가려진진실"], "score": 99.2, "warningScore": 15.4, "polarity": "positive", "reversePolarity": "negative" },
  "20": { "id": 20, "name": "Judgement", "nameKr": "심판", "keywords": ["부활", "결단", "보상"], "keywordsReversed": ["과거회귀", "결정지연", "성찰필요"], "score": 92.4, "warningScore": 38.2, "polarity": "positive", "reversePolarity": "negative" },
  "21": { "id": 21, "name": "The World", "nameKr": "세계", "keywords": ["완성", "통합", "새로운 여정"], "keywordsReversed": ["미완성", "조율중", "도착지연"], "score": 100.0, "warningScore": 10.0, "polarity": "positive", "reversePolarity": "positive" },
  "22": { "id": 22, "name": "Ace of Wands", "nameKr": "완드 에이스", "keywords": ["시작", "착수", "영감"], "keywordsReversed": ["망설임", "준비부족", "에너지분산"], "score": 87.5, "warningScore": 32.4, "polarity": "positive", "reversePolarity": "negative" },
  "23": { "id": 23, "name": "Two of Wands", "nameKr": "완드 2번", "keywords": ["계획", "전망", "선택"], "keywordsReversed": ["선택장애", "시야협소", "계획수정"], "score": 75.8, "warningScore": 35.0, "polarity": "positive", "reversePolarity": "negative" },
  "24": { "id": 24, "name": "Three of Wands", "nameKr": "완드 3번", "keywords": ["확장", "전진", "기다림"], "keywordsReversed": ["지연", "안주", "재정비"], "score": 79.2, "warningScore": 38.2, "polarity": "positive", "reversePolarity": "negative" },
  "25": { "id": 25, "name": "Four of Wands", "nameKr": "완드 4번", "keywords": ["안정", "화합", "축제"], "keywordsReversed": ["형식주의", "일시적불안", "소통정체"], "score": 85.0, "warningScore": 30.5, "polarity": "positive", "reversePolarity": "negative" },
  "26": { "id": 26, "name": "Five of Wands", "nameKr": "완드 5번", "keywords": ["경쟁", "충돌", "성장통"], "keywordsReversed": ["회피", "소모전", "내부갈등"], "score": 42.1, "warningScore": 55.4, "polarity": "negative", "reversePolarity": "negative" },
  "27": { "id": 27, "name": "Six of Wands", "nameKr": "완드 6번", "keywords": ["승리", "명예", "인정"], "keywordsReversed": ["과시", "자만심경계", "평판관리"], "score": 86.5, "warningScore": 40.2, "polarity": "positive", "reversePolarity": "negative" },
  "28": { "id": 28, "name": "Seven of Wands", "nameKr": "완드 7번", "keywords": ["수호", "방어", "입지"], "keywordsReversed": ["방어적태도", "압박감", "유연성부족"], "score": 74.5, "warningScore": 45.8, "polarity": "positive", "reversePolarity": "negative" },
  "29": { "id": 29, "name": "Eight of Wands", "nameKr": "완드 8번", "keywords": ["속도", "급진전", "소식"], "keywordsReversed": ["혼선", "속도지연", "정보과잉"], "score": 81.2, "warningScore": 34.0, "polarity": "positive", "reversePolarity": "negative" },
  "30": { "id": 30, "name": "Nine of Wands", "nameKr": "완드 9번", "keywords": ["인내", "경계", "최후의 시험"], "keywordsReversed": ["피로", "경계심과잉", "휴식필요"], "score": 52.4, "warningScore": 58.6, "polarity": "negative", "reversePolarity": "negative" },
  "31": { "id": 31, "name": "Ten of Wands", "nameKr": "완드 10번", "keywords": ["과부하", "책임", "압박"], "keywordsReversed": ["책임회피", "한계도착", "분산필요"], "score": 60.5, "warningScore": 68.2, "polarity": "positive", "reversePolarity": "negative" },
  "32": { "id": 32, "name": "Page of Wands", "nameKr": "완드 시종", "keywords": ["소식", "호기심", "잠재력"], "keywordsReversed": ["미숙함", "집중력부족", "전달지연"], "score": 72.8, "warningScore": 38.4, "polarity": "positive", "reversePolarity": "negative" },
  "33": { "id": 33, "name": "Knight of Wands", "nameKr": "완드 기사", "keywords": ["행동", "모험", "추진력"], "keywordsReversed": ["조급함", "무모함주의", "속도조절"], "score": 78.4, "warningScore": 45.2, "polarity": "positive", "reversePolarity": "negative" },
  "34": { "id": 34, "name": "Queen of Wands", "nameKr": "완드 여왕", "keywords": ["자신감", "매력", "활력"], "keywordsReversed": ["감정기복", "자기중심적", "활력정체"], "score": 84.5, "warningScore": 42.1, "polarity": "positive", "reversePolarity": "negative" },
  "35": { "id": 35, "name": "King of Wands", "nameKr": "완드 왕", "keywords": ["비전", "권위", "성취"], "keywordsReversed": ["독단", "시야부족", "압박감"], "score": 90.0, "warningScore": 40.5, "polarity": "positive", "reversePolarity": "negative" },
  "36": { "id": 36, "name": "Ace of Cups", "nameKr": "컵 에이스", "keywords": ["시작", "정서적 유입", "충만"], "keywordsReversed": ["감정적소모", "기대치조절", "내면치유"], "score": 92.4, "warningScore": 28.5, "polarity": "positive", "reversePolarity": "negative" },
  "37": { "id": 37, "name": "Two of Cups", "nameKr": "컵 2번", "keywords": ["화합", "우정", "파트너십"], "keywordsReversed": ["오해", "불통", "관계재정비"], "score": 91.5, "warningScore": 30.2, "polarity": "positive", "reversePolarity": "negative" },
  "38": { "id": 38, "name": "Three of Cups", "nameKr": "컵 3번", "keywords": ["공유", "유대", "환희"], "keywordsReversed": ["과시적친목", "소외감", "내실부족"], "score": 88.4, "warningScore": 35.0, "polarity": "positive", "reversePolarity": "negative" },
  "39": { "id": 39, "name": "Four of Cups", "nameKr": "컵 4번", "keywords": ["정체", "권태", "내면 탐색"], "keywordsReversed": ["각성", "권태탈피", "새로운제안"], "score": 50.2, "warningScore": 48.4, "polarity": "positive", "reversePolarity": "negative" },
  "40": { "id": 40, "name": "Five of Cups", "nameKr": "컵 5번", "keywords": ["상실", "후회", "시선 전환"], "keywordsReversed": ["회복 시작", "과거 수용", "남은 가치 발견"], "score": 32.5, "warningScore": 65.0, "polarity": "negative", "reversePolarity": "negative" },
  "41": { "id": 41, "name": "Six of Cups", "nameKr": "컵 6번", "keywords": ["추억", "순수", "재방문"], "keywordsReversed": ["현실 자각", "미래 지향", "성숙한 성장"], "score": 75.2, "warningScore": 32.4, "polarity": "positive", "reversePolarity": "negative" },
  "42": { "id": 42, "name": "Seven of Cups", "nameKr": "컵 7번", "keywords": ["환상", "선택장애", "신기루"], "keywordsReversed": ["현실 파악", "명료한 선택", "실질적 행동"], "score": 45.8, "warningScore": 58.2, "polarity": "negative", "reversePolarity": "negative" },
  "43": { "id": 43, "name": "Eight of Cups", "nameKr": "컵 8번", "keywords": ["이탈", "본질 탐구", "여정"], "keywordsReversed": ["복귀 준비", "감정 회복", "새로운 열정"], "score": 58.4, "warningScore": 52.0, "polarity": "negative", "reversePolarity": "negative" },
  "44": { "id": 44, "name": "Nine of Cups", "nameKr": "컵 9번", "keywords": ["만족", "소원 성취", "자기애"], "keywordsReversed": ["겸손한 감사", "내실 다지기", "자만 경계"], "score": 94.2, "warningScore": 28.5, "polarity": "positive", "reversePolarity": "negative" },
  "45": { "id": 45, "name": "Ten of Cups", "nameKr": "컵 10번", "keywords": ["완성", "정서적 유대", "조화"], "keywordsReversed": ["소통 재정비", "형식주의 경계", "진심 회복"], "score": 96.5, "warningScore": 25.0, "polarity": "positive", "reversePolarity": "negative" },
  "46": { "id": 46, "name": "Page of Cups", "nameKr": "컵 시종", "keywords": ["소식", "예술적 감성", "호기심"], "keywordsReversed": ["표현의 서투름", "내면 탐구", "조심스러운 감성"], "score": 74.2, "warningScore": 38.5, "polarity": "positive", "reversePolarity": "negative" },
  "47": { "id": 47, "name": "Knight of Cups", "nameKr": "컵 기사", "keywords": ["제안", "로맨티시즘", "우아함"], "keywordsReversed": ["신중한 제안", "감정 조절", "현실적 접근"], "score": 82.0, "warningScore": 40.2, "polarity": "positive", "reversePolarity": "negative" },
  "48": { "id": 48, "name": "Queen of Cups", "nameKr": "컵 여왕", "keywords": ["공감", "자애", "통찰"], "keywordsReversed": ["감정적 평온", "자기 치유", "내면의 힘"], "score": 88.5, "warningScore": 42.4, "polarity": "positive", "reversePolarity": "negative" },
  "49": { "id": 49, "name": "King of Cups", "nameKr": "컵 왕", "keywords": ["평정", "관대", "정서적 숙련"], "keywordsReversed": ["감정의 균형", "솔직한 대화", "성찰적 리더십"], "score": 92.4, "warningScore": 38.0, "polarity": "positive", "reversePolarity": "negative" },
  "50": { "id": 50, "name": "Ace of Swords", "nameKr": "검 에이스", "keywords": ["결단", "명확함", "돌파"], "keywordsReversed": ["신중한 결단", "계획 수정", "돌파구 탐색"], "score": 85.0, "warningScore": 55.2, "polarity": "positive", "reversePolarity": "positive" },
  "51": { "id": 51, "name": "Two of Swords", "nameKr": "검 2번", "keywords": ["교착", "선택 보류", "균형"], "keywordsReversed": ["망설임 끝", "진실 직시", "해답 발견"], "score": 48.5, "warningScore": 58.4, "polarity": "negative", "reversePolarity": "positive" },
  "52": { "id": 52, "name": "Three of Swords", "nameKr": "검 3번", "keywords": ["상처", "슬픔", "직면"], "keywordsReversed": ["치유의 과정", "과거 용서", "회복의 기미"], "score": 15.2, "warningScore": 85.0, "polarity": "negative", "reversePolarity": "positive" },
  "53": { "id": 53, "name": "Four of Swords", "nameKr": "검 4번", "keywords": ["휴식", "회복", "정지"], "keywordsReversed": ["활동 재개", "활력 회복", "적극적 대응"], "score": 58.5, "warningScore": 48.0, "polarity": "positive", "reversePolarity": "positive" },
  "54": { "id": 54, "name": "Five of Swords", "nameKr": "검 5번", "keywords": ["이기주의", "불화", "상처뿐인 승리"], "keywordsReversed": ["갈등 종결", "화해의 손길", "평화로운 양보"], "score": 22.4, "warningScore": 75.8, "polarity": "negative", "reversePolarity": "positive" },
  "55": { "id": 55, "name": "Six of Swords", "nameKr": "검 6번", "keywords": ["이동", "회복", "국면 전환"], "keywordsReversed": ["정체 극복", "내면의 정착", "안정적인 이동"], "score": 62.0, "warningScore": 45.2, "polarity": "positive", "reversePolarity": "positive" },
  "56": { "id": 56, "name": "Seven of Swords", "nameKr": "검 7번", "keywords": ["기만", "은밀함", "책임 회피"], "keywordsReversed": ["정직한 대면", "오해 해소", "책임의 수용"], "score": 35.8, "warningScore": 68.2, "polarity": "negative", "reversePolarity": "positive" },
  "57": { "id": 57, "name": "Eight of Swords", "nameKr": "검 8번", "keywords": ["속박", "무력감", "제약"], "keywordsReversed": ["해방의 시작", "안대 벗기", "자율성 회복"], "score": 28.4, "warningScore": 72.5, "polarity": "negative", "reversePolarity": "positive" },
  "58": { "id": 58, "name": "Nine of Swords", "nameKr": "검 9번", "keywords": ["불면", "불안", "죄책감"], "keywordsReversed": ["악몽 탈피", "평온한 안식", "불안의 해소"], "score": 12.5, "warningScore": 88.4, "polarity": "negative", "reversePolarity": "positive" },
  "59": { "id": 59, "name": "Ten of Swords", "nameKr": "검 10번", "keywords": ["종결", "바닥", "수용"], "keywordsReversed": ["바닥 딛고 재기", "새로운 희망", "고통의 승화"], "score": 4.8, "warningScore": 95.0, "polarity": "negative", "reversePolarity": "positive" },
  "60": { "id": 60, "name": "Page of Swords", "nameKr": "검 시종", "keywords": ["경계", "첩보", "미숙함"], "keywordsReversed": ["신중한 탐색", "생각 정리", "서툰 표현 다듬기"], "score": 65.2, "warningScore": 48.4, "polarity": "positive", "reversePolarity": "positive" },
  "61": { "id": 61, "name": "Knight of Swords", "nameKr": "검 기사", "keywords": ["급박함", "추진력", "논리적 관철"], "keywordsReversed": ["속도 조절", "신중한 질주", "추진력 재정비"], "score": 70.5, "warningScore": 55.2, "polarity": "positive", "reversePolarity": "positive" },
  "62": { "id": 62, "name": "Queen of Swords", "nameKr": "검 여왕", "keywords": ["독립", "냉철함", "경계 설정"], "keywordsReversed": ["부드러운 통찰", "장벽 허물기", "유연한 소신"], "score": 82.4, "warningScore": 58.0, "polarity": "positive", "reversePolarity": "positive" },
  "63": { "id": 63, "name": "King of Swords", "nameKr": "검 왕", "keywords": ["지성", "전략", "이성적 권위"], "keywordsReversed": ["독단 경계", "지혜로운 수용", "유연한 판단"], "score": 88.5, "warningScore": 52.1, "polarity": "positive", "reversePolarity": "positive" },
  "64": { "id": 64, "name": "Ace of Pentacles", "nameKr": "펜타클 에이스", "keywords": ["기틀", "번영", "실질적 결실"], "keywordsReversed": ["내실 다지기", "준비 단계", "씨앗 가꾸기"], "score": 96.8, "warningScore": 22.4, "polarity": "positive", "reversePolarity": "negative" },
  "65": { "id": 65, "name": "Two of Pentacles", "nameKr": "펜타클 2번", "keywords": ["조율", "유연성", "변동성"], "keywordsReversed": ["집중력 회복", "안정적 균형", "시간 관리"], "score": 68.5, "warningScore": 42.1, "polarity": "positive", "reversePolarity": "negative" },
  "66": { "id": 66, "name": "Three of Pentacles", "nameKr": "펜타클 3번", "keywords": ["협동", "숙련", "인정"], "keywordsReversed": ["기초 보완", "배움의 지속", "협력 구조 정비"], "score": 86.4, "warningScore": 32.5, "polarity": "positive", "reversePolarity": "negative" },
  "67": { "id": 67, "name": "Four of Pentacles", "nameKr": "펜타클 4번", "keywords": ["소유", "안전제일", "보수적"], "keywordsReversed": ["경계 완화", "유연한 분배", "소유욕 비우기"], "score": 75.2, "warningScore": 48.4, "polarity": "positive", "reversePolarity": "negative" },
  "68": { "id": 68, "name": "Five of Pentacles", "nameKr": "펜타클 5번", "keywords": ["고립", "고난", "소외"], "keywordsReversed": ["회복의 기미", "희망의 발견", "도움의 수용"], "score": 18.4, "warningScore": 82.1, "polarity": "negative", "reversePolarity": "positive" },
  "69": { "id": 69, "name": "Six of Pentacles", "nameKr": "펜타클 6번", "keywords": ["관용", "나눔", "균형"], "keywordsReversed": ["재정적 자립", "내실 경영", "공정한 배분 성찰"], "score": 88.2, "warningScore": 30.5, "polarity": "positive", "reversePolarity": "negative" },
  "70": { "id": 70, "name": "Seven of Pentacles", "nameKr": "펜타클 7번", "keywords": ["인내", "수확 대기", "중간 점검"], "keywordsReversed": ["조급함 내려놓기", "노력의 재평가", "기초 보강"], "score": 72.5, "warningScore": 40.2, "polarity": "positive", "reversePolarity": "negative" },
  "71": { "id": 71, "name": "Eight of Pentacles", "nameKr": "펜타클 8번", "keywords": ["성실", "연마", "장인 정신"], "keywordsReversed": ["숙련도 보완", "휴식과 정비", "기술적 성찰"], "score": 84.8, "warningScore": 28.4, "polarity": "positive", "reversePolarity": "negative" },
  "72": { "id": 72, "name": "Nine of Pentacles", "nameKr": "펜타클 9번", "keywords": ["자립", "성취", "품격"], "keywordsReversed": ["겸손한 감사", "내실 다지기", "자만 경계"], "score": 93.5, "warningScore": 25.4, "polarity": "positive", "reversePolarity": "negative" },
  "73": { "id": 73, "name": "Ten of Pentacles", "nameKr": "펜타클 10번", "keywords": ["유산", "가풍", "부유함"], "keywordsReversed": ["형식 탈피", "진정한 가치 공유", "안정적 구조 정비"], "score": 97.2, "warningScore": 20.0, "polarity": "positive", "reversePolarity": "negative" },
  "74": { "id": 74, "name": "Page of Pentacles", "nameKr": "펜타클 시종", "keywords": ["학구열", "신중", "기회 포착"], "keywordsReversed": ["실천의 시작", "정보 정밀 분석", "조심스러운 첫발"], "score": 75.0, "warningScore": 38.2, "polarity": "positive", "reversePolarity": "negative" },
  "75": { "id": 75, "name": "Knight of Pentacles", "nameKr": "펜타클 기사", "keywords": ["우직함", "보수적", "실천"], "keywordsReversed": ["유연한 실천", "정체 극복", "완급 조절"], "score": 82.4, "warningScore": 35.0, "polarity": "positive", "reversePolarity": "negative" },
  "76": { "id": 76, "name": "Queen of Pentacles", "nameKr": "펜타클 여왕", "keywords": ["실속", "풍요", "보살핌"], "keywordsReversed": ["자아 성찰", "자율적 배려", "내면의 풍요"], "score": 90.5, "warningScore": 32.1, "polarity": "positive", "reversePolarity": "negative" },
  "77": { "id": 77, "name": "King of Pentacles", "nameKr": "펜타클 왕", "keywords": ["재력", "성공", "경제적 권위"], "keywordsReversed": ["권위의 유연함", "지출 정비", "안정적 자산 수성"], "score": 96.0, "warningScore": 28.5, "polarity": "positive", "reversePolarity": "negative" }
};

export const CARDS: Record<number, TarotCardData> = {
  0: { ...TAROT_METADATA[0], ...card0 },
  1: { ...TAROT_METADATA[1], ...card1 },
  2: { ...TAROT_METADATA[2], ...card2 },
  3: { ...TAROT_METADATA[3], ...card3 },
  4: { ...TAROT_METADATA[4], ...card4 },
  5: { ...TAROT_METADATA[5], ...card5 },
  6: { ...TAROT_METADATA[6], ...card6 },
  7: { ...TAROT_METADATA[7], ...card7 },
  8: { ...TAROT_METADATA[8], ...card8 },
  9: { ...TAROT_METADATA[9], ...card9 },
  10: { ...TAROT_METADATA[10], ...card10 },
  11: { ...TAROT_METADATA[11], ...card11 },
  12: { ...TAROT_METADATA[12], ...card12 },
  13: { ...TAROT_METADATA[13], ...card13 },
  14: { ...TAROT_METADATA[14], ...card14 },
  15: { ...TAROT_METADATA[15], ...card15 },
  16: { ...TAROT_METADATA[16], ...card16 },
  17: { ...TAROT_METADATA[17], ...card17 },
  18: { ...TAROT_METADATA[18], ...card18 },
  19: { ...TAROT_METADATA[19], ...card19 },
  20: { ...TAROT_METADATA[20], ...card20 },
  21: { ...TAROT_METADATA[21], ...card21 },
  22: { ...TAROT_METADATA[22], ...card22 },
  23: { ...TAROT_METADATA[23], ...card23 },
  24: { ...TAROT_METADATA[24], ...card24 },
  25: { ...TAROT_METADATA[25], ...card25 },
  26: { ...TAROT_METADATA[26], ...card26 },
  27: { ...TAROT_METADATA[27], ...card27 },
  28: { ...TAROT_METADATA[28], ...card28 },
  29: { ...TAROT_METADATA[29], ...card29 },
  30: { ...TAROT_METADATA[30], ...card30 },
  31: { ...TAROT_METADATA[31], ...card31 },
  32: { ...TAROT_METADATA[32], ...card32 },
  33: { ...TAROT_METADATA[33], ...card33 },
  34: { ...TAROT_METADATA[34], ...card34 },
  35: { ...TAROT_METADATA[35], ...card35 },
  36: { ...TAROT_METADATA[36], ...card36 },
  37: { ...TAROT_METADATA[37], ...card37 },
  38: { ...TAROT_METADATA[38], ...card38 },
  39: { ...TAROT_METADATA[39], ...card39 },
  40: { ...TAROT_METADATA[40], ...card40 },
  41: { ...TAROT_METADATA[41], ...card41 },
  42: { ...TAROT_METADATA[42], ...card42 },
  43: { ...TAROT_METADATA[43], ...card43 },
  44: { ...TAROT_METADATA[44], ...card44 },
  45: { ...TAROT_METADATA[45], ...card45 },
  46: { ...TAROT_METADATA[46], ...card46 },
  47: { ...TAROT_METADATA[47], ...card47 },
  48: { ...TAROT_METADATA[48], ...card48 },
  49: { ...TAROT_METADATA[49], ...card49 },
  50: { ...TAROT_METADATA[50], ...card50 },
  51: { ...TAROT_METADATA[51], ...card51 },
  52: { ...TAROT_METADATA[52], ...card52 },
  53: { ...TAROT_METADATA[53], ...card53 },
  54: { ...TAROT_METADATA[54], ...card54 },
  55: { ...TAROT_METADATA[55], ...card55 },
  56: { ...TAROT_METADATA[56], ...card56 },
  57: { ...TAROT_METADATA[57], ...card57 },
  58: { ...TAROT_METADATA[58], ...card58 },
  59: { ...TAROT_METADATA[59], ...card59 },
  60: { ...TAROT_METADATA[60], ...card60 },
  61: { ...TAROT_METADATA[61], ...card61 },
  62: { ...TAROT_METADATA[62], ...card62 },
  63: { ...TAROT_METADATA[63], ...card63 },
  64: { ...TAROT_METADATA[64], ...card64 },
  65: { ...TAROT_METADATA[65], ...card65 },
  66: { ...TAROT_METADATA[66], ...card66 },
  67: { ...TAROT_METADATA[67], ...card67 },
  68: { ...TAROT_METADATA[68], ...card68 },
  69: { ...TAROT_METADATA[69], ...card69 },
  70: { ...TAROT_METADATA[70], ...card70 },
  71: { ...TAROT_METADATA[71], ...card71 },
  72: { ...TAROT_METADATA[72], ...card72 },
  73: { ...TAROT_METADATA[73], ...card73 },
  74: { ...TAROT_METADATA[74], ...card74 },
  75: { ...TAROT_METADATA[75], ...card75 },
  76: { ...TAROT_METADATA[76], ...card76 },
  77: { ...TAROT_METADATA[77], ...card77 }
};
