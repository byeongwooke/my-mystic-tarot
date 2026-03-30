'use client';

import { useState, useEffect } from 'react';
import { UserSettings, TarotMode } from '../types/settings';

const STORAGE_KEY = 'tarot_user_settings';

const DEFAULT_SETTINGS: UserSettings = {
  mode: 'gentle',
  includeMinor: false,
  useReversals: false,
  isFirstVisit: true,
};

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse user settings from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Update localStorage when settings change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const setMode = (mode: TarotMode) => updateSettings({ mode });
  const setIncludeMinor = (includeMinor: boolean) => updateSettings({ includeMinor });
  const setUseReversals = (useReversals: boolean) => updateSettings({ useReversals });
  const setFirstVisit = (isFirstVisit: boolean) => updateSettings({ isFirstVisit });

  return {
    settings,
    isLoaded,
    updateSettings,
    setMode,
    setIncludeMinor,
    setUseReversals,
    setFirstVisit,
  };
};
