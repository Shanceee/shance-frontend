'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useSmoothScroll } from '@/hooks';
import { useCurrentUser, useLogout } from '@/modules/auth';
import { getImageUrl } from '@/lib/utils';

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
                  <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                    {user.avatar ? (
                      <Image
                        src={getImageUrl(user.avatar)}
                        alt="Avatar"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#00A851] to-[#008f45] flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {user.first_name?.charAt(0) ||
                            user.username?.charAt(0)?.toUpperCase() ||
                            user.email?.charAt(0)?.toUpperCase() ||
                            'U'}
                        </span>
                      </div>
                    )}
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
          <div className="md:hidden flex items-center space-x-3">
            {!isMounted || isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isAuthenticated && user ? (
              <button
                onClick={handleProfileClick}
                className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
              >
                {user.avatar ? (
                  <Image
                    src={getImageUrl(user.avatar)}
                    alt="Avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#00A851] to-[#008f45] flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user.first_name?.charAt(0) ||
                        user.username?.charAt(0)?.toUpperCase() ||
                        user.email?.charAt(0)?.toUpperCase() ||
                        'U'}
                    </span>
                  </div>
                )}
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
              className="w-10 h-10 flex items-center justify-center text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Мобильное меню выпадающее */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-white/10">
            <nav className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300 py-3 px-2 rounded-lg font-montserrat bg-transparent border-none cursor-pointer text-left w-full"
                >
                  {item.id === 'projects' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )}
                  {item.id === 'about' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {item.id === 'faq' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span>{item.text}</span>
                </button>
              ))}

              {isMounted && isAuthenticated && user && (
                <>
                  <div className="border-t border-white/10 my-2" />

                  <button
                    onClick={() => {
                      handleProfileClick();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 text-[#00A851] hover:bg-white/5 transition-all duration-300 py-3 px-2 rounded-lg font-montserrat font-medium bg-transparent border-none cursor-pointer text-left w-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Профиль</span>
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 text-red-400 hover:text-red-300 hover:bg-white/5 transition-all duration-300 py-3 px-2 rounded-lg font-montserrat bg-transparent border-none cursor-pointer text-left w-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Выйти</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
