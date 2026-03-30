'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserSettings } from '@/hooks/useUserSettings';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings } = useUserSettings();

  const handleSave = () => {
    updateSettings({ isFirstVisit: false });
    router.push('/select');
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
      <h3 className="text-emerald-400 font-black tracking-widest text-lg mb-2 uppercase">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 font-light">{description}</p>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            className={`py-4 px-2 rounded-2xl border-2 transition-all duration-300 font-bold tracking-widest ${
              currentValue === opt.value
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                : 'bg-slate-900/50 border-slate-800 text-gray-500 hover:border-slate-700'
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
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl md:text-4xl font-black text-amber-500 tracking-[0.3em] mb-2 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] uppercase"
          >
            My Page
          </motion.h1>
          <div className="h-1 w-20 bg-amber-500/50 mx-auto rounded-full" />
        </header>

        <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <ToggleSection
            title="해석 모드"
            description="타로가 전하는 진심의 농도를 결정합니다."
            currentValue={settings.mode}
            onChange={(val) => updateSettings({ mode: val })}
            options={[
              { label: '매운맛 (Spicy)', value: 'spicy' },
              { label: '순한맛 (Gentle)', value: 'gentle' }
            ]}
          />

          <ToggleSection
            title="카드 범위"
            description="덱의 구성 범위를 선택합니다."
            currentValue={settings.includeMinor}
            onChange={(val) => updateSettings({ includeMinor: val })}
            options={[
              { label: '메이저 카드만', value: false },
              { label: '전체 카드 포함', value: true }
            ]}
          />

          <ToggleSection
            title="역방향"
            description="카드의 방향에 따른 해석 차이를 적용합니다."
            currentValue={settings.useReversals}
            onChange={(val) => updateSettings({ useReversals: val })}
            options={[
              { label: '사용함 (7:3)', value: true },
              { label: '사용 안 함', value: false }
            ]}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full py-5 bg-gradient-to-r from-amber-600 to-amber-500 hover:to-amber-400 text-white font-black text-xl rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] transition-all tracking-[0.2em] mt-4"
          >
            저장하고 돌아가기
          </motion.button>
        </div>

        <footer className="mt-12 text-gray-600 text-xs tracking-widest font-light uppercase">
          Your Destiny, Your Choice
        </footer>
      </div>
    </motion.main>
  );
}
