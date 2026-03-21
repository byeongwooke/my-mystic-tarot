'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 묻지도 따지지도 않고 입구(Welcome)로 안내합니다.
    router.push('/welcome');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="animate-pulse text-indigo-400 font-mono">운명의 입구로 이동 중...</div>
    </div>
  );
}
