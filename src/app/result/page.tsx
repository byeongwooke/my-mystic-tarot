"use client";

import React, { useEffect, useState, Suspense, useMemo, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TAROT_DATA } from "@/constants/tarotData";
import { motion } from "framer-motion";

// 개별 결과 카드 컴포넌트 (성능 최적화)
const ResultCardItem = memo(({ 
  cardData, 
  role, 
  isLarge,
  isCeltic,
  isActive,
  onClick
}: { 
  cardData: any, 
  role: string, 
  isLarge: boolean,
  isCeltic?: boolean,
  isActive?: boolean,
  onClick?: () => void
}) => {
  const sizeClass = isLarge 
    ? 'w-[140px] h-[220px] md:w-[240px] md:h-[384px]'
    : isCeltic
      ? 'w-[64px] h-[100px] md:w-[110px] md:h-[171px]'
      : 'w-[80px] h-[128px] md:w-[150px] md:h-[240px]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`flex flex-col items-center ${onClick ? 'cursor-pointer' : ''} ${isActive ? 'scale-110 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] z-10' : isCeltic && !isActive ? 'opacity-60 scale-95 hover:opacity-100 hover:scale-100' : ''} transition-all duration-300`}
      onClick={onClick}
    >
      <span className={`text-amber-400 border border-amber-400/50 px-2 md:px-4 py-1 rounded-full text-[10px] md:text-sm font-bold mb-2 md:mb-4 tracking-tighter md:tracking-widest whitespace-nowrap ${isActive ? 'bg-amber-400/40' : 'bg-amber-400/10'}`}>
        {role}
      </span>
      <div className={`${sizeClass} rounded-xl border-2 ${isActive ? 'border-amber-400' : 'border-amber-400/50'} shadow-[0_0_25px_rgba(251,191,36,0.3)] bg-indigo-950 flex flex-col items-center justify-center relative overflow-hidden transition-transform group`}>
        {cardData.id <= 21 ? (
          <>
            <img
              src={`/images/cards/${cardData.id}.webp`}
              alt={cardData.nameKr}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent ${isCeltic ? 'pt-6 pb-1' : 'pt-8 pb-2'} px-1`}>
              <div className={`${isCeltic ? 'text-[8px] md:text-[10px]' : 'text-[9px] md:text-sm'} font-bold text-amber-400 text-center drop-shadow-md tracking-tighter`}>
                {cardData.nameKr}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-1 border border-amber-500/20 rounded-lg"></div>
            <div className={`${isCeltic ? 'text-[9px] md:text-sm' : 'text-[11px] md:text-lg'} font-bold text-amber-200 text-center px-1 md:px-4 leading-relaxed break-keep z-10`}>{cardData.nameKr}</div>
            <div className={`${isCeltic ? 'hidden md:block text-[8px]' : 'text-[9px] md:text-xs'} font-bold text-amber-400/60 mt-2 z-10 text-center px-1 tracking-widest uppercase`}>{cardData.name}</div>
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
  const [spread, setSpread] = useState<string>('basic');
  const [activeCardIdx, setActiveCardIdx] = useState(0);

  useEffect(() => {
    const cat = searchParams.get('category');
    const cardsParam = searchParams.get('cards');
    const spreadParam = searchParams.get('spread') || 'basic';

    if (!cat || !cardsParam) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setCategory(cat);
    setSpread(spreadParam);

    const roles = spreadParam === 'today' ? ["오늘의 카드"] : 
      spreadParam === 'celtic' ? 
      ["요즘 나의 모습", "지금 꼬인 포인트", "진짜 내 속마음", "이미 지나간 일", "내가 꿈꾸는 목표", "곧 일어날 일", "내가 생각하는 나", "남들이 보는 나", "기대 반 걱정 반", "마지막 결과"] :
      ["과거", "현재", "미래"];

    const cardIds = cardsParam.split(',').map(id => parseInt(id, 10));
    const loadedCards = cardIds.map((id, index) => {
      const cardData = TAROT_DATA.find(c => c.id === id);
      return cardData ? { cardData, role: roles[index] || "오늘의 카드" } : null;
    }).filter((item): item is { cardData: any, role: string } => item !== null);

    const requiredCount = spreadParam === 'today' ? 1 : spreadParam === 'celtic' ? 10 : 3;
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
    if (spread === 'today' || category === 'today') {
      return cardData.todayAdvice || "운명의 흐름을 읽어오는 중입니다";
    }

    const timeMap: Record<string, "past" | "present" | "future"> = {
      '과거': 'past',
      '현재': 'present',
      '미래': 'future'
    };
    const mappedTime = timeMap[roleStr] || 'future';

    if (typeof cardData.advice === 'string') return cardData.advice;

    const catAdvice = cardData.advice?.[category];

    if (typeof catAdvice === 'string') return catAdvice;
    return catAdvice?.[mappedTime] || "운명의 흐름을 읽어오는 중입니다";
  };

  const getInterpretationText = (cardData: any) => {
    if (!cardData || !category) return "";
    if (spread === 'today' || category === 'today') {
      return cardData.todayAdvice || "운명의 흐름을 읽어오는 중입니다";
    }
    return cardData.interpretations?.[category] || "운명의 흐름을 읽어오는 중입니다";
  };

  const getCelticInterpretation = (cardData: any, idx: number) => {
    if (!cardData || !cardData.celtic) return "운명의 흐름을 읽어오는 중입니다";
    switch(idx) {
        case 0: return cardData.celtic.core;
        case 1: return cardData.celtic.obstacle;
        case 2: return cardData.celtic.foundation;
        case 3: return cardData.celtic.foundation;
        case 4: return cardData.celtic.core;
        case 5: return cardData.celtic.nearFuture;
        case 6: return cardData.celtic.influence;
        case 7: return cardData.celtic.influence;
        case 8: return cardData.celtic.destiny;
        case 9: return cardData.celtic.destiny;
        default: return cardData.celtic.core;
    }
  };

  const overallAdvice = useMemo(() => {
    if (cardsInfo.length === 0) return "운명의 메시지를 기다리는 중입니다.";
    if (spread === 'today') {
      return `"${getAdviceText(cardsInfo[0].cardData, '오늘의 카드')}"`;
    }
    if (spread === 'celtic') {
      return '"운명의 수레바퀴가 당신의 모든 순간을 비정하게 꿰뚫어봅니다."';
    }
    const futureItem = cardsInfo.find(c => c.role === "미래");
    return futureItem ? `"${getAdviceText(futureItem.cardData, '미래')}"` : "운명은 당신의 선택에 달려 있습니다.";
  }, [cardsInfo, spread, category]);

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
      className="w-full min-h-screen flex flex-col items-center bg-slate-900 bg-fixed overflow-y-auto select-none pt-[env(safe-area-inset-top)]"
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

        {spread === 'celtic' ? (
          <div className="w-full flex flex-col items-center">
            {/* 셀틱 크로스 10카드 그리드 */}
            <div className="w-full flex flex-wrap justify-center gap-2 md:gap-4 mb-10 md:mb-16 px-2 lg:px-10">
              {cardsInfo.map((item, idx) => (
                <ResultCardItem 
                  key={item.role + '-' + idx} 
                  cardData={item.cardData} 
                  role={item.role} 
                  isLarge={false}
                  isCeltic={true}
                  isActive={idx === activeCardIdx}
                  onClick={() => setActiveCardIdx(idx)}
                />
              ))}
            </div>

            {/* 활성 카드 상세 해석 (모달 대체 인라인 표시) */}
            <div className="w-full max-w-3xl">
              {cardsInfo[activeCardIdx] && (
                <motion.div
                  key={"celtic-detail-" + activeCardIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 text-8xl text-white/[0.03] font-black italic pointer-events-none">
                    {activeCardIdx + 1}
                  </div>
                  
                  <div className="flex flex-col items-center mb-8 border-b border-amber-500/20 pb-6">
                    <span className="text-amber-500 mb-2 font-bold tracking-widest text-sm md:text-base border border-amber-500/50 px-3 py-1 rounded-full">{cardsInfo[activeCardIdx].role}</span>
                    <h2 className="text-2xl md:text-4xl font-bold text-amber-300 tracking-widest text-center mt-2 flex items-center justify-center gap-3">
                      {cardsInfo[activeCardIdx].cardData.nameKr}
                    </h2>
                    <p className="text-amber-200/60 mt-2 text-sm md:text-md tracking-widest uppercase">{cardsInfo[activeCardIdx].cardData.name}</p>
                    <p className="text-amber-100/80 mt-4 tracking-wide text-sm md:text-base text-center break-keep">
                      "{cardsInfo[activeCardIdx].cardData.keywords.join(' · ')}"
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-black/30 p-5 md:p-6 rounded-2xl relative border border-white/5">
                      <span className="absolute -top-3 left-4 bg-slate-800 border border-white/10 px-3 py-1 text-xs text-gray-300 rounded-full tracking-widest">이 위치에서의 의미</span>
                      <p className="text-amber-50 text-[15px] md:text-xl leading-loose tracking-wide break-keep mt-2 font-serif">
                        {getCelticInterpretation(cardsInfo[activeCardIdx].cardData, activeCardIdx)}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/30 to-black/40 border border-indigo-500/30 p-5 md:p-6 rounded-2xl relative">
                      <span className="absolute -top-3 left-4 bg-indigo-900 border border-indigo-500/50 px-3 py-1 text-xs text-indigo-200 rounded-full tracking-widest">일반적 조언</span>
                      <p className="text-indigo-100/90 text-sm md:text-base leading-loose break-keep mt-2">
                        {getInterpretationText(cardsInfo[activeCardIdx].cardData)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="w-full flex justify-center gap-4 md:gap-12 lg:gap-20 mb-16 md:mb-24 px-2">
              {cardsInfo.map((item) => (
                <ResultCardItem 
                  key={item.role} 
                  cardData={item.cardData} 
                  role={item.role} 
                  isLarge={spread === 'today'} 
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
                      {spread === 'today' ? '오늘의 종합 조언' : item.role === '과거' ? '과거의 기반' : item.role === '현재' ? '현재의 조언' : '미래의 가능성'}
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
          </>
        )}

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
