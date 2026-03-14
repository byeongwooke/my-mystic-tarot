"use client";

import { useState, useEffect, Suspense } from "react";
import { TAROT_DATA } from "@/constants/tarotData";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

function SelectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get('category');
  
  // 만약 카테고리가 없다면 메인으로 튕겨냅니다
  useEffect(() => {
    if (!rawCategory) {
      router.replace('/');
    }
  }, [rawCategory, router]);

  const [selectedCards, setSelectedCards] = useState<{ id: number; role: string }[]>([]);
  const roles = rawCategory === 'today' ? ["오늘의 카드"] : ["과거", "현재", "미래"];
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cards, setCards] = useState<typeof TAROT_DATA>([]);

  // 카테고리 이름 변환
  const categoryNameMap: Record<string, string> = {
    'today': '오늘의 운세☀️',
    'love': '애정운❤️',
    'money': '재물운💰',
    'work': '직업운💼'
  };
  const displayCategory = rawCategory ? (categoryNameMap[rawCategory] || '특별한 운세') : '';

  // Fisher-Yates shuffle
  const shuffleCards = () => {
    const shuffledIds = Array.from({ length: 78 }, (_, i) => i);
    for (let i = shuffledIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
    }
    const shuffledData = shuffledIds.map(id => TAROT_DATA[id] || TAROT_DATA[0]);
    setCards(shuffledData);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    shuffleCards();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCardClick = (cardId: number) => {
    if (isRevealing || !rawCategory) return;

    const isAlreadySelected = selectedCards.some(c => c.id === cardId);
    if (isAlreadySelected) {
      setSelectedCards(prev => {
        const remaining = prev.filter(c => c.id !== cardId);
        return remaining.map((c, i) => ({ ...c, role: roles[i] }));
      });
      return;
    }

    const maxCards = rawCategory === 'today' ? 1 : 3;
    if (selectedCards.length >= maxCards) {
      alert(`이미 ${maxCards}장의 카드를 모두 고르셨습니다!`);
      return;
    }

    setSelectedCards(prev => [...prev, { id: cardId, role: roles[prev.length] }]);
  };

  const handleCheckDestiny = () => {
    const requiredCards = rawCategory === 'today' ? 1 : 3;
    if (selectedCards.length !== requiredCards) return;
    setIsRevealing(true);
    const sortedSelections = [...selectedCards].sort((a, b) => roles.indexOf(a.role) - roles.indexOf(b.role));
    sortedSelections.forEach((selection, idx) => {
      setTimeout(() => {
        setRevealedCards(prev => [...prev, selection.id]);
      }, idx * 500);
    });
    setTimeout(() => {
      const sortedIds = sortedSelections.map(c => c.id).join(',');
      router.push(`/result?category=${rawCategory}&cards=${sortedIds}`);
    }, 2800);
  };

  if (!rawCategory) return null;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full min-h-screen flex flex-col bg-slate-900 bg-fixed overflow-x-hidden"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 1rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 8rem)'
      }}
    >
      {/* 상단 스테이지 */}
      <div className="w-full flex flex-col items-center justify-start relative z-10 border-b-4 border-indigo-900 bg-slate-900/50 shadow-[0_15px_50px_rgba(0,0,0,0.8)] pt-2 md:pt-6 pb-8 px-4">
        <div className="flex flex-col items-center mb-6 md:mb-10 mt-4 md:mt-2 relative">
          <h1 className="text-xl md:text-3xl font-extrabold tracking-widest text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] text-center break-keep">
            <span className="text-white">{displayCategory.replace(/[☀️❤️💰💼]/g, '')}</span>을(를) 위한 운명의 카드를 골라주세요
          </h1>
        </div>

        <p className="text-sm md:text-base text-gray-300 font-light opacity-80 tracking-widest max-w-md line-clamp-2 leading-relaxed text-center mb-6 md:mb-10 min-h-[40px]">
          {selectedCards.length === (rawCategory === 'today' ? 1 : 3)
            ? "당신의 운명이 선택되었습니다."
            : `${rawCategory === 'today' ? '오늘' : '3장'}의 카드를 신중하게 선택하세요 (${selectedCards.length}/${rawCategory === 'today' ? 1 : 3})`}
        </p>

        {/* 슬롯 영역 - 카드 크기에 맞춰 확장 */}
        <div className={`relative w-full max-w-5xl h-[220px] md:h-[380px] min-h-[220px] flex justify-center mx-auto ${rawCategory === 'today' ? 'items-center' : ''}`}>
          {roles.map((role, idx) => {
            let leftPos = "50%";
            if (rawCategory !== 'today') {
              const offset = isMobile ? 120 : 250;
              leftPos = idx === 0 ? `calc(50% - ${offset}px)` : idx === 1 ? "50%" : `calc(50% + ${offset}px)`;
            }
            
            const selection = selectedCards.find(c => c.role === role);
            const selectedCardData = selection ? cards.find(c => c.id === selection.id) : null;
            const isFilled = !!selection;

            return (
              <div
                key={role}
                className="absolute bottom-0 flex flex-col items-center -translate-x-1/2"
                style={{ left: leftPos }}
              >
                <span className="mb-6 text-white/50 text-sm md:text-lg font-semibold tracking-widest whitespace-nowrap uppercase">{role}</span>
                <div className={`relative w-[96px] h-[150px] md:w-[165px] md:h-[270px] rounded-xl transition-all duration-700 flex items-center justify-center ${isFilled
                  ? 'border-transparent bg-transparent shadow-[0_0_80px_rgba(251,191,36,0.3)]'
                  : 'border-2 border-dashed border-white/20 bg-white/5 shadow-inner'
                  }`}>
                  {isFilled && selectedCardData && (
                    <motion.div
                      layoutId={`card-${selectedCardData.id}`}
                      onClick={() => handleCardClick(selectedCardData.id)}
                      className="relative cursor-pointer pointer-events-auto w-full h-full"
                      style={{ transformStyle: "preserve-3d" }}
                      animate={{
                        rotateY: revealedCards.includes(selectedCardData.id) ? -180 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {/* 카드 뒷면 */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-xl border border-amber-300 overflow-hidden bg-gradient-to-br from-[#191970] via-indigo-950 to-[#191970] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.7)]"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div className="absolute inset-1 border border-[#D4AF37]/40 rounded-lg"></div>
                        <div className="w-8 h-8 border border-[#D4AF37]/50 rounded-full flex items-center justify-center rotate-45">
                          <div className="w-3 h-3 bg-[#D4AF37]/40 rounded-full"></div>
                        </div>
                      </div>
                      {/* 카드 앞면 */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-xl border-2 border-amber-400/50 shadow-[0_0_25px_rgba(251,191,36,0.5)] bg-indigo-950 flex flex-col items-center justify-center overflow-hidden"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(-180deg)" }}
                      >
                        {selectedCardData.id <= 21 ? (
                          <>
                            <img
                              src={`/images/cards/${selectedCardData.id}.webp`}
                              alt={selectedCardData.nameKr}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                            {/* 금색 네임텍 레이어 */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-2 px-1">
                              <div className="text-[10px] md:text-sm font-bold text-amber-400 text-center drop-shadow-md tracking-tighter">
                                {selectedCardData.nameKr}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-1 border border-amber-500/20 rounded-lg"></div>
                            <div className="text-[10px] md:text-sm font-bold text-amber-200 text-center px-2 break-keep drop-shadow-sm">
                              {selectedCardData.nameKr}
                            </div>
                            <div className="text-[8px] md:text-[10px] text-amber-500/60 mt-2 tracking-widest uppercase">
                              {selectedCardData.name}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 덱 영역 - 파노라마 수평 스크롤 (웅장한 스케일) */}
      <div className="w-full mt-4 md:mt-8 relative overflow-hidden flex-grow flex items-center">
        <div 
          className="w-full h-full overflow-x-auto scrollbar-hide flex items-center px-[45vw]" 
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
        >
          <div className="flex items-center space-x-[-35px] md:space-x-[-65px] py-16">
            <AnimatePresence>
              {cards.map((card) => {
                const isSelected = selectedCards.some(c => c.id === card.id);
                
                return (
                  <div key={card.id} className="relative flex-shrink-0 perspective-1000">
                    {/* Placeholder - 카드 크기 일치화 (96x150 / 165x270) */}
                    <div className="w-[96px] h-[150px] md:w-[165px] md:h-[270px] invisible" />
                    
                    {!isSelected && (
                      <motion.div
                        layoutId={`card-${card.id}`}
                        onClick={() => handleCardClick(card.id)}
                        className="absolute inset-0 cursor-pointer pointer-events-auto"
                        style={{ transformStyle: "preserve-3d" }}
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        whileInView={{ 
                          scale: 1.25,
                          zIndex: 150,
                          transition: { type: "spring", stiffness: 150, damping: 25 }
                        }}
                        viewport={{ amount: 0.2, margin: "-5% 0px -5% 0px" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        whileHover={{ 
                          y: -40, 
                          scale: 1.35,
                          zIndex: 100 
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 150, 
                          damping: 25 
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
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {isRevealing && (
        <div className="absolute inset-0 z-[700] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin shadow-[0_0_30px_rgba(251,191,36,0.5)]"></div>
          <p className="mt-8 text-xl md:text-2xl text-amber-300 font-semibold tracking-widest animate-pulse drop-shadow-lg text-center px-4">
            타로 마스터가 당신의 운명을 읽는 중...
          </p>
        </div>
      )}

      <AnimatePresence>
        {selectedCards.length === (rawCategory === 'today' ? 1 : 3) && !isRevealing && (
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
