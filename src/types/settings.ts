export type TarotMode = 'spicy' | 'gentle';

export interface UserSettings {
  mode: TarotMode;
  includeMinor: boolean;
  useReversals: boolean;
  isFirstVisit: boolean;
}

export interface UserProfile extends UserSettings {
  displayName: string;
  pin: string;
  uid: string;
  hasConfiguredSettings: boolean;
  updatedAt?: string;
}
