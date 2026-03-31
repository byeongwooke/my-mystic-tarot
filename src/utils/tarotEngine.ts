import { UserSettings } from '../types/settings';
import { CardContent, CelticPositions } from '../data/tarot/base';
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
  isReversed: boolean = false
): any => {
  const cardData = CARDS[cardId];
  if (!cardData) return null;

  // v1.1.11: 전역 설정(useReversals)이 꺼져 있으면 카드가 역방향이라도 정방향 데이터를 반환함
  const direction = (isReversed && settings.useReversals) ? 'reversed' : 'normal';
  const flavor = (settings?.mode || 'gentle') as 'spicy' | 'gentle';

  try {
    // v1.1.10: 데이터 구조 표준화로 매핑 로직 단일화
    const spreadData = (cardData as any)[spreadType];
    if (!spreadData) return null;

    // today, worry는 flavor가 없는 1단계 구조, others는 flavor 포함한 3단계 구조
    let targetData = spreadData;
    if (spreadType !== 'today' && spreadType !== 'worry') {
      const flavorData = spreadData[flavor] || spreadData['gentle'];
      targetData = flavorData?.[category] || flavorData?.['love'];
    }

    if (!targetData) return null;

    // 역방향 요청 시 데이터가 없으면 정방향으로 매핑
    const content = targetData[direction] || targetData['normal'];

    // v1.1.7: spread3 구조적 완결성 검증 보강 (interpretation 필드 보장)
    if (spreadType === 'spread3' && content && typeof content === 'object') {
      if (!content.interpretation) {
        content.interpretation = "운명의 파동이 새로운 해석을 기다리고 있습니다.";
      }
    }

    return content || null;
  } catch (error) {
    console.error(`Mapping Error [Card ${cardId}]:`, error);
    return null;
  }
};
