'use client';

export function NoProjectsState() {
  return (
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
  );
}
