"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getSharedResult } from "@/lib/tarot";

export default function SharePage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const result = await getSharedResult(id as string);
        if (!result) {
          setIsLoading(false);
          return;
        }

        // Expiration check (24 hours = 24 * 60 * 60 * 1000 ms)
        const createdAt = result.createdAt?.toDate ? result.createdAt.toDate() : new Date(result.createdAt);
        const now = new Date();
        const diff = now.getTime() - createdAt.getTime();
        
        if (diff > 24 * 60 * 60 * 1000) {
          setIsExpired(true);
        } else {
          setData(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || isExpired) {
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-900 px-6 text-center">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-4 tracking-widest leading-tight">
          인연이 다해 사라진 기록입니다
        </h1>
        <p className="text-gray-400 mb-10 text-sm md:text-base break-keep max-w-xs leading-relaxed">
          운명의 메시지는 24시간 동안만 머물다 시공간 너머로 흩어집니다. 당신의 운명을 지금 바로 확인해보세요.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all tracking-widest"
        >
          나의 운명 확인하기
        </button>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,78,59,0.15),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 py-16 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest mb-4 uppercase">
            Captured Destiny Snapshot
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 break-keep">
            <span className="text-emerald-400">{data.displayName}</span> 님의 {data.category}
          </h1>
          <p className="text-gray-400 text-sm md:text-lg font-serif italic opacity-80">
            "해석에 담긴 기운은 소중한 인연에게만 공유됩니다."
          </p>
        </motion.div>

        {/* Card Snapshot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-stretch">
          {data.cardsSnapshot.map((card: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-black/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center gap-6"
            >
              <div className="text-amber-400/60 text-xs font-bold tracking-widest uppercase border-b border-white/5 pb-2 w-full text-center mb-2">
                {card.role}
              </div>
              <div className="relative w-full aspect-[2/3.5] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img
                  src={`/images/cards/${card.id}.webp`}
                  alt={card.nameKr}
                  className={`absolute inset-0 w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`}
                />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-100">{card.nameKr}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interpretation Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-emerald-900/20 to-slate-900/40 p-8 md:p-12 rounded-[40px] border border-emerald-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-24 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-8 tracking-widest border-l-4 border-emerald-500 pl-4 uppercase">
            종합 해석 전문
          </h2>
          <div className="text-gray-200 text-lg md:text-xl leading-relaxed text-justify break-keep font-serif opacity-90 whitespace-pre-wrap">
             {data.fullInterpretation}
          </div>
        </motion.div>

        {/* Branding Footer */}
        <div className="text-center py-10 border-t border-white/5 opacity-40">
           <p className="text-xs tracking-widest uppercase mb-2">Hocis-Healing Mystic Tarot</p>
           <p className="text-[10px]">&copy; 2026 BYEONGWOOK PROJECTS. ALL DESTINIES RESERVED.</p>
        </div>
      </div>

      {/* Floating CTA Button */}
      <div className="fixed bottom-8 inset-x-0 flex justify-center z-[50] px-6">
        <button
          onClick={() => router.push('/')}
          className="w-full max-w-sm py-5 bg-gradient-to-r from-emerald-600 to-emerald-400 text-slate-950 font-black text-xl rounded-full shadow-[0_10px_40px_rgba(16,185,129,0.4)] hover:shadow-[0_15px_60px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95 transition-all tracking-widest uppercase"
        >
          나의 운명 확인하기 ✨
        </button>
      </div>
    </main>
  );
}
