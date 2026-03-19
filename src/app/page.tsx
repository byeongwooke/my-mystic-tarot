"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const categories = [
    { id: 'today', title: '오늘의 운세', icon: '☀️', desc: '오늘 하루, 나를 위한 카드의 조언' },
    { id: 'love', title: '애정운', icon: '❤️', desc: '현재의 사랑, 그리고 앞으로의 인연' },
    { id: 'money', title: '재물운', icon: '💰', desc: '금전의 흐름과 숨겨진 부의 기운' },
    { id: 'work', title: '직업운', icon: '💼', desc: '커리어의 방향과 성공을 위한 힌트' }
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-900 bg-fixed p-6 select-none pt-[env(safe-area-inset-top)]"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 신비로운 배경 효과 */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/40 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/20 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        className="z-10 text-center mb-12 flex flex-col items-center"
      >
        <span className="text-amber-500/80 tracking-[0.2em] text-sm md:text-base mb-2 uppercase font-medium">진정한 운명은 당신의 손끝에서 시작됩니다</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">
          Mystic Tarot
        </h1>
      </motion.div>

      <div className="z-10 w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (idx * 0.1), duration: 0.6 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(cat.id === 'today' ? `/select?category=${cat.id}&spread=today` : `/spread?category=${cat.id}`)}
            className="w-full relative flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl border-[0.5px] border-amber-900/40 bg-gradient-to-br from-zinc-800/80 to-zinc-900/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.3)] active:border-amber-400/50 active:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-colors duration-300 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/20 to-transparent opacity-0 active:opacity-100 transition-opacity duration-300"></div>
            
            <span className="text-3xl md:text-4xl mb-3 drop-shadow-md z-10">{cat.icon}</span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-200 mb-2 tracking-wide group-active:text-amber-400 z-10">
              {cat.title}
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-light break-keep text-center leading-relaxed h-[2.5rem] flex items-center justify-center group-active:text-gray-300 z-10">
              {cat.desc}
            </p>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="z-10 w-full max-w-lg mt-6 md:mt-8"
      >
        <button
          onClick={() => router.push('/select?category=worry&spread=today')}
          className="w-full relative flex flex-col md:flex-row items-center justify-between p-6 md:p-8 rounded-3xl border border-emerald-800/60 bg-gradient-to-r from-[#1c1c1c] via-[#1a2622] to-[#122b22] backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:border-emerald-500/50 active:border-emerald-400/80 active:shadow-[0_0_25px_rgba(52,211,153,0.4)] transition-all duration-300 group overflow-hidden"
        >
          <div className="flex flex-col items-center md:items-start text-center md:text-left px-2 relative z-10 w-full md:w-auto">
            <h2 className="text-xl md:text-2xl font-bold text-emerald-400 mb-2 tracking-wide flex items-center justify-center md:justify-start gap-2 w-full">
              <span className="text-2xl drop-shadow-md">⚖️</span> 고민뽑기
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-light break-keep leading-relaxed md:max-w-[280px]">
              어떤 고민이든 단 하나의 명쾌한 결론을 내려드립니다
            </p>
          </div>
          <div className="mt-5 md:mt-0 flex-shrink-0 flex items-center justify-center p-3 rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 group-hover:bg-emerald-800/60 group-active:scale-95 transition-all relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-900/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
        </button>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-16 text-xs md:text-sm text-gray-500 tracking-widest uppercase"
      >
        Choose Your Destiny
      </motion.p>
    </motion.main>
  );
}
