'use client';

import { useEffect, useRef, useState } from 'react';

import { ProjectCard } from '@/components/ui/ProjectCard';
import { InfoCard } from '@/components/ui/InfoCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { projectsData, infoCardsData } from '@/data/projects';

export function EnhancedFeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProject(prev => (prev + 1) % projectsData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-5 relative">
      {/* Фоновые элементы */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-[400px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[400px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader title="Как это работает" />

        {/* Дополнительные информационные карточки */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '600ms',
          }}
        >
          {infoCardsData.map((card, index) => (
            <InfoCard
              key={index}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
