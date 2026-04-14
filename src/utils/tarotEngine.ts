import { UserSettings } from '../types/settings';
import { CardContent, CelticAdvice } from '../data/tarot/base';
import { CARDS } from '../data/tarot/cards';

/**
 * Returns the card pool based on whether minor arcana are included.
 * 0-21: Major Arcana
 * 22-77: Minor Arcana
 */
export const getCardPool = (includeMinor: boolean): number[] => {
  const majorCount = 22;
  const totalCount = 78;
  return Array.from(
    { length: includeMinor ? totalCount : majorCount },
    (_, i) => i
  );
};

/**
 * Randomly draws a card (or uses a forced ID) and determines if it is reversed.
 * Reversal logic: Applying mystical probability flow if enabled in settings.
 */
export const drawCard = (settings: UserSettings, forcedId?: number): { id: number; isReversed: boolean } => {
  let id = forcedId;
  
  if (id === undefined) {
    const pool = getCardPool(settings.includeMinor);
    id = pool[Math.floor(Math.random() * pool.length)];
  }
  
  let isReversed = false;
  if (settings.useReversals) {
    // Apply mystical probability flow for reversals
    isReversed = Math.random() < 0.3;
  }

  return { id, isReversed };
};

/**
 * Resolves the specific content for a tarot card based on the current mode, category, and direction.
 * v1.1.6: Enhanced with robust fallbacks and defensive logic to prevent null/undefined errors.
 */
export const resolveTarotContent = (
  cardId: number,
  settings: UserSettings,
  category: 'today' | 'worry' | 'love' | 'money' | 'work' = 'love',
  spreadType: 'today' | 'worry' | 'spread3' | 'celtic' = 'spread3',
  isReversed: boolean = false,
  positionIndex?: number
): { interpretation: string; advice: string } | null => {
  const cardData = CARDS[cardId];
  if (!cardData) return null;

  // v1.1.11: 전역 설정(useReversals)이 꺼져 있으면 카드가 역방향이라도 정방향 데이터를 반환함
  const direction = (isReversed && settings.useReversals) ? 'reversed' : 'normal';
  const flavor = (settings?.mode || 'gentle') as 'spicy' | 'gentle';

  try {
    let targetData: any = null;

    if (spreadType === 'today' || spreadType === 'worry') {
      targetData = (cardData as any)[spreadType];
    } else {
      const spreadData = (cardData as any)[spreadType];
      if (!spreadData) return null;
      
      const flavorData = spreadData[flavor] || spreadData['gentle'];
      targetData = flavorData?.[category] || flavorData?.['love'];
    }

    if (!targetData) return null;

    // direction에 따른 정밀 매핑 (reversed 명시적 처리)
    let content = targetData[direction];
    
    // 역방향을 요청했으나 데이터가 없는 경우에만 정방향으로 폴백
    if (direction === 'reversed' && !content) {
      content = targetData['normal'];
    }
    
    if (!content) return null;

    let interpretation = content.interpretation || "";
    let advice = "";

    // 위치별 정밀 매핑 로직
    if (spreadType === 'spread3' && typeof positionIndex === 'number') {
      const adviceObj = content.advice;
      if (positionIndex === 0) advice = adviceObj?.past || "";
      else if (positionIndex === 1) advice = adviceObj?.present || "";
      else if (positionIndex === 2) advice = adviceObj?.future || "";
      else advice = typeof adviceObj === 'string' ? adviceObj : "";
    } else if (spreadType === 'celtic' && typeof positionIndex === 'number') {
      const adviceObj = content.advice as unknown as CelticAdvice;
      const celticKeys: (keyof CelticAdvice)[] = [
        'core', 'obstacle', 'foundation', 'past', 'goal',
        'nearFuture', 'self', 'influence', 'hopes', 'destiny'
      ];
      const key = celticKeys[positionIndex];
      advice = adviceObj && key ? adviceObj[key] || "" : "";
    } else {
      // today, worry 또는 인덱스가 없는 경우
      advice = content.advice || "";
    }

    return {
      interpretation,
      advice: advice || "운명의 조언을 읽어내는 중입니다..."
    };
  } catch (error) {
    console.error(`Mapping Error [Card ${cardId}]:`, error);
    return null;
  }
};
