'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDocs, collection, query, where, limit, orderBy, updateDoc, writeBatch } from 'firebase/firestore';
import { useAuth } from '@/providers/AuthProvider';

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const assignInitialName = async () => {
      if (!loading && user) {
        if (user.displayName && !user.displayName.includes('호')) {
          router.push('/select');
          return;
        }

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
  }, [user, loading, router]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !name.trim()) return;
    setIsSubmitting(true);

    try {
      const q = query(collection(db, "users"), where("displayName", "==", name.trim()));
      const snap = await getDocs(q);
      
      if (!snap.empty && snap.docs[0].id !== user?.uid) {
        setError("이미 다른 영혼이 사용 중인 성명입니다.");
        setIsSubmitting(false);
        return;
      }

      if (user) {
        await updateProfile(user, { displayName: name.trim() });
        await setDoc(doc(db, "users", user.uid), {
          displayName: name.trim(),
          isInitial: false,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        router.push('/select');
      }
    } catch (err) {
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
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            className="w-full border-b-2 border-slate-800 bg-transparent py-4 text-center text-3xl font-bold text-indigo-400 outline-none focus:border-indigo-500 transition-all"
            placeholder="이름 입력"
            maxLength={10}
          />
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
