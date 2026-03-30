'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, identifiedProfile, hasConfiguredSettings } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // 1. 프로필 식별 자체가 안 된 경우 -> 무조건 루트(/)로 유도
    if (!identifiedProfile) {
      const isExcluded = pathname === '/' || pathname === '/login/';
      if (!isExcluded) {
        router.replace('/');
      }
      return;
    }

    // 2. 식별은 됐는데 설정이 안 된 경우 -> /settings/로 유도
    if (!hasConfiguredSettings) {
      const isExcluded = pathname === '/' || pathname === '/settings/' || pathname === '/login/';
      if (!isExcluded) {
        router.replace('/settings/');
      }
    }
  }, [loading, identifiedProfile, hasConfiguredSettings, pathname, router]);

  // 로딩 중이거나 세션이 없어도 일단 렌더링은 허용 (로그인/웰컴 페이지 접근)
  return <>{children}</>;
}
