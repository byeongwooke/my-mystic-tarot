'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if missing
    // console.error(error);
  }, [error]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-950 px-6 relative overflow-hidden">
      {/* Background Magic Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex justify-center items-center">
        <div className="w-[400px] h-[400px] bg-rose-900 rounded-full blur-[140px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] mb-6">
          운명의 파동에 혼선이 빚어졌습니다
        </h1>
        
        <p className="text-gray-300 text-lg md:text-xl font-medium tracking-widest max-w-xl leading-relaxed break-keep mb-10">
          신비로운 에너지가 일시적으로 교란되었습니다.<br/> 잠시 후 다시 시도해주시거나 관리자에게 문의바랍니다.
        </p>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => reset()}
            className="px-8 py-4 bg-emerald-900/30 border border-emerald-500/50 rounded-full flex items-center justify-center font-bold tracking-widest text-lg text-emerald-300 transition-all hover:bg-emerald-900/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            다시 연결 시도
          </button>
          
          <Link href="/">
            <div className="px-8 py-4 bg-slate-900 border border-amber-500/30 rounded-full flex items-center justify-center font-bold tracking-widest text-lg text-amber-400 transition-all hover:bg-slate-800 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]">
              메인으로 피신
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
