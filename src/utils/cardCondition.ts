export interface CardCondition {
  level: number;
}

export function getDailyCardCondition(cardId: number): CardCondition {
  // Use KST timeline to ensure strict deterministic result per day
  const dateStr = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
  const seed = `${dateStr}-${cardId}`;
  
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const level = (hash % 5) + 1; // 1~5 levels
  
  return {
    level
  };
}
