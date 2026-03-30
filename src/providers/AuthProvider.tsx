'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext<{ 
  user: User | null; 
  loading: boolean;
  hasConfiguredSettings: boolean;
}>({
  user: null,
  loading: true,
  hasConfiguredSettings: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasConfiguredSettings, setHasConfiguredSettings] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 1. 이미 로그인이 되어있는 경우 (또는 익명 로그인 직후)
        setUser(currentUser);
        
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setHasConfiguredSettings(!!userSnap.data().hasConfiguredSettings);
          } else {
            // 문서가 없는 경우 초기 생성
            await setDoc(userRef, {
              uid: currentUser.uid,
              hasConfiguredSettings: false,
              createdAt: new Date().toISOString(),
            });
            setHasConfiguredSettings(false);
          }
        } catch (error) {
          console.error("사용자 설정 조회 실패:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // 2. 신규 유저: 익명 로그인 실행
        try {
          await signInAnonymously(auth);
          // onAuthStateChanged 가 다시 호출됨
        } catch (error) {
          console.error("영혼 소환 실패:", error);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, hasConfiguredSettings }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
