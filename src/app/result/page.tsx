"use client";

import React, { useEffect, useState, Suspense, useMemo, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TAROT_DATA } from "@/constants/tarotData";
import { motion } from "framer-motion";

// 개별 결과 카드 컴포넌트 (성능 최적화)
const ResultCardItem = memo(({ cardData, role, isLarge }: { cardData: any, role: string, isLarge: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="flex flex-col items-center"
    >
      <span className={`text-amber-400 border border-amber-400/50 bg-amber-400/10 px-4 py-1 rounded-full text-xs md:text-lg font-bold mb-4 tracking-widest ${isLarge ? 'scale-125' : ''}`}>
        {role}
      </span>
      <div className={`${isLarge ? 'w-[140px] h-[220px] md:w-[240px] md:h-[384px]' : 'w-[80px] h-[128px] md:w-[150px] md:h-[240px]'} rounded-xl border-2 border-amber-400/50 shadow-[0_0_25px_rgba(251,191,36,0.5)] bg-indigo-950 flex flex-col items-center justify-center relative overflow-hidden transform hover:scale-105 transition-transform group`}>
        {cardData.id <= 21 ? (
          <>
            <img
              src={`/images/cards/${cardData.id}.webp`}
              alt={cardData.nameKr}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-2 px-1">
              <div className="text-[9px] md:text-sm font-bold text-amber-400 text-center drop-shadow-md tracking-tighter">
                {cardData.nameKr}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-1 border border-amber-500/20 rounded-lg"></div>
            <div className="text-[11px] md:text-lg font-bold text-amber-200 text-center px-1 md:px-4 leading-relaxed break-keep z-10">{cardData.nameKr}</div>
            <div className="text-[9px] md:text-xs font-bold text-amber-400/60 mt-2 z-10 text-center px-1 tracking-widest uppercase">{cardData.name}</div>
          </>
        )}
      </div>
    </motion.div>
  );
});

ResultCardItem.displayName = "ResultCardItem";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [cardsInfo, setCardsInfo] = useState<{ cardData: any, role: string }[]>([]);
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    const cardsParam = searchParams.get('cards');

    if (!cat || !cardsParam) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setCategory(cat);
    const roles = cat === 'today' ? ["오늘의 카드"] : ["과거", "현재", "미래"];
    const cardIds = cardsParam.split(',').map(id => parseInt(id, 10));
    const loadedCards = cardIds.map((id, index) => {
      const cardData = TAROT_DATA.find(c => c.id === id);
      return cardData ? { cardData, role: roles[index] || "오늘의 카드" } : null;
    }).filter((item): item is { cardData: any, role: string } => item !== null);

    const requiredCount = cat === 'today' ? 1 : 3;
    if (loadedCards.length !== requiredCount) {
      setHasError(true);
    } else {
      setCardsInfo(loadedCards);
    }
    setIsLoading(false);
  }, [searchParams]);

  const categoryName = useMemo(() => {
    const map: Record<string, string> = {
      'love': '연애운',
      'money': '재물운',
      'work': '직업운',
      'today': '오늘의 운세'
    };
    return category ? (map[category] || '') : '';
  }, [category]);

  const getAdviceText = (cardData: any, roleStr: string) => {
    if (!cardData || !category) return "";
    
    // 오늘의 운세 전용 조언 우선
    if (category === 'today') {
      return cardData.todayAdvice || cardData.advice?.work || "조언을 준비 중입니다.";
    }

    const timeMap: Record<string, "past" | "present" | "future"> = {
      '과거': 'past',
      '현재': 'present',
      '미래': 'future'
    };
    const mappedTime = timeMap[roleStr] || 'future';

    if (typeof cardData.advice === 'string') return cardData.advice;

    const mappedCat = category === 'today' ? 'work' : category;
    const catAdvice = cardData.advice?.[mappedCat];

    if (typeof catAdvice === 'string') return catAdvice;
    return catAdvice?.[mappedTime] || "운명의 흐름을 조용히 관찰해 보세요.";
  };

  const getInterpretationText = (cardData: any) => {
    if (!cardData || !category) return "";
    const mappedCat = category === 'today' ? 'work' : category;
    return cardData.interpretations?.[mappedCat] || "카드가 신비로운 침묵을 지키고 있습니다.";
  };

  const overallAdvice = useMemo(() => {
    if (cardsInfo.length === 0) return "운명의 메시지를 기다리는 중입니다.";
    if (category === 'today') {
      return `"${getAdviceText(cardsInfo[0].cardData, '오늘의 카드')}"`;
    }
    const futureItem = cardsInfo.find(c => c.role === "미래");
    return futureItem ? `"${getAdviceText(futureItem.cardData, '미래')}"` : "운명은 당신의 선택에 달려 있습니다.";
  }, [cardsInfo, category]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4 text-center">
        <div className="w-20 h-20 mb-6 text-amber-500/50 flex items-center justify-center border-2 border-amber-500/30 rounded-full text-4xl">⚠️</div>
        <h1 className="text-2xl md:text-3xl font-bold text-amber-400 mb-4 tracking-widest">운명의 흐름이 끊겼습니다</h1>
        <p className="text-gray-300 mb-10 tracking-wide text-sm md:text-base leading-relaxed break-keep max-w-sm">
          정상적인 타로 결과를 불러올 수 없습니다. 카드를 다시 선택해 주세요.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 transition-all tracking-widest"
        >
          메인으로 돌아가기
        </button>
      </main>
    );
  }

  return (
    <main
      className="w-full min-h-screen flex flex-col items-center bg-slate-900 bg-fixed overflow-y-auto"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 2rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 4rem)'
      }}
    >
      <div className="w-full max-w-4xl px-4 md:px-8 mt-10 md:mt-16 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-5xl font-extrabold text-amber-400 mb-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] text-center break-keep leading-relaxed"
        >
          당신의 {categoryName} 결과입니다
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-amber-300 mb-12 md:mb-20 mt-4 tracking-widest text-center text-lg md:text-3xl font-serif italic drop-shadow-md break-keep leading-loose max-w-3xl"
        >
          {overallAdvice}
        </motion.p>

        <div className="w-full flex justify-center gap-4 md:gap-12 lg:gap-20 mb-16 md:mb-24 px-2">
          {cardsInfo.map((item) => (
            <ResultCardItem 
              key={item.role} 
              cardData={item.cardData} 
              role={item.role} 
              isLarge={category === 'today'} 
            />
          ))}
        </div>

        <div className="w-full max-w-3xl flex flex-col gap-10 md:gap-16">
          {cardsInfo.map((item, idx) => (
            <motion.div
              key={item.role + '-detail'}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (idx * 0.2) }}
              className="w-full bg-white/5 rounded-3xl p-6 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-8xl text-white/[0.03] font-black italic pointer-events-none">
                {idx + 1}
              </div>

              <div className="flex items-center gap-4 mb-6 border-b border-amber-500/20 pb-4">
                <div className={`w-4 h-4 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)] ${
                  item.role === '과거' ? 'bg-amber-700 border-2 border-amber-500' :
                  item.role === '현재' ? 'bg-amber-500 border-2 border-amber-300' :
                  'bg-yellow-400 border-2 border-yellow-200'
                }`}></div>
                <h2 className="text-2xl md:text-3xl font-bold text-amber-400 tracking-widest">
                  {category === 'today' ? '오늘의 종합 조언' : item.role === '과거' ? '과거의 기반' : item.role === '현재' ? '현재의 조언' : '미래의 가능성'}
                </h2>
              </div>

              <div className="flex flex-col gap-2 mb-6">
                <h3 className="text-2xl text-white font-bold flex items-center gap-3">
                  {item.cardData.nameKr}
                  <span className="text-lg text-emerald-400 opacity-80 font-normal">정방향</span>
                </h3>
                <p className="text-amber-200/80 tracking-wide text-sm md:text-base">
                  {item.cardData.keywords.join(' · ')}
                </p>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="bg-black/30 p-5 md:p-6 rounded-2xl relative">
                  <span className="absolute -top-3 left-4 bg-slate-800 border border-white/10 px-3 py-1 text-xs text-gray-400 rounded-full tracking-widest">카드의 해석</span>
                  <p className="text-gray-200 text-sm md:text-lg leading-loose break-keep mt-2">
                    {getInterpretationText(item.cardData)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-900/30 to-black/40 border border-amber-500/30 p-5 md:p-6 rounded-2xl relative">
                  <span className="absolute -top-3 left-4 bg-amber-900 border border-amber-500/50 px-3 py-1 text-xs text-amber-200 rounded-full tracking-widest">타로 마스터의 한마디</span>
                  <p className="text-amber-50/90 text-[15px] md:text-xl leading-loose tracking-wide break-keep mt-2 font-serif italic">
                    "{getAdviceText(item.cardData, item.role)}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 mb-10 flex flex-col items-center w-full"
        >
          <p className="text-gray-400 opacity-60 text-xs md:text-sm font-light tracking-wide mb-8 text-center max-w-sm">
            본 결과는 삶의 방향을 잡기 위한 참고용이며, 진정한 운명은 스스로 개척하는 것입니다.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full max-w-sm py-4 md:py-6 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-xl rounded-full shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_50px_rgba(251,191,36,0.6)] hover:scale-105 active:scale-95 transition-all tracking-widest border border-amber-300/50"
          >
            새로운 운명 펼치기
          </button>
        </motion.div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
