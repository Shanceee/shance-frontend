'use client';

import { BackgroundElements } from '@/components/ui/BackgroundElements';

export function NoProjectsState() {
  return (
    <div className="min-h-screen bg-[#232323] relative overflow-hidden">
      <BackgroundElements />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-unbounded text-white mb-4">
            Проекты не найдены
          </h1>
          <p className="text-white/60 font-montserrat">
            Попробуйте обновить страницу или обратитесь к администратору
          </p>
        </div>
      </div>
    </div>
  );
}
