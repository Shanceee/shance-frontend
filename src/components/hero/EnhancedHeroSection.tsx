'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { AnimatedHashtags } from '@/components/ui/AnimatedHashtags';
import { hashtagsData } from '@/data/hashtags';

export function EnhancedHeroSection() {
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
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0"
    >
      {/* Фоновые элементы */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-[700px] animate-pulse"></div>
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-blue-500/30 rounded-full blur-[800px] animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-green-500/20 rounded-full blur-[600px] animate-pulse delay-2000"></div>
      </div>

      {/* Основной контент */}
      <div
        className={`relative z-10 text-center px-5 max-w-6xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Логотип с анимацией */}
        <div className="mb-8 flex justify-center animate-bounce">
          <div className="relative w-24 h-24 hover:scale-110 transition-transform duration-300">
            <Image
              src="/images/logo.svg"
              alt="Shance Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Главный заголовок */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 bg-gradient-to-t from-gray-400/30 to-white bg-clip-text text-transparent animate-pulse font-unbounded">
          shance
        </h1>

        {/* Описание */}
        <p className="text-xl md:text-2xl text-white/80 mb-16 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay font-montserrat">
          Стань частью стартапа
        </p>

        {/* Анимированные хэштеги */}
        <AnimatedHashtags tags={hashtagsData} className="mb-16" />

        {/* Кнопка CTA */}
        <Link
          href="/projects"
          className="inline-block px-12 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-xl font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105 animate-bounce-slow font-montserrat"
        >
          к проектам
        </Link>
      </div>
    </section>
  );
}
