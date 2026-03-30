'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, hasConfiguredSettings } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 로딩 중이 아니고 세션이 있으며, 설정을 완료하지 않은 경우
    if (!loading && user && !hasConfiguredSettings) {
      // 현재 경로가 /settings가 아니고 / 가 아닐 때 (메인 웰컴은 허용하거나 아예 막거나 선택)
      // 사장님의 지시는 "/settings 외의 페이지 접근 시 강제" 이므로 적극적으로 막음
      if (pathname !== '/settings' && pathname !== '/login') {
        router.push('/settings');
      }
    }
  }, [user, loading, hasConfiguredSettings, pathname, router]);

  // 로딩 중이거나 가드 조건에 걸려 리다이렉트 중일 때의 UI 처리 (필요 시)
  return <>{children}</>;
}
