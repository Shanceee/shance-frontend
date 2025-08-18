'use client';

export function ProjectsPageHeader() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20 md:pt-0">
      {/* Фоновые элементы */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-[700px] animate-pulse"></div>
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-blue-500/30 rounded-full blur-[800px] animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-green-500/20 rounded-full blur-[600px] animate-pulse delay-2000"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-10 text-center px-5 max-w-6xl mx-auto">
        {/* Главный заголовок */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-t from-gray-400/30 to-white bg-clip-text text-transparent font-unbounded">
          Твои идеальные проекты
        </h1>

        {/* Описание */}
        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed font-montserrat">
          Найди свой идеальный проект или создай команду для реализации идей
        </p>
      </div>
    </section>
  );
}
