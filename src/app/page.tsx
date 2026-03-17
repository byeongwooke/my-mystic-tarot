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
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/select?category=${cat.id}`)}
            className="group relative flex flex-col items-start p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/40 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:bg-indigo-900/60 hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <span className="text-3xl md:text-4xl mb-3 drop-shadow-md">{cat.icon}</span>
            <h2 className="text-xl md:text-2xl font-bold text-amber-300 mb-2 tracking-wide group-hover:text-amber-400 transition-colors">
              {cat.title}
            </h2>
            <p className="text-indigo-200/70 text-sm md:text-base font-light break-keep group-hover:text-indigo-100 transition-colors">
              {cat.desc}
            </p>
          </motion.button>
        ))}
      </div>
      
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
