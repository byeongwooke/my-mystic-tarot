'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, User, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { generateDestinyKey } from '@/utils/mysticName';

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
          
          // 신비로운 기본 이름 생성
          const defaultName = generateDestinyKey();
          
          // Auth 프로필에 임시 각인
          await updateProfile(newUser, { displayName: defaultName });
          
          // DB에 영혼 기록 생성
          await setDoc(doc(db, "users", newUser.uid), {
            uid: newUser.uid,
            displayName: defaultName,
            isInitial: true, // 아직 본인 이름을 입력하지 않은 상태
            createdAt: new Date().toISOString(),
          });
          
          setUser({ ...newUser, displayName: defaultName });
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
