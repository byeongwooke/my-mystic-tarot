'use client';

import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { useAuth } from '@/providers/AuthProvider';

export default function IdentityModal() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 이미 고유 이름을 가졌다면(자동 생성된 '안개의' 등이 포함되지 않은 진짜 이름) 모달을 노출하지 않습니다.
  if (!user || (user.displayName && !user.displayName.includes('안개의'))) return null;

  const handleAwakening = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      // 1. 운명의 명부(Firestore)에서 이름 중복 체크
      const q = query(collection(db, "users"), where("displayName", "==", trimmedName));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setError("이미 다른 영혼이 사용 중인 성명입니다.");
        setIsSubmitting(false);
        return;
      }

      // 2. 영혼의 각인 (Auth 프로필 & Firestore DB 동시 저장)
      await updateProfile(user, { displayName: trimmedName });
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: trimmedName,
        isInitial: false,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // 3. 각인 완료 후 운명의 페이지 새로고침
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("운명의 연결이 불안정합니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-2xl px-6">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-indigo-500/20 bg-slate-950 p-8 shadow-2xl shadow-indigo-500/10">
        <div className="text-center mb-8">
          <div className="mb-4 inline-block rounded-full bg-slate-900 px-3 py-1 border border-slate-800">
            <p className="text-[9px] font-mono text-indigo-400/60 uppercase tracking-widest">
              UUID: {user.uid}
            </p>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">성명 각인</h2>
          <p className="text-xs text-slate-500 mt-2">중복된 이름은 영혼의 간섭을 일으킵니다.</p>
        </div>

        <form onSubmit={handleAwakening} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              required
              maxLength={10}
              placeholder="부르고 싶은 이름을 입력하세요"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-center text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
            />
          </div>
          {error && (
            <p className="text-center text-xs font-medium text-rose-500 animate-pulse">{error}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-30 active:scale-95"
          >
            {isSubmitting ? "운명의 명부 대조 중..." : "운명의 열쇠 확정"}
          </button>
        </form>
      </div>
    </div>
  );
}
