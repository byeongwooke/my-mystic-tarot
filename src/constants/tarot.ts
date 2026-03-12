export interface TarotCard {
  id: number;
  name: string;
}

const MAJOR_ARCANA_NAMES = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World"
];

const suits = ["Wands", "Cups", "Swords", "Pentacles"];
const ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Page", "Knight", "Queen", "King"];

const MINOR_ARCANA_NAMES = suits.flatMap(suit => ranks.map(rank => `${rank} of ${suit}`));

const ALL_CARD_NAMES = [...MAJOR_ARCANA_NAMES, ...MINOR_ARCANA_NAMES];

export const TAROT_CARDS: TarotCard[] = ALL_CARD_NAMES.map((name, index) => ({
  id: index,
  name
}));
