export type TarotMode = 'spicy' | 'gentle';

export interface UserSettings {
  mode: TarotMode;
  includeMinor: boolean;
  useReversals: boolean;
  isFirstVisit: boolean;
}
