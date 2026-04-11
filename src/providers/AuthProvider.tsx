'use client';

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { UserProfile } from '@/types/settings';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthInitialized: boolean;
  identifiedProfile: UserProfile | null;
  identifyUser: (name: string, pin: string) => void;
  hasConfiguredSettings: boolean;
  setHasConfiguredSettings: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthInitialized: false,
  identifiedProfile: null,
  identifyUser: () => {},
  hasConfiguredSettings: false,
  setHasConfiguredSettings: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [identifiedProfile, setIdentifiedProfile] = useState<UserProfile | null>(null);
  const [hasConfiguredSettings, setHasConfiguredSettings] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  // 1. 초기 인증 (Anonymous)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // 브라우저 로컬 스토리지에 저장된 프로필 식별 정보가 있는지 확인 (자동 재접속)
        const savedId = localStorage.getItem('tarot_profile_id');
        if (savedId) {
          setProfileId(savedId);
        } else {
          setLoading(false);
        }
      } else {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("영혼 소환 실패:", error);
          setLoading(false);
          setIsAuthInitialized(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. 프로필 실시간 감시 (Real-time Sync)
  useEffect(() => {
    if (!profileId) return;

    const profileRef = doc(db, 'profiles', profileId);
    const unsubscribe = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setIdentifiedProfile(data);
        setHasConfiguredSettings(!!data.hasConfiguredSettings);
      } else {
        // 프로필이 삭제된 경우나 없는 경우
        setIdentifiedProfile(null);
        setHasConfiguredSettings(false);
        localStorage.removeItem('tarot_profile_id');
      }
      setLoading(false);
      setIsAuthInitialized(true);
    }, (error) => {
      console.error("프로필 감시 실패:", error);
      setLoading(false);
      setIsAuthInitialized(true);
    });

    return () => unsubscribe();
  }, [profileId]);

  const identifyUser = useCallback((name: string, pin: string) => {
    const id = `${name}_${pin}`;
    setProfileId(id);
    localStorage.setItem('tarot_profile_id', id);
  }, []);

  const contextValue = useMemo(() => ({
    user, 
    loading, 
    isAuthInitialized,
    identifiedProfile, 
    identifyUser,
    hasConfiguredSettings, 
    setHasConfiguredSettings 
  }), [user, loading, isAuthInitialized, identifiedProfile, identifyUser, hasConfiguredSettings]);

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
