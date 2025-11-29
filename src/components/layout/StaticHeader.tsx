'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useSmoothScroll } from '@/hooks';
import { useCurrentUser, useLogout } from '@/modules/auth';

export function StaticHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { scrollToElementWithOffset } = useSmoothScroll();
  const { data: user, isLoading } = useCurrentUser();
  const logoutMutation = useLogout();
  const isAuthenticated = !!user;

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsUserMenuOpen(false);
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setIsUserMenuOpen(false);
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

          {/* Кнопка входа или пользователь для десктопа */}
          <div className="hidden md:flex items-center space-x-4 transition-all duration-500 opacity-100 translate-x-0">
            {!isMounted || isLoading ? (
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 px-4 py-2 text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 font-montserrat"
                >
                  <div className="w-6 h-6 bg-[#00A851] rounded-full flex items-center justify-center text-xs font-bold">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm">{user.email}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#202122] border border-white/20 rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors font-montserrat"
                    >
                      Профиль
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors font-montserrat"
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 font-montserrat"
              >
                Войти
              </Link>
            )}
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden flex items-center space-x-4">
            {!isMounted || isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isAuthenticated && user ? (
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-2 px-3 py-2 text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 font-montserrat"
              >
                <div className="w-5 h-5 bg-[#00A851] rounded-full flex items-center justify-center text-xs font-bold">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm truncate max-w-[100px]">
                  {user.email}
                </span>
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 font-montserrat"
              >
                Войти
              </Link>
            )}
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
              {isMounted && isAuthenticated && user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block text-white/80 hover:text-white transition-all duration-300 py-2 font-montserrat bg-transparent border-none cursor-pointer text-left w-full"
                >
                  Выйти
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
