import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-950 px-6 relative overflow-hidden">
      {/* Background Magic Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex justify-center items-center">
        <div className="w-[500px] h-[500px] bg-emerald-900 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-[120px] md:text-[180px] font-black leading-none bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl text-gray-200 font-bold tracking-widest mt-4">
          운명의 길을 잃다
        </h2>
        
        <p className="text-gray-400 text-base md:text-lg mt-6 max-w-md leading-relaxed break-keep">
          당신이 찾으려는 카드는 이 운명의 덱에 존재하지 않습니다.<br/>
          아마도 별들이 당신을 새로운 방향으로 이끌고 있는 것인지도 모릅니다.
        </p>

        <Link href="/" className="mt-12 group">
          <div className="relative px-8 py-4 bg-emerald-900/30 border border-emerald-500/50 rounded-full flex items-center gap-3 overflow-hidden transition-all hover:bg-emerald-900/50 hover:border-emerald-400/80 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <span className="text-emerald-300 font-bold tracking-widest text-lg z-10">시작점으로 돌아가기</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
