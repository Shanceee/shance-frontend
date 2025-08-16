'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo-vector-2.svg"
                alt="Shance Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-white text-xl font-bold font-unbounded">
              shance
            </span>
          </Link>

          {/* Навигация */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/projects"
              className="text-white/80 hover:text-white transition-colors font-montserrat"
            >
              Проекты
            </Link>
            <Link
              href="/about"
              className="text-white/80 hover:text-white transition-colors font-montserrat"
            >
              О нас
            </Link>
            <Link
              href="/faq"
              className="text-white/80 hover:text-white transition-colors font-montserrat"
            >
              FAQ
            </Link>
          </nav>

          {/* Кнопка входа */}
          <div className="flex items-center space-x-4">
            <button className="px-6 py-2 text-white border border-white/20 rounded-full hover:bg-white/10 transition-colors font-montserrat">
              Войти
            </button>

            {/* Мобильное меню */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link
                href="/projects"
                className="text-white/80 hover:text-white transition-colors font-montserrat"
                onClick={() => setIsMenuOpen(false)}
              >
                Проекты
              </Link>
              <Link
                href="/about"
                className="text-white/80 hover:text-white transition-colors font-montserrat"
                onClick={() => setIsMenuOpen(false)}
              >
                О нас
              </Link>
              <Link
                href="/faq"
                className="text-white/80 hover:text-white transition-colors font-montserrat"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
