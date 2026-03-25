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

// This regex deletes (past), (core) etc properly even with punctuation
const cleanText = (text) => {
  if (!text) return text;
  return text.replace(/\s*\([\w]+\)[,.]?/g, "").trim();
};

const joinSentences = (past, present, future) => {
  let p = cleanText(past || "").trim();
  let c = cleanText(present || "").trim();
  let f = cleanText(future || "").trim();
  
  if (p && !p.endsWith(".") && !p.endsWith(",")) p += ",";
  else if (p && p.endsWith(",")) p += "";
  
  if (c && !c.endsWith(".") && !c.endsWith(",")) c += ".";
  
  return (p + " " + c + " " + f).trim();
};

// Handcrafted short keywords for major arcana 0-21 (6 categories)
const MAJOR_INTERPRETATIONS = {
  "0": {
    love: "순수한 호감, 무경계의 만남, 운명적 이끌림",
    loveReversed: "무책임한 태도, 가벼운 관계, 회피성",
    money: "새로운 수익원, 대담한 시작, 예상 밖의 투자",
    moneyReversed: "무계획적 지출, 탕진, 현실 감각 상실",
    work: "혁신적 발상, 새로운 분야 개척, 자유로운 시도",
    workReversed: "무책임한 강행, 기한 어김, 대책 없는 태도"
  },
  "1": {
    love: "주도적인 만남, 매력의 폭발, 설레는 진전",
    loveReversed: "언어의 기만, 얕은 호감 치부, 조종하려는 태도",
    money: "탁월한 협상력, 아이디어의 수익화, 기술적 자산",
    moneyReversed: "불투명한 거래, 사기 위험, 재능의 오용",
    work: "전략적 승리, 뛰어난 프레젠테이션, 다재다능",
    workReversed: "말뿐인 허세, 실력 부족 탄로, 조작과 거짓"
  },
  "2": {
    love: "정신적 교감, 내면의 신뢰, 조용히 싹트는 사랑",
    loveReversed: "비밀스러운 관계, 소통의 단절, 의심과 왜곡",
    money: "신중한 자금 관리, 문서운 강세, 비밀 유지",
    moneyReversed: "정보 누설로 인한 손해, 문서의 오류, 직관 착오",
    work: "분석적 깊이, 심도 있는 통찰, 묵묵한 성과",
    workReversed: "편협한 아집, 폐쇄적인 소통, 치명적 편견"
  },
  "3": {
    love: "풍요로운 애정, 헌신적 돌봄, 관계의 깊은 결실",
    loveReversed: "소유욕과 집착, 과보호, 숨 막히는 종속",
    money: "안정적인 부의 축적, 여유로운 사치, 투자 결실",
    moneyReversed: "극도의 낭비벽, 사치로 인한 재정 파탄, 가치 전락",
    work: "풍성한 성과, 원만한 대인관계, 노력의 달콤한 수확",
    workReversed: "결실 없는 과소비, 나태함과 공주병, 소통 부재"
  },
  "4": {
    love: "책임감 있는 보호, 안정적인 리드, 굳건한 신뢰",
    loveReversed: "숨 막히는 통제, 독재적 억압, 가부장적 권위",
    money: "규칙적인 적금, 흔들림 없는 재정, 완벽한 구조",
    moneyReversed: "자금 마비, 극단적 구두쇠, 투자 경직성",
    work: "시스템의 장악, 독보적 권위, 지도자의 역량",
    workReversed: "불통의 리더십, 경직된 사고, 조직의 반발"
  },
  "5": {
    love: "정신적 지지, 도덕적 결합, 축복받는 만남",
    loveReversed: "맹목적 강요, 가스라이팅, 어긋난 가치관",
    money: "안전 지향 투자, 전문가 조언 수용, 공적인 이익",
    moneyReversed: "잘못된 투자 자문, 군중 심리에 의한 손실, 신념의 배신",
    work: "훌륭한 멘토링, 조직 룰 준수, 공식적인 승인",
    workReversed: "사내 파벌의 희생양, 위선적 리더, 경직된 관행"
  },
  "6": {
    love: "운명적 선택, 완벽한 조화, 피할 수 없는 로맨스",
    loveReversed: "유혹에의 굴복, 삼각관계, 어리석은 감정 소모",
    money: "유리한 동업 제안, 훌륭한 계약 체결, 상호 이익",
    moneyReversed: "동업자와의 배신, 지출 밸런스 붕괴, 잘못된 동업",
    work: "최상의 팀워크, 직장에서의 완벽한 핏, 즐거운 업무",
    workReversed: "불화와 분열, 사내 연애 스캔들, 업무 효율 저하"
  },
  "7": {
    love: "저돌적인 전진, 뜨거운 고백, 빠른 진도",
    loveReversed: "일방적 구애, 폭력적 통제 욕구, 감정의 브레이크 고장",
    money: "공격적인 수익 창출, 목표 돌파, 단기 자금 회수",
    moneyReversed: "투기적 몰빵에 의한 파산, 무모한 베팅, 통제 불가",
    work: "경쟁사 압도, 압도적 추진력, 프로젝트의 폭풍 질주",
    workReversed: "오버페이스로 인한 과부하, 팀원 무시, 목표 상실"
  },
  "8": {
    love: "부드러운 포용, 상대를 기다려주는 여유, 단단한 신뢰",
    loveReversed: "인내심의 고갈, 억눌린 분노의 폭발, 포기 상태",
    money: "장기 비전의 승리, 인내 뒤의 보상, 안정적 유지",
    moneyReversed: "충동적인 포기, 감정적 소비, 마지막 순간의 탕진",
    work: "조용한 카리스마, 내유외강의 리더십, 원만한 조율",
    workReversed: "자신감 상실, 스트레스 폭발, 포기로 인한 실패"
  },
  "9": {
    love: "신중한 거리 두기, 성찰, 혼자만의 시간을 가짐",
    loveReversed: "극도의 철벽, 폐쇄적 고립, 마음의 왜곡",
    money: "물욕의 초연함, 내실 다지기, 지출 동결",
    moneyReversed: "정보 부족에 따른 단절적 손해, 옹고집 투자",
    work: "고도의 전문성 발휘, 장인 정신, 연구의 성과",
    workReversed: "사내 왕따, 타협 불가, 협업의 절대적 파괴"
  },
  "10": {
    love: "운명의 전환점, 예견된 만남, 긍정적 변화의 시작",
    loveReversed: "악연의 쳇바퀴, 타이밍의 완전한 엇갈림, 변화에 대한 저항",
    money: "뜻밖의 수익 곡선, 투자 타이밍 명중, 행운의 도래",
    moneyReversed: "어긋난 타이밍의 대규모 손실, 밑 빠진 독, 운의 하락",
    work: "이직 혹은 승진의 최적기, 파도를 타는 유연함",
    workReversed: "시기상조의 이직, 운에만 의존하는 무능력, 기회 날림"
  },
  "11": {
    love: "공평한 상호작용, 건강한 조율, 이성적 애정표현",
    loveReversed: "계산적인 이기심, 잔혹한 평가, 불공정한 대우",
    money: "합리적 투자, 손익 분기점 돌파, 법적 우위 점함",
    moneyReversed: "계약서상 치명적 오류, 법적 패소, 금전적 불이익",
    work: "공정한 보상 체계, 정확한 업무 분담, 합리적인 판단",
    workReversed: "불합리한 인사고과, 책임 전가, 잔인한 사내 정치"
  },
  "12": {
    love: "희생을 감내하는 깊은 사랑, 상대를 위한 양보",
    loveReversed: "억울한 호구 연애, 의미 없는 집착, 피해의식 폭발",
    money: "미래를 위한 일시적 묶임, 장기 청약, 지연된 만족",
    moneyReversed: "물린 주식의 방치, 답 없는 투자 유지, 금전적 족쇄",
    work: "새로운 관점 도출, 정체를 견디는 인내, 큰 그림",
    workReversed: "무의미한 헌신, 나아지지 않는 현실, 자포자기의 정체"
  },
  "13": {
    love: "관계의 완벽한 종료 후 새 출발, 미련 없는 이별",
    loveReversed: "과거 망령의 늪, 끊지 못하는 악연, 지독한 집착",
    money: "손절매의 결단력, 파산 후 재건, 자산 구조조정",
    moneyReversed: "손실 인정 거부, 더 깊은 적자의 늪, 재무적 사망",
    work: "낡은 시스템의 과감한 폐기, 새로운 직무로의 부활",
    workReversed: "과거 성공에 취한 도태, 혁신 거부, 처참한 사양길"
  },
  "14": {
    love: "완벽한 감정의 밸런스, 타협의 미학, 힐링 로맨스",
    loveReversed: "극단적 감정 기복, 밸런스 붕괴, 피로한 통제 불능",
    money: "포트폴리오의 절묘한 분산, 안정적 수입과 지출",
    moneyReversed: "잘못된 투자 비중, 현금 흐름의 엇박자, 절제력 상실",
    work: "우수한 조율자, 협상의 달인, 이질적 요소의 결합",
    workReversed: "소통의 단절, 무리한 합병, 조율 불가능한 트러블"
  },
  "15": {
    love: "강렬한 욕박, 마력적인 이끌림, 벗어날 수 없는 유혹",
    loveReversed: "막장 치정극, 타락한 종속 관계, 숨 막히는 구속",
    money: "수단 방법 가리지 않는 폭발적 수입, 이권 개입",
    moneyReversed: "빚의 늪, 파멸적 중독 소비, 사기성 투자의 희생양",
    work: "거부할 수 없는 달콤한 제안, 카리스마적 장악력",
    workReversed: "검은돈의 유혹, 과로의 극한, 영혼 없는 노동력 착취"
  },
  "16": {
    love: "거짓의 붕괴, 갑작스런 소나기 후 맑음, 진실의 획득",
    loveReversed: "충격적 이별의 상처, 비극의 폭격, 외면하던 현실 파괴",
    money: "거품 자산의 붕괴 후 건전화, 리스크 청산",
    moneyReversed: "처참한 파산, 강제 경매, 폭락장 직격탄",
    work: "고인 물 시스템 파괴, 거대한 구조조정 피바람",
    workReversed: "돌이킬 수 없는 사업 실패, 해고 통보, 재난적 붕괴"
  },
  "17": {
    love: "천생연분의 소울메이트, 로맨틱한 미래 약속, 영감의 원천",
    loveReversed: "과대망상, 헛된 짝사랑 희망고문, 현실 부적응 연애",
    money: "빛나는 투자 감각, 자산 회복기 돌입, 희망적 수익",
    moneyReversed: "근거 없는 대박 환상, 뜬구름 같은 투자처, 자금 공중분해",
    work: "아이디어의 보상, 트렌드를 선도하는 기획, 스타성",
    workReversed: "현실성 없는 플랜, 공상에 빠진 기획안, 헛된 자신감"
  },
  "18": {
    love: "오묘하고 몽환적인 썸, 말하지 않아도 통하는 신비로움",
    loveReversed: "불안과 편집증, 오해가 낳은 공포증, 숨겨진 기만",
    money: "보이지 않는 잠재적 투자처, 알 수 없으나 수익 나는 루트",
    moneyReversed: "사기판에 속은 맹신, 짙은 안개 속 낭떠러지 걷기",
    work: "직관적 통찰, 무의식을 활용한 디자인 예술성 발현",
    workReversed: "동료에 대한 과대 피해망상, 뒷담화의 주범, 멘탈 붕괴"
  },
  "19": {
    love: "눈부신 행복, 더할 나위 없는 축복, 완벽한 궁합",
    loveReversed: "극도의 오만에 취한 방심, 잘나갈 때의 이기심",
    money: "태양처럼 명확한 수익, 대성공, 최고의 재정 상태",
    moneyReversed: "과시욕이 부른 탕진, 겉만 화려한 허세성 불량 잔고",
    work: "영광의 무대 중심, 모든 스포트라이트 집중, 성과 1위",
    workReversed: "나만 잘났다는 나르시시즘, 타인의 공로 탈취, 신뢰 좀먹기"
  },
  "20": {
    love: "인연의 부활, 재회 후 깊은 깨달음, 진정한 구원",
    loveReversed: "과거에 매몰된 찌질함, 기회를 차버리는 우유부단함",
    money: "지연된 보상의 완벽한 회수, 되살아난 자본의 불씨",
    moneyReversed: "골든타임을 놓친 매도 지연, 영영 죽어버린 자산",
    work: "최종 합격, 승진 심사 통과, 새로운 커리어 소환",
    workReversed: "인사 고과 누락, 무능력에 대한 최후 통첩, 도태 확정"
  },
  "21": {
    love: "결혼이나 동거의 성사, 우주의 축복 수준의 완성체",
    loveReversed: "완성 직전의 파토, 한 끗 차이로 무너진 약속",
    money: "경제적 자유 달성, 완벽한 포트폴리오 완성",
    moneyReversed: "알맹이 빠진 속 빈 강정 수익, 아쉬운 99%의 마감",
    work: "글로벌 프로젝트의 성공적 엔딩, 마스터의 경지",
    workReversed: "사소한 마무리의 실수로 망친 대업, 미완성의 수모"
  }
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

  const getInterp = (cat) => {
    if (i <= 21 && MAJOR_INTERPRETATIONS[cardId][cat]) {
      return MAJOR_INTERPRETATIONS[cardId][cat];
    }
    // Fallback for minor arcana (22-77)
    if (cat.includes('Reversed')) {
      return cData.interpretations?.reversed || "부정적 흐름, 각성 필요, 정체";
    }
    return cData.interpretations?.[cat] || "긍정적 흐름, 성과, 발전";
  };

  newSpread3Data[cardId] = {
    interpretations: {
      love: getInterp('love'),
      loveReversed: getInterp('loveReversed'),
      money: getInterp('money'),
      moneyReversed: getInterp('moneyReversed'),
      work: getInterp('work'),
      workReversed: getInterp('workReversed'),
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
console.log('Successfully completed Spread3 data update for Major Arcana (Interpretations & Cleaned Advice).');
