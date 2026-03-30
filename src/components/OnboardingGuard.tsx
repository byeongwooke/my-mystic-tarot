'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, hasConfiguredSettings } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. 유저가 없거나 로딩 중이면 온보딩 체크를 하지 않음 (로그인 전 화면 허용)
    if (loading || !user) return;

    // 2. 로그인 상태인데 설정이 안 된 경우에만 /settings로 강제
    if (!hasConfiguredSettings) {
      if (pathname !== '/settings' && pathname !== '/login') {
        router.push('/settings');
      }
    }
  }, [user, loading, hasConfiguredSettings, pathname, router]);

  // 로딩 중이거나 세션이 없어도 일단 렌더링은 허용 (로그인/웰컴 페이지 접근)
  return <>{children}</>;
}
