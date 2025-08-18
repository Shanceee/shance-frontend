'use client';

import { useEffect, useRef, useState } from 'react';

const aboutCards = [
  {
    id: 1,
    title: 'Не хватает опыта?',
    description: 'Участвуй в проектах и учись на практике.',
    size: 'small',
    position: 'top-left',
  },
  {
    id: 2,
    title: 'Хочешь развиваться быстрее?',
    description: 'Попади в команду с ментором',
    size: 'large',
    position: 'top-right',
  },
  {
    id: 3,
    title: 'Готов начать карьеру?',
    description: 'Построй своё портфолио и найди первых заказчиков',
    size: 'small',
    position: 'bottom-left',
  },
];

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 px-5 overflow-hidden">
      {/* Заголовок */}
      <div className="text-center mb-20">
        <h2
          className={`text-4xl md:text-5xl font-unbounded font-normal leading-tight transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="bg-gradient-to-t from-gray-400/30 to-white bg-clip-text text-transparent">
            О нас
          </span>
        </h2>
      </div>

      {/* Контейнер для карточек */}
      <div className="max-w-7xl mx-auto relative">
        {/* Адаптивная сетка карточек - 2 строки, 3 колонки */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Первая карточка - 1 строка, 1 колонка */}
          <div
            className="lg:col-start-1 lg:row-start-1 transition-all duration-1000"
            style={{
              transitionDelay: '200ms',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
            }}
          >
            <div className="relative backdrop-blur-[5px] backdrop-filter h-[347px] rounded-[40px] border-[3px] border-white/50 border-solid overflow-hidden p-6 lg:p-[26px] flex flex-col justify-between hover:border-white/70 transition-all duration-300 group">
              <div className="text-white">
                <h3 className="text-2xl lg:text-[32px] font-unbounded font-normal leading-tight mb-4 group-hover:text-white/90 transition-colors duration-300">
                  {aboutCards[0].title}
                </h3>
              </div>
              <div className="text-white/60">
                <p className="font-unbounded text-base lg:text-[18px] leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                  {aboutCards[0].description}
                </p>
              </div>
            </div>
          </div>

          {/* Вторая карточка - 2 строка, 2 колонка */}
          <div
            className="lg:col-start-2 lg:row-start-2 transition-all duration-1000"
            style={{
              transitionDelay: '400ms',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
            }}
          >
            <div className="relative backdrop-blur-[5px] backdrop-filter h-[347px] rounded-[40px] border-[3px] border-white/50 border-solid overflow-hidden p-6 lg:p-[33px] flex flex-col justify-between hover:border-white/70 transition-all duration-300 group">
              <div className="text-white">
                <h3 className="text-2xl lg:text-[32px] font-unbounded font-normal leading-tight mb-4 group-hover:text-white/90 transition-colors duration-300">
                  {aboutCards[1].title}
                </h3>
              </div>
              <div className="text-white/60">
                <p className="font-unbounded text-base lg:text-[18px] leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                  {aboutCards[1].description}
                </p>
              </div>
            </div>
          </div>

          {/* Третья карточка - 1 строка, 3 колонка */}
          <div
            className="lg:col-start-3 lg:row-start-1 transition-all duration-1000"
            style={{
              transitionDelay: '600ms',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
            }}
          >
            <div className="relative backdrop-blur-[5px] backdrop-filter h-[347px] rounded-[40px] border-[3px] border-white/50 border-solid overflow-hidden p-6 lg:p-[23px] flex flex-col justify-between hover:border-white/70 transition-all duration-300 group">
              <div className="text-white">
                <h3 className="text-2xl lg:text-[32px] font-unbounded font-normal leading-tight mb-4 group-hover:text-white/90 transition-colors duration-300">
                  {aboutCards[2].title}
                </h3>
              </div>
              <div className="text-white/60">
                <p className="font-unbounded text-base lg:text-[18px] leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                  {aboutCards[2].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
