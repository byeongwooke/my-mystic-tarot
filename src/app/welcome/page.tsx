'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
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
        // 이름 판정 로직
        const hasValidName = user.displayName && !user.displayName.includes('호');
        if (hasValidName) {
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
