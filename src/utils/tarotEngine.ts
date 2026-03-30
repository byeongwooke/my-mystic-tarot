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
 * Randomly draws a card and determines if it is reversed.
 * Reversal logic: 7:3 (30% chance of being reversed) if enabled in settings.
 */
export const drawCard = (settings: UserSettings): { id: number; isReversed: boolean } => {
  const pool = getCardPool(settings.includeMinor);
  const id = pool[Math.floor(Math.random() * pool.length)];
  
  let isReversed = false;
  if (settings.useReversals) {
    // 7:3 probability (30% reversed)
    isReversed = Math.random() < 0.3;
  }

  return { id, isReversed };
};

/**
 * Resolves the specific content for a tarot card based on the current mode, category, and direction.
 */
export const resolveTarotContent = (
  cardId: number,
  settings: UserSettings,
  category: 'love' | 'money' | 'work',
  isReversed: boolean
): { interpretation: string; positions: CelticPositions } => {
  const cardData = CARDS[cardId];
  if (!cardData) {
    throw new Error(`Card with ID ${cardId} not found.`);
  }

  const direction = isReversed ? 'reversed' : 'normal';
  const mode = settings.mode;

  return cardData.celtic[mode][category][direction];
};
