'use client';

export function LoadingState() {
  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        <p className="text-white/60 font-montserrat mt-4">
          Загрузка проектов...
        </p>
      </div>
    </div>
  );
}
