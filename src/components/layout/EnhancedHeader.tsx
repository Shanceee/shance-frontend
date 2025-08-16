'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function EnhancedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/projects', text: 'Проекты' },
    { href: '/about', text: 'О нас' },
    { href: '/faq', text: 'FAQ' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/40 backdrop-blur-lg border-b border-white/20'
          : 'bg-black/20 backdrop-blur-md border-b border-white/10'
      }`}
    >
      <div className="container mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          {/* Логотип с анимацией */}
          <Link
            href="/"
            className={`flex items-center space-x-3 transition-all duration-500 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="relative w-10 h-10 hover:scale-110 transition-transform duration-300">
              <Image
                src="/images/logo-vector-2.svg"
                alt="Shance Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-white text-xl font-bold hover:text-green-200 transition-colors font-unbounded">
              shance
            </span>
          </Link>

          {/* Навигация с анимацией */}
          <nav
            className={`hidden md:flex items-center space-x-8 transition-all duration-500 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-5'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-white/80 hover:text-white transition-all duration-300 hover:scale-105 font-montserrat ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-5'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                {item.text}
              </Link>
            ))}
          </nav>

          {/* Кнопка входа и мобильное меню */}
          <div
            className={`flex items-center space-x-4 transition-all duration-500 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-10'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <button className="px-6 py-2 text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 font-montserrat">
              Войти
            </button>

            {/* Мобильное меню */}
            <button
              className="md:hidden text-white hover:text-green-200 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Открыть меню"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-1' : ''
                  }`}
                ></span>
                <span
                  className={`w-5 h-0.5 bg-current mt-1 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  className={`w-5 h-0.5 bg-current mt-1 transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 -translate-y-1' : ''
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Мобильное меню с анимацией */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col space-y-4 pt-4 pb-4 border-t border-white/10">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/80 hover:text-white transition-all duration-300 hover:translate-x-2 font-montserrat"
                onClick={() => setIsMenuOpen(false)}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {item.text}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
