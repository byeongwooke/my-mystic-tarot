"use client";

import { useState, useEffect } from "react";
import { TAROT_DATA } from "@/constants/tarotData";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // id와 역할(과거, 현재, 미래)을 저장합니다.
  const [selectedCards, setSelectedCards] = useState<{ id: number; role: string }[]>([]);
  const roles = ["과거", "현재", "미래"];

  // 결과 연출 관련 상태 추가
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);

  // 운세 카테고리 상태 추가
  type CategoryType = "love" | "money" | "work" | null;
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);

  const [isMobile, setIsMobile] = useState(false);

  // 78장 풀 덱 상태
  const [cards, setCards] = useState<typeof TAROT_DATA>([]);

  // Fisher-Yates shuffle 알고리즘을 이용한 카드 섞기 함수
  const shuffleCards = () => {
    // 1. 0번부터 77번까지 '번호표' 78개를 먼저 만듭니다.
    const shuffledIds = Array.from({ length: 78 }, (_, i) => i);

    // 2. 이 번호표들을 마구 섞습니다.
    for (let i = shuffledIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
    }

    // 3. 섞인 번호표 순서대로 실제 카드 정보를 상자(setCards)에 담습니다.
    // (데이터가 부족해도 에러 안 나게 안전장치를 해뒀어요)
    const shuffledData = shuffledIds.map(id => TAROT_DATA[id] || TAROT_DATA[0]);
    setCards(shuffledData);
  };

  useEffect(() => {
    // 1. 화면 크기 체크 로직
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // 초기화
    window.addEventListener('resize', checkMobile);

    // 2. 컴포넌트가 처음 마운트(렌더링)될 때 카드 섞기 실행
    shuffleCards();

    return () => window.removeEventListener('resize', checkMobile);
  }, []); // 빈 배열([])을 넣으면 컴포넌트 생성 시 단 한 번만 실행됨

  // 78장 그룹화 로직 (8줄 시스템: 7*10 + 1*8)
  const groupedRows: (typeof TAROT_DATA)[] = [];
  const cardsPerRow = 10;
  for (let i = 0; i < cards.length; i += cardsPerRow) {
    groupedRows.push(cards.slice(i, i + cardsPerRow));
  }

  const handleCardClick = (cardId: number) => {
    if (isRevealing) return;
    if (!selectedCategory) {
      alert("먼저 어떤 운세가 궁금하신지 선택해 주세요.");
      return;
    }

    const isAlreadySelected = selectedCards.some(c => c.id === cardId);
    if (isAlreadySelected) {
      setSelectedCards(prev => {
        const remaining = prev.filter(c => c.id !== cardId);
        return remaining.map((c, i) => ({ ...c, role: roles[i] }));
      });
      return;
    }

    if (selectedCards.length >= 3) {
      alert("이미 3장의 카드를 모두 고르셨습니다!");
      return;
    }

    setSelectedCards(prev => [...prev, { id: cardId, role: roles[prev.length] }]);
  };

  const handleCheckDestiny = () => {
    if (selectedCards.length !== 3) return;
    setIsRevealing(true);
    const sortedSelections = [...selectedCards].sort((a, b) => roles.indexOf(a.role) - roles.indexOf(b.role));
    sortedSelections.forEach((selection, idx) => {
      setTimeout(() => {
        setRevealedCards(prev => [...prev, selection.id]);
      }, idx * 500);
    });
    setTimeout(() => {
      const sortedIds = sortedSelections.map(c => c.id).join(',');
      router.push(`/result?category=${selectedCategory}&cards=${sortedIds}`);
    }, 2800);
  };

  const resetTarot = () => {
    window.location.reload();
  };

  const getOverallAdvice = () => {
    if (selectedCards.length !== 3 || !selectedCategory) return "운명의 카드가 당신에게 전하는 메시지입니다.";
    const futureCard = selectedCards.find(c => c.role === "미래");
    if (!futureCard) return "운명의 카드가 당신에게 전하는 메시지입니다.";
    const cardData = TAROT_DATA.find(c => c.id === futureCard.id);
    if (!cardData) return "운명의 카드가 당신에게 전하는 메시지입니다.";
    return `"${getAdviceText(cardData, selectedCategory, '미래')}"`;
  };

  const getAdviceText = (cardData: any, category: string | null, roleStr: string) => {
    if (!cardData || !cardData.advice || !category) return "";
    const typeMap: Record<string, string> = {
      '연애운': 'love', '재물운': 'money', '직업운': 'work',
      '연애': 'love', '재물': 'money', '직업': 'work',
      'love': 'love', 'money': 'money', 'work': 'work'
    };
    const timeMap: Record<string, "past" | "present" | "future"> = {
      '과거': 'past', '현재': 'present', '미래': 'future'
    };
    const mappedKey = typeMap[category] || 'work';
    const mappedTime = timeMap[roleStr] || 'future';
    if (typeof cardData.advice === 'string') return cardData.advice;
    if (typeof cardData.advice[mappedKey] === 'string') return cardData.advice[mappedKey];
    return cardData.advice[mappedKey]?.[mappedTime] || "";
  };

  const getInterpretationText = (cardData: any, category: string | null) => {
    if (!cardData || !cardData.interpretations || !category) return "";
    const typeMap: Record<string, string> = {
      '연애운': 'love', '재물운': 'money', '직업운': 'work',
      '연애': 'love', '재물': 'money', '직업': 'work',
      'love': 'love', 'money': 'money', 'work': 'work'
    };
    const mappedKey = typeMap[category] || 'work';
    return cardData.interpretations[mappedKey] || "";
  };

  const categoryName = selectedCategory === 'love' ? '연애운'
    : selectedCategory === 'money' ? '재물운'
      : selectedCategory === 'work' ? '직업운' : '';

  return (
    <main
      className="w-full min-h-screen flex flex-col bg-slate-900 bg-fixed overflow-y-auto"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 1rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 8rem)'
      }}
    >
      <div className="w-full flex flex-col items-center justify-start relative z-10 border-b-4 border-indigo-900 bg-slate-900/50 shadow-[0_15px_50px_rgba(0,0,0,0.8)] pt-2 md:pt-6 pb-8 px-4">
        <div className="flex flex-col items-center mb-3 md:mb-5 relative">
          <h1 className="text-2xl md:text-5xl font-extrabold tracking-widest text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] text-center">
            Mystic Tarot
          </h1>
          <button
            onClick={() => {
              setSelectedCards([]);
              shuffleCards();
            }}
            className="mt-4 px-4 py-1.5 rounded-full border border-amber-500/30 text-amber-200 text-xs md:text-sm bg-black/40 hover:bg-amber-500/20 hover:border-amber-400 transition-all flex items-center gap-2"
          >
            <span className="text-base">✨</span> 다시 섞기
          </button>
        </div>

        <p className="text-sm md:text-base text-gray-300 font-light opacity-80 mb-3 md:mb-4 tracking-widest text-center">어떤 운세가 궁금하신가요?</p>
        <div className="flex gap-3 justify-center mb-5 z-50 pointer-events-auto">
          {[
            { id: 'love', label: '연애운 ❤️' },
            { id: 'money', label: '재물운 💰' },
            { id: 'work', label: '직업운 💼' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CategoryType)}
              disabled={selectedCards.length > 0}
              className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full border transition-all text-sm md:text-base font-medium ${selectedCategory === cat.id
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                  : 'bg-black/40 border-amber-500/30 text-amber-100/60 hover:bg-black/60 hover:border-amber-400/50'
                } disabled:opacity-50`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="text-sm md:text-base text-gray-300 font-light opacity-80 tracking-widest max-w-md line-clamp-2 leading-relaxed text-center mb-6 md:mb-10">
          {selectedCards.length === 3
            ? "당신의 운명이 선택되었습니다. 아래 버튼을 눌러 확인하세요."
            : `당신의 타로 카드를 선택하세요 (${selectedCards.length}/3)`}
        </p>

        <div className="relative w-full max-w-4xl h-[180px] md:h-[280px] min-h-[180px] flex justify-center">
          {roles.map((role, idx) => {
            const offset = isMobile ? 95 : 180;
            const leftPos = idx === 0 ? `calc(50% - ${offset}px)` : idx === 1 ? "50%" : `calc(50% + ${offset}px)`;
            const isFilled = selectedCards.some(c => c.role === role);
            return (
              <div
                key={role}
                className="absolute bottom-0 flex flex-col items-center -translate-x-1/2"
                style={{ left: leftPos }}
              >
                <span className="mb-4 text-white/50 text-sm md:text-lg font-semibold tracking-widest whitespace-nowrap">{role}</span>
                <div className={`relative w-[78px] h-[126px] md:w-[140px] md:h-[224px] rounded-xl transition-all duration-700 ${isFilled
                    ? 'border-transparent bg-transparent shadow-[0_0_80px_rgba(251,191,36,0.3)]'
                    : 'border-2 border-dashed border-white/20 bg-white/5 shadow-inner'
                  }`} />
              </div>
            );
          })}

          {/* 카드 덱 렌더링 - 슬롯 컨테이너의 좌표계에 종속시켜 정밀한 흡착 지원 */}
          <div className="absolute top-0 left-1/2 w-0 h-0 pointer-events-none">
            <AnimatePresence>
              {groupedRows.map((row, rowIdx) => (
                row.map((card, colIdx) => {
                  const centerCol = (row.length - 1) / 2;
                  const overlap = isMobile ? 28 : 45; 
                  const baseX = (colIdx - centerCol) * overlap;

                  const selectionOpt = selectedCards.find(c => c.id === card.id);
                  const isSelected = !!selectionOpt;
                  const roleIndex = isSelected ? roles.indexOf(selectionOpt.role) : 0;
                  
                  // 목표 X 좌표 (슬롯 수평 위치)
                  const targetOffset = isMobile ? 95 : 180;
                  const slotX = (roleIndex - 1) * targetOffset; 
                  
                  // 목표 Y 좌표 (슬롯 수직 위치 - 고정 절대값)
                  // 모바일 h-180 컨테이너 기준, h-126 박스의 정중앙은 약 117px 지점
                  const slotY = isMobile ? 117 : 168; 
                  
                  // 시작 Y 좌표 (덱 그리드 위치 - 슬롯 컨테이너 상단으로부터 하단으로 오프셋)
                  const rowHeight = isMobile ? 108 : 180;
                  const deckStartOffsetY = isMobile ? 400 : 550;
                  const baseY = deckStartOffsetY + (rowIdx * rowHeight);

                  const isRevealed = revealedCards.includes(card.id);

                  return (
                    <motion.div
                      key={card.id}
                      layout
                      className="absolute flex justify-center items-center"
                      style={{ transformOrigin: 'center' }}
                      initial={{ opacity: 0, scale: 0.8, x: baseX, y: baseY }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        x: isSelected ? slotX : baseX,
                        y: isSelected ? slotY : baseY,
                        zIndex: isSelected ? 500 : 20 + colIdx,
                        rotate: isSelected ? 0 : (colIdx - centerCol) * 2,
                      }}
                      whileHover={{ 
                        y: isSelected ? slotY : baseY - 15,
                        zIndex: isSelected ? 500 : 100,
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: isSelected ? 250 : 300, 
                        damping: 25,
                        layout: { duration: 0.3 }
                      }}
                    >
                      <motion.div
                        onClick={() => handleCardClick(card.id)}
                        className="relative cursor-pointer pointer-events-auto w-[64px] h-[100px] md:w-[110px] md:h-[180px]"
                        style={{ transformStyle: "preserve-3d" }}
                        animate={{
                          rotateY: isRevealed ? -180 : 0,
                          scale: isSelected ? 1.3 : 1
                        }}
                        whileHover={{ scale: isSelected ? 1.3 : 1.05 }}
                      >
                        <div
                          className={`absolute inset-0 w-full h-full rounded-xl border border-[#D4AF37] transition-all duration-300 overflow-hidden bg-gradient-to-br from-[#191970] via-indigo-950 to-[#191970] flex items-center justify-center group ${isSelected && !isRevealed
                              ? "shadow-[0_0_25px_rgba(212,175,55,0.7)] border-amber-300 scale-105"
                              : "shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
                            }`}
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <div className="absolute inset-1 md:inset-1.5 border border-[#D4AF37]/40 rounded-lg"></div>
                          <div className="w-6 h-6 md:w-8 md:h-8 border border-[#D4AF37]/50 rounded-full flex items-center justify-center rotate-45">
                            <div className="w-2 h-2 md:w-3 md:h-3 bg-[#D4AF37]/40 rounded-full"></div>
                          </div>
                        </div>
                        <div
                          className={`absolute inset-0 w-full h-full rounded-xl border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.8)] bg-slate-100 flex flex-col items-center justify-center overflow-hidden`}
                          style={{ backfaceVisibility: "hidden", transform: "rotateY(-180deg)" }}
                        >
                          <div className="absolute inset-1 border border-amber-500/30 rounded-lg"></div>
                          <div className="text-[10px] md:text-sm font-bold text-amber-900 text-center px-1 break-keep">
                            {card.nameKr}
                          </div>
                          <div className="text-[8px] md:text-[10px] text-amber-700 mt-2 tracking-wide text-center px-1">
                            {card.keywords[0]}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })
              ))}
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

      <motion.div
        className="absolute bottom-[10vh] md:bottom-[12vh] z-[600] w-full flex justify-center px-4"
        initial={{ y: 80, opacity: 0, scale: 0.9 }}
        animate={{
          y: selectedCards.length === 3 && !isRevealing ? 0 : 80,
          opacity: selectedCards.length === 3 && !isRevealing ? 1 : 0,
          scale: selectedCards.length === 3 && !isRevealing ? 1 : 0.9
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 20,
          delay: selectedCards.length === 3 && !isRevealing ? 0.4 : 0
        }}
        style={{ pointerEvents: selectedCards.length === 3 && !isRevealing ? 'auto' : 'none' }}
      >
        <button
          onClick={handleCheckDestiny}
          className="relative w-full max-w-[320px] py-4 md:py-5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-[length:200%_auto] text-white font-extrabold text-xl md:text-2xl rounded-full border border-amber-300/50 shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          <span className="relative z-10 drop-shadow-md tracking-wide">
            나의 운명 확인하기
          </span>
        </button>
      </motion.div>
    </main>
  );
}
