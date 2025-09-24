'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSmoothScroll } from '@/hooks';

export function StaticHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { scrollToElementWithOffset } = useSmoothScroll();

  const handleNavigation = (section: string) => {
    setIsMenuOpen(false);

    // Если мы не на главной странице, переходим на неё
    if (window.location.pathname !== '/') {
      router.push('/');
      // Ждем перехода и затем скроллим
      setTimeout(() => {
        scrollToElementWithOffset(section, 100);
      }, 100);
    } else {
      // Если уже на главной, просто скроллим
      scrollToElementWithOffset(section, 100);
    }
  };

  const navItems = [
    {
      id: 'projects',
      href: '/projects',
      text: 'Проекты',
      action: () => router.push('/projects'),
    },
    {
      id: 'about',
      href: '#about',
      text: 'О нас',
      action: () => handleNavigation('about'),
    },
    {
      id: 'faq',
      href: '#faq',
      text: 'FAQ',
      action: () => handleNavigation('faq'),
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <Link
            href="/"
            className="flex items-center space-x-3 transition-all duration-500 opacity-100 translate-x-0"
          >
            <div className="relative w-10 h-10 hover:scale-110 transition-transform duration-300">
              <Image
                src="/images/logo.svg"
                alt="Shance Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-white text-xl font-bold hover:text-green-200 transition-colors font-unbounded">
              shance
            </span>
          </Link>

          {/* Навигация для десктопа */}
          <nav className="hidden md:flex items-center space-x-8 transition-all duration-500 opacity-100 translate-y-0">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={item.action}
                className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 opacity-100 translate-y-0 font-montserrat bg-transparent border-none cursor-pointer"
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                {item.text}
              </button>
            ))}
          </nav>

          {/* Кнопка входа для десктопа */}
          <div className="hidden md:flex items-center space-x-4 transition-all duration-500 opacity-100 translate-x-0">
            <Link
              href="/login"
              className="px-6 py-2 text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 font-montserrat"
            >
              Войти
            </Link>
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 font-montserrat"
            >
              Войти
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-1' : ''
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 mt-1 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 mt-1 ${
                    isMenuOpen ? '-rotate-45 -translate-y-1' : ''
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Мобильное меню выпадающее */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-white/10">
            <nav className="space-y-4">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsMenuOpen(false);
                  }}
                  className="block text-white/80 hover:text-white transition-all duration-300 py-2 font-montserrat bg-transparent border-none cursor-pointer text-left w-full"
                >
                  {item.text}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
