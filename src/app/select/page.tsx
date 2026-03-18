"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { TAROT_BASE } from "@/data/tarot/base";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

function SelectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get('category') || 'today';
  const spreadParam = searchParams.get('spread') || 'basic';

  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  // [에러 해결] 객체인 TAROT_BASE를 배열로 변환하여 초기화합니다.
  const [cards, setCards] = useState(() => {
    const baseArray = Object.values(TAROT_BASE);
    return baseArray.length > 0 ? baseArray : [];
  });

  const maxCards = useMemo(() => {
    if (spreadParam === 'today') return 1;
    if (spreadParam === 'celtic') return 10;
    return 3;
  }, [spreadParam]);

  // 초기 진입 시 셔플 (순정 그리드 시절의 그 느낌 그대로)
  useEffect(() => {
    setCards(prev => [...prev].sort(() => Math.random() - 0.5));
  }, []);

  const handleCardClick = (id: number) => {
    if (selectedCards.includes(id) || selectedCards.length >= maxCards) return;
    const newSelection = [...selectedCards, id];
    setSelectedCards(newSelection);

    if (newSelection.length === maxCards) {
      const idsParam = newSelection.map(cid => `${cid}${Math.random() < 0.5 ? 'r' : ''}`).join(',');
      setTimeout(() => {
        router.push(`/result?category=${rawCategory}&spread=${spreadParam}&cards=${idsParam}`);
      }, 700);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f1117] text-white flex flex-col overflow-hidden select-none">
      {/* 1. 상단 타이틀 & 선택 현황 */}
      <header className="pt-12 pb-6 text-center z-10 bg-gradient-to-b from-[#0f1117] to-transparent">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-400 mb-2 drop-shadow-lg">운명의 카드를 골라주세요</h1>
        <p className="text-gray-400 text-sm tracking-widest">{selectedCards.length} / {maxCards} 선택됨</p>
      </header>

      {/* 2. 중앙 선택된 카드 슬롯 */}
      <div className="flex-grow flex items-center justify-center gap-2 md:gap-4 px-4 overflow-x-auto">
        {Array.from({ length: maxCards }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-16 h-28 md:w-32 md:h-52 border-2 border-dashed border-indigo-900/50 rounded-xl flex items-center justify-center relative overflow-hidden bg-white/5">
            {selectedCards[i] ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-slate-900 border-2 border-amber-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.4)]"
              >
                <span className="text-amber-400 text-xl font-bold">✨</span>
              </motion.div>
            ) : (
              <span className="text-indigo-900/30 text-2xl md:text-4xl font-black">{i + 1}</span>
            )}
          </div>
        ))}
      </div>

      {/* 3. 하단 좌우 스크롤 덱 */}
      <div className="h-64 md:h-80 w-full relative mb-10 flex flex-col justify-end">
        <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
          {/* px-[45vw]를 주어 첫 카드가 화면 중앙에 오도록 배치 */}
          <div className="flex items-center gap-3 py-10 px-[45vw]" style={{ width: 'max-content' }}>
            {cards.map((card) => {
              const isSelected = selectedCards.includes(card.id);
              return (
                <motion.div
                  key={card.id}
                  whileHover={{ y: -30, scale: 1.1, zIndex: 50 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCardClick(card.id)}
                  className={`
                    flex-shrink-0 w-28 h-44 md:w-40 md:h-64 rounded-xl border-2 cursor-pointer transition-all duration-300
                    ${isSelected ? 'opacity-0 scale-50 pointer-events-none' : 'border-amber-500/30 bg-indigo-950 shadow-2xl'}
                  `}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center relative bg-slate-900 overflow-hidden rounded-lg">
                    {/* 카드 뒷면 문양 */}
                    <div className="absolute inset-1 border border-amber-500/10 rounded-lg" />
                    <span className="text-amber-500/20 text-4xl">✨</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 양옆 페이드 효과 */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0f1117] to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0f1117] to-transparent pointer-events-none z-20" />
      </div>
    </main>
  );
}

export default function SelectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f1117] flex items-center justify-center">카드 뭉치를 가져오는 중...</div>}>
      <SelectContent />
    </Suspense>
  );
}