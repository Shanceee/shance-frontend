'use client';

import { useEffect, useRef, useState } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  animationDelay?: number;
  align?: 'left' | 'center';
}

export function SectionHeader({
  title,
  subtitle,
  className = '',
  animationDelay = 0,
  align = 'left',
}: SectionHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={headerRef}
      className={`mb-20 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{ transitionDelay: `${animationDelay}ms` }}
    >
      <h2
        className={`text-4xl md:text-5xl font-bold text-white mb-8 font-unbounded ${
          align === 'center' ? 'text-center' : 'text-left'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-xl text-white/80 max-w-3xl font-montserrat ${
            align === 'center' ? 'text-center mx-auto' : 'text-left'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
