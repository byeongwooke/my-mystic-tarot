'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const checkDoor = async () => {
      if (user?.uid) {
        try {
          const userDocSnap = await getDoc(doc(db, "users", user.uid));
          if (userDocSnap.exists()) {
            const hasValidName = userDocSnap.data().displayName && !userDocSnap.data().displayName.includes('호');
            const targetBase = hasValidName ? '/select' : '/welcome';
            if (pathname !== targetBase) router.replace(targetBase);
          } else {
            if (pathname !== '/welcome') router.replace('/welcome');
          }
        } catch (err) {
          if (pathname !== '/welcome') router.replace('/welcome');
        }
      } else {
        if (pathname !== '/welcome') router.replace('/welcome');
      }
    };

    checkDoor();
  }, [router, pathname, user, loading]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="animate-pulse text-indigo-400 font-mono">운명의 입구로 이동 중...</div>
    </div>
  );
}
