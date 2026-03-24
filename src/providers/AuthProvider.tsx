'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 1. 이미 로그인이 되어있는 경우
        setUser(currentUser);
        setLoading(false);
      } else {
        // 2. 신규 유저: 익명 로그인 실행
        try {
          const userCredential = await signInAnonymously(auth);
          const newUser = userCredential.user;
          
          // 유령 문서 찌꺼기 생성 로직 전면 삭제 (웰컴 페이지에서만 생성)
          
          setUser(newUser);
        } catch (error) {
          console.error("영혼 소환 실패:", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
