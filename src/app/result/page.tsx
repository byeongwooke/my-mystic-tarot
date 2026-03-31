"use client";

import React, { useEffect, useState, useMemo, useRef, Suspense, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { useUserSettings } from "@/hooks/useUserSettings";
import { CARDS } from "@/data/tarot/cards";
import { resolveTarotContent } from "@/utils/tarotEngine";
import { saveTarotResult, saveSharedResult } from "@/lib/tarot";
import TarotResultView, { TarotCardInfo } from "@/components/TarotResultView";

const CATEGORY_MAP: Record<string, string> = {
  '애정운': 'love', 'love': 'love',
  '재물운': 'money', 'money': 'money',
  '직업운': 'work', 'work': 'work',
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

      const spreadType = spreadParam === 'celtic' ? 'celtic' : 'spread3';

      const loadedCards = ids.map((id, index) => {
        const cardData = CARDS[id];
        if (!cardData) return null;
        const isReversed = reversedArr[index];
        const baseRole = roles[index] || "오늘의 카드";
        
        const content = resolveTarotContent(
          id,
          settings,
          categorySlug as any,
          spreadType as any,
          isReversed
        );

        let cardInterpretation = "";
        let cardAdvice = "";

        // v1.1.6: Enhanced defensive mapping
        if ((categorySlug === 'today' || categorySlug === 'worry')) {
          const rootContent = (cardData as any)[categorySlug];
          const direction = isReversed ? 'reversed' : 'normal';
          cardInterpretation = rootContent?.[direction] || "운명의 메시지를 준비 중입니다.";
          cardAdvice = rootContent?.[direction] || "운명의 조언을 준비 중입니다.";
        } else if (spreadType === 'spread3' && content && typeof content === 'object') {
          cardInterpretation = content?.interpretation || "";
          const adviceObj = content?.advice;
          if (adviceObj) {
            if (index === 0) cardAdvice = adviceObj?.past || "";
            else if (index === 1) cardAdvice = adviceObj?.present || "";
            else if (index === 2) cardAdvice = adviceObj?.future || "";
          }
        } 
        
        // Final fallback if still empty
        if (!cardInterpretation) {
          cardInterpretation = typeof content === 'string' ? content : (content?.interpretation || "신비로운 해석을 준비 중입니다.");
        }
        if (!cardAdvice) {
          cardAdvice = (typeof content === 'object' ? content?.advice : "") || cardData.keywords.join(", ");
        }

        return {
          cardId: id,
          nameKr: cardData.nameKr,
          role: baseRole,
          isReversed,
          interpretation: cardInterpretation,
          advice: cardAdvice,
          keywords: isReversed ? cardData.keywordsReversed : cardData.keywords,
          polarity: (cardData.polarity as "positive" | "negative") || "negative",
          score: cardData.score,
          warningScore: cardData.warningScore,
        };
      }).filter(item => item !== null) as TarotCardInfo[];

      const requiredCount = (spreadParam === 'today' || categorySlug === 'worry') ? 1 : spreadParam === 'celtic' ? 10 : 3;
      if (loadedCards.length < 1) {
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
      'love': '연애운', 'money': '재물운', 'work': '직업운', 'today': '오늘의 운세', 'worry': '고민뽑기'
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

  // 자동 기록 저장 (Local History)
  useEffect(() => {
    if (cardsInfo.length > 0 && identifiedProfile && !isLoading && !hasError && !isSavedRef.current) {
      isSavedRef.current = true;
      const profileId = `${identifiedProfile.displayName}_${identifiedProfile.pin}`;
      saveTarotResult(profileId, identifiedProfile.displayName, 
        cardsInfo.map(c => ({ id: c.cardId, role: c.role, isReversed: c.isReversed, name: c.nameKr })),
        overallAdvice
      ).catch(err => console.error("Save error:", err));
    }
  }, [cardsInfo, identifiedProfile, isLoading, hasError, overallAdvice]);

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
      const shareUrl = `${window.location.origin}/share/${shareId}`;

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
        <button onClick={() => router.push('/')} className="px-8 py-3 bg-amber-600 text-white rounded-full font-bold">처음으로 돌아가기</button>
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050B08]"
        >
          {/* v1.1.7: Purified Layout - No gradients or grids */}
          <div className="absolute w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />

          <motion.div 
            animate={{ 
              rotateY: 360,
              scale: [1, 1.05, 1]
            }} 
            transition={{ 
              rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }} 
            className="relative z-10 w-[160px] md:w-[200px] aspect-[18/31] drop-shadow-[0_0_80px_rgba(52,211,153,0.4)]"
          >
             <Image 
               src="/images/card_back.webp" 
               alt="Card Back" 
               fill 
               className="object-contain rounded-xl" 
               priority
             />
          </motion.div>

          <div className="relative z-10 flex flex-col items-center mt-16 gap-4">
            <h2 className="text-2xl md:text-4xl font-serif text-emerald-400 font-bold tracking-[0.3em] drop-shadow-[0_0_15px_rgba(52,211,153,0.8)] text-center">
              운명을 준비중입니다
            </h2>
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
            <p className="text-emerald-500/50 text-xs md:text-sm tracking-[0.4em] mt-6 font-light uppercase text-center break-keep">
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

           <div className="w-full max-w-sm px-6 flex flex-col gap-4 mt-12">
             <button
               onClick={handleShare}
               disabled={isSharing}
               className={`w-full py-5 rounded-full font-black text-xl tracking-widest transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] ${isSharing ? 'bg-slate-800 text-emerald-800' : 'bg-gradient-to-r from-emerald-600 to-emerald-400 text-slate-950 hover:scale-105 active:scale-95'}`}
             >
               {isSharing ? "운명을 갈무리하는 중..." : "운명 공유하기 🔗"}
             </button>
              <button
                onClick={() => {
                  isSavedRef.current = false;
                  window.scrollTo(0,0);
                  router.push('/');
                }}
                className="w-full py-5 bg-slate-900 border border-emerald-500/30 text-emerald-400 font-bold text-xl rounded-full tracking-widest hover:bg-slate-800 active:scale-95 transition-all"
              >
                다른 운명 점치기
              </button>
           </div>

           <AnimatePresence>
             {popupCardId !== null && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6" onClick={() => setPopupCardId(null)}>
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
