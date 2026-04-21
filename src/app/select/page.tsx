"use client";

import React, { useState, useEffect, Suspense, useMemo, memo } from "react";
import { TarotBase } from "@/data/tarot/base";
import { CARDS } from "@/data/tarot/cards";
import { CELTIC_LAYOUT_INFO } from "@/constants/tarot";
import { getDailyCardCondition } from "@/utils/cardCondition";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { useUserSettings } from "@/hooks/useUserSettings";
import { getCardPool, drawCard } from "@/utils/tarotEngine";
import { db, doc, updateDoc, increment, getDocs, query, collection, where } from "@/lib/firebase";

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
  const condition = getDailyCardCondition(card.id);
  const filterStyle = {
    filter: `saturate(${120 - (condition.level * 10)}%) contrast(${95 + (condition.level * 5)}%)`
  };

  return (
    <div className="relative flex-shrink-0" style={{ perspective: "1500px" }}>
      {/* Placeholder - 카드 크기 일치화 (96x150 / 165x270) */}
      <div className="w-[96px] h-[150px] md:w-[165px] md:h-[270px] invisible" />

      {!isSelected && (
        <motion.div
          layoutId={`card-${card.id}`}
          onClick={() => onCardClick(card.id)}
          className="absolute inset-0 cursor-pointer pointer-events-auto"
          style={{ transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: 0.8, y: 50, rotateY: 0, boxShadow: "0px 10px 20px rgba(0,0,0,0.3)" }}
          whileInView={{
            scale: 1.25,
            zIndex: 150,
            transition: { type: "spring", stiffness: 150, damping: 25, zIndex: { duration: 0 } }
          }}
          viewport={{ amount: 0.2, margin: "-5% 0px -5% 0px" }}
          animate={{ opacity: 1, y: 0, rotateY: 0, boxShadow: "0px 15px 30px rgba(0,0,0,0.4)" }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{
            scale: 1.3,
            rotateY: -5,
            rotateX: 10,
            boxShadow: "20px 30px 50px rgba(0,0,0,0.6)",
            transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
          }}
          whileTap={{
            y: -40,
            scale: 1.35,
            rotateY: 15,
            rotateX: 5,
            boxShadow: "10px 40px 60px rgba(0,0,0,0.7)",
            zIndex: 200,
            transition: { zIndex: { duration: 0 }, duration: 0.8, ease: [0.4, 0, 0.2, 1] }
          }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          <div
            className="w-full h-full rounded-xl flex items-center justify-center overflow-hidden"
            style={{ backfaceVisibility: "hidden", ...filterStyle }}
          >
            <img
              src="/images/card_back.webp"
              alt="카드 뒷면"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] rounded-xl pointer-events-none border border-white/10 mix-blend-overlay"></div>
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
  const { user, identifiedProfile, loading, isAuthInitialized } = useAuth();
  const { settings } = useUserSettings();

  useEffect(() => {
    // 🚩 Logic Lock: Never act until the auth system has declared confirmation finished.
    if (!isAuthInitialized || loading) return; 

    // 프로필 식별 여부 확인 (Final Confirmation)
    if (!identifiedProfile) {
      if (pathname !== '/') {
        console.log("[AuthGuard] Confirmation finished. No profile found, redirecting.");
        router.replace('/');
      }
      return;
    }
  }, [router, pathname, identifiedProfile, loading, isAuthInitialized]);

  const cleanCategory = rawCategory ? rawCategory.replace(/[^\w]/g, '') : '';

  const [selectedCards, setSelectedCards] = useState<{ id: number; role: string; isReversed: boolean }[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [cards, setCards] = useState<TarotBase[]>([]);
  const [showHomeModal, setShowHomeModal] = useState(false);

  const spreadData = useMemo(() => {
    if (spreadParam === 'today' || spreadParam === 'worry') {
      return { limit: 1, roles: ["운명의 카드"] };
    } else if (spreadParam === 'celtic') {
      return {
        limit: 10,
        roles: ["현재 상황 (Core)", "장애와 과제 (Obstacle)", "의식과 목표 (Goal)", "무의식의 뿌리 (Foundation)", "지나온 과거 (Past)", "가까운 미래 (Near Future)", "본인의 태도 (Self)", "외부의 영향 (Environment)", "희망과 공포 (Hopes & Fears)", "최종 결과 (Outcome)"]
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
      'friendship': '대인관계🤝',
      'health': '건강/컨디션🌿',
      'worry': '고민뽑기⚖️'
    };
    return cleanCategory ? (categoryNameMap[cleanCategory] || '특별한 운세') : '';
  }, [cleanCategory]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 초기 셔플
    const poolIds = getCardPool(settings.includeMinor);
    const shuffledIds = [...poolIds];
    for (let i = shuffledIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledIds[i], shuffledIds[j]] = [shuffledIds[j], shuffledIds[i]];
    }
    setCards(shuffledIds.map(id => CARDS[id]));

    return () => {
      window.removeEventListener('resize', checkMobile);
      setShowHomeModal(false);
    };
  }, [settings.includeMinor]);

  // ✅ 진입 시 무조건 선택 내역 초기화 (Reset on Mount)
  useEffect(() => {
    setSelectedCards([]);
  }, []);

  // ✅ 질문/모드가 바뀌면 선택 내역 초기화
  useEffect(() => {
    setSelectedCards([]);
  }, [cleanCategory, spreadParam]);

  const handleCardClick = (cardId: number) => {
    if (!cleanCategory) return;

    const isAlreadySelected = selectedCards.some(c => c.id === cardId);
    if (isAlreadySelected) {
      if (spreadParam === 'celtic') return; // 캘틱크로스는 취소 불가
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

    const { id: cardIdDraw, isReversed: isReversedDraw } = drawCard(settings, cardId);
    const newSelection = { id: cardIdDraw, role: roles[selectedCards.length], isReversed: isReversedDraw };
    const newSelected = [...selectedCards, newSelection];
    setSelectedCards(newSelected);
  };

  const handleCheckDestiny = async () => {
    if (selectedCards.length !== maxCards) return;

    if (identifiedProfile && cleanCategory) {
      const complexCategories = ['love', 'money', 'work', 'friendship', 'health'];
      const fieldName = complexCategories.includes(cleanCategory) ? `${cleanCategory}_${spreadParam}` : cleanCategory;

      try {
        const profileId = `${identifiedProfile.displayName}_${identifiedProfile.pin}`;
        const profileRef = doc(db, "profiles", profileId);

        // 비동기로 DB 업데이트
        updateDoc(profileRef, {
          [`counts.${fieldName}`]: increment(1),
          lastReadingAt: new Date().toISOString()
        }).then(() => {
          console.log(`[Firebase DebugView] Syncing counts for: ${profileId}`);
        }).catch((err) => {
          console.error(`[Firebase DebugView Error] Failed to update: ${profileId}`, err);
        });
      } catch (err) {
        console.error("[Firebase Setup Error]", err);
      }
    }

    const sortedSelections = [...selectedCards].sort((a, b) => roles.indexOf(a.role) - roles.indexOf(b.role));
    const sortedIds = sortedSelections.map(c => c.id).join(',');
    const sortedReversed = sortedSelections.map(c => c.isReversed ? '1' : '0').join(',');

    // 즉시 이동 (결과 페이지에서 로딩 애니메이션 처리)
    router.push(`/result?category=${cleanCategory}&spread=${spreadParam}&cards=${sortedIds}&reversed=${sortedReversed}`);
  };

  if (!cleanCategory) {
    const categories = [
      { id: 'today', title: '오늘의 운세', icon: '☀️', desc: '오늘 하루, 나를 위한 카드의 조언' },
      { id: 'worry', title: '고민뽑기', icon: '⚖️', desc: '어떤 고민이든 명쾌한 결론' },
      { id: 'love', title: '애정운', icon: '❤️', desc: '현재의 사랑, 그리고 앞으로의 인연' },
      { id: 'money', title: '재물운', icon: '💰', desc: '금전의 흐름과 숨겨진 부의 기운' },
      { id: 'work', title: '직업운', icon: '💼', desc: '커리어의 방향과 성공을 위한 힌트' },
      { id: 'friendship', title: '대인관계', icon: '🤝', desc: '주변 사람들과의 소중한 인연과 소통' },
      { id: 'health', title: '건강운', icon: '🌿', desc: '몸과 마음의 에너지, 그리고 컨디션' }
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

        <button
          onClick={() => router.push('/settings/')}
          className="fixed top-[calc(env(safe-area-inset-top)+0.85rem)] right-2 md:right-6 text-emerald-400/50 active:text-emerald-400 transition-colors z-[50] p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.941l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="z-10 text-center mb-12 flex flex-col items-center"
        >
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] tracking-[0.2em]">혹시타로</h2>
          </div>
          <span className="text-emerald-500/80 tracking-[0.2em] text-sm md:text-base mb-2 uppercase font-medium">진정한 운명은 당신의 손끝에서 시작됩니다</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <span className="text-emerald-400 font-bold drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]">
              {identifiedProfile?.displayName || user?.displayName || "운명"}
            </span> 님의 선택
          </h1>
        </motion.div>

        <div className="z-10 w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={cat.id === 'today' ? `/select/?category=${cat.id}&spread=today` : `/spread/?category=${cat.id}`}
              className="w-full"
            >
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (idx * 0.1), duration: 0.6 }}
                whileTap={{ scale: 0.95 }}
                style={{ transform: 'translateZ(0)', willChange: 'backdrop-filter' }}
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
            </Link>
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
          onClick={() => {
            if (spreadParam === 'today') {
              router.push('/');
            } else {
              setShowHomeModal(!showHomeModal);
            }
          }}
          className="fixed top-[calc(env(safe-area-inset-top)+0.85rem)] left-2 md:left-6 text-amber-400/50 active:text-amber-400 transition-colors z-[50] p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => router.push('/settings/')}
          className="fixed top-[calc(env(safe-area-inset-top)+0.85rem)] right-2 md:right-6 text-emerald-400/50 active:text-emerald-400 transition-colors z-[50] p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.941l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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
                배열법 선택 화면으로 돌아가시겠습니까?
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
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm md:text-base text-gray-300 font-light opacity-80 tracking-widest text-center line-clamp-2 leading-relaxed">
                    {selectedCards.length === maxCards
                      ? "당신의 운명이 선택되었습니다."
                      : `${maxCards > 1 ? `${maxCards}장` : '운명'}의 카드를 신중하게 선택하세요`}
                  </p>
                  <div className="px-4 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs md:text-sm font-bold tracking-widest">
                    {selectedCards.length} / {maxCards}
                  </div>
                </div>
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
                  onClick={() => {
                    setShowHomeModal(false);
                    router.push(`/spread/?category=${cleanCategory}`);
                  }}
                  className="px-6 py-2 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-sm md:text-base font-bold active:bg-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all tracking-widest"
                >
                  예
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 슬롯 영역 */}
        <div className={`relative w-full max-w-4xl mx-auto gap-2 md:gap-6 lg:gap-10 ${spreadParam === 'celtic'
            ? 'grid grid-cols-4 lg:grid-cols-5 grid-rows-4 mt-4 overflow-visible place-items-center'
            : spreadParam === 'today'
              ? 'flex items-center justify-center h-[220px] md:h-[380px] min-h-[220px]'
              : 'flex items-center justify-center gap-4 md:gap-12 lg:gap-20 h-[220px] md:h-[380px] min-h-[220px]'
          }`}>
          {roles.map((role, idx) => {
            const isCeltic = spreadParam === 'celtic';
            const isToday = spreadParam === 'today';

            let posClass = "flex flex-col items-center justify-center transition-all duration-700";
            let posStyle: React.CSSProperties = { zIndex: 10 };

            if (isCeltic) {
              if (idx === 0) { posClass += " col-start-2 row-start-2"; }
              else if (idx === 1) { posClass += " col-start-2 row-start-2"; posStyle.transform = "rotate(90deg) scale(0.95)"; posStyle.zIndex = 11; }
              else if (idx === 2) { posClass += " col-start-2 row-start-3"; }
              else if (idx === 3) { posClass += " col-start-1 row-start-2"; }
              else if (idx === 4) { posClass += " col-start-2 row-start-1"; }
              else if (idx === 5) { posClass += " col-start-3 row-start-2"; }
              else if (idx === 6) { posClass += " col-start-4 lg:col-start-5 row-start-4"; }
              else if (idx === 7) { posClass += " col-start-4 lg:col-start-5 row-start-3"; }
              else if (idx === 8) { posClass += " col-start-4 lg:col-start-5 row-start-2"; }
              else if (idx === 9) { posClass += " col-start-4 lg:col-start-5 row-start-1"; }
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

                <div className={`relative ${slotWidthClass} rounded-xl transition-all duration-700 flex items-center justify-center`} style={{ perspective: "1500px" }}>
                  <div className={`absolute inset-0 rounded-xl transition-all duration-700 ${isFilled
                    ? 'border-transparent bg-transparent shadow-[0_0_80px_rgba(251,191,36,0.3)]'
                    : 'border-[1px] border-amber-500/30 bg-black/40 shadow-inner backdrop-blur-sm'
                    }`}
                    style={{ transform: 'translateZ(0)', willChange: 'backdrop-filter' }}
                  ></div>
                  {isCeltic && !isFilled && (
                    <span className="absolute text-amber-500/40 font-serif text-[10px] md:text-xs tracking-widest pointer-events-none z-10">
                      {romanNumerals[idx]}
                    </span>
                  )}
                  {isFilled && selectedCardData && (() => {
                    const condition = getDailyCardCondition(selectedCardData.id);
                    const filterStyle = {
                      filter: `saturate(${120 - (condition.level * 10)}%) contrast(${95 + (condition.level * 5)}%)`
                    };
                    return (
                      <motion.div
                        layoutId={`card-${selectedCardData.id}`}
                        className="absolute inset-0 cursor-pointer pointer-events-auto"
                        style={{ transformStyle: "preserve-3d" }}
                        initial={{ opacity: 0.3, rotateY: 180, boxShadow: "0px 30px 60px rgba(0,0,0,0.8)" }}
                        animate={{ opacity: 1, rotateY: 0, boxShadow: "0px 10px 20px rgba(0,0,0,0.4)" }}
                        whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5, boxShadow: "10px 20px 40px rgba(0,0,0,0.6)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30, opacity: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }}
                      >
                        <div
                          className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
                          style={{ backfaceVisibility: "hidden", ...filterStyle }}
                        >
                          <img
                            src="/images/card_back.webp"
                            alt="카드 뒷면"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] rounded-xl pointer-events-none border border-white/10 mix-blend-overlay"></div>
                        </div>
                      </motion.div>
                    );
                  })()}
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
      <Suspense fallback={null}>
        <SelectContent />
      </Suspense>
    </Suspense>
  );
}

