"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getSharedResult } from "@/lib/tarot";
import TarotResultView from "@/components/TarotResultView";

const URL_WEB_HOME = "https://www.hocsitarot.com";

export default function ShareClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [popupCardId, setPopupCardId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      try {
        const result = await getSharedResult(id);
        if (!result) {
          setIsLoading(false);
          return;
        }

        // 24-hour expiration check
        const createdAt = result.createdAt?.toDate ? result.createdAt.toDate() : new Date(result.createdAt);
        const now = new Date();
        const diff = now.getTime() - createdAt.getTime();
        
        if (diff > 24 * 60 * 60 * 1000) {
          setIsExpired(true);
        } else {
          setData(result);
        }
      } catch (err) {
        console.error("Shared result fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAppRedirect = () => {
    window.location.href = URL_WEB_HOME;
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || isExpired) {
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-950 px-6 text-center">
        <div className="text-6xl mb-8 grayscale opacity-50">⏳</div>
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-4 tracking-widest leading-tight">
          인연이 다해 사라진 기록입니다
        </h1>
        <p className="text-gray-400 mb-10 text-sm md:text-base break-keep max-w-xs leading-relaxed opacity-80 font-serif italic text-center">
          "운명의 메시지는 24시간 동안만 머물다 시공간 너머로 흩어집니다. 당신의 운명을 지금 바로 확인해 보세요."
        </p>
        <button
          onClick={handleAppRedirect}
          className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-emerald-400 text-slate-950 font-black text-xl rounded-full shadow-[0_10px_40px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all tracking-widest"
        >
          나의 운명 확인하기 ✨
        </button>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative flex flex-col items-center pb-32">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,78,59,0.15),transparent_70%)] pointer-events-none" />
      
      <TarotResultView 
        displayName={data.displayName}
        categoryName={data.categoryName}
        category={data.category}
        spread={data.spread}
        cardsInfo={data.cardsInfo}
        overallAdvice={data.overallAdvice}
        onCardClick={(cardId) => setPopupCardId(cardId)}
      />

      {/* Floating CTA for viral loop */}
      <div className="fixed bottom-8 inset-x-0 flex justify-center z-[50] px-6">
        <button
          onClick={handleAppRedirect}
          className="w-full max-w-sm py-5 bg-gradient-to-r from-emerald-600 to-emerald-400 text-slate-950 font-black text-xl rounded-full shadow-[0_10px_40px_rgba(16,185,129,0.4)] hover:shadow-[0_15px_60px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95 transition-all tracking-widest uppercase border border-emerald-300/30"
        >
          나도 운명 확인하기 ✨
        </button>
      </div>

      <AnimatePresence>
        {popupCardId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 cursor-pointer"
            onClick={() => setPopupCardId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={`/images/cards/${popupCardId}.webp`} 
                alt="Detail Card" 
                width={800} 
                height={1300} 
                className="max-h-[80vh] w-auto object-contain rounded-3xl shadow-2xl" 
                priority
              />
              <button 
                onClick={() => setPopupCardId(null)}
                className="mt-8 px-12 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-bold tracking-widest transition-colors"
              >
                닫기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center py-20 border-t border-white/5 opacity-40 w-full max-w-4xl mt-12">
         <p className="text-xs tracking-widest uppercase mb-2 font-light">Hocsi-Healing Mystic Tarot</p>
         <p className="text-[10px]">&copy; 2026 BYEONGWOOK PROJECTS. ALL DESTINIES RESERVED.</p>
      </div>
    </main>
  );
}
