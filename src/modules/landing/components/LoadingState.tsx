'use client';

import { BackgroundElements } from '@/components/ui/BackgroundElements';

export function LoadingState() {
  return (
    <div className="min-h-screen bg-[#232323] relative overflow-hidden">
      <BackgroundElements />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="text-white/60 font-montserrat mt-4">
            Загрузка проектов...
          </p>
        </div>
      </div>
    </div>
  );
}
