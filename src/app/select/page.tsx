"use client";

import React, { useState, useEffect, Suspense, useMemo, memo } from "react";
import { TAROT_BASE, TarotBase } from "@/data/tarot/base";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { doc, updateDoc, increment, getDocs, query, collection, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// 개별 카드 컴포넌트화하여 React.memo 적용 (불필요한 리렌더링 방지)
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get('category');
  const spreadParam = searchParams.get('spread') || 'basic';
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Loading 방어

    // 이름 판정 로직 통일
    const hasValidName = user?.displayName && !user.displayName.includes('호');

    if (!hasValidName) {
      if (pathname !== '/welcome') { // 중복 이동 방지
        router.replace('/welcome');
      }
      return;
    }

  }, [rawCategory, router, pathname, user, loading]);

  const cleanCategory = rawCategory ? rawCategory.replace(/[^\w]/g, '') : '';

  const [selectedCards, setSelectedCards] = useState<{ id: number; role: string; isReversed: boolean }[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [cards, setCards] = useState<TarotBase[]>([]);
  const [showHomeModal, setShowHomeModal] = useState(false);

  const spreadData = useMemo(() => {
    if (spreadParam === 'today') {
      return { limit: 1, roles: ["운명의 카드"] };
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
      'work': '직업운💼',
      'worry': '고민뽑기⚖️'
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
    setCards(shuffledIds.map(id => TAROT_BASE[id] || TAROT_BASE[0]));

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

    setSelectedCards(prev => [...prev, { id: cardId, role: roles[prev.length], isReversed: Math.random() < 0.5 }]);
  };

  const handleCheckDestiny = async () => {
    if (selectedCards.length !== maxCards) return;
    
    if (user?.displayName && cleanCategory) {
      const complexCategories = ['love', 'money', 'work'];
      const fieldName = complexCategories.includes(cleanCategory) ? `${cleanCategory}_${spreadParam}` : cleanCategory;
      
      try {
        const userQuery = query(collection(db, "users"), where("displayName", "==", user.displayName));
        const snap = await getDocs(userQuery);
        if (!snap.empty) {
          await updateDoc(doc(db, "users", snap.docs[0].id), {
            [`counts.${fieldName}`]: increment(1)
          });
        }
      } catch (err) {
        console.error(err);
      }
    }

    const sortedSelections = [...selectedCards].sort((a, b) => roles.indexOf(a.role) - roles.indexOf(b.role));
    const sortedIds = sortedSelections.map(c => `${c.id}${c.isReversed ? 'r' : ''}`).join(',');
    
    // 즉시 이동 (결과 페이지에서 로딩 애니메이션 처리)
    router.push(`/result?category=${cleanCategory}&spread=${spreadParam}&cards=${sortedIds}`);
  };

  if (!cleanCategory) {
    const categories = [
      { id: 'today', title: '오늘의 운세', icon: '☀️', desc: '오늘 하루, 나를 위한 카드의 조언' },
      { id: 'worry', title: '고민뽑기', icon: '⚖️', desc: '어떤 고민이든 명쾌한 결론' },
      { id: 'love', title: '애정운', icon: '❤️', desc: '현재의 사랑, 그리고 앞으로의 인연' },
      { id: 'money', title: '재물운', icon: '💰', desc: '금전의 흐름과 숨겨진 부의 기운' },
      { id: 'work', title: '직업운', icon: '💼', desc: '커리어의 방향과 성공을 위한 힌트' }
    ];

    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-900 bg-fixed p-6 select-none pt-[env(safe-area-inset-top)]"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/30 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 blur-[120px] rounded-full"></div>
        </div>

        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="z-10 text-center mb-12 flex flex-col items-center"
        >
          <span className="text-emerald-500/80 tracking-[0.2em] text-sm md:text-base mb-2 uppercase font-medium">진정한 운명은 당신의 손끝에서 시작됩니다</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]">{user?.displayName || "운명의 인도자"}</span> 님의 선택
          </h1>
        </motion.div>

        <div className="z-10 w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (idx * 0.1), duration: 0.6 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(cat.id === 'today' || cat.id === 'worry' ? `/select?category=${cat.id}&spread=today` : `/spread?category=${cat.id}`)}
              className="w-full relative flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl border-[0.5px] border-emerald-900/40 bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.3)] active:border-emerald-400/50 active:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-colors duration-300 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 to-transparent opacity-0 active:opacity-100 transition-opacity duration-300"></div>
              
              <span className="text-3xl md:text-4xl mb-3 drop-shadow-md z-10">{cat.icon}</span>
              <h2 className="text-xl md:text-2xl font-bold text-gray-200 mb-2 tracking-wide group-active:text-emerald-400 z-10">
                {cat.title}
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-light break-keep text-center leading-relaxed h-[2.5rem] flex items-center justify-center group-active:text-gray-300 z-10">
                {cat.desc}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full min-h-screen flex flex-col bg-slate-900 bg-fixed overflow-x-hidden select-none"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)',
        paddingBottom: '1rem'
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
                    : `${maxCards > 1 ? `${maxCards}장` : '운명'}의 카드를 신중하게 선택하세요 (${selectedCards.length}/${maxCards})`}
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
                  onClick={() => router.push('/select')}
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
            ? 'h-[440px] md:h-[650px] mt-4 overflow-visible' 
            : spreadParam === 'today' 
              ? 'items-center h-[220px] md:h-[380px] min-h-[220px]' 
              : 'h-[220px] md:h-[380px] min-h-[220px]'
        }`}>
          {roles.map((role, idx) => {
            const isCeltic = spreadParam === 'celtic';
            const isToday = spreadParam === 'today';
            
            let posClass = "flex flex-col items-center justify-center";
            let posStyle: React.CSSProperties = {};
            
            if (!isCeltic) {
              posClass += " absolute bottom-0 -translate-x-1/2";
              if (isToday) {
                posStyle = { left: "50%" };
              } else {
                const offset = isMobile ? 120 : 250;
                posStyle = { left: idx === 0 ? `calc(50% - ${offset}px)` : idx === 1 ? "50%" : `calc(50% + ${offset}px)` };
              }
            } else {
              posClass += " absolute";
              const cardW = isMobile ? 50 : 86;
              const cardH = isMobile ? 80 : 135;
              const gapX = isMobile ? 68 : 120;
              const gapY = isMobile ? 85 : 150;
              
              const crossCx = `calc(50% - ${gapX}px)`;
              const crossCy = `50%`;
              const pillarX = `calc(50% + ${gapX * 1.5}px)`;
              
              let left = '50%';
              let top = '50%';
              let transform = 'translate(-50%, -50%)';
              let zIndex = 10;
              
              if (idx === 0) {
                left = crossCx; top = crossCy; zIndex = 10;
              } else if (idx === 1) {
                left = crossCx; top = crossCy; 
                transform = 'translate(-50%, -50%) rotate(90deg)';
                zIndex = 11;
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
              posStyle = { left, top, transform, zIndex };
            }
            
            const slotWidthClass = isCeltic ? "w-[50px] h-[80px] md:w-[86px] md:h-[135px]" : "w-[96px] h-[150px] md:w-[165px] md:h-[270px]";
            const textSizeClass = isCeltic ? "hidden" : "text-sm md:text-lg mb-6";

            const selection = selectedCards.find(c => c.role === role);
            const selectedCardData = selection ? cards.find(c => c.id === selection.id) : null;
            const isFilled = !!selection;

            const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

            return (
              <div
                key={role}
                className={posClass}
                style={posStyle}
              >
                {!isCeltic && (
                  <div className={`h-[24px] md:h-[32px] flex items-end ${textSizeClass}`}>
                    <span className={`text-white/50 font-semibold tracking-widest whitespace-nowrap uppercase text-center w-full block drop-shadow-sm`}>{role}</span>
                  </div>
                )}
                
                <div className={`relative ${slotWidthClass} rounded-xl transition-all duration-700 flex items-center justify-center ${isFilled
                  ? 'border-transparent bg-transparent shadow-[0_0_80px_rgba(251,191,36,0.3)]'
                  : 'border-[1px] border-amber-500/30 bg-black/40 shadow-inner backdrop-blur-sm'
                  }`}>
                  {isCeltic && !isFilled && (
                    <span className="absolute text-amber-500/40 font-serif text-[10px] md:text-xs tracking-widest pointer-events-none">
                      {romanNumerals[idx]}
                    </span>
                  )}
                  {isFilled && selectedCardData && (
                    <motion.div
                      layoutId={`card-${selectedCardData.id}`}
                      onClick={() => handleCardClick(selectedCardData.id)}
                      className="relative cursor-pointer pointer-events-auto w-full h-full"
                      style={{ transformStyle: "preserve-3d" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div
                        className="absolute inset-0 w-full h-full rounded-xl border border-amber-300 overflow-hidden bg-gradient-to-br from-[#191970] via-indigo-950 to-[#191970] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.7)]"
                      >
                        <div className="absolute inset-1 border border-[#D4AF37]/40 rounded-lg"></div>
                        <div className="w-6 h-6 md:w-8 md:h-8 border border-[#D4AF37]/50 rounded-full flex items-center justify-center rotate-45">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-[#D4AF37]/40 rounded-full"></div>
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
