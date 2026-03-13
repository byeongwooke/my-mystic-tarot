"use client";

import { useState, useEffect } from "react";
import { TAROT_DATA } from "@/constants/tarotData";
import { motion } from "framer-motion";
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

  // 셔플된 카드 배열 상태 추가 (최근 섞인 배열 저장)
  const [cards, setCards] = useState<typeof TAROT_DATA>([]);
  // 페이지네이션 (30장씩) 인덱스
  const [pageIndex, setPageIndex] = useState(0);

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
    setPageIndex(0);
  };

  const loadNextBatch = () => {
    // 다음 30장이 전체 개수(78장)를 초과하면 카드를 배열을 통째로 다시 섞어버림
    if ((pageIndex + 1) * 30 >= TAROT_DATA.length) {
      shuffleCards();
    } else {
      setPageIndex(prev => prev + 1);
    }
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

  // 모바일 성능 및 시각적 안정감을 위해 30장 단위로 잘라서 화면에 뿌립니다 (페이징 방식).
  const displayCards = cards.slice(pageIndex * 30, (pageIndex + 1) * 30);

  const handleCardClick = (cardId: number) => {
    // 결과 공개 중일 때는 클릭 방지
    if (isRevealing) return;

    // 카테고리 선택 확인
    if (!selectedCategory) {
      alert("먼저 어떤 운세가 궁금하신지 선택해 주세요.");
      return;
    }

    const isAlreadySelected = selectedCards.some(c => c.id === cardId);

    // 이미 선택된 카드를 다시 클릭하면 선택 해제 (역순이 아닌 해당 요소를 제거하고 역할 재정립)
    if (isAlreadySelected) {
      setSelectedCards(prev => {
        const remaining = prev.filter(c => c.id !== cardId);
        // 남은 카드들에 순차적으로 다시 역할 부여
        return remaining.map((c, i) => ({ ...c, role: roles[i] }));
      });
      return;
    }

    // 3장을 초과해서 선택하려 할 때 알림
    if (selectedCards.length >= 3) {
      alert("이미 3장의 카드를 모두 고르셨습니다!");
      return;
    }

    // 새 카드 선택 추가
    setSelectedCards(prev => [...prev, { id: cardId, role: roles[prev.length] }]);
  };

  const handleCheckDestiny = () => {
    if (selectedCards.length !== 3) return;

    setIsRevealing(true);

    // 선택된 3장의 카드를 과거, 현재, 미래 순서대로 정렬하여 추출
    const sortedSelections = [...selectedCards].sort((a, b) => roles.indexOf(a.role) - roles.indexOf(b.role));

    // 0.5초 간격으로 순차적 뒤집기 (3D Flip)
    sortedSelections.forEach((selection, idx) => {
      setTimeout(() => {
        setRevealedCards(prev => [...prev, selection.id]);
      }, idx * 500); // 0초, 0.5초, 1초
    });

    // 모든 카드가 뒤집히고 조금 더 대기한 후(약 2.5초) 결과 페이지로 이동
    setTimeout(() => {
      // 카테고리와 선택된 3장의 카드 ID 리스트를 Query Parameter로 변환
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

    // 오타나 한글 값이 들어올 경우를 대비한 매핑 객체
    const typeMap: Record<string, string> = {
      '연애운': 'love',
      '재물운': 'money',
      '직업운': 'work',
      '연애': 'love',
      '재물': 'money',
      '직업': 'work',
      'love': 'love',
      'money': 'money',
      'work': 'work'
    };

    // 타임라인 영문 매핑
    const timeMap: Record<string, "past" | "present" | "future"> = {
      '과거': 'past',
      '현재': 'present',
      '미래': 'future'
    };

    const mappedKey = typeMap[category] || 'work';
    const mappedTime = timeMap[roleStr] || 'future';

    // 데이터가 문자열이면 그대로 반환 (구버전 호환)
    if (typeof cardData.advice === 'string') {
      return cardData.advice;
    }

    // 과거(구버전) 단일 문자열 로직 호환 (타임라인 지원 전)
    if (typeof cardData.advice[mappedKey] === 'string') {
      return cardData.advice[mappedKey];
    }

    return cardData.advice[mappedKey]?.[mappedTime] || "";
  };

  const getInterpretationText = (cardData: any, category: string | null) => {
    if (!cardData || !cardData.interpretations || !category) return "";

    const typeMap: Record<string, string> = {
      '연애운': 'love',
      '재물운': 'money',
      '직업운': 'work',
      '연애': 'love',
      '재물': 'money',
      '직업': 'work',
      'love': 'love',
      'money': 'money',
      'work': 'work'
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
        paddingTop: 'calc(env(safe-area-inset-top) + 1rem)', // +5rem -> +1rem 으로 화면 상단 밀착
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 8rem)'
      }}
    >

      {/* 상단 스테이지 - 자연스러운 흐름 적용, 상하 패딩 대폭 압축 */}
      <div className="w-full flex flex-col items-center justify-start relative z-10 border-b-4 border-indigo-900 bg-slate-900/50 shadow-[0_15px_50px_rgba(0,0,0,0.8)] pt-2 md:pt-6 pb-8 px-4">

        {/* 최고 상단 텍스트 묶음: 폰트 사이즈 미세 조절 및 하단 여백 대폭 감소 */}
        <div className="flex flex-col items-center mb-3 md:mb-5 relative">
          <h1 className="text-2xl md:text-5xl font-extrabold tracking-widest text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] text-center">
            Mystic Tarot
          </h1>

          {/* 수동 카드 섞기 버튼 추가 */}
          <button
            onClick={() => {
              setSelectedCards([]); // 다시 섞을 땐 선택된 카드 초기화
              shuffleCards();
            }}
            className="mt-4 px-4 py-1.5 rounded-full border border-amber-500/30 text-amber-200 text-xs md:text-sm bg-black/40 hover:bg-amber-500/20 hover:border-amber-400 transition-all flex items-center gap-2"
          >
            <span className="text-base">✨</span> 다시 섞기
          </button>
        </div>

        {/* 운세 카테고리 버튼 */}
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

        {/* 3 슬롯 위치 표시기 */}
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
                {/* 슬롯 상단 텍스트 라벨 */}
                <span className="mb-4 text-white/50 text-sm md:text-lg font-semibold tracking-widest whitespace-nowrap">{role}</span>

                {/* 점선 슬롯 (1:1 스케일 크기 완벽 일치 및 Glow 전환) */}
                <div className={`relative w-[78px] h-[126px] md:w-[140px] md:h-[224px] rounded-xl transition-all duration-700 ${isFilled
                    ? 'border-transparent bg-transparent shadow-[0_0_80px_rgba(251,191,36,0.3)]'
                    : 'border-2 border-dashed border-white/20 bg-white/5 shadow-inner'
                  }`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 덱 영역 */}
      <div className="w-full h-[850px] md:h-[650px] mt-[180px] md:mt-[40px] mb-10 relative flex justify-center items-center z-20">
        {[...displayCards, { isDeckButton: true } as any].map((card, index) => {
          const isDeckButton = index === displayCards.length;

          // 모바일은 5열(grid-cols-5 역할), 데스크탑은 10열 (수학적 절대 좌표 그리드)
          const cols = isMobile ? 5 : 10;
          const cardWidth = isMobile ? 65 : 110;  // 간격 포함 (실제카드 너비 + 갭)
          const cardHeight = isMobile ? 105 : 170; // 간격 포함 (실제카드 높이 + 갭)

          const colIndex = index % cols;
          const rowIndex = Math.floor(index / cols);

          const centerCol = (cols - 1) / 2;
          const totalRows = Math.ceil((displayCards.length + 1) / cols);
          const centerRow = (totalRows - 1) / 2;

          const baseXNum = (colIndex - centerCol) * cardWidth;
          const baseYNum = (rowIndex - centerRow) * cardHeight;

          const baseX = `${baseXNum}px`;
          const finalYNum = baseYNum;
          const finalY = `${finalYNum}px`;

          // 덱 보충 버튼일 경우 렌더링
          if (isDeckButton) {
            // 전체 78장에서 현재 페이지까지 보여준 카드(30장 단위)를 빼서 남은 숫자를 구해요.
            const remainingCount = 78 - (pageIndex + 1) * 30;

            // 더 이상 남은 카드가 없으면 뭉치 버튼을 숨깁니다.
            if (remainingCount <= 0) return null;

            return (
              <motion.div
                key="deck-btn"
                className="absolute flex justify-center items-center z-20 pointer-events-auto"
                initial={{ x: baseX, y: finalY }}
                animate={{ x: baseX, y: finalY }}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  onClick={loadNextBatch}
                  className="w-[56px] h-[90px] md:w-[100px] md:h-[160px] cursor-pointer rounded-xl border border-amber-500/50 bg-black/40 flex flex-col items-center justify-center shadow-lg hover:bg-amber-500/20 transition-all group"
                >
                  <span className="text-2xl mb-1 md:mb-2 group-hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">🃏</span>
                  {/* 여기에 남은 카드 숫자가 표시됩니다! */}
                  <span className="text-[10px] md:text-sm text-amber-200 font-bold">
                    {remainingCount}장 더 보기
                  </span>
                </div>
              </motion.div>
            );
          }

          // 이하 일반 카드 렌더링 (card가 무조건 존재함)
          const validCard = card!;

          const selectionOpt = selectedCards.find(c => c.id === validCard.id);
          const isSelected = !!selectionOpt;
          const roleIndex = isSelected ? roles.indexOf(selectionOpt.role) : 0;

          const hoverY = `${finalYNum - 20}px`; // 호버 시 부드럽게 20px 상승
          const defaultZIndex = rowIndex * 100 + colIndex + 20;

          // 선택 시 이동할 목적지 좌푯값 계산
          const targetOffset = isMobile ? 95 : 180;
          const slotX = (roleIndex - 1) * targetOffset;

          // 슬롯 목적지 컨테이너 중심 보정 (marginTop 증가로 인한 도달 범위 확장)
          const slotY = isMobile ? "-780px" : "-600px"; 

          const isRevealed = revealedCards.includes(validCard.id);
          const angle = 0; // 격자 배열이므로 기울기 제거

          return (
            <motion.div
              key={validCard.id}
              className="absolute flex justify-center items-center pointer-events-none"
              initial={{ rotate: angle, x: baseX, y: finalY, zIndex: defaultZIndex }}
              animate={{
                rotate: isSelected ? 0 : angle,
                // 선택 시엔 슬롯 위치로, 아닐 땐 원래 자리로 복귀
                x: isSelected ? slotX : baseX,
                y: isSelected ? slotY : finalY,
                zIndex: isSelected ? 500 : defaultZIndex,
              }}
              whileHover={{
                // 호버 시 부가 팝업 상승
                y: isSelected ? slotY : hoverY,
                zIndex: isSelected ? 500 : defaultZIndex + 50,
              }}
              transition={{ type: "spring", stiffness: 280, damping: 25 }}
            >
              <motion.div
                onClick={() => handleCardClick(validCard.id)}
                className="relative cursor-pointer pointer-events-auto w-[56px] h-[90px] md:w-[100px] md:h-[160px]"
                // 크기 조절 및 3D 뒤집기
                initial={{ scale: 1, rotateY: 0 }}
                animate={{
                  scale: isSelected ? 1.4 : 1,
                  rotateY: isRevealed ? -180 : 0
                }}
                whileHover={{ scale: isSelected ? 1.4 : 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* 뒷면 (타로카드 무늬) - 기본 시점 */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-xl border border-[#D4AF37] transition-all duration-300 overflow-hidden bg-gradient-to-br from-[#191970] via-indigo-950 to-[#191970] flex items-center justify-center group ${isSelected && !isRevealed
                      ? "shadow-[0_0_25px_rgba(212,175,55,0.7)]"
                      : "shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
                    }`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="absolute inset-1 md:inset-1.5 border border-[#D4AF37]/40 rounded-lg"></div>
                  <div className="w-6 h-6 md:w-8 md:h-8 border border-[#D4AF37]/50 rounded-full flex items-center justify-center rotate-45 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-colors">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-[#D4AF37]/40 rounded-full group-hover:bg-[#D4AF37]/80"></div>
                  </div>
                </div>

                {/* 앞면 (결과 공개) - Y축으로 뒤집혀 있는 상태 */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-xl border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.8)] bg-slate-100 flex flex-col items-center justify-center overflow-hidden`}
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(-180deg)" }}
                >
                  <div className="absolute inset-1 border border-amber-500/30 rounded-lg"></div>
                  <div className="text-[10px] md:text-sm font-bold text-amber-900 text-center px-1 break-keep drop-shadow-sm">
                    {validCard.nameKr}
                  </div>
                  <div className="text-[8px] md:text-[10px] text-amber-700 mt-2 tracking-wide text-center px-1">
                    {validCard.keywords[0]}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* AI 로딩 스피너 (결과 대기 중) */}
      {isRevealing && (
        <div className="absolute inset-0 z-[700] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin shadow-[0_0_30px_rgba(251,191,36,0.5)]"></div>
          <p className="mt-8 text-xl md:text-2xl text-amber-300 font-semibold tracking-widest animate-pulse drop-shadow-lg text-center px-4">
            타로 마스터가 당신의 운명을 읽는 중...
          </p>
        </div>
      )}

      {/* 3장을 모두 고르면 하단에 "결과 확인버튼" 노출 */}
      {/* 바닥에서 둥둥 떠다니지 않게 버튼 생성 */}
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
          {/* 빛이 지나가는 쉬머(Shimmer) 효과를 위한 가상 요소 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>

          <span className="relative z-10 drop-shadow-md tracking-wide">
            나의 운명 확인하기
          </span>
        </button>
      </motion.div>
    </main>
  );
}
