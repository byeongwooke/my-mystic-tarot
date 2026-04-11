"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';
import React, { Suspense, useMemo, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

function SpreadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, identifiedProfile } = useAuth();
  const rawCategory = searchParams.get('category');
  const category = rawCategory ? rawCategory.replace(/[^\w]/g, '') : null;
  const [showHomeModal, setShowHomeModal] = useState(false);

  // ✅ 언마운트 시 모달 상태 초기화 (Prompt Cleanup)
  React.useEffect(() => {
    return () => setShowHomeModal(false);
  }, []);

  const displayCategory = useMemo(() => {
    const categoryNameMap: Record<string, string> = {
      'love': '애정운❤️',
      'money': '재물운💰',
      'work': '직업운💼'
    };
    return category ? (categoryNameMap[category] || '특별한 운세') : '';
  }, [category]);

  if (!category || category === 'today') {
    if (typeof window !== 'undefined') router.replace('/');
    return null;
  }

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
                <span className="text-emerald-400 font-bold">{identifiedProfile?.displayName || user?.displayName || "운명"}</span>님의 배열법 선택
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
                  <span className="text-white">{displayCategory.replace(/[☀️❤️💰💼]/g, '')}</span>에 적합한 타로 배열을 선택하세요.
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
      </div>

      <div className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-center gap-6 px-6 py-10">
        <Link href={`/select/?category=${category}&spread=basic`} className="w-full">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileTap={{ scale: 0.95 }}
            style={{ transform: 'translateZ(0)', willChange: 'backdrop-filter' }}
            className="w-full relative flex flex-col items-center justify-center p-8 md:p-10 rounded-3xl border-2 border-indigo-500/30 bg-indigo-950/40 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.5)] active:bg-indigo-900/60 active:border-amber-400/60 active:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-4 tracking-widest drop-shadow-md">베이직 배열 (3장)</h2>
            <p className="text-indigo-200/80 text-sm md:text-base font-light break-keep text-center leading-relaxed">과거, 현재, 미래를 가볍게 짚어봅니다.</p>
          </motion.button>
        </Link>
        
        <Link href={`/select/?category=${category}&spread=celtic`} className="w-full">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.95 }}
            style={{ transform: 'translateZ(0)', willChange: 'backdrop-filter' }}
            className="w-full relative flex flex-col items-center justify-center p-8 md:p-10 rounded-3xl border-2 border-purple-500/30 bg-purple-950/40 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.5)] active:bg-purple-900/60 active:border-amber-400/60 active:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-4 tracking-widest drop-shadow-md">캘틱 크로스 (10장)</h2>
            <p className="text-purple-200/80 text-sm md:text-base font-light break-keep text-center leading-relaxed">문제의 원인부터 최종 결과까지 심층적으로 분석합니다.</p>
          </motion.button>
        </Link>
      </div>
    </motion.main>
  );
}

export default function SpreadPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    }>
      <SpreadContent />
    </Suspense>
  );
}
