'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const hasValidName = user?.displayName && !user.displayName.includes('호');
    const targetPath = hasValidName ? '/select?category=today&spread=today' : '/welcome';
    const targetBase = hasValidName ? '/select' : '/welcome';

    if (pathname === targetBase) return;

    router.replace(targetPath);
  }, [router, pathname, user, loading]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="animate-pulse text-indigo-400 font-mono">운명의 입구로 이동 중...</div>
    </div>
  );
}
