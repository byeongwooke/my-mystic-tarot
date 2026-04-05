"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getDailyCardCondition } from "@/utils/cardCondition";

export interface TarotCardInfo {
  cardId: number;
  nameKr: string;
  role: string;
  isReversed: boolean;
  advice: string;
  interpretation: string;
  keywords: string[];
  // Metadata for score display
  polarity?: "positive" | "negative";
  score?: number;
  warningScore?: number;
}

interface TarotResultViewProps {
  displayName: string;
  categoryName: string;
  category: string;
  spread: string;
  cardsInfo: TarotCardInfo[];
  overallAdvice: string;
  onCardClick?: (id: number) => void;
}

const CELTIC_LAYOUT_INFO = [
  { labelKr: "현재 상황" },
  { labelKr: "장애와 과제" },
  { labelKr: "의식과 목표" },
  { labelKr: "무의식의 뿌리" },
  { labelKr: "지나온 과거" },
  { labelKr: "가까운 미래" },
  { labelKr: "본인의 태도" },
  { labelKr: "외부의 영향" },
  { labelKr: "희망과 공포" },
  { labelKr: "최종 결과" },
];

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

const ResultCardItem = memo(({
  cardId,
  nameKr,
  role,
  isLarge,
  isCeltic,
  isActive,
  isReversed,
  onClick,
  idx
}: {
  cardId: number,
  nameKr: string,
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
  const condition = getDailyCardCondition(cardId);
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
        <img
          src={`/images/cards/${cardId}.webp`}
          alt={nameKr}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isReversed ? 'rotate-180' : ''}`}
        />
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

export default function TarotResultView({
  displayName,
  categoryName,
  category,
  spread,
  cardsInfo,
  overallAdvice,
  onCardClick
}: TarotResultViewProps) {
  const [isGridFolded, setIsGridFolded] = useState(false);

  return (
    <div className="w-full max-w-4xl px-4 md:px-8 mt-6 md:mt-12 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-5xl font-extrabold text-amber-400 mb-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] text-center break-keep leading-relaxed"
      >
        <span className="text-emerald-400 font-bold">{displayName}</span>님의 {categoryName} 결과
      </motion.h1>

      <div className="mb-6 md:mb-10 mt-2 min-h-[60px] md:min-h-[100px] flex items-center justify-center w-full max-w-4xl px-2">
        {category === 'worry' && cardsInfo?.[0] ? (
          (() => {
            const isStop = cardsInfo[0]?.polarity === 'negative';
            return (
              <AnimatePresence mode="wait">
                <motion.div
                  key={'worry-score'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center gap-4 text-center w-full"
                >
                  <div className={`text-4xl md:text-6xl font-black tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${!isStop ? 'text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.5)]' : 'text-rose-600 drop-shadow-[0_0_35px_rgba(225,29,72,1)]'}`}>
                    {!isStop ? 'YES / GO!' : 'NO / STOP'}
                  </div>
                  <div className="text-amber-300 font-bold tracking-widest text-xs md:text-sm border border-amber-500/50 px-3 py-1 rounded-full bg-amber-500/10">
                    마스터의 한마디
                  </div>
                  <p className="text-amber-100/90 tracking-widest text-base md:text-2xl font-serif italic drop-shadow-md break-keep leading-loose px-2 md:px-8 mt-2">
                    "{cardsInfo?.[0]?.advice}"
                  </p>
                </motion.div>
              </AnimatePresence>
            );
          })()
        ) : spread === 'today' && cardsInfo?.[0] ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={'today-score'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center text-center w-full"
            >
              <div className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-700 drop-shadow-[0_0_40px_rgba(251,191,36,0.5)] py-4">
                오늘의 운세 점수: {cardsInfo[0]?.isReversed ? cardsInfo[0]?.warningScore?.toFixed(1) : cardsInfo[0]?.score?.toFixed(1)}점
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-amber-300 tracking-widest text-center text-base md:text-2xl font-serif italic drop-shadow-md break-keep leading-loose px-4"
            >
              {overallAdvice}
            </motion.p>
          </AnimatePresence>
        )}
      </div>

      {spread === 'celtic' ? (
        <div className="w-full flex flex-col items-center pb-20 px-4 md:px-0">
          {cardsInfo[9] && (
            <div className="w-full max-w-4xl mx-auto mb-8 p-6 md:p-10 bg-emerald-900/20 rounded-2xl border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-sm">
              <h3 className="text-emerald-400 text-sm md:text-base mb-4 font-bold tracking-widest text-center uppercase">최종 운명의 결론</h3>
              <p className="text-white text-lg md:text-2xl text-center leading-relaxed font-serif break-keep">
                "{cardsInfo?.[9]?.interpretation}"
              </p>
            </div>
          )}

          <button
            onClick={() => setIsGridFolded(!isGridFolded)}
            className="w-full py-4 text-xs md:text-sm text-gray-400 hover:text-emerald-400 underline underline-offset-4 mb-4 transition-colors tracking-widest text-center"
          >
            {isGridFolded ? "배열도 펼쳐보기" : "배열도 접기"}
          </button>

          <motion.div
            initial={false}
            animate={{
              height: isGridFolded ? 0 : 'auto',
              opacity: isGridFolded ? 0 : 1,
              marginBottom: isGridFolded ? 0 : 48,
              marginTop: isGridFolded ? 0 : 16
            }}
            className="relative w-full max-w-4xl mx-auto grid grid-cols-4 lg:grid-cols-5 grid-rows-4 gap-2 md:gap-6 lg:gap-10 place-items-center overflow-visible"
          >
            {cardsInfo?.map((item, idx) => {
              let gridPos = "";
              let transform = "";
              let zIndex = 10;
              if (idx === 0) gridPos = "col-start-2 row-start-2";
              else if (idx === 1) { gridPos = "col-start-2 row-start-2"; transform = "rotate(90deg) scale(0.95)"; zIndex = 11; }
              else if (idx === 2) gridPos = "col-start-2 row-start-3";
              else if (idx === 3) gridPos = "col-start-1 row-start-2";
              else if (idx === 4) gridPos = "col-start-2 row-start-1";
              else if (idx === 5) gridPos = "col-start-3 row-start-2";
              else if (idx === 6) gridPos = "col-start-4 lg:col-start-5 row-start-4";
              else if (idx === 7) gridPos = "col-start-4 lg:col-start-5 row-start-3";
              else if (idx === 8) gridPos = "col-start-4 lg:col-start-5 row-start-2";
              else if (idx === 9) gridPos = "col-start-4 lg:col-start-5 row-start-1";
              return (
                <div key={idx} className={`transition-all duration-700 flex items-center justify-center ${gridPos}`} style={{ transform, zIndex }}>
                  <ResultCardItem
                    cardId={item.cardId}
                    nameKr={item.nameKr}
                    role={item.role}
                    isLarge={false}
                    isCeltic={true}
                    idx={idx}
                    isReversed={item.isReversed}
                    onClick={() => onCardClick?.(item.cardId)}
                  />
                </div>
              );
            })}
          </motion.div>

          {/* 종합해석 섹션 */}
          <div className="w-full max-w-4xl mt-12 mb-6 p-8 md:p-14 bg-[#111] rounded-3xl border-[0.5px] border-amber-900/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
            <h2 className="text-3xl md:text-4xl font-serif text-amber-400/80 mb-12 text-center italic tracking-widest border-b border-amber-900/30 pb-6 relative z-10 drop-shadow-md">종합해석</h2>
            <div className="space-y-6 md:space-y-10 text-amber-50/90 leading-loose text-justify break-keep text-[15px] md:text-lg font-serif relative z-10">
              {cardsInfo?.map((card, idx) => (
                <p key={idx} className="flex flex-col md:flex-row gap-2">
                   <span className="text-emerald-400 font-bold shrink-0 md:min-w-[140px]">[{idx + 1}. {CELTIC_LAYOUT_INFO[idx]?.labelKr}]</span>
                   <span>{card.interpretation}</span>
                </p>
              ))}
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="w-full max-w-4xl space-y-4 md:space-y-6 mt-16 mb-16">
            <h3 className="text-xl md:text-2xl text-amber-500 font-bold mb-6 tracking-widest border-b border-amber-500/30 pb-4">운명의 근거 (상세 정보)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {cardsInfo?.map((card, idx) => (
                <div key={idx} className="bg-black/40 p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-300 font-bold text-xs bg-white/5 px-2 py-0.5 rounded">[{idx + 1}]</span>
                    <span className="text-gray-300 text-xs tracking-widest uppercase">{CELTIC_LAYOUT_INFO[idx]?.labelKr}</span>
                  </div>
                  <div className="text-white font-bold text-base md:text-lg tracking-wider mb-2">
                    {card.nameKr} {card.isReversed ? <span className="text-amber-500/80 text-sm ml-1">(역방향)</span> : <span className="text-emerald-400 text-sm ml-1">(정방향)</span>}
                  </div>
                  <div className="text-emerald-400/80 text-sm md:text-sm leading-relaxed break-keep font-serif italic">
                    {card.keywords.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full flex justify-center gap-4 md:gap-12 lg:gap-20 mb-16 md:mb-24 px-2">
            {cardsInfo?.map((item, idx) => (
              <ResultCardItem
                key={idx}
                cardId={item.cardId}
                nameKr={item.nameKr}
                role={item.role}
                isLarge={spread === 'today'}
                isReversed={item.isReversed}
                onClick={() => onCardClick?.(item.cardId)}
              />
            ))}
          </div>

          <div className="w-full max-w-3xl flex flex-col gap-10 md:gap-16">
            {(spread === 'spread3' ? [0, 1, 2] : cardsInfo).map((_, idx) => {
              const item = spread === 'spread3' ? cardsInfo[idx] : _ as TarotCardInfo;
              
              // Placeholder logic for missing cards in spread3
              const isPlaceholder = spread === 'spread3' && !item;
              const role = isPlaceholder 
                ? (idx === 0 ? '과거의 기반' : idx === 1 ? '현재의 조언' : '미래의 가능성') 
                : (item?.role || "");
                
              const isWarning = item ? (item.isReversed || (item.polarity === 'negative' && category === 'worry')) : false;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (idx * 0.2) }}
                  className={`w-full rounded-3xl p-6 md:p-10 border shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden transition-colors ${isPlaceholder ? 'bg-white/[0.02] border-white/5 opacity-50' : 'bg-white/5 border-white/10'}`}
                >
                  <div className="absolute top-0 right-0 p-8 text-8xl text-white/[0.03] font-black italic pointer-events-none">{idx + 1}</div>
                  <div className="flex items-center gap-4 mb-6 border-b border-amber-500/20 pb-4">
                    <div className={`w-4 h-4 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)] ${role.startsWith('과거') ? 'bg-amber-700 border-2 border-amber-500' : role.startsWith('현재') ? 'bg-amber-500 border-2 border-amber-300' : 'bg-yellow-400 border-2 border-yellow-200'}`}></div>
                    <h2 className="text-2xl md:text-3xl font-bold text-amber-400 tracking-widest flex items-center">
                      {spread === 'today' ? '오늘의 종합 조언' : role}
                      {!isPlaceholder && (
                        <span className="text-xl md:text-2xl text-amber-400/60 font-medium ml-3">({item.isReversed ? '역방향' : '정방향'})</span>
                      )}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-2 mb-6">
                    <h3 className="text-2xl text-white font-bold">{item?.nameKr || "신비로운 카드"}</h3>
                    <p className="text-amber-200/80 tracking-wide text-sm md:text-base">
                      {item ? item.keywords.join(' · ') : "키워드를 불러오는 중..."}
                    </p>
                  </div>

                  {category !== 'worry' && (
                    <div className="bg-black/30 p-5 md:p-6 rounded-2xl relative border border-white/5 mt-4 min-h-[100px] flex flex-col justify-center">
                      <span className="absolute -top-3 left-4 bg-slate-800 border border-white/10 px-3 py-1 text-xs text-gray-400 rounded-full tracking-widest font-bold">
                         핵심 키워드
                      </span>
                      <p className="text-gray-200 text-[15px] md:text-xl leading-loose break-keep mt-2 font-serif italic">
                         "{item?.interpretation || "운명이 갈무리되는 중입니다..."}"
                      </p>
                    </div>
                  )}

                  <div className={`mt-6 p-5 md:p-6 rounded-2xl relative border min-h-[100px] flex flex-col justify-center ${isWarning ? 'bg-rose-950/20 border-rose-500/30' : 'bg-emerald-900/20 border-emerald-500/30'}`}>
                    <span className={`absolute -top-3.5 left-4 px-4 py-1.5 text-xs md:text-sm rounded-full border shadow-md tracking-widest font-bold ${isWarning ? 'bg-rose-900 border-rose-400 text-rose-100' : 'bg-emerald-900 border-emerald-400 text-emerald-100'}`}>
                       [타로 마스터의 해석]
                    </span>
                    <p className={`text-[15px] md:text-xl leading-loose font-serif italic break-keep mt-2 ${isWarning ? 'text-rose-100/90' : 'text-emerald-50/90'}`}>
                       "{item?.advice || "운명의 조언을 준비 중입니다..."}"
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
