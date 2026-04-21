"use client";

import React, { useEffect, useState, useMemo, useRef, Suspense, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { useUserSettings } from "@/hooks/useUserSettings";
import { CARDS } from "@/data/tarot/cards";
import { resolveTarotContent } from "@/utils/tarotEngine";
import { logSpreadUsage, saveSharedResult } from "@/lib/tarot";
import TarotResultView, { TarotCardInfo } from "@/components/TarotResultView";

const CATEGORY_MAP: Record<string, string> = {
  '애정운': 'love', 'love': 'love',
  '재물운': 'money', 'money': 'money',
  '직업운': 'work', 'work': 'work',
  '대인관계': 'friendship', 'friendship': 'friendship',
  '건강운': 'health', 'health': 'health',
  '오늘': 'today', 'today': 'today',
  '고민': 'worry', 'worry': 'worry'
};

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, identifiedProfile } = useAuth();
  const { settings } = useUserSettings();

  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [cardsInfo, setCardsInfo] = useState<TarotCardInfo[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [spread, setSpread] = useState<string>('basic');
  const [popupCardId, setPopupCardId] = useState<number | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  
  const isSavedRef = useRef(false);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const spreadParam = searchParams.get('spread') || 'basic';
    const categorySlug = CATEGORY_MAP[categoryParam || ''] || categoryParam;

    const getLoadingTime = (spread: string, cat: string | null) => {
      if (cat === 'today') return 2500;
      if (cat === 'worry') return 3000;
      if (spread === 'celtic') return 6000;
      return 4500; // Default for spread3/others
    };

    const duration = getLoadingTime(spreadParam, categorySlug);
    const timer = setTimeout(() => setIsCalculating(false), duration);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  useEffect(() => {
    const cardIdsParam = searchParams.get('cards');
    const categoryParam = searchParams.get('category');
    const spreadParam = searchParams.get('spread') || 'basic';
    const isReversedParam = searchParams.get('reversed');

    if (!cardIdsParam || !categoryParam) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const categorySlug = CATEGORY_MAP[categoryParam] || categoryParam;
    setCategory(categorySlug);
    setSpread(spreadParam);

    try {
      const ids = cardIdsParam.split(',').map(Number);
      const reversedArr = isReversedParam ? isReversedParam.split(',').map(v => v === '1') : ids.map(() => false);

      const roles = spreadParam === 'celtic' 
        ? ["현재 상황", "장애와 과제", "의식과 목표", "무의식의 뿌리", "지나온 과거", "가까운 미래", "본인의 태도", "외부의 영향", "희망과 공포", "최종 결과"]
        : ["과거의 기반", "현재의 조언", "미래의 가능성"];

      const spreadType = (categorySlug === 'today' || spreadParam === 'today') 
        ? 'today' 
        : (categorySlug === 'worry' || spreadParam === 'worry') ? 'worry'
        : (spreadParam === 'celtic' ? 'celtic' : 'spread3');

      const loadedCards = ids.map((id, index) => {
        const cardData = CARDS[id];
        if (!cardData) return null;
        const isReversed = reversedArr[index];
        const baseRole = roles[index] || "오늘의 카드";
        const isReversedEffective = isReversed && settings.useReversals;

        const content = resolveTarotContent(
          id,
          settings,
          categorySlug as any,
          spreadType as any,
          isReversedEffective,
          index
        );

        return {
          cardId: id,
          nameKr: cardData.nameKr,
          role: baseRole,
          isReversed: isReversedEffective,
          interpretation: content?.interpretation || "신비로운 해석을 준비 중입니다.",
          advice: content?.advice || "운명의 조언을 읽어내는 중입니다...",
          keywords: isReversedEffective ? cardData.keywordsReversed : cardData.keywords,
          polarity: (cardData.polarity as "positive" | "negative") || "negative",
          score: cardData.score,
          warningScore: cardData.warningScore,
        };
      }).filter(item => item !== null) as TarotCardInfo[];

      const requiredCount = (spreadParam === 'today' || spreadParam === 'worry' || categorySlug === 'worry') ? 1 : spreadParam === 'celtic' ? 10 : 3;
      if (loadedCards.length < requiredCount) {
        setHasError(true);
      } else {
        setCardsInfo(loadedCards);
      }
    } catch (err) {
      console.error("Mapping error:", err);
      setHasError(true);
    }
    setIsLoading(false);
  }, [searchParams, settings]);

  const categoryName = useMemo(() => {
    const map: Record<string, string> = {
      'love': '연애운', 'money': '재물운', 'work': '직업운', 'friendship': '대인관계', 'health': '건강운', 'today': '오늘의 운세', 'worry': '고민뽑기'
    };
    return category ? (map[category] || '') : '';
  }, [category]);

  const overallAdvice = useMemo(() => {
    if (cardsInfo.length === 0) return "운명의 메시지를 기다리는 중입니다.";
    if (category === 'worry' || spread === 'today') return `"${cardsInfo[0].advice}"`;
    const futureItem = cardsInfo.find(c => c.role.startsWith("미래"));
    return futureItem ? `"${futureItem.advice}"` : "운명은 당신의 선택에 달려 있습니다.";
  }, [cardsInfo, spread, category]);

  const cardsResult = cardsInfo;

  // 최소 사용 통계 기록 (Minimal Analytics)
  useEffect(() => {
    if (cardsInfo.length > 0 && identifiedProfile && !isLoading && !hasError && !isSavedRef.current) {
      isSavedRef.current = true;
      const profileId = `${identifiedProfile.displayName}_${identifiedProfile.pin}`;
      logSpreadUsage(profileId, identifiedProfile.displayName, spread || "unknown", category || "unknown")
        .catch(err => console.error("Log error:", err));
    }
  }, [cardsInfo, identifiedProfile, isLoading, hasError, spread, category]);

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const displayName = identifiedProfile?.displayName || user?.displayName || "운명";
      const shareSnapshot = {
        displayName, categoryName, category, spread,
        cardsInfo: cardsResult,
        overallAdvice
      };
      
      const serializedData = JSON.parse(JSON.stringify(shareSnapshot));
      const shareId = await saveSharedResult(serializedData);
      const shareUrl = `https://www.hocsitarot.com/share?id=${shareId}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: '혹시타로 - 운명의 기록',
            text: `"${displayName}"님의 운명이 담긴 신비로운 기록입니다. (24시간 뒤 소멸)`,
            url: shareUrl
          });
          showToast("운명이 성공적으로 공유되었습니다.");
        } catch (sErr) {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareUrl);
            showToast("링크가 클립보드로 복사되었습니다.");
          }
        }
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        showToast("링크가 클립보드로 복사되었습니다.");
      }
    } catch (err) {
      console.error("Critical Share Error:", err);
      showToast("운명을 갈무리하는 중 오류가 발생했습니다.");
    } finally {
      setIsSharing(false);
    }
  };

  if (hasError) {
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-950 px-6 text-center">
        <h1 className="text-2xl font-bold text-amber-500 mb-4">운명의 파동이 불안정합니다</h1>
        <p className="text-gray-400 mb-8">결과 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.</p>
        <button onClick={() => router.push('/select/')} className="px-8 py-3 bg-amber-600 text-white rounded-full font-bold">처음으로 돌아가기</button>
      </main>
    );
  }

  const resultDisplayName = identifiedProfile?.displayName || user?.displayName || "운명";

  return (
    <AnimatePresence mode="wait">
      {isCalculating || isLoading ? (
        <motion.div
          key="waiting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#050B08]"
        >
          {/* v1.1.9: Restored Vertical Layout - Card(top) + Text(bottom) */}
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="relative z-10 w-48 h-80 rounded-2xl border-2 border-emerald-500/30 overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]"
            >
              <Image 
                src="/images/card_back.webp" 
                alt="Tarot Back" 
                fill 
                className="object-cover opacity-80"
              />
            </motion.div>
          </div>
          
          <div className="text-center flex flex-col items-center gap-4">
            <p className="text-emerald-400 text-lg font-medium tracking-[0.3em] animate-pulse">
              운명을 준비중입니다
            </p>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                />
              ))}
            </div>
            <p className="text-emerald-500/50 text-xs md:text-sm tracking-[0.4em] mt-2 font-light uppercase text-center break-keep">
              {resultDisplayName}님의 파동을 갈무리하는 중...
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.main
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full min-h-screen flex flex-col items-center bg-slate-950 overflow-y-auto select-none pb-24 relative"
        >

           <TarotResultView 
             displayName={resultDisplayName}
             categoryName={categoryName}
             category={category || ""}
             spread={spread}
             cardsInfo={cardsResult}
             overallAdvice={overallAdvice}
             onCardClick={(id) => setPopupCardId(id)}
           />

           <div className="w-full max-w-sm px-6 flex flex-col gap-4 mt-12 mb-12">
             {/* 1. 공유 버튼 (Secondary Action) */}
             <motion.button
               whileHover={{ scale: 1.01 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleShare}
               disabled={isSharing}
               style={{ transform: 'translateZ(0)', willChange: 'backdrop-filter' }}
               className={`w-full py-4 rounded-2xl font-bold text-lg tracking-widest transition-all border border-emerald-500/20 bg-emerald-500/5 text-emerald-400/80 backdrop-blur-md ${isSharing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-500/10'}`}
             >
               {isSharing ? "운명을 갈무리하는 중..." : "운명 결과 공유하기 🔗"}
             </motion.button>

             {/* 2. 홈으로 버튼 (Primary Action) - Emerald & Grey Pill UI */}
             <motion.button
               whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}
               whileTap={{ scale: 0.95 }}
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 // Reset State & Navigate
                 setPopupCardId(null);
                 setCardsInfo([]);
                 window.location.href = '/select/';
               }}
               className='w-full py-5 bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-emerald-500/40 text-emerald-400 font-black text-xl rounded-full tracking-[0.2em] shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all'
             >
               홈으로 되돌아가기
             </motion.button>
           </div>

           <AnimatePresence>
             {popupCardId !== null && (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }} 
                 style={{ transform: 'translateZ(0)', willChange: 'backdrop-filter' }}
                 className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6" 
                 onClick={() => setPopupCardId(null)}
               >
                 <Image src={`/images/cards/${popupCardId}.webp`} alt="Card Detail" width={800} height={1300} className="max-h-[80vh] w-auto object-contain rounded-3xl" />
                 <button className="mt-8 px-12 py-3 bg-white/10 rounded-full text-white font-bold">닫기</button>
               </motion.div>
             )}
           </AnimatePresence>
           
           <AnimatePresence>
             {toast.show && (
               <motion.div initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 20, x: "-50%" }} className="fixed bottom-10 left-1/2 z-[1100] px-8 py-4 bg-emerald-600 text-white rounded-full font-bold shadow-2xl">
                 🔮 {toast.message}
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
    <Suspense fallback={<div className="w-full min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" /></div>}>
      <ResultContent />
    </Suspense>
  );
}
