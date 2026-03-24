'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDocs, updateDoc, collection, query, where, deleteDoc } from 'firebase/firestore';
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

      if (user?.uid) {
        try {
          const userQuery = query(collection(db, "users"), where("uid", "==", user.uid));
          const snap = await getDocs(userQuery);
          if (!snap.empty) {
            const docData = snap.docs[0].data();
            const hasValidName = docData.displayName && !docData.displayName.includes('호');
            if (hasValidName) {
              setName(docData.displayName);
            }
          } else {
            setName('');
          }
        } catch (err) {
          setName('');
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
      if (!user) throw new Error("No user");

      // 1. UID가 문서 ID인 유령 데이터(과거 잔재)가 있다면 즉시 삭제
      try {
        await deleteDoc(doc(db, "users", user.uid));
      } catch (e) {
        // 무시 (문서가 없을 수 있음)
      }

      const oldQuery = query(collection(db, "users"), where("uid", "==", user.uid));
      const oldSnap = await getDocs(oldQuery);

      const q = query(collection(db, "users"), where("displayName", "==", typedName));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const existingDoc = snap.docs[0];
        const existingData = existingDoc.data();
        
        if (existingData.pin !== pin) {
          setError("이미 다른 영혼이 사용 중인 성명입니다.");
          setIsSubmitting(false);
          return;
        }

        // 다른 모든 내 연결을 null로 초기화 (1인 1계정 고수)
        for (const d of oldSnap.docs) {
          if (d.id !== existingDoc.id) {
            await updateDoc(doc(db, "users", d.id), { uid: null });
          }
        }
        
        // 현재 닉네임 문서에 내 UID 바인딩 및 무결성 필드 보강
        await updateDoc(doc(db, "users", existingDoc.id), { 
          uid: user.uid, 
          isInitial: false,
          updatedAt: new Date().toISOString() 
        });
      } else {
        // 새 문서 생성 전 모든 기존 연결 해제
        for (const d of oldSnap.docs) {
          await updateDoc(doc(db, "users", d.id), { uid: null });
        }
        await setDoc(doc(db, "users", typedName), {
          displayName: typedName,
          pin: pin,
          uid: user.uid,
          isInitial: false,
          counts: {},
          updatedAt: new Date().toISOString()
        });
      }

      await updateProfile(user, { displayName: typedName });
      
      if (pathname !== '/select') {
        router.replace('/select');
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
              placeholder="닉네임 입력"
              maxLength={10}
            />
            <input
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              value={pin}
              onChange={(e) => { setPin(e.target.value.replace(/[^0-9]/g, '')); setError(''); }}
              className="w-full border-b-2 border-slate-800 bg-transparent py-4 text-center text-xl font-bold text-indigo-400 outline-none focus:border-indigo-500 transition-all tracking-[1em] placeholder:tracking-normal"
              placeholder="password(4자리)"
              maxLength={4}
            />
          </div>
          {error && <p className="text-sm text-rose-500 animate-pulse">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting || pin.length !== 4}
            className={`w-full rounded-2xl py-5 text-lg font-bold text-white shadow-xl transition-all active:scale-95 ${isSubmitting || pin.length !== 4 ? 'bg-slate-700 cursor-not-allowed text-slate-400 shadow-none' : 'bg-indigo-600 hover:bg-indigo-500'}`}
          >
            {isSubmitting ? "각인 중..." : "운명의 여정 시작하기"}
          </button>
        </form>
      </div>
    </main>
  );
}
