'use client';

import { useState, useEffect, useRef } from 'react';
import React from 'react';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'platform' | 'users';
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  animationDelay?: number;
}

export function FAQAccordion({
  items,
  className = '',
  animationDelay = 100,
}: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  const toggleItem = (id: string) => {
    const currentScrollY = window.scrollY;
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    setTimeout(() => window.scrollTo(0, currentScrollY), 0);
  };

  const platformItems = items.filter(item => item.category === 'platform');
  const userItems = items.filter(item => item.category === 'users');

  const renderFAQColumn = (
    items: FAQItem[],
    category: string,
    startNumber: number
  ) => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-8 text-left font-unbounded">
        {category}
      </h3>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <div
            className={`bg-white/10 backdrop-blur-sm border border-white/30 rounded-[30px] overflow-hidden transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-20'
            }`}
            style={{ transitionDelay: `${index * animationDelay}ms` }}
          >
            <button
              className="w-full px-8 py-8 text-left flex items-center justify-between hover:bg-white/5 transition-colors group"
              onClick={event => {
                event.preventDefault();
                toggleItem(item.id);
              }}
              aria-expanded={openItems.includes(item.id)}
              aria-controls={`faq-${item.id}`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-white/60 min-w-[2rem] font-unbounded">
                  {startNumber + index}
                </span>
                <span className="text-xl font-bold text-white pr-8 group-hover:text-green-200 transition-colors font-unbounded">
                  {item.question}
                </span>
              </div>
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  {openItems.includes(item.id) ? (
                    <svg
                      className="w-4 h-4 text-white transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-white transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          </div>

          {openItems.includes(item.id) && (
            <div
              id={`faq-${item.id}`}
              className="px-8 py-8 animate-slide-down bg-green-600 rounded-[30px] border border-green-500/30 mb-6"
              aria-hidden={!openItems.includes(item.id)}
            >
              <p className="text-white/90 text-lg leading-relaxed font-montserrat">
                {item.answer}
              </p>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div ref={sectionRef} className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Левая колонка - Про платформу */}
        <div className="space-y-6">
          {renderFAQColumn(platformItems, 'Про платформу', 1)}
        </div>

        {/* Правая колонка - Для пользователей */}
        <div className="space-y-6">
          {renderFAQColumn(userItems, 'Для пользователей', 1)}
        </div>
      </div>
    </div>
  );
}
