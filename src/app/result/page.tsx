"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TAROT_DATA } from "@/constants/tarotData";
import { motion } from "framer-motion";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [cardsInfo, setCardsInfo] = useState<{ cardData: any, role: string }[]>([]);
  const [category, setCategory] = useState<string | null>(null);

  const roles = ["과거", "현재", "미래"];

  useEffect(() => {
    // URL에서 파라미터 읽기
    const cat = searchParams.get('category');
    const cardsParam = searchParams.get('cards');

    if (!cat || !cardsParam) {
      // 잘못된 접근 시 메인으로 리다이렉트
      router.push('/');
      return;
    }

    setCategory(cat);

    const cardIds = cardsParam.split(',').map(id => parseInt(id, 10));
    const loadedCards = cardIds.map((id, index) => {
      const cardData = TAROT_DATA.find(c => c.id === id);
      return {
        cardData: cardData,
        role: roles[index]
      };
    }).filter(item => item.cardData !== undefined);

    setCardsInfo(loadedCards);
    setIsLoading(false);
  }, [searchParams, router]);

  const categoryName = category === 'love' ? '연애운' 
                     : category === 'money' ? '재물운' 
                     : category === 'work' ? '직업운' : '';

  const getAdviceText = (cardData: any, categoryKey: string | null, roleStr: string) => {
    if (!cardData || !cardData.advice || !categoryKey) return "";
    
    const timeMap: Record<string, "past" | "present" | "future"> = {
      '과거': 'past',
      '현재': 'present',
      '미래': 'future'
    };

    const mappedTime = timeMap[roleStr] || 'future';

    if (typeof cardData.advice === 'string') {
      return cardData.advice;
    }
    
    if (typeof cardData.advice[categoryKey] === 'string') {
        return cardData.advice[categoryKey];
    }
    
    return cardData.advice[categoryKey]?.[mappedTime] || "";
  };

  const getInterpretationText = (cardData: any, categoryKey: string | null) => {
    if (!cardData || !cardData.interpretations || !categoryKey) return "";
    return cardData.interpretations[categoryKey] || "";
  };

  const getOverallAdvice = () => {
    if (cardsInfo.length !== 3 || !category) return "운명의 카드가 당신에게 전하는 메시지입니다.";
    const futureItem = cardsInfo.find(c => c.role === "미래");
    if (!futureItem || !futureItem.cardData) return "운명의 카드가 당신에게 전하는 메시지입니다.";
    
    return `"${getAdviceText(futureItem.cardData, category, '미래')}"`;
  };

  const resetTarot = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main 
      className="w-full min-h-screen flex flex-col items-center bg-slate-900 bg-fixed overflow-y-auto"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 2rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 4rem)'
      }}
    >
      <div className="w-full max-w-4xl px-4 md:px-8 mt-10 md:mt-16 flex flex-col items-center">
        
        {/* 상단 결과 제목 */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-2xl md:text-5xl font-extrabold text-amber-400 mb-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] text-center break-keep leading-relaxed"
        >
          당신의 {categoryName} 결과입니다
        </motion.h1>
        
        {/* 전체 한줄평 */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-amber-300 mb-12 md:mb-20 mt-4 tracking-widest text-center text-lg md:text-3xl font-serif italic drop-shadow-md break-keep leading-loose max-w-3xl"
        >
          {getOverallAdvice()}
        </motion.p>
        
        {/* 뽑은 카드 3장 상단 정렬 전시 */}
        <div className="w-full flex justify-center gap-4 md:gap-12 lg:gap-20 mb-16 md:mb-24 px-2">
          {cardsInfo.map((item, idx) => (
            <motion.div 
              key={item.role}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + (idx * 0.2), type: "spring", stiffness: 100 }}
              className="flex flex-col items-center"
            >
              <span className="text-amber-400 border border-amber-400/50 bg-amber-400/10 px-4 py-1 rounded-full text-xs md:text-lg font-bold mb-4 tracking-widest">
                {item.role}
              </span>
              <div className="w-[80px] h-[128px] md:w-[150px] md:h-[240px] rounded-xl border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)] bg-slate-100 flex flex-col items-center justify-center relative overflow-hidden transform hover:scale-105 transition-transform">
                <div className="absolute inset-1 border border-amber-500/30 rounded-lg"></div>
                <div className="text-[11px] md:text-lg font-bold text-amber-900 text-center px-1 md:px-4 leading-relaxed break-keep z-10">{item.cardData.nameKr}</div>
                <div className="text-[9px] md:text-xs font-bold text-amber-700 mt-2 z-10 text-center px-1">{item.cardData.name}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 세로형 상세 리포트 영역 */}
        <div className="w-full max-w-3xl flex flex-col gap-10 md:gap-16">
          {cardsInfo.map((item, idx) => (
            <motion.div 
              key={item.role + '-detail'}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + (idx * 0.3), duration: 0.8 }}
              className="w-full bg-white/5 rounded-3xl p-6 md:p-10 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-8xl text-white/[0.03] font-black italic pointer-events-none select-none">
                {idx + 1}
              </div>

              <div className="flex items-center gap-4 mb-6 border-b border-amber-500/20 pb-4">
                <div className={`w-4 h-4 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)] ${
                  item.role === '과거' ? 'bg-amber-700 border-2 border-amber-500' :
                  item.role === '현재' ? 'bg-amber-500 border-2 border-amber-300' :
                  'bg-yellow-400 border-2 border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,1)]'
                }`}></div>
                <h2 className="text-2xl md:text-3xl font-bold text-amber-400 tracking-widest">
                  {item.role === '과거' ? '과거의 기반' : item.role === '현재' ? '현재의 조언' : '미래의 가능성'}
                </h2>
              </div>

              <div className="flex flex-col gap-2 mb-6">
                <h3 className="text-2xl text-white font-bold flex items-center gap-3">
                  {item.cardData.nameKr} 
                  <span className="text-lg text-emerald-400 opacity-80 font-normal">정방향</span>
                </h3>
                <p className="text-amber-200/80 tracking-wide text-sm md:text-base">
                  {item.cardData.keywords.join(' · ')}
                </p>
              </div>

              <div className="space-y-6 md:space-y-8">
                {/* 일반 해석 */}
                <div className="bg-black/30 p-5 md:p-6 rounded-2xl relative">
                  <span className="absolute -top-3 left-4 bg-slate-800 border border-white/10 px-3 py-1 text-xs text-gray-400 rounded-full tracking-widest">카드의 해석</span>
                  <p className="text-gray-200 text-sm md:text-lg leading-loose break-keep mt-2">
                    {getInterpretationText(item.cardData, category)}
                  </p>
                </div>

                {/* 타임라인 특별 조언 */}
                <div className="bg-gradient-to-br from-amber-900/30 to-black/40 border border-amber-500/30 p-5 md:p-6 rounded-2xl relative">
                  <span className="absolute -top-3 left-4 bg-amber-900 border border-amber-500/50 px-3 py-1 text-xs text-amber-200 rounded-full tracking-widest">타로 마스터의 한마디</span>
                  <p className="text-amber-50/90 text-[15px] md:text-xl leading-loose tracking-wide break-keep mt-2 font-serif italic">
                    "{getAdviceText(item.cardData, category, item.role)}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 하단 다시하기 영역 */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-24 mb-10 flex flex-col items-center w-full"
        >
          <p className="text-gray-400 opacity-60 text-xs md:text-sm font-light tracking-wide break-keep mb-8 text-center max-w-sm">
            본 결과는 삶의 방향을 잡기 위한 참고용이며, 진정한 운명은 스스로 개척하는 것입니다.
          </p>
          <button 
            onClick={resetTarot}
            className="w-full max-w-sm py-4 md:py-6 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-xl rounded-full shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_50px_rgba(251,191,36,0.6)] hover:scale-105 active:scale-95 transition-all tracking-widest border border-amber-300/50"
          >
            새로운 운명 펼치기
          </button>
        </motion.div>

      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
