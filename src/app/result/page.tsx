"use client";

import React, { useEffect, useState, useMemo, memo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { TAROT_BASE } from "@/data/tarot/base";
import { TAROT_FORTUNE } from "@/data/tarot/today";
import { TAROT_SPREAD3 } from "@/data/tarot/spread3";
import { TAROT_CELTIC } from "@/data/tarot/celtic";
import { CELTIC_LAYOUT_INFO } from "@/constants/tarot";
import { getDailyCardCondition } from "@/utils/cardCondition";
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

  const condition = getDailyCardCondition(cardData.id);
  const filterStyle = {
    filter: `saturate(${120 - (condition.level * 10)}%) contrast(${95 + (condition.level * 5)}%)`
  };

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
      <div className={`${sizeClass} rounded-xl border-[0.5px] ${isActive ? 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)]' : 'border-[#D4AF37]/60 shadow-[0_4px_15px_rgba(0,0,0,0.6)]'} bg-[#050505] flex items-center justify-center relative overflow-hidden transition-transform group`} style={filterStyle}>
        {/* Visual Liberation: Pure Symbolism (Rider Waite WebP) */}
        <img
          src={`/images/cards/${cardData.id}.webp`}
          alt={cardData.nameKr}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isReversed ? 'rotate-180' : ''}`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = '0.3';
          }}
        />

        {/* 미니멀 번호 레이블 (중앙 투명 오버레이) */}
        {isCeltic && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 mix-blend-overlay">
            <span className="text-white/60 text-[32px] md:text-[48px] font-serif font-black italic drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">
              {romanNumerals[idx || 0]}
            </span>
          </div>
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
  const [isCalculating, setIsCalculating] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [cardsInfo, setCardsInfo] = useState<{ cardData: any, role: string, isReversed: boolean }[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [spread, setSpread] = useState<string>('basic');
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isGridFolded, setIsGridFolded] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [swipeDir, setSwipeDir] = useState(1);
  const [popupCardId, setPopupCardId] = useState<number | null>(null);

  const isSavedRef = React.useRef(false);

  const checkMobile = () => setIsMobile(window.innerWidth < 768);

  const handleShare = async () => {
    const shareData = {
      title: '혹시타로',
      text: "혹시 내 운명은? '혹시타로'에서 확인해보세요!",
      url: window.location.origin
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      alert('링크가 클립보드에 복사되었습니다. 친구에게 공유해보세요!');
    }
  };

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ 카테고리/배열법 기반 로딩 타이머 (3.5s ~ 9.0s)
  useEffect(() => {
    if (!category || !spread) return;
    
    let delay = 6000; // 기본 3배열 (Love/Money/Work: 6.0초)
    if (spread === 'celtic') {
      // url param 등 구분자가 있다면 확장, 기본 종합해석은 9000ms
      delay = 9000;
    } else if (spread === 'today' || category === 'today') {
      delay = 3500; // 오늘의 운세: 3.5초
    } else if (category === 'worry') {
      delay = 4500; // 고민뽑기: 4.5초
    }
    
    // [운명 확인하기] 진입 시 타이머 작동
    const timer = setTimeout(() => {
      setIsCalculating(false);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [category, spread]);

  // ✅ 진입/변경 시 특정 상태(Popup, GridFold) 초기화
  useEffect(() => {
    setIsGridFolded(false);
    setPopupCardId(null);
    setShowSummary(false); // 요약 창도 리셋
    // isCalculating 도 재진입 시 다시 켤 경우를 대비하지만, 
    // 통상 page mount 시 true 가 됩니다.
  }, [searchParams]);

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

    // 3배열 (기본 advice 객체 매핑 로직)
    const baseKey = CATEGORY_MAP[category] || category;
    const targetKey = isReversed ? `${baseKey}Reversed` : baseKey;
    
    // 역방향 전용 데이터가 있으면 가져오고, 없으면 정방향(baseKey)로 폴백
    const catAdvice = cardData.advice?.[targetKey] || cardData.advice?.[baseKey];

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

  const getCelticInterpretation = (cardData: any, idx: number, isReversed: boolean = false) => {
    if (!cardData || !cardData.celtic || !category) return "운명의 메시지를 준비 중입니다";
    
    // 만약 오늘의 운세 카테고리인데 캘틱을 시도할 경우 에러 방지 (기본값 love)
    let targetCat = CATEGORY_MAP[category] || category;
    if (targetCat === 'today') targetCat = 'love';

    // 역방향 전용 데이터 시도 (혹시 데이터에 reversed 가 있다면 우선 사용)
    if (isReversed && cardData.interpretations?.reversed) {
      return `[역방향] ${cardData.interpretations.reversed} 하지만 이 시기를 지혜롭게 넘긴다면 충분히 극복할 수 있는 흐름입니다.`;
    }
    
    const catCelticData = cardData.celtic[targetCat];
    if (!catCelticData) return "운명의 메시지를 준비 중입니다";

    const key = CELTIC_LAYOUT_INFO[idx]?.key as keyof typeof catCelticData;
    let text = key && catCelticData[key] ? catCelticData[key] : "운명의 메시지를 준비 중입니다";
    if (typeof text === 'string') {
        text = text.replace(/\s*\((core|obstacle|goal|foundation|past|nearFuture|self|influence|hopes|destiny)\)/g, "");
    }
    
    if (isReversed) {
      // 긍정적 조언 가이드 문구 추가 (Softening Logic)
      const softening = [
        "하지만 이 흐름은 당신의 의지로 충분히 극복할 수 있습니다.",
        "오히려 이 시기를 지혜롭게 넘기기 위한 조언으로 받아들여 보세요.",
        "잠시 쉬어가며 내면을 단단히 다지는 계기로 삼으시길 바랍니다."
      ];
      const randomSoft = softening[Math.floor(Math.random() * softening.length)];
      text = `[역방향] ${text} ${randomSoft}`;
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

  // isLoading 스피너 로직은 아래 AnimatePresence 에서 통합 관리


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
    <AnimatePresence mode="wait">
      {isCalculating || isLoading ? (
        <motion.div
           key="destiny-waiting-room"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
           className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050B08] backdrop-blur-xl overflow-hidden"
        >
           {/* 배경: 에메랄드 그린 톤이 가미된 깊은 블랙 */}
           <div className="absolute inset-0 bg-gradient-to-b from-[#02100A]/80 to-[#0A1A12]/90 pointer-events-none" />

           <div 
             className="relative flex flex-col items-center justify-center mb-12 w-full"
             style={{ perspective: 1000 }}
           >
              {/* 뒷 배경 빛 번짐 효과 */}
              <div className="absolute inset-0 bg-emerald-700/20 blur-[60px] rounded-full w-[250px] h-[250px] md:w-[400px] md:h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative z-10 w-[45vw] max-w-[200px] md:max-w-[280px] aspect-[18/31]"
              >
                {/* Front Side */}
                <Image 
                  src="/images/card_back.webp" 
                  alt="Tarot Card Back Front" 
                  fill
                  priority
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className="object-contain rounded-2xl md:rounded-3xl drop-shadow-[0_20px_40px_rgba(16,185,129,0.4)] md:drop-shadow-[0_30px_50px_rgba(16,185,129,0.6)]" 
                  style={{ backfaceVisibility: "hidden" }}
                />
                {/* Back Side */}
                <Image 
                  src="/images/card_back.webp" 
                  alt="Tarot Card Back Reversed" 
                  fill
                  priority
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className="object-contain rounded-2xl md:rounded-3xl drop-shadow-[0_20px_40px_rgba(16,185,129,0.4)] md:drop-shadow-[0_30px_50px_rgba(16,185,129,0.6)]" 
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                />
              </motion.div>
           </div>
           
           <p className="text-xl md:text-2xl font-serif tracking-[0.2em] text-emerald-300/90 text-center break-keep px-6 relative z-10 animate-pulse drop-shadow-[0_0_20px_rgba(16,185,129,0.6)] leading-relaxed">
              {user?.displayName ? `${user.displayName} 님의 운명을 확인하는 중입니다.` : '운명을 확인하는 중입니다.'}
           </p>
        </motion.div>
      ) : (
        <motion.main
          key="destiny-result"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full min-h-screen flex flex-col items-center bg-slate-900 bg-fixed overflow-y-auto select-none pt-[env(safe-area-inset-top)] relative z-10"
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
          <div className="w-full flex flex-col items-center pb-20 px-4 md:px-0">
            {/* 1. 최종 결론 */}
            {cardsInfo[9] && (
              <div className="w-full max-w-4xl mx-auto conclusion-box mb-8 p-6 md:p-10 bg-emerald-900/20 rounded-2xl border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-sm">
                <h3 className="text-emerald-400 text-sm md:text-base mb-4 font-bold tracking-widest text-center uppercase">최종 운명의 결론</h3>
                <p className="text-white text-lg md:text-2xl text-center leading-relaxed font-serif break-keep">
                  "{getCelticInterpretation(cardsInfo[9].cardData, 9, cardsInfo[9].isReversed)}"
                </p>
              </div>
            )}

            {/* 2. 배열도 토글 및 펼치기 */}
            <button 
              onClick={() => setIsGridFolded(!isGridFolded)}
              className="w-full py-4 text-xs md:text-sm text-gray-500 hover:text-emerald-400 underline underline-offset-4 mb-4 transition-colors tracking-widest text-center"
            >
              {isGridFolded ? "배열도 펼쳐보기" : "배열도 접기"}
            </button>

            <motion.div 
              initial={false}
              animate={{ 
                height: isGridFolded ? 0 : 'auto',
                opacity: isGridFolded ? 0 : 1,
                marginBottom: isGridFolded ? 0 : (isMobile ? 32 : 48),
                marginTop: isGridFolded ? 0 : 16
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative w-full max-w-4xl mx-auto grid grid-cols-4 lg:grid-cols-5 grid-rows-4 gap-2 md:gap-6 lg:gap-10 place-items-center overflow-visible"
              style={{ pointerEvents: isGridFolded ? 'none' : 'auto' }}
            >
              {cardsInfo.map((item, idx) => {
                const isActive = false;
                
                let gridPos = "";
                let transform = "";
                let zIndex = 10;
                
                if (idx === 0) { gridPos = "col-start-2 row-start-2"; }
                else if (idx === 1) { gridPos = "col-start-2 row-start-2"; transform = "rotate(90deg) scale(0.95)"; zIndex = 11; }
                else if (idx === 2) { gridPos = "col-start-2 row-start-3"; }
                else if (idx === 3) { gridPos = "col-start-1 row-start-2"; }
                else if (idx === 4) { gridPos = "col-start-2 row-start-1"; }
                else if (idx === 5) { gridPos = "col-start-3 row-start-2"; }
                else if (idx === 6) { gridPos = "col-start-4 lg:col-start-5 row-start-4"; }
                else if (idx === 7) { gridPos = "col-start-4 lg:col-start-5 row-start-3"; }
                else if (idx === 8) { gridPos = "col-start-4 lg:col-start-5 row-start-2"; }
                else if (idx === 9) { gridPos = "col-start-4 lg:col-start-5 row-start-1"; }

                return (
                  <div 
                    key={item.role + '-' + idx} 
                    className={`transition-all duration-700 pointer-events-auto flex items-center justify-center ${gridPos}`}
                    style={{ transform, zIndex }}
                  >
                    <ResultCardItem 
                      cardData={item.cardData} 
                      role={item.role} 
                      isLarge={false}
                      isCeltic={true}
                      isActive={isActive}
                      idx={idx}
                      isReversed={item.isReversed}
                      onClick={() => setPopupCardId(item.cardData.id)}
                    />
                  </div>
                );
              })}
            </motion.div>

            {/* 3. 종합 해석 (소설형) */}
            <div className="comprehensive-story w-full max-w-4xl mt-12 mb-6 p-8 md:p-14 bg-[#111] rounded-3xl border-[0.5px] border-amber-900/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
              {/* 양피지 텍스처나 은은한 백그라운드 효과 */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
              
              <h2 className="text-3xl md:text-4xl font-serif text-amber-400/80 mb-12 text-center italic tracking-widest border-b border-amber-900/30 pb-6 inset-x-0 relative z-10 drop-shadow-md">종합해석</h2>
              <div className="space-y-6 md:space-y-8 text-amber-50/90 leading-loose text-justify break-keep text-[15px] md:text-lg font-serif relative z-10">
                {cardsInfo.map((card, idx) => (
                  <p key={idx}>{getCelticInterpretation(card.cardData, idx, card.isReversed)}</p>
                ))}
              </div>
            </div>

            {/* 4. 운명의 근거 (상세 기술 정보 목록) */}
            <div className="w-full max-w-4xl space-y-4 md:space-y-6 mt-16 mb-16">
              <h3 className="text-xl md:text-2xl text-amber-500 font-bold mb-6 tracking-widest border-b border-amber-500/30 pb-4">운명의 근거 (상세 정보)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {cardsInfo.map((card, idx) => (
                  <div key={idx} className="card-info-item bg-black/40 p-5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-300 font-bold text-xs bg-white/5 px-2 py-0.5 rounded">[{idx + 1}]</span>
                      <span className="text-gray-300 text-xs tracking-widest uppercase">{CELTIC_LAYOUT_INFO[idx]?.labelKr}</span>
                    </div>
                    <div className="text-white font-bold text-base md:text-lg tracking-wider mb-2">
                      {card.cardData.nameKr} <span className="text-gray-400 text-sm font-normal">({card.cardData.name})</span> {card.isReversed ? <span className="text-amber-500/80 text-sm ml-1">(역방향)</span> : <span className="text-emerald-400 text-sm ml-1">(정방향)</span>}
                    </div>
                    <div className="text-emerald-400/80 text-sm md:text-sm leading-relaxed break-keep font-serif">
                      {card.cardData.keywords.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 flex flex-col items-center gap-4 w-full px-4">
              <button
                onClick={handleShare}
                className="w-full max-w-[280px] md:max-w-[320px] py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:to-emerald-400 text-slate-950 font-extrabold text-lg rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all tracking-widest"
              >
                운명 공유하기 🔗
              </button>
              <button
                onClick={() => router.push('/select')}
                className="w-full max-w-[280px] md:max-w-[320px] py-4 bg-slate-800 border border-emerald-500/50 text-emerald-500 font-bold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-slate-700 active:scale-95 transition-all tracking-widest text-lg"
              >
                다른 운명 점치기
              </button>
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
                  isReversed={item.isReversed}
                  onClick={() => setPopupCardId(item.cardData.id)}
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
                      const isWarning = item.isReversed || (category === 'worry' && isNegative);

                      return (
                        <div className={`p-5 md:p-6 rounded-2xl relative border transition-all duration-500 ${
                          isWarning
                            ? 'bg-gradient-to-br from-rose-950/40 to-black/60 border-rose-500/40 shadow-[0_0_20px_rgba(225,29,72,0.2)]'
                            : (category === 'worry'
                                ? 'bg-gradient-to-br from-emerald-900/30 to-black/40 border-emerald-500/30 shadow-[0_0_30px_rgba(52,211,153,0.15)]'
                                : 'bg-gradient-to-br from-amber-900/30 to-black/40 border-amber-500/30')
                        }`}>
                          <span className={`absolute -top-3 left-4 px-3 py-1 text-xs rounded-full tracking-widest border transition-colors ${
                            isWarning
                              ? 'bg-rose-950 border-rose-500/60 text-rose-200 shadow-[0_0_10px_rgba(225,29,72,0.3)]'
                              : (category === 'worry'
                                  ? 'bg-emerald-900 border-emerald-500/50 text-emerald-200'
                                  : 'bg-amber-900 border-amber-500/50 text-amber-200')
                          }`}>
                            타로 마스터의 한마디
                          </span>
                          <p className={`text-[15px] md:text-xl leading-loose tracking-wide break-keep mt-2 font-serif italic ${
                            isWarning
                              ? 'text-rose-100/90'
                              : (category === 'worry' ? 'text-emerald-50/90' : 'text-amber-50/90')
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
          <p className="text-gray-300 opacity-80 text-xs md:text-sm font-light tracking-wide mb-8 text-center max-w-sm">
            본 결과는 삶의 방향을 잡기 위한 참고용이며, 진정한 운명은 스스로 개척하는 것입니다.
          </p>
          <div className="w-full flex flex-col items-center gap-4 px-4">
            <button
              onClick={handleShare}
              className="w-full max-w-sm py-4 md:py-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:to-emerald-400 text-slate-950 font-extrabold text-xl rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.7)] active:scale-95 transition-all tracking-widest"
            >
              운명 공유하기 🔗
            </button>
            <button
              onClick={() => router.push('/select')}
              className="w-full max-w-sm py-4 md:py-6 bg-slate-800 text-emerald-500 font-bold text-xl rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:bg-slate-700 active:scale-95 transition-all tracking-widest border border-emerald-500/50"
            >
              다른 운명 점치기
            </button>
          </div>
        </motion.div>
      </div>

      {/* Layer Popup for Pure View */}
      <AnimatePresence>
        {popupCardId !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setPopupCardId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative flex flex-col items-center justify-center w-full max-h-[90vh] cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={`/images/cards/${popupCardId}.webp`} 
                alt="상세 카드"
                width={800}
                height={1370}
                quality={90}
                className="max-h-[75vh] w-auto object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl"
              />
              <button
                onClick={() => setPopupCardId(null)}
                className="mt-8 px-10 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white/90 tracking-widest text-sm transition-colors backdrop-blur-md"
              >
                닫기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
      )}
    </AnimatePresence>
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
