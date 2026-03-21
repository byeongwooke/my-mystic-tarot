'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDocs, collection, query, where, limit, orderBy, updateDoc, writeBatch } from 'firebase/firestore';
import { useAuth } from '@/providers/AuthProvider';

export default function IdentityModal() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isAssigned, setIsAssigned] = useState(false);

  // 1. 초기 자동 이름 부여 로직
  useEffect(() => {
    const assignAutoName = async () => {
      // 로그인은 되어 있는데, 이름이 없거나 아직 배정 전인 경우
      if (user && !user.displayName && !isAssigned) {
        try {
          // 창고(naming_pool)에서 사용되지 않은 가장 빠른 번호의 이름 1개 가져오기
          const poolRef = collection(db, "naming_pool");
          const q = query(poolRef, where("isUsed", "==", false), orderBy("order"), limit(1));
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const nameDoc = snapshot.docs[0];
            const assignedName = nameDoc.data().name;

            // [중요] 배정된 이름을 '사용됨'으로 바꾸고 유저 정보에 저장
            const batch = writeBatch(db);
            batch.update(doc(db, "naming_pool", nameDoc.id), { isUsed: true });
            batch.set(doc(db, "users", user.uid), { 
              uid: user.uid, 
              displayName: assignedName, 
              isInitial: true,
              updatedAt: new Date().toISOString()
            }, { merge: true });

            await batch.commit();
            await updateProfile(user, { displayName: assignedName });
            
            setName(assignedName);
            setIsAssigned(true);
          }
        } catch (err) {
          console.error("이름 배정 실패:", err);
        }
      } else if (user?.displayName) {
        setName(user.displayName);
      }
    };
    assignAutoName();
  }, [user, isAssigned]);

  // 유저가 이미 이름을 확정하고 운명 선택으로 넘어갔다면 모달을 숨깁니다.
  if (!user || (user.displayName && !isAssigned && !user.displayName.includes('호'))) return null;

  const handleSaveAndGo = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      // 2. 직접 수정 시 중복 체크 (자신의 이름이 아닐 때만)
      const q = query(collection(db, "users"), where("displayName", "==", trimmedName));
      const snap = await getDocs(q);
      
      if (!snap.empty && snap.docs[0].id !== user.uid) {
        setError("이미 다른 영혼이 사용 중인 성명입니다.");
        setIsSubmitting(false);
        return;
      }

      // 프로필 및 DB 업데이트
      await updateProfile(user, { displayName: trimmedName });
      await setDoc(doc(db, "users", user.uid), {
        displayName: trimmedName,
        isInitial: false, // 이제 직접 수정한 이름임을 표시
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 3. 운명 선택 페이지로 즉시 이동
      router.push('/select');
    } catch (err) {
      setError("운명의 연결이 불안정합니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-2xl px-6">
      <div className="w-full max-w-sm rounded-3xl border border-indigo-500/30 bg-slate-950 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <p className="text-[10px] font-mono text-indigo-400/50 mb-2">IDENTIFIER: {user.uid}</p>
          <h2 className="text-2xl font-bold text-white tracking-tight">당신의 성명입니다</h2>
          <p className="text-xs text-slate-500 mt-2">부여된 이름을 그대로 쓰거나, 직접 수정할 수 있습니다.</p>
        </div>

        <form onSubmit={handleSaveAndGo} className="space-y-4">
          <input
            type="text"
            required
            maxLength={10}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-center text-white text-lg outline-none focus:border-indigo-500 transition-all"
          />
          {error && <p className="text-center text-xs text-rose-500">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
          >
            {isSubmitting ? "각인 중..." : "운명 선택하러 가기"}
          </button>
        </form>
      </div>
    </div>
  );
}
