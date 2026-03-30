'use client';

import { useAuth } from '@/providers/AuthProvider';
import { UserSettings, TarotMode } from '../types/settings';

const DEFAULT_SETTINGS: UserSettings = {
  mode: 'gentle',
  includeMinor: false,
  useReversals: false,
  isFirstVisit: true,
};

export const useUserSettings = () => {
  const { identifiedProfile, loading } = useAuth();
  
  // profile이 있으면 profile의 설정을, 없으면 기본값을 반환
  const settings: UserSettings = identifiedProfile ? {
    mode: identifiedProfile.mode,
    includeMinor: identifiedProfile.includeMinor,
    useReversals: identifiedProfile.useReversals,
    isFirstVisit: identifiedProfile.isFirstVisit,
  } : DEFAULT_SETTINGS;

  return {
    settings,
    isLoaded: !loading,
    // 업데이트는 이제 개별 페이지에서 Firestore를 직접 통해 수행하거나, 
    // AuthProvider에 updateProfile 메소드를 추가할 수 있음.
    // 여기서는 일단 읽기 전용 상태로 변환.
  };
};
