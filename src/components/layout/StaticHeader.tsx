'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function StaticHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isProjectsPage = pathname === '/projects';

  const navItems = [
    { href: '/projects', text: 'Проекты' },
    { href: '/about', text: 'О нас' },
    { href: '/faq', text: 'FAQ' },
  ];

  const projectsNavItems = [
    { href: '/', text: 'Главная' },
    { href: '/favorites', text: 'Мои избранные' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
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
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 opacity-100 translate-y-0 font-montserrat"
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  {item.text}
                </Link>
              ))}
            </nav>

            {/* Кнопка входа для десктопа */}
            <div className="hidden md:flex items-center space-x-4 transition-all duration-500 opacity-100 translate-x-0">
              <button className="px-6 py-2 text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 font-montserrat">
                Войти
              </button>
            </div>

            {/* Мобильное меню */}
            <div className="md:hidden flex items-center space-x-4">
              <button className="px-4 py-2 text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 font-montserrat">
                Войти
              </button>
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
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-white/80 hover:text-white transition-all duration-300 py-2 font-montserrat"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.text}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Открытый хедер с профилем пользователя для страницы проектов */}
      {isProjectsPage && (
        <div className="pt-24 pb-10 px-5">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              {/* Навигационные кнопки */}
              <div className="flex gap-6">
                {projectsNavItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-8 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white font-unbounded text-sm hover:bg-white/30 transition-all"
                  >
                    {item.text}
                  </Link>
                ))}
              </div>

              {/* Профиль пользователя */}
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center gap-2">
                <span className="text-white font-unbounded text-sm">
                  kalinsvetas@gmail.com
                </span>
                <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
