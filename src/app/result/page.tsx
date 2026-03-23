"use client";

import React, { useEffect, useState, useMemo, memo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TAROT_BASE } from "@/data/tarot/base";
import { TAROT_FORTUNE } from "@/data/tarot/today";
import { TAROT_SPREAD3 } from "@/data/tarot/spread3";
import { TAROT_CELTIC } from "@/data/tarot/celtic";
import { CELTIC_LAYOUT_INFO } from "@/constants/tarot";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { saveTarotResult } from "@/lib/tarot";

const CATEGORY_MAP: Record<string, string> = {
  '애정운': 'love', 'love': 'love',
  '재물운': 'money', 'money': 'money',
  '직업운': 'work', 'work': 'work',
  '오늘': 'today', 'today': 'today',
  '고민': 'worry', 'worry': 'worry'
};

const renderRoleWithStyles = (role: string) => {
  const match = role.match(/^(.*?)\s*(\(.*?\))$/);
  if (match) {
    return (
      <span className="inline-flex items-center gap-1">
        <span>{match[1]}</span>
        <span className="text-[0.75em] opacity-60 font-normal tracking-normal">{match[2]}</span>
      </span>
    );
  }
  return role;
};

// 개별 결과 카드 컴포넌트 (성능 최적화)
const ResultCardItem = memo(({ 
  cardData, 
  role, 
  isLarge,
  isCeltic,
  isActive,
  isReversed,
  onClick,
  idx
}: { 
  cardData: any, 
  role: string, 
  isLarge: boolean,
  isCeltic?: boolean,
  isActive?: boolean,
  isReversed?: boolean,
  onClick?: () => void,
  idx?: number
}) => {
  const sizeClass = isLarge 
    ? 'w-[140px] h-[220px] md:w-[240px] md:h-[384px]'
    : isCeltic
      ? 'w-[64px] h-[100px] md:w-[110px] md:h-[171px]'
      : 'w-[80px] h-[128px] md:w-[150px] md:h-[240px]';

  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`flex flex-col items-center ${onClick ? 'cursor-pointer' : ''} ${isActive ? 'scale-110 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] z-[60]' : isCeltic ? 'opacity-90 hover:opacity-100 hover:scale-[1.03]' : ''} transition-all duration-300 w-full h-full`}
      onClick={onClick}
    >
      {!isCeltic && (
        <span className={`text-amber-400 border border-amber-400/50 px-2 md:px-4 py-1 rounded-full text-[10px] md:text-sm font-bold mb-2 md:mb-4 tracking-tighter md:tracking-widest whitespace-nowrap ${isActive ? 'bg-amber-400/40' : 'bg-amber-400/10'}`}>
          {renderRoleWithStyles(role)}
        </span>
      )}
      <div className={`${sizeClass} rounded-xl border-2 ${isActive ? 'border-amber-400' : 'border-amber-400/30'} shadow-[0_0_25px_rgba(251,191,36,0.2)] bg-indigo-950 flex flex-col items-center justify-center relative overflow-hidden transition-transform group`}>
        {isCeltic && (
          <span className="absolute -top-1 left-2 text-white/50 text-[20px] md:text-[32px] font-black italic opacity-20 pointer-events-none z-0">
            {romanNumerals[idx || 0]}
          </span>
        )}
        {cardData.id <= 21 ? (
          <>
            <img
              src={`/images/cards/${cardData.id}.webp`}
              alt={cardData.nameKr}
              loading="lazy"
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isReversed ? 'rotate-180' : ''}`}
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
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [cardsInfo, setCardsInfo] = useState<{ cardData: any, role: string, isReversed: boolean }[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [spread, setSpread] = useState<string>('basic');
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isGridFolded, setIsGridFolded] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [swipeDir, setSwipeDir] = useState(1);

  const isSavedRef = React.useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    const cardsParam = searchParams.get('cards');
    const spreadParam = searchParams.get('spread') || 'basic';

    if (!cat || !cardsParam) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const rawCat = cat.replace(/[^\w가-힣]/g, '');
    const cleanCat = CATEGORY_MAP[rawCat] || CATEGORY_MAP[cat] || rawCat.replace(/[^\w]/g, '');
    setCategory(cleanCat);
    setSpread(spreadParam);

    const roles = spreadParam === 'today' ? ["오늘의 카드"] : 
      spreadParam === 'celtic' ? 
      CELTIC_LAYOUT_INFO.map(info => `${info.labelKr} (${info.labelEn})`) :
      ["과거", "현재", "미래"];

    const cardSelections = cardsParam.split(',').map(val => ({ id: parseInt(val, 10), isReversed: val.endsWith('r') }));
    const loadedCards = cardSelections.map(({ id, isReversed }, index) => {
      const base = TAROT_BASE[id];
      if (!base) return null;
      let cardData: any = { ...base };
      if (spreadParam === 'today') {
        cardData = { ...cardData, ...TAROT_FORTUNE[id] };
      } else if (spreadParam === 'celtic') {
        cardData = { ...cardData, celtic: TAROT_CELTIC[id] };
      } else {
        cardData = { ...cardData, ...TAROT_SPREAD3[id] };
      }
      const baseRole = roles[index] || "오늘의 카드";
      const appendedRole = `${baseRole} (${isReversed ? '역방향' : '정방향'})`;
      return { cardData, role: appendedRole, isReversed };
    }).filter((item): item is { cardData: any, role: string, isReversed: boolean } => item !== null);

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
      'today': '오늘의 운세',
      'worry': '고민뽑기'
    };
    return category ? (map[category] || '') : '';
  }, [category]);

  const getAdviceText = (item: any) => {
    const { cardData, role, isReversed } = item;
    if (!cardData || !category) return "";
    
    if (category === 'worry') {
      const polarity = isReversed ? cardData.reversePolarity : cardData.polarity;
      if (polarity === 'negative') return TAROT_FORTUNE[cardData.id]?.warningWorry || "운명의 경고를 준비 중입니다";
      return TAROT_FORTUNE[cardData.id]?.worry || "운명의 메시지를 준비 중입니다";
    }

    // 오늘의 운세 전용 조언 우선
    if (spread === 'today' || category === 'today') {
      return isReversed ? (cardData?.todayWarningAdvice || cardData?.todayAdvice || "운명의 메시지를 준비 중입니다") : (cardData?.todayAdvice || "운명의 메시지를 준비 중입니다");
    }

    const timeMap: Record<string, "past" | "present" | "future"> = {
      '과거': 'past',
      '현재': 'present',
      '미래': 'future'
    };
    const mappedTime = timeMap[role] || 'future';

    if (isReversed && cardData.interpretations?.reversed) {
      return cardData.interpretations.reversed;
    }

    if (typeof cardData.advice === 'string') return cardData.advice;

    const key = CATEGORY_MAP[category] || category;
    const catAdvice = cardData.advice?.[key];

    if (typeof catAdvice === 'string') return catAdvice;
    return catAdvice?.[mappedTime] || "운명의 메시지를 준비 중입니다";
  };

  const getInterpretationText = (item: any) => {
    const { cardData, isReversed } = item;
    if (!cardData || !category) return "";
    if (spread === 'today' || category === 'today') {
      return isReversed ? (cardData?.todayWarningAdvice || cardData?.todayAdvice || "운명의 메시지를 준비 중입니다") : (cardData?.todayAdvice || "운명의 메시지를 준비 중입니다");
    }

    if (isReversed && cardData.interpretations?.reversed) {
      return cardData.interpretations.reversed;
    }

    const key = CATEGORY_MAP[category] || category;
    return cardData.interpretations?.[key] || "운명의 메시지를 준비 중입니다";
  };

  const getCelticInterpretation = (cardData: any, idx: number) => {
    if (!cardData || !cardData.celtic || !category) return "운명의 메시지를 준비 중입니다";
    
    // 만약 오늘의 운세 카테고리인데 캘틱을 시도할 경우 에러 방지 (기본값 love)
    let targetCat = CATEGORY_MAP[category] || category;
    if (targetCat === 'today') targetCat = 'love';
    
    const catCelticData = cardData.celtic[targetCat];
    if (!catCelticData) return "운명의 메시지를 준비 중입니다";

    const key = CELTIC_LAYOUT_INFO[idx]?.key as keyof typeof catCelticData;
    let text = key && catCelticData[key] ? catCelticData[key] : "운명의 메시지를 준비 중입니다";
    if (typeof text === 'string') {
        text = text.replace(/\s*\((core|obstacle|goal|foundation|past|nearFuture|self|influence|hopes|destiny)\)/g, "");
    }
    return text;
  };

  const overallAdvice = useMemo(() => {
    if (cardsInfo.length === 0) return "운명의 메시지를 기다리는 중입니다.";
    if (category === 'worry') {
      return `"${getAdviceText(cardsInfo[0])}"`;
    }
    if (spread === 'today') {
      return `"${getAdviceText(cardsInfo[0])}"`;
    }
    if (spread === 'celtic') {
      const activeData = cardsInfo[activeCardIdx]?.cardData;
      return `"${getCelticInterpretation(activeData, activeCardIdx)}"`;
    }
    const futureItem = cardsInfo.find(c => c.role === "미래");
    return futureItem ? `"${getAdviceText(futureItem)}"` : "운명은 당신의 선택에 달려 있습니다.";
  }, [cardsInfo, spread, category, activeCardIdx]);

  useEffect(() => {
    if (cardsInfo.length > 0 && user && !isLoading && !hasError && !isSavedRef.current) {
      isSavedRef.current = true;
      saveTarotResult(
        user.uid,
        user.displayName || 'Unknown',
        cardsInfo.map(c => ({ id: c.cardData?.id, role: c.role, isReversed: c.isReversed, name: c.cardData?.nameKr })),
        overallAdvice
      ).catch(err => {
        console.error("Save error:", err);
        isSavedRef.current = false;
      });
    }
  }, [cardsInfo, user, isLoading, hasError, overallAdvice]);

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
          정상적인 {user ? (user.displayName || "운명의 인도자") : "운명을 읽는 중..."} 님의 운명의 결과를 불러올 수 없습니다. 카드를 다시 선택해 주세요.
        </p>
        <button
          onClick={() => router.push('/select')}
          className="px-8 py-3 bg-slate-800 text-emerald-500 font-bold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all tracking-widest border border-emerald-500/30"
        >
          다른 운명 점치기
        </button>
      </main>
    );
  }

  return (
    <main
      className="w-full min-h-screen flex flex-col items-center bg-slate-900 bg-fixed overflow-y-auto select-none pt-[env(safe-area-inset-top)]"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)',
        paddingBottom: '2rem'
      }}
    >
      <div className="w-full max-w-4xl px-4 md:px-8 mt-6 md:mt-12 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-5xl font-extrabold text-amber-400 mb-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] text-center break-keep leading-relaxed"
        >
          {user ? (user.displayName || "운명의 인도자") : "운명을 읽는 중..."} 님의 운명의 결과
        </motion.h1>


        <div className="mb-12 md:mb-20 mt-4 min-h-[80px] md:min-h-[120px] flex items-center justify-center w-full max-w-4xl px-2">
          {category === 'worry' && cardsInfo[0] ? (
            (() => {
              const polarity = cardsInfo[0].isReversed ? cardsInfo[0].cardData?.reversePolarity : cardsInfo[0].cardData?.polarity;
              const isStop = polarity === 'negative';
              return (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={cardsInfo[0].cardData?.id || 'worry-score'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center gap-4 text-center w-full"
                  >
                    {user?.displayName && (
                      <div className="text-amber-200/80 font-serif text-base md:text-xl tracking-widest mb-1">
                        {user.displayName} 님의 운명의 결과
                      </div>
                    )}
                    <div className={`text-4xl md:text-6xl font-black tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${
                      !isStop ? 'text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.5)]' : 'text-rose-600 drop-shadow-[0_0_35px_rgba(225,29,72,1)]'
                    }`}>
                      {!isStop ? 'YES / GO!' : 'NO / STOP'}
                    </div>
                    <div className="text-amber-300 font-bold tracking-widest text-xs md:text-sm border border-amber-500/50 px-3 py-1 rounded-full bg-amber-500/10">
                      마스터의 한마디
                    </div>
                    <p className="text-amber-100/90 tracking-widest text-base md:text-2xl font-serif italic drop-shadow-md break-keep leading-loose px-2 md:px-8 mt-2">
                      "{getAdviceText(cardsInfo[0])}"
                    </p>
                  </motion.div>
                </AnimatePresence>
              );
            })()
          ) : spread === 'today' && cardsInfo[0] ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={cardsInfo[0].cardData?.id || 'today-score'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center justify-center gap-6 text-center w-full"
              >
                <div className="text-3xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                  오늘의 운세 점수: {cardsInfo[0].isReversed ? cardsInfo[0].cardData?.warningScore?.toFixed(1) : cardsInfo[0].cardData?.score?.toFixed(1)}점
                </div>
                <p className="text-amber-100/90 tracking-widest text-base md:text-2xl font-serif italic drop-shadow-md break-keep leading-loose px-2 md:px-8">
                  "{getAdviceText(cardsInfo[0])}"
                </p>
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <motion.p
                key={activeCardIdx + overallAdvice}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-amber-300 tracking-widest text-center text-base md:text-2xl font-serif italic drop-shadow-md break-keep leading-loose"
              >
                {overallAdvice}
              </motion.p>
            </AnimatePresence>
          )}
        </div>

        {spread === 'celtic' ? (
          <div className="w-full flex flex-col items-center">
            {/* 배열 영역 토글 버튼 */}
            <button 
              onClick={() => setIsGridFolded(!isGridFolded)}
              className="flex items-center justify-center gap-2 mb-2 px-6 py-2 rounded-full border border-amber-500/30 text-amber-500/80 hover:text-amber-400 hover:bg-amber-500/10 active:bg-amber-500/20 transition-all font-semibold tracking-widest text-xs md:text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform duration-300 ${isGridFolded ? 'rotate-180' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
              {isGridFolded ? "배열 다시 보기" : "배열 숨기기"}
            </button>

            {/* 셀틱 크로스 10카드 절대좌표 그리드 */}
            <motion.div 
              initial={false}
              animate={{ 
                height: isGridFolded ? 0 : (isMobile ? 440 : 650),
                opacity: isGridFolded ? 0 : 1,
                marginBottom: isGridFolded ? 0 : (isMobile ? 32 : 48),
                marginTop: isGridFolded ? 0 : 16
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative w-full max-w-5xl mx-auto flex justify-center overflow-visible"
              style={{ pointerEvents: isGridFolded ? 'none' : 'auto' }}
            >
              {cardsInfo.map((item, idx) => {
                const isActive = idx === activeCardIdx;
                const cardW = isMobile ? 64 : 110;
                const cardH = isMobile ? 100 : 171;
                const gapX = isMobile ? 74 : 140; // slightly larger for result card sizes
                const gapY = isMobile ? 104 : 190;
                
                const crossCx = `calc(50% - ${gapX}px)`;
                const crossCy = `50%`;
                const pillarX = `calc(50% + ${gapX * 1.5}px)`;
                
                let left = '50%';
                let top = '50%';
                let transform = 'translate(-50%, -50%)';
                let zIndex = isActive ? 60 : 10;
                
                if (idx === 0) {
                  left = crossCx; top = crossCy; zIndex = isActive ? 60 : 10;
                } else if (idx === 1) {
                  left = crossCx; top = crossCy; 
                  transform = 'translate(-50%, -50%) rotate(90deg)';
                  zIndex = isActive ? 60 : 11;
                } else if (idx === 2) {
                  left = crossCx; top = `calc(50% + ${gapY}px)`; 
                } else if (idx === 3) {
                  left = `calc(${crossCx} - ${gapX}px)`; top = crossCy;
                } else if (idx === 4) {
                  left = crossCx; top = `calc(50% - ${gapY}px)`;
                } else if (idx === 5) {
                  left = `calc(${crossCx} + ${gapX}px)`; top = crossCy;
                } else {
                  left = pillarX;
                  const multiplier = 1.5 - (idx - 6);
                  top = `calc(50% + ${gapY * multiplier}px)`;
                }

                return (
                  <div 
                    key={item.role + '-' + idx} 
                    className="absolute transition-all duration-700 pointer-events-auto"
                    style={{ left, top, transform, zIndex }}
                  >
                    <ResultCardItem 
                      cardData={item.cardData} 
                      role={item.role} 
                      isLarge={false}
                      isCeltic={true}
                      isActive={isActive}
                      onClick={() => setActiveCardIdx(idx)}
                      idx={idx}
                    />
                  </div>
                );
              })}
            </motion.div>

            {/* 활성 카드 상세 해석 (모달 대체 인라인 표시, 스와이프 기능 적용) */}
            <div className="w-full max-w-3xl overflow-hidden relative">
              <AnimatePresence mode="wait" custom={swipeDir}>
                {cardsInfo[activeCardIdx] && (
                  <motion.div
                    key={"celtic-detail-" + activeCardIdx}
                    custom={swipeDir}
                    initial={{ opacity: 0, x: swipeDir === 1 ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: swipeDir === 1 ? -50 : 50 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipeDir;
                      if (offset.x < -50 && activeCardIdx < 9) {
                        setSwipeDir(1);
                        setActiveCardIdx(prev => prev + 1);
                        if (!isGridFolded) setIsGridFolded(true);
                      } else if (offset.x > 50 && activeCardIdx > 0) {
                        setSwipeDir(-1);
                        setActiveCardIdx(prev => prev - 1);
                        if (!isGridFolded) setIsGridFolded(true);
                      }
                    }}
                    className="w-full bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col relative"
                  >
                    <div className="absolute top-0 right-0 p-8 text-8xl text-white/[0.03] font-black italic pointer-events-none">
                      {activeCardIdx + 1}
                    </div>
                    
                    <div className="flex flex-col items-center mb-8 border-b border-amber-500/20 pb-6">
                      <span className="text-amber-500 mb-2 font-bold tracking-widest text-sm md:text-base border border-amber-500/50 px-3 py-1 rounded-full">{renderRoleWithStyles(cardsInfo[activeCardIdx].role)}</span>
                      <h2 className="text-2xl md:text-4xl font-bold text-amber-300 tracking-widest text-center mt-2 flex items-center justify-center gap-3">
                        {cardsInfo[activeCardIdx].cardData.nameKr}
                      </h2>
                      <p className="text-amber-200/60 mt-2 text-sm md:text-md tracking-widest uppercase">{cardsInfo[activeCardIdx].cardData.name}</p>
                      <p className="text-amber-100/80 mt-4 tracking-wide text-sm md:text-base text-center break-keep">
                        "{cardsInfo[activeCardIdx].cardData.keywords.join(' · ')}"
                      </p>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      {spread === 'celtic' && CELTIC_LAYOUT_INFO[activeCardIdx] && (
                        <div className="bg-black/20 p-3 md:p-4 rounded-lg border border-white/5">
                           <p className="text-gray-400 text-xs md:text-[13px] leading-relaxed break-keep">
                             {CELTIC_LAYOUT_INFO[activeCardIdx].desc}
                           </p>
                        </div>
                      )}

                      <div className="bg-black/30 p-5 md:p-6 rounded-2xl relative border border-white/5">
                        <span className="absolute -top-3 left-4 bg-slate-800 border border-white/10 px-3 py-1 text-xs text-gray-300 rounded-full tracking-widest">이 위치에서의 해석</span>
                        <p className="text-amber-50 text-sm md:text-base leading-loose break-keep mt-2">
                          {getCelticInterpretation(cardsInfo[activeCardIdx].cardData, activeCardIdx)}
                        </p>
                      </div>
                    </div>

                    {/* 내비게이션 하단 영역 */}
                    <div className={`mt-10 flex w-full ${activeCardIdx === 0 ? 'justify-end' : 'justify-between'}`}>
                      {activeCardIdx > 0 && (
                        <button 
                          onClick={() => {
                            setSwipeDir(-1);
                            setActiveCardIdx(p => p - 1);
                          }}
                          className="px-6 py-3 rounded-full border border-amber-600/40 text-amber-500/80 active:bg-amber-500/10 font-bold tracking-widest transition-all text-sm md:text-base"
                        >
                          이전 해석 보기
                        </button>
                      )}
                      {activeCardIdx < 9 ? (
                        <button 
                          onClick={() => {
                            setSwipeDir(1);
                            setActiveCardIdx(p => p + 1);
                            if (!isGridFolded) setIsGridFolded(true);
                          }}
                          className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-[0_0_15px_rgba(251,191,36,0.3)] active:scale-95 font-bold tracking-widest transition-all text-sm md:text-base"
                        >
                          다음 해석 보기
                        </button>
                      ) : (
                        <button 
                          onClick={() => setShowSummary(true)}
                          className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.6)] active:scale-95 font-black tracking-widest transition-all text-sm md:text-base"
                        >
                          전체 해석 보기
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* 전체 해석 리포트 모달 */}
            <AnimatePresence>
              {showSummary && (
                <motion.div 
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  className="fixed inset-0 z-[100] bg-slate-900 overflow-y-auto px-4 py-8 md:p-12 flex flex-col items-center"
                >
                  <button 
                    onClick={() => setShowSummary(false)}
                    className="absolute top-6 right-6 md:top-10 md:right-10 text-gray-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-amber-400 mb-4 tracking-widest drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                    운명의 전체 흐름
                  </h1>
                  <p className="text-amber-200/60 mb-12 tracking-widest font-serif italic text-lg text-center">
                    당신의 과거, 현재, 그리고 다가올 미래
                  </p>
                  
                  <div className="w-full max-w-4xl space-y-4 md:space-y-6">
                    {cardsInfo.map((item, idx) => (
                      <div key={'summary-'+idx} className="bg-slate-800/50 border border-amber-500/20 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold italic text-lg md:text-2xl">
                          {idx + 1}
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-1">
                            <span className="text-amber-400 text-xs md:text-sm font-bold tracking-widest border border-amber-500/20 px-2 py-0.5 rounded-full inline-block w-fit">
                              {renderRoleWithStyles(item.role)}
                            </span>
                            <span className="text-gray-200 text-lg md:text-xl font-bold tracking-widest">
                              {item.cardData.nameKr}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm tracking-wide mt-2 break-keep">
                            {item.cardData.keywords.join(' · ')}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-amber-100/60 font-serif text-sm md:text-base max-w-xs break-keep leading-relaxed line-clamp-3 md:line-clamp-2">
                          {getCelticInterpretation(item.cardData, idx)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => router.push('/select')}
                    className="mt-16 px-10 py-4 bg-slate-800 border border-emerald-500/50 text-emerald-500 font-bold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-slate-700 active:scale-95 transition-all tracking-widest text-lg"
                  >
                    다른 운명 점치기
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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
                  isReversed={item.isReversed}
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
                      item.role.startsWith('과거') ? 'bg-amber-700 border-2 border-amber-500' :
                      item.role.startsWith('현재') ? 'bg-amber-500 border-2 border-amber-300' :
                      'bg-yellow-400 border-2 border-yellow-200'
                    }`}></div>
                    <h2 className="text-2xl md:text-3xl font-bold text-amber-400 tracking-widest flex items-center">
                      {spread === 'today' ? '오늘의 종합 조언' : item.role.startsWith('과거') ? '과거의 기반' : item.role.startsWith('현재') ? '현재의 조언' : '미래의 가능성'}
                      <span className="text-xl md:text-2xl text-amber-400/60 font-medium ml-3">
                        ({item.isReversed ? '역방향' : '정방향'})
                      </span>
                    </h2>
                  </div>

                  <div className="flex flex-col gap-2 mb-6">
                    <h3 className="text-2xl text-white font-bold flex items-center gap-3">
                      {item.cardData.nameKr}
                    </h3>
                    <p className="text-amber-200/80 tracking-wide text-sm md:text-base">
                      {item.cardData.keywords.join(' · ')}
                    </p>
                  </div>

                  <div className="space-y-6 md:space-y-8">
                    <div className="bg-black/30 p-5 md:p-6 rounded-2xl relative">
                      <span className="absolute -top-3 left-4 bg-slate-800 border border-white/10 px-3 py-1 text-xs text-gray-400 rounded-full tracking-widest">카드의 해석</span>
                      {spread === 'today' && (item.cardData?.summary || item.cardData?.warningSummary) ? (
                        <div className="flex flex-col gap-6 mt-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-pink-400/80 font-bold text-xs md:text-sm tracking-widest uppercase">Love</span>
                            <p className="text-gray-200 text-sm md:text-lg leading-loose break-keep">{item.isReversed ? item.cardData?.warningSummary?.love : item.cardData?.summary?.love}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-amber-400/80 font-bold text-xs md:text-sm tracking-widest uppercase">Money</span>
                            <p className="text-gray-200 text-sm md:text-lg leading-loose break-keep">{item.isReversed ? item.cardData?.warningSummary?.money : item.cardData?.summary?.money}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-blue-400/80 font-bold text-xs md:text-sm tracking-widest uppercase">Work</span>
                            <p className="text-gray-200 text-sm md:text-lg leading-loose break-keep">{item.isReversed ? item.cardData?.warningSummary?.work : item.cardData?.summary?.work}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-200 text-sm md:text-lg leading-loose break-keep mt-2">
                          {getInterpretationText(item)}
                        </p>
                      )}
                    </div>

                    {(() => {
                      const isNegative = (item.isReversed ? item.cardData?.reversePolarity : item.cardData?.polarity) === 'negative';
                      return (
                        <div className={`p-5 md:p-6 rounded-2xl relative border ${
                          category === 'worry' 
                            ? (isNegative ? 'bg-gradient-to-br from-rose-900/30 to-black/40 border-rose-500/30 shadow-[0_0_30px_rgba(225,29,72,0.15)]' : 'bg-gradient-to-br from-emerald-900/30 to-black/40 border-emerald-500/30 shadow-[0_0_30px_rgba(52,211,153,0.15)]')
                            : 'bg-gradient-to-br from-amber-900/30 to-black/40 border-amber-500/30'
                        }`}>
                          <span className={`absolute -top-3 left-4 px-3 py-1 text-xs rounded-full tracking-widest border ${
                            category === 'worry'
                              ? (isNegative ? 'bg-rose-900 border-rose-500/50 text-rose-200' : 'bg-emerald-900 border-emerald-500/50 text-emerald-200')
                              : 'bg-amber-900 border-amber-500/50 text-amber-200'
                          }`}>
                            타로 마스터의 한마디
                          </span>
                          <p className={`text-[15px] md:text-xl leading-loose tracking-wide break-keep mt-2 font-serif italic ${
                            category === 'worry'
                              ? (isNegative ? 'text-rose-50/90' : 'text-emerald-50/90')
                              : 'text-amber-50/90'
                          }`}>
                            "{category === 'worry' ? (item.isReversed ? item.cardData?.todayWarningAdvice : item.cardData?.todayAdvice) : getAdviceText(item)}"
                          </p>
                        </div>
                      );
                    })()}
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
            onClick={() => router.push('/select')}
            className="w-full max-w-sm py-4 md:py-6 bg-slate-800 text-emerald-500 font-bold text-xl rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all tracking-widest border border-emerald-500/50"
          >
            다른 운명 점치기
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
