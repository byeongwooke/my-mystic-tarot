'use client';

import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/providers/AuthProvider';

export default function IdentityModal() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이름이 이미 있거나 로그인이 안 된 경우 노출하지 않음
  if (!user || user.displayName) return null;

  const handleIdentityAwakening = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 1. Firebase Auth 프로필 업데이트
      await updateProfile(user, { displayName: name.trim() });

      // 2. Firestore에 유저 정보 영구 각인
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: name.trim(),
        createdAt: new Date().toISOString(),
        role: "Seeker",
        destinyLevel: 1
      });

      // 페이지 새로고침하여 반영
      window.location.reload();
    } catch (error) {
      console.error("영혼의 각인에 실패했습니다:", error);
      alert("운명의 소용돌이가 불안정합니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md px-6">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-indigo-500/30 bg-slate-900 p-8 shadow-2xl shadow-indigo-500/20">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-3xl">
            🔮
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-indigo-100">운명의 인도자를 찾아서</h2>
          <p className="text-sm text-slate-400">당신의 영혼을 무엇이라 부르면 좋을까요?</p>
        </div>

        <form onSubmit={handleIdentityAwakening} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              required
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-5 py-4 text-center text-lg text-white outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-700 py-4 font-bold text-white shadow-lg shadow-indigo-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "각인 중..." : "운명의 열쇠 받기"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          입력하신 이름은 기기를 바꿔도 당신을 증명하는 <br/>
          신비로운 열쇠가 될 것입니다.
        </p>
      </div>
    </div>
  );
}
