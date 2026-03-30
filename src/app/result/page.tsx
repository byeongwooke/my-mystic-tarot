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
  const [cardsInfo, setCardsInfo] = useState<{ cardData: any, role: string, isReversed: boolean }[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [spread, setSpread] = useState<string>('basic');
  const [popupCardId, setPopupCardId] = useState<number | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  
  const isSavedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsCalculating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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

    setCategory(CATEGORY_MAP[categoryParam] || categoryParam);
    setSpread(spreadParam);

    const ids = cardIdsParam.split(',').map(Number);
    const reversedArr = isReversedParam ? isReversedParam.split(',').map(v => v === '1') : ids.map(() => false);

    const roles = spreadParam === 'celtic' 
      ? ["현재 상황", "장애와 과제", "의식과 목표", "무의식의 뿌리", "지나온 과거", "가까운 미래", "본인의 태도", "외부의 영향", "희망과 공포", "최종 결과"]
      : ["과거의 기반", "현재의 조언", "미래의 가능성"];

    const loadedCards = ids.map((id, index) => {
      const cardData = CARDS[id];
      if (!cardData) return null;
      const isReversed = reversedArr[index];
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
      'love': '연애운', 'money': '재물운', 'work': '직업운', 'today': '오늘의 운세', 'worry': '고민뽑기'
    };
    return category ? (map[category] || '') : '';
  }, [category]);

  const getFallbackText = (cardData: any) => {
    const keywords = cardData?.keywords || [];
    return `카드가 가진 ${keywords.join(', ')}의 기운이 현재 운명의 흐름에 머물고 있습니다.`;
  };

  const getAdviceText = (item: any) => {
    const { cardData, role, isReversed } = item;
    if (!cardData || !category) return "";
    if (category === 'today') return (isReversed ? cardData?.today?.reversed : cardData?.today?.normal) || getFallbackText(cardData);
    if (category === 'worry') return (isReversed ? cardData?.worry?.reversed : cardData?.worry?.normal) || getFallbackText(cardData);
    
    const spreadType = spread === 'celtic' ? 'celtic' : 'spread3';
    const content = resolveTarotContent(cardData?.id, settings, category as any, spreadType, isReversed);
    
    const timeMap: Record<string, "past" | "present" | "future"> = { '과거': 'past', '현재': 'present', '미래': 'future' };
    const baseRoleMatch = role?.match(/^(과거|현재|미래)/);
    const mappedTime = baseRoleMatch ? timeMap[baseRoleMatch[1]] : 'future';
    const text = (content?.advice as any)?.[mappedTime] || getFallbackText(cardData);
    return text?.replace(/\s*\((past|present|future|core|obstacle|goal|foundation|nearFuture|self|influence|hopes|destiny)\)/g, "");
  };

  const getInterpretationText = (item: any) => {
    const { cardData, isReversed } = item;
    if (!cardData || !category) return "";
    if (category === 'today' || category === 'worry') {
      const keywords = isReversed ? cardData?.keywordsReversed : cardData?.keywords;
      return keywords?.join(' · ') || "키워드 분석 중";
    }
    const spreadType = spread === 'celtic' ? 'celtic' : 'spread3';
    const content = resolveTarotContent(cardData?.id, settings, category as any, spreadType, isReversed);
    return content?.interpretation || getFallbackText(cardData);
  };

  const getCelticInterpretation = (cardData: any, idx: number, isReversed: boolean = false) => {
    if (!cardData || !category) return "운명의 흐름을 읽는 중입니다";
    let baseCat = (spread === 'celtic' && (category === 'love' || category === 'money' || category === 'work')) ? category : 'love';
    const content = resolveTarotContent(cardData.id, settings, baseCat as any, 'celtic', isReversed);
    return content?.interpretation || getFallbackText(cardData);
  };

  const overallAdvice = useMemo(() => {
    if (cardsInfo.length === 0) return "운명의 메시지를 기다리는 중입니다.";
    if (category === 'worry' || spread === 'today') return `"${getAdviceText(cardsInfo[0])}"`;
    const futureItem = cardsInfo.find(c => c.role.startsWith("미래"));
    return futureItem ? `"${getAdviceText(futureItem)}"` : "운명은 당신의 선택에 달려 있습니다.";
  }, [cardsInfo, spread, category, settings]);

  const cardsResult = useMemo<TarotCardInfo[]>(() => {
    return cardsInfo.map((item, idx) => {
      const polarity = item.isReversed ? item.cardData?.reversePolarity : item.cardData?.polarity;
      return {
        cardId: item.cardData.id,
        nameKr: item.cardData.nameKr,
        role: item.role,
        isReversed: item.isReversed,
        advice: getAdviceText(item),
        interpretation: spread === 'celtic' ? getCelticInterpretation(item.cardData, idx, item.isReversed) : getInterpretationText(item),
        keywords: item.isReversed ? (item.cardData?.keywordsReversed || item.cardData?.keywords || []) : (item.cardData?.keywords || []),
        polarity,
        score: item.cardData?.score,
        warningScore: item.cardData?.warningScore
      };
    });
  }, [cardsInfo, spread, category, settings]);

  // 자동 기록 저장 (Local History)
  useEffect(() => {
    if (cardsInfo.length > 0 && identifiedProfile && !isLoading && !hasError && !isSavedRef.current) {
      isSavedRef.current = true;
      const profileId = `${identifiedProfile.displayName}_${identifiedProfile.pin}`;
      saveTarotResult(profileId, identifiedProfile.displayName, 
        cardsInfo.map(c => ({ id: c.cardData?.id, role: c.role, isReversed: c.isReversed, name: c.cardData?.nameKr })),
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
          // Fallback if share is cancelled or fails
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

  return (
    <AnimatePresence mode="wait">
      {isCalculating || isLoading ? (
        <motion.div
          key="waiting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050B08] backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#02100A]/80 to-[#0A1A12]/90" />
          <motion.div animate={{ rotateY: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="relative z-10 w-[200px] aspect-[18/31]">
             <Image src="/images/card_back.webp" alt="Card Back" fill className="object-contain drop-shadow-[0_0_50px_rgba(16,185,129,0.4)]" />
          </motion.div>
          <p className="text-xl font-serif text-emerald-300 mt-12 animate-pulse tracking-widest">
            {identifiedProfile?.displayName || user?.displayName || "운명"} 님의 조언을 준비하고 있습니다...
          </p>
        </motion.div>
      ) : (
        <motion.main
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full min-h-screen flex flex-col items-center bg-slate-950 overflow-y-auto select-none pb-24 relative"
        >
           {/* UI Source of Truth Component */}
           <TarotResultView 
             displayName={identifiedProfile?.displayName || user?.displayName || "운명"}
             categoryName={categoryName}
             category={category || ""}
             spread={spread}
             cardsInfo={cardsResult}
             overallAdvice={overallAdvice}
             onCardClick={(id) => setPopupCardId(id)}
           />

           {/* Actions Section */}
           <div className="w-full max-w-sm px-6 flex flex-col gap-4 mt-12">
             <button
               onClick={handleShare}
               disabled={isSharing}
               className={`w-full py-5 rounded-full font-black text-xl tracking-widest transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] ${isSharing ? 'bg-slate-800 text-emerald-800' : 'bg-gradient-to-r from-emerald-600 to-emerald-400 text-slate-950 hover:scale-105 active:scale-95'}`}
             >
               {isSharing ? "운명을 갈무리하는 중..." : "운명 공유하기 🔗"}
             </button>
             <button
               onClick={() => router.push('/select/')}
               className="w-full py-5 bg-slate-900 border border-emerald-500/30 text-emerald-400 font-bold text-xl rounded-full tracking-widest hover:bg-slate-800 active:scale-95 transition-all"
             >
               다른 운명 점치기
             </button>
           </div>

           {/* Modal & Toast */}
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
