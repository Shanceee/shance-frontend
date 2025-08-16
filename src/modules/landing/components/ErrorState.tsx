'use client';

import { BackgroundElements } from '@/components/ui/BackgroundElements';

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-[#232323] relative overflow-hidden">
      <BackgroundElements />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-unbounded text-white mb-4">
            Ошибка загрузки
          </h1>
          <p className="text-white/60 font-montserrat mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-unbounded hover:bg-white/30 transition-all"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    </div>
  );
}
