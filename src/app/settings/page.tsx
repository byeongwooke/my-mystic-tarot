'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useAuth } from '@/providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { db, doc, updateDoc } from '@/lib/firebase';
import { TarotMode } from '@/types/settings';

export default function SettingsPage() {
  const router = useRouter();
  const { user, identifiedProfile, hasConfiguredSettings, setHasConfiguredSettings } = useAuth();
  const { settings } = useUserSettings();

  // 온보딩 모드인 경우 초기값을 null로 설정하여 선택을 강제함
  const [localMode, setLocalMode] = useState<TarotMode | null>(
    hasConfiguredSettings ? settings.mode : null
  );
  const [localIncludeMinor, setLocalIncludeMinor] = useState<boolean | null>(
    hasConfiguredSettings ? settings.includeMinor : null
  );
  const [localUseReversals, setLocalUseReversals] = useState<boolean | null>(
    hasConfiguredSettings ? settings.useReversals : null
  );

  const [isSaving, setIsSaving] = useState(false);

  // 모든 항목이 선택되었는지 확인
  const isValid = localMode !== null && localIncludeMinor !== null && localUseReversals !== null;

  const handleSave = async () => {
    if (!isValid || !identifiedProfile) return;
    
    setIsSaving(true);
    try {
      // 1. Firebase 유저 설정 완료 상태 업데이트 (profiles 컬렉션 사용)
      const profileId = `${identifiedProfile.displayName}_${identifiedProfile.pin}`;
      const profileRef = doc(db, 'profiles', profileId);
      
      await updateDoc(profileRef, {
        hasConfiguredSettings: true,
        mode: localMode,
        includeMinor: localIncludeMinor,
        useReversals: localUseReversals,
        isFirstVisit: false,
        updatedAt: new Date().toISOString(),
      });

      // 2. 전역 상태 업데이트 (OnboardingGuard 동기화)
      // onSnapshot이 실시간으로 상태를 잡아주므로 명시적인 setter 호출은 
      // 보조적인 역할(즉각 응답)을 수행함
      setHasConfiguredSettings(true);

      // 3. 이동 (trailingSlash: true 기반)
      router.push('/select/');
    } catch (error) {
      console.error("설정 저장 실패:", error);
      alert("설정 저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSection = ({ 
    title, 
    description, 
    options, 
    currentValue, 
    onChange 
  }: { 
    title: string; 
    description: string; 
    options: { label: string; value: any }[]; 
    currentValue: any; 
    onChange: (val: any) => void 
  }) => (
    <div className="mb-10 w-full">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-emerald-400 font-black tracking-widest text-lg uppercase">{title}</h3>
        {currentValue === null && (
            <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/30 font-bold"
            >
                필수 선택
            </motion.span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-6 font-light">{description}</p>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            className={`py-4 px-2 rounded-2xl border-2 transition-all duration-300 font-bold tracking-widest ${
              currentValue === opt.value
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                : 'bg-slate-900/50 border-slate-800 text-gray-400 hover:border-slate-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col items-center relative overflow-hidden"
    >
      {/* Mystical Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-900/10 blur-[150px] rounded-full" />
      </div>

      <div className="z-10 w-full max-w-md flex flex-col items-center">
        <header className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4"
          >
            <span className="text-amber-500/60 text-xs tracking-[0.5em] uppercase font-bold">Registration</span>
          </motion.div>
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl md:text-4xl font-black text-amber-500 tracking-[0.3em] mb-2 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] uppercase"
          >
            {hasConfiguredSettings ? 'My Page' : 'Onboarding'}
          </motion.h1>
          <div className="h-1 w-20 bg-amber-500/50 mx-auto rounded-full" />
          {!hasConfiguredSettings && (
              <p className="mt-4 text-gray-400 text-xs tracking-widest break-keep">
                당신의 운명을 읽기 전, 세 가지 취향을 먼저 알려주세요.
              </p>
          )}
        </header>

        <div 
          style={{ transform: 'translateZ(0)', willChange: 'backdrop-filter' }}
          className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          <ToggleSection
            title="해석 모드"
            description="타로가 전하는 진심의 농도를 결정합니다."
            currentValue={localMode}
            onChange={(val) => setLocalMode(val)}
            options={[
              { label: '매운맛 (Spicy)', value: 'spicy' },
              { label: '순한맛 (Gentle)', value: 'gentle' }
            ]}
          />

          <ToggleSection
            title="카드 범위"
            description="덱의 구성 범위를 선택합니다."
            currentValue={localIncludeMinor}
            onChange={(val) => setLocalIncludeMinor(val)}
            options={[
              { label: '메이저 카드만', value: false },
              { label: '전체 카드 포함', value: true }
            ]}
          />

          <ToggleSection
            title="역방향"
            description="운명의 이면을 읽어내는 신비로운 흐름을 무작위로 적용합니다."
            currentValue={localUseReversals}
            onChange={(val) => setLocalUseReversals(val)}
            options={[
              { label: '운명의 이면 활성화', value: true },
              { label: '사용 안 함', value: false }
            ]}
          />

          <motion.button
            whileHover={isValid && !isSaving ? { scale: 1.02 } : {}}
            whileTap={isValid && !isSaving ? { scale: 0.98 } : {}}
            disabled={!isValid || isSaving}
            onClick={handleSave}
            className={`w-full py-5 font-black text-xl rounded-2xl transition-all tracking-[0.2em] mt-4 flex items-center justify-center ${
              isValid && !isSaving
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-[0_10px_30px_rgba(245,158,11,0.3)]'
                : 'bg-slate-800 text-gray-500 border border-white/5 cursor-not-allowed opacity-50'
            }`}
          >
            {isSaving ? '신비로운 설정 저장 중...' : '저장하고 시작하기'}
          </motion.button>
          
          {!isValid && (
            <p className="text-center text-[10px] text-rose-400/60 mt-4 tracking-tighter uppercase font-bold">
                * 모든 항목을 선택해야 운명의 문이 열립니다.
            </p>
          )}
        </div>

        <footer className="mt-12 text-gray-600 text-[10px] tracking-widest font-light uppercase text-center space-y-1">
          <div>Your Destiny, Your Choice</div>
          <div className="opacity-40">Spirit of Hocis Tarot</div>
        </footer>
      </div>
    </motion.main>
  );
}
