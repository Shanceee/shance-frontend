'use client';

import { useEffect, useRef, useState } from 'react';

import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { faqData } from '@/data/faq';

export function EnhancedFAQSection() {
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
    <section ref={sectionRef} className="py-20 px-5 relative">
      {/* Фоновые элементы */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-[400px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[400px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Заголовок прижат к левому краю */}
        <SectionHeader
          title="Часто задаваемые вопросы"
          subtitle="Ответы на самые популярные вопросы о нашей платформе"
          align="left"
        />

        {/* Основной контент */}
        <div
          className="transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '300ms',
          }}
        >
          <FAQAccordion
            items={faqData}
            className="mb-20"
            animationDelay={100}
          />
        </div>
      </div>
    </section>
  );
}
