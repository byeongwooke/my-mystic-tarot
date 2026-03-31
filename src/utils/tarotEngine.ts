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
  category: 'love' | 'money' | 'work' = 'love',
  spreadType: 'spread3' | 'celtic' = 'spread3',
  isReversed: boolean = false
): any => {
  const cardData = CARDS[cardId];
  if (!cardData) return null;

  // Fallback state management
  const flavor = (settings?.mode || 'gentle') as 'spicy' | 'gentle';
  const direction = isReversed ? 'reversed' : 'normal';
  const safeCategory = category || 'love';
  const safeSpread = spreadType || 'spread3';

  try {
    // [spreadType] -> [flavor] -> [category] -> [direction] 경로 정밀 매핑
    const spreadData = (cardData as any)[safeSpread];
    if (!spreadData) return null;

    const flavorData = spreadData[flavor] || spreadData['gentle'] || spreadData['spicy'];
    if (!flavorData) return null;

    const categoryData = flavorData[safeCategory] || flavorData['love'];
    if (!categoryData) return null;

    const content = categoryData[direction] || categoryData['normal'];

    return content || null;
  } catch (error) {
    console.error(`Tarot Engine Error [Card ${cardId}]:`, error);
    return null;
  }
};
