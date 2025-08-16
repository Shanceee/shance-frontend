'use client';

export function BackgroundElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Фоновые градиентные круги */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[400px] animate-pulse"></div>
      <div className="absolute top-40 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-[400px] animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-green-500/10 rounded-full blur-[300px] animate-pulse delay-2000"></div>

      {/* Дополнительные декоративные элементы */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[300px] animate-pulse delay-3000"></div>
      <div className="absolute bottom-1/3 right-0 w-56 h-56 bg-yellow-500/10 rounded-full blur-[250px] animate-pulse delay-4000"></div>
    </div>
  );
}
