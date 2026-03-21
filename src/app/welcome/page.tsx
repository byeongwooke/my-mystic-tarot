'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDocs, collection, query, where, limit, orderBy, updateDoc, writeBatch } from 'firebase/firestore';
import { useAuth } from '@/providers/AuthProvider';

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const assignInitialName = async () => {
      if (loading) return; // Loading 방어

      if (user) {
        // 이름 판정 로직 통일
        const hasValidName = user.displayName && !user.displayName.includes('호');
        
        if (hasValidName) {
          // 리다이렉트 제외: 유저가 폼을 변경하거나 확인 후 버튼을 누를 기회를 줌
          setName(user.displayName);
          setIsReady(true);
          return;
        }

        // 이름이 없거나 임시 이름(..호)인 경우 창고에서 배정
        if (!user.displayName) {
          try {
            const poolRef = collection(db, "naming_pool");
            const q = query(poolRef, where("isUsed", "==", false), orderBy("order"), limit(1));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
              const nameDoc = snapshot.docs[0];
              const assignedName = nameDoc.data().name;

              const batch = writeBatch(db);
              batch.update(doc(db, "naming_pool", nameDoc.id), { isUsed: true });
              batch.set(doc(db, "users", user.uid), { 
                uid: user.uid, 
                displayName: assignedName, 
                isInitial: true 
              }, { merge: true });

              await batch.commit();
              await updateProfile(user, { displayName: assignedName });
              setName(assignedName);
            }
          } catch (err) { console.error(err); }
        } else {
          setName(user.displayName);
        }
        setIsReady(true);
      }
    };
    assignInitialName();
  }, [user, loading, router, pathname]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    const typedName = name.trim();
    if (isSubmitting || !typedName) return;

    if (!/^\d{4}$/.test(pin)) {
      setError("PIN은 정확히 4자리 숫자여야 합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const q = query(collection(db, "users"), where("displayName", "==", typedName));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        // 기가입자 본인 인증 검사
        const existingData = snap.docs[0].data();
        if (existingData.pin !== pin) {
          setError("이미 다른 영혼이 사용 중인 성명입니다.");
          setIsSubmitting(false);
          return;
        }
        // PIN이 일치하면 무사 통과 (아래에서 프로필 / 토큰 uid 최신화)
      } else {
        // 신규 가입 시: 입력한 이름이 풀에 있으면 isUsed: true 처리
        const poolQ = query(collection(db, "naming_pool"), where("name", "==", typedName));
        const poolSnap = await getDocs(poolQ);
        if (!poolSnap.empty) {
          await updateDoc(doc(db, "naming_pool", poolSnap.docs[0].id), { isUsed: true });
        }
      }

      if (user) {
        await updateProfile(user, { displayName: typedName });
        await setDoc(doc(db, "users", user.uid), {
          displayName: typedName,
          pin: pin,
          isInitial: false,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        if (pathname !== '/select') {
          router.replace('/select');
        }
      }
    } catch (err) {
      console.error(err);
      setError("운명의 연결이 불안정합니다.");
      setIsSubmitting(false);
    }
  };

  if (loading || !isReady) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-indigo-400 font-mono">
      진실의 거울을 닦는 중...
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md space-y-12 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white tracking-tighter">성명 각인</h1>
          <p className="text-slate-400">이 세계에서 당신은 무엇이라 불리길 원하십니까?</p>
        </div>

        <form onSubmit={handleStart} className="space-y-8">
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className="w-full border-b-2 border-slate-800 bg-transparent py-4 text-center text-3xl font-bold text-indigo-400 outline-none focus:border-indigo-500 transition-all"
              placeholder="이름 입력"
              maxLength={10}
            />
            <input
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              value={pin}
              onChange={(e) => { setPin(e.target.value.replace(/[^0-9]/g, '')); setError(''); }}
              className="w-full border-b-2 border-slate-800 bg-transparent py-4 text-center text-xl font-bold text-indigo-400 outline-none focus:border-indigo-500 transition-all tracking-[1em]"
              placeholder="PIN (숫자 4자리)"
              maxLength={4}
            />
          </div>
          {error && <p className="text-sm text-rose-500 animate-pulse">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-indigo-600 py-5 text-lg font-bold text-white shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
          >
            {isSubmitting ? "각인 중..." : "운명의 여정 시작하기"}
          </button>
        </form>
      </div>
    </main>
  );
}
