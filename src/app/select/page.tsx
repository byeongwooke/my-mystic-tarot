"use client";

import React, { useState, useEffect, Suspense, useMemo, memo } from "react";
import { TAROT_BASE, TarotBase } from "@/data/tarot/base";
import { useRouter, useSearchParams } from "next/navigation";

// 순수 CSS 카드 컴포넌트
const TarotCardItem = memo(({ 
  card, 
  isSelected, 
  onCardClick 
}: { 
  card: TarotBase, 
  isSelected: boolean, 
  onCardClick: (id: number) => void 
}) => {
  return (
    <div 
      onClick={() => onCardClick(card.id)}
      className={`relative w-full aspect-[2/3] cursor-pointer rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
        isSelected 
          ? 'scale-105 z-10 border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]'
          : 'border border-[#D4AF37]/50 hover:border-amber-400/80 hover:scale-[1.02]'
      }`}
    >
      <div className="w-full h-full bg-gradient-to-br from-[#191970] via-indigo-950 to-[#191970] flex items-center justify-center">
        <div className={`absolute inset-1 border rounded-lg ${isSelected ? 'border-amber-400/50' : 'border-[#D4AF37]/40'}`}></div>
        <div className={`w-4 h-4 md:w-6 md:h-6 border rounded-full flex items-center justify-center rotate-45 ${isSelected ? 'border-amber-400/80' : 'border-[#D4AF37]/50'}`}>
          <div className={`w-1 h-1 md:w-2 md:h-2 rounded-full ${isSelected ? 'bg-amber-400/80' : 'bg-[#D4AF37]/40'}`}></div>
        </div>
      </div>
    </div>
  );
});
TarotCardItem.displayName = "TarotCardItem";

function SelectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get('category');
  const spreadParam = searchParams.get('spread') || 'basic';

  useEffect(() => {
    if (!rawCategory) {
      router.replace('/');
    }
  }, [rawCategory, router]);

  const cleanCategory = rawCategory ? rawCategory.replace(/[^\w]/g, '') : '';

  const [selectedCards, setSelectedCards] = useState<{ id: number; role: string; isReversed: boolean }[]>([]);
  const [cards, setCards] = useState<TarotBase[]>([]);

  const spreadData = useMemo(() => {
    if (spreadParam === 'today') {
      return { limit: 1, roles: ["오늘의 카드"] };
    } else if (spreadParam === 'celtic') {
      return { 
        limit: 10, 
        roles: ["지금, 당신의 중심 (현재)", "나를 가로막는 벽 (장애물)", "인지하지 못한 근본 (무의식/기반)", "지나온 시간의 잔상 (과거)", "의식의 지향점 (목표/의식)", "곧 마주할 상황 (가까운 미래)", "스스로 정의하는 나 (태도/자아)", "나를 둘러싼 환경 (주변 상황)", "내면의 기대와 불안 (심리)", "마주하게 될 결과 (결과)"] 
      };
    } else {
      return { limit: 3, roles: ["과거", "현재", "미래"] };
    }
  }, [spreadParam]);

  const { limit: maxCards, roles } = spreadData;

  const displayCategory = useMemo(() => {
    const categoryNameMap: Record<string, string> = {
      'today': '오늘의 운세☀️',
      'love': '애정운❤️',
      'money': '재물운💰',
      'work': '직업운💼'
    };
    return cleanCategory ? (categoryNameMap[cleanCategory] || '특별한 운세') : '';
  }, [cleanCategory]);

  useEffect(() => {
    // 초기 셔플
    const shuffledIds = Array.from({ length: 78 }, (_, i) => i);
    for (let i = shuffledIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
    }
    setCards(shuffledIds.map(id => TAROT_BASE[id] || TAROT_BASE[0]));
  }, []);

  const handleCardClick = (cardId: number) => {
    if (!cleanCategory) return;
    if (selectedCards.length >= maxCards) return;

    const isAlreadySelected = selectedCards.some(c => c.id === cardId);
    if (isAlreadySelected) {
      setSelectedCards(prev => {
        const remaining = prev.filter(c => c.id !== cardId);
        return remaining.map((c, i) => ({ ...c, role: roles[i] }));
      });
      return;
    }

    const newSelections = [...selectedCards, { id: cardId, role: roles[selectedCards.length], isReversed: Math.random() < 0.5 }];
    setSelectedCards(newSelections);

    if (newSelections.length === maxCards) {
      const sortedSelections = [...newSelections].sort((a, b) => roles.indexOf(a.role) - roles.indexOf(b.role));
      const sortedIds = sortedSelections.map(c => `${c.id}${c.isReversed ? 'r' : ''}`).join(',');
      
      // 즉시 이동 (선택 피드백이 눈에 띄도록 약간의 딜레이만 줌)
      setTimeout(() => {
        router.push(`/result?category=${cleanCategory}&spread=${spreadParam}&cards=${sortedIds}`);
      }, 300);
    }
  };

  if (!cleanCategory) return null;

  return (
    <main className="w-full min-h-screen flex flex-col bg-slate-900 overflow-x-hidden select-none">
      {/* 헤더 영역 (순수 HTML) */}
      <div className="w-full flex items-center justify-between sticky top-0 z-50 bg-slate-900 border-b border-indigo-900/50 px-4 md:px-8 py-4 backdrop-blur-sm bg-opacity-90">
        <button 
          onClick={() => router.push('/')}
          className="text-amber-400/50 hover:text-amber-400 transition-colors p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex flex-col items-center">
          <h1 className="text-base md:text-2xl font-extrabold tracking-widest text-amber-400 drop-shadow-md text-center">
            <span className="text-white mr-1">{displayCategory.replace(/[☀️❤️💰💼]/g, '')}</span>
            카드 선택 ({selectedCards.length}/{maxCards})
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1 tracking-widest text-center">
            {selectedCards.length === maxCards 
              ? "운명을 확인하는 중..." 
              : "직관에 따라 카드를 선택해주세요"}
          </p>
        </div>
        
        <div className="w-10"></div> {/* Center alignment anchor */}
      </div>

      {/* Grid 렌더링 영역 */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4 lg:gap-5 pb-20">
          {cards.map((card) => (
            <TarotCardItem 
              key={card.id}
              card={card}
              isSelected={selectedCards.some(c => c.id === card.id)}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function SelectPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    }>
      <SelectContent />
    </Suspense>
  );
}
