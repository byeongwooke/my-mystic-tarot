"use client";

import React, { useState, useEffect, Suspense, useMemo, memo } from "react";
import { TAROT_DATA } from "@/constants/tarotData";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

// 개별 카드 컴포넌트화하여 React.memo 적용 (불필요한 리렌더링 방지)
const TarotCardItem = memo(({ 
  card, 
  isSelected, 
  onCardClick 
}: { 
  card: typeof TAROT_DATA[0], 
  isSelected: boolean, 
  onCardClick: (id: number) => void 
}) => {
  return (
    <div className="relative flex-shrink-0 perspective-1000">
      {/* Placeholder - 카드 크기 일치화 (96x150 / 165x270) */}
      <div className="w-[96px] h-[150px] md:w-[165px] md:h-[270px] invisible" />
      
      {!isSelected && (
        <motion.div
          layoutId={`card-${card.id}`}
          onClick={() => onCardClick(card.id)}
          className="absolute inset-0 cursor-pointer pointer-events-auto"
          style={{ transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          whileInView={{ 
            scale: 1.25,
            zIndex: 150,
            transition: { type: "spring", stiffness: 150, damping: 25, zIndex: { duration: 0 } }
          }}
          viewport={{ amount: 0.2, margin: "-5% 0px -5% 0px" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileTap={{ 
            y: -40, 
            scale: 1.35,
            zIndex: 200,
            transition: { zIndex: { duration: 0 } }
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
        >
          <div
            className="w-full h-full rounded-xl border border-[#D4AF37] bg-gradient-to-br from-[#191970] via-indigo-950 to-[#191970] flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.6)] overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="absolute inset-1 border border-[#D4AF37]/40 rounded-lg"></div>
            <div className="w-6 h-6 md:w-8 md:h-8 border border-[#D4AF37]/50 rounded-full flex items-center justify-center rotate-45">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-[#D4AF37]/40 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      )}
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

  const [selectedCards, setSelectedCards] = useState<{ id: number; role: string }[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [cards, setCards] = useState<typeof TAROT_DATA>([]);
  const [showHomeModal, setShowHomeModal] = useState(false);

  const spreadData = useMemo(() => {
    if (spreadParam === 'today') {
      return { limit: 1, roles: ["오늘의 카드"] };
    } else if (spreadParam === 'celtic') {
      return { 
        limit: 10, 
        roles: ["요즘 나의 모습", "지금 꼬인 포인트", "진짜 내 속마음", "이미 지나간 일", "내가 꿈꾸는 목표", "곧 일어날 일", "내가 생각하는 나", "남들이 보는 나", "기대 반 걱정 반", "마지막 결과"] 
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
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // 초기 셔플
    const shuffledIds = Array.from({ length: 78 }, (_, i) => i);
    for (let i = shuffledIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
    }
    setCards(shuffledIds.map(id => TAROT_DATA[id] || TAROT_DATA[0]));

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCardClick = (cardId: number) => {
    if (!cleanCategory) return;

    const isAlreadySelected = selectedCards.some(c => c.id === cardId);
    if (isAlreadySelected) {
      setSelectedCards(prev => {
        const remaining = prev.filter(c => c.id !== cardId);
        return remaining.map((c, i) => ({ ...c, role: roles[i] }));
      });
      return;
    }

    if (selectedCards.length >= maxCards) {
      alert(`이미 ${maxCards}장의 카드를 모두 고르셨습니다!`);
      return;
    }

    setSelectedCards(prev => [...prev, { id: cardId, role: roles[prev.length] }]);
  };

  const handleCheckDestiny = () => {
    if (selectedCards.length !== maxCards) return;
    
    const sortedSelections = [...selectedCards].sort((a, b) => roles.indexOf(a.role) - roles.indexOf(b.role));
    const sortedIds = sortedSelections.map(c => c.id).join(',');
    
    // 즉시 이동 (결과 페이지에서 로딩 애니메이션 처리)
    router.push(`/result?category=${cleanCategory}&spread=${spreadParam}&cards=${sortedIds}`);
  };

  if (!cleanCategory) return null;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full min-h-screen flex flex-col bg-slate-900 bg-fixed overflow-x-hidden select-none"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 8rem)'
      }}
    >
      {/* 상단 스테이지 */}
      <div className="w-full flex flex-col items-center justify-start relative z-10 border-b-4 border-indigo-900 bg-slate-900/50 shadow-[0_15px_50px_rgba(0,0,0,0.8)] pb-6 px-4">
        <button 
          onClick={() => setShowHomeModal(!showHomeModal)}
          className="fixed top-[calc(env(safe-area-inset-top)+0.85rem)] left-2 md:left-6 text-amber-400/50 active:text-amber-400 transition-colors z-[50] p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative w-full flex flex-col items-center px-12 md:px-16 mb-4 md:mb-6 min-h-[40px] md:min-h-[50px] justify-center">
          <AnimatePresence>
            {!showHomeModal ? (
              <motion.h1 
                key="title-default"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, position: 'absolute' }}
                transition={{ duration: 0.3 }}
                className="text-xl md:text-3xl font-extrabold tracking-widest text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] text-center break-keep w-full"
              >
                <span className="text-white">{displayCategory.replace(/[☀️❤️💰💼]/g, '')}</span>을(를) 위한 운명의 카드를 골라주세요
              </motion.h1>
            ) : (
              <motion.h1 
                key="title-confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, position: 'absolute' }}
                transition={{ duration: 0.3 }}
                className="text-xl md:text-2xl font-bold tracking-widest text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] text-center break-keep w-full"
              >
                질문 선택 화면으로 돌아가시겠습니까?
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        <div className="relative w-full max-w-md flex justify-center items-center mb-4 md:mb-8 min-h-[40px]">
          <AnimatePresence>
            {!showHomeModal ? (
              <motion.div
                key="desc-default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, position: 'absolute' }}
                transition={{ duration: 0.3 }}
                className="flex justify-center w-full"
              >
                <p className="text-sm md:text-base text-gray-300 font-light opacity-80 tracking-widest text-center line-clamp-2 leading-relaxed">
                  {selectedCards.length === maxCards
                    ? "당신의 운명이 선택되었습니다."
                    : `${maxCards > 1 ? `${maxCards}장` : '오늘'}의 카드를 신중하게 선택하세요 (${selectedCards.length}/${maxCards})`}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="desc-confirm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, position: 'absolute' }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 w-full justify-center"
              >
                <button
                  onClick={() => setShowHomeModal(false)}
                  className="px-6 py-2 rounded-full border border-gray-400/30 text-gray-300 text-sm md:text-base font-semibold active:bg-gray-400/20 transition-colors tracking-widest"
                >
                  아니오
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-sm md:text-base font-bold active:bg-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all tracking-widest"
                >
                  예
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 슬롯 영역 */}
        <div className={`relative w-full max-w-5xl mx-auto flex justify-center ${
          spreadParam === 'celtic' 
            ? 'grid grid-cols-5 gap-y-6 md:gap-y-10 gap-x-2 md:gap-x-4 place-items-center mt-4' 
            : spreadParam === 'today' 
              ? 'items-center h-[220px] md:h-[380px] min-h-[220px]' 
              : 'h-[220px] md:h-[380px] min-h-[220px]'
        }`}>
          {roles.map((role, idx) => {
            const isCeltic = spreadParam === 'celtic';
            const isToday = spreadParam === 'today';
            
            let posClass = "flex flex-col items-center";
            let posStyle = {};
            
            if (!isCeltic) {
              posClass += " absolute bottom-0 -translate-x-1/2";
              if (isToday) {
                posStyle = { left: "50%" };
              } else {
                const offset = isMobile ? 120 : 250;
                posStyle = { left: idx === 0 ? `calc(50% - ${offset}px)` : idx === 1 ? "50%" : `calc(50% + ${offset}px)` };
              }
            } else {
              posClass += " relative"; // For CSS grid placement
            }
            
            const slotWidthClass = isCeltic ? "w-[56px] h-[88px] md:w-[130px] md:h-[203px]" : "w-[96px] h-[150px] md:w-[165px] md:h-[270px]";
            const textSizeClass = isCeltic ? "text-[10px] md:text-sm mb-2" : "text-sm md:text-lg mb-6";

            const selection = selectedCards.find(c => c.role === role);
            const selectedCardData = selection ? cards.find(c => c.id === selection.id) : null;
            const isFilled = !!selection;

            return (
              <div
                key={role}
                className={posClass}
                style={posStyle}
              >
                <div className={`h-[24px] md:h-[32px] flex items-end ${textSizeClass}`}>
                  <span className={`text-white/50 font-semibold tracking-widest whitespace-nowrap uppercase text-center w-full block drop-shadow-sm`}>{role}</span>
                </div>
                <div className={`relative ${slotWidthClass} rounded-xl transition-all duration-700 flex items-center justify-center ${isFilled
                  ? 'border-transparent bg-transparent shadow-[0_0_80px_rgba(251,191,36,0.3)]'
                  : 'border-2 border-dashed border-white/20 bg-white/5 shadow-inner'
                  }`}>
                  {isFilled && selectedCardData && (
                    <motion.div
                      layoutId={`card-${selectedCardData.id}`}
                      onClick={() => handleCardClick(selectedCardData.id)}
                      className="relative cursor-pointer pointer-events-auto w-full h-full"
                      style={{ transformStyle: "preserve-3d" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {/* 카드 뒷면 (선택 후 슬롯에 꽂힌 상태에서는 뒷면으로 고정) */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-xl border border-amber-300 overflow-hidden bg-gradient-to-br from-[#191970] via-indigo-950 to-[#191970] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.7)]"
                      >
                        <div className="absolute inset-1 border border-[#D4AF37]/40 rounded-lg"></div>
                        <div className="w-8 h-8 border border-[#D4AF37]/50 rounded-full flex items-center justify-center rotate-45">
                          <div className="w-3 h-3 bg-[#D4AF37]/40 rounded-full"></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 덱 영역 */}
      <div className="w-full mt-4 md:mt-8 relative overflow-hidden flex-grow flex items-center">
        <div 
          className="w-full h-full overflow-x-auto scrollbar-hide flex items-center px-[45vw]" 
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
        >
          <div className="flex items-center space-x-[-35px] md:space-x-[-65px] py-16">
            <AnimatePresence>
              {cards.map((card) => (
                <TarotCardItem 
                  key={card.id}
                  card={card}
                  isSelected={selectedCards.some(c => c.id === card.id)}
                  onCardClick={handleCardClick}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCards.length === maxCards && (
          <motion.div
            className="fixed left-0 z-[600] w-full flex justify-center px-4"
            style={{ bottom: 'calc(4vh + env(safe-area-inset-bottom))' }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            <button
              onClick={handleCheckDestiny}
              className="relative w-full max-w-[320px] py-4 md:py-5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-[length:200%_auto] text-white font-extrabold text-xl md:text-2xl rounded-full border border-amber-300/50 shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              <span className="relative z-10 drop-shadow-md tracking-wide">
                운명 확인하기
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.main>
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
