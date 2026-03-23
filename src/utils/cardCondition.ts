export interface CardCondition {
  level: number;
  hasStain: boolean;
  hasScratch: boolean;
  hasGlint: boolean;
}

export function getDailyCardCondition(cardId: number): CardCondition {
  // Use KST timeline to ensure strict deterministic result per day
  const dateStr = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
  const seed = `${dateStr}-${cardId}`;
  
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const level = (hash % 10) + 1; // 1~10 levels
  
  return {
    level,
    hasStain: hash % 17 === 0,
    hasScratch: hash % 19 === 0,
    hasGlint: hash % 23 === 0
  };
}
