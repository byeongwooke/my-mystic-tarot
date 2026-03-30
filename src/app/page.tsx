'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDocs, getDoc, updateDoc, collection, query, where, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/providers/AuthProvider';

export default function Home() {
  const { user, loading, identifiedProfile, identifyUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleInitialGate = async () => {
      if (loading) return;

      // 1. 프로필이 확인된 유저 처리 (자동 재접속 포함)
      if (identifiedProfile) {
        if (identifiedProfile.hasConfiguredSettings) {
          router.replace('/select/');
        } else {
          router.replace('/settings/');
        }
        return;
      }
      
      // 2. 미식별 유저는 웰컴 UI 유지
      setIsReady(true);
    };

    handleInitialGate();
  }, [loading, identifiedProfile, router]);

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
      if (!user) throw new Error("No user session");

      const profileId = `${typedName}_${pin}`;
      const profileRef = doc(db, "profiles", profileId);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        // 이미 존재하는 프로필 -> 식별 처리 (로그인)
        const profileData = profileSnap.data();
        identifyUser(typedName, pin);
        
        // 이동은 useEffect 기반으로 자동 처리되지만, 즉시성을 위해 명시적 처리
        if (profileData.hasConfiguredSettings) {
          router.replace('/select/');
        } else {
          router.replace('/settings/');
        }
      } else {
        // 신규 프로필 생성 (Lazy Identity)
        await setDoc(profileRef, {
          displayName: typedName,
          pin: pin,
          uid: user.uid,
          hasConfiguredSettings: false,
          mode: 'gentle', // 기본값
          includeMinor: false,
          useReversals: false,
          isFirstVisit: true,
          updatedAt: new Date().toISOString()
        });

        identifyUser(typedName, pin);
        router.replace('/settings/');
      }
    } catch (err) {
      console.error(err);
      setError("운명의 연결이 불안정합니다.");
      setIsSubmitting(false);
    }
  };

  if (loading || !isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-indigo-400 font-mono">
        운명의 입구를 여는 중...
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md space-y-12 text-center">
        <div className="space-y-4">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] tracking-[0.2em]">혹시타로</h1>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tighter mt-4">성명 각인</h2>
          <p className="text-slate-400">이 세계에서 당신은 무엇이라 불리길 원하십니까?</p>
        </div>

        <form onSubmit={handleStart} className="space-y-8">
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className="w-full border-b-2 border-slate-800 bg-transparent py-4 text-center text-3xl font-bold text-indigo-400 outline-none focus:border-indigo-500 transition-all font-sans"
              placeholder="닉네임 입력"
              maxLength={10}
            />
            <input
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              value={pin}
              onChange={(e) => { setPin(e.target.value.replace(/[^0-9]/g, '')); setError(''); }}
              className="w-full border-b-2 border-slate-800 bg-transparent py-4 text-center text-xl font-bold text-indigo-400 outline-none focus:border-indigo-500 transition-all tracking-[1em] placeholder:tracking-normal font-sans"
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
