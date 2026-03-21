const adjectives = ["푸른 안개의", "고요한 별의", "타오르는 심장의", "은빛 달빛의", "대지의 속삭임인", "바람을 가르는", "새벽을 여는"];
const nouns = ["인도자", "수호자", "해석가", "방랑자", "관찰자", "사제", "현자"];

export const generateDestinyKey = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
};
