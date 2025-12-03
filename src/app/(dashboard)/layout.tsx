'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { useCurrentUser, useLogout } from '@/modules/auth';
import { tokenManager } from '@/lib/api';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const router = useRouter();
  const logout = useLogout();
  const hasRedirected = useRef(false);

  // Only fetch user data if we have a token
  const { data: user, isLoading, isError } = useCurrentUser();

  // Handle all redirects in useEffect to avoid setState during render
  useEffect(() => {
    const token = tokenManager.getToken();

    // No token - redirect to login
    if (!token) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.replace('/login');
      }
      return;
    }

    // Has token - allow render
    setShouldRender(true);
  }, [router]);

  // Handle error state redirect in separate effect
  // Only clear tokens and redirect if we explicitly got an auth error
  useEffect(() => {
    // Only handle actual errors, not initial loading states
    if (isError && !isLoading) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        tokenManager.clearTokens();
        router.replace('/login');
      }
    }
  }, [isLoading, isError, router]);

  const handleLogout = () => {
    logout.mutate();
    setIsSettingsOpen(false);
  };

  // Don't render until we've confirmed we have a token
  if (!shouldRender) {
    return null;
  }

  // Show loading only when we have a token and are verifying it
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#161419] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00A851] mx-auto mb-4"></div>
          <p className="text-white/80 font-montserrat">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  // If still no user after loading, show nothing (redirect happening in effect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#161419]">
      {/* Profile page header with navigation */}
      <header className="border-b border-white/10 bg-[#161419]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative w-8 h-8">
                  <Image
                    src="/images/logo.svg"
                    alt="Shance Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-white text-lg font-bold font-unbounded">
                  shance
                </span>
              </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center space-x-2 text-white/80 hover:text-white font-montserrat transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Главная</span>
              </Link>

              <Link
                href="/projects"
                className="flex items-center space-x-2 text-white/80 hover:text-white font-montserrat transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span>Проекты</span>
              </Link>

              <Link
                href="/profile"
                className="flex items-center space-x-2 text-[#00A851] font-montserrat font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Профиль</span>
              </Link>
            </nav>

            {/* Settings dropdown - Desktop only */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                aria-label="Settings"
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              {/* Settings dropdown menu */}
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#202122] border border-white/20 rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={() => {
                      router.push('/settings');
                      setIsSettingsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors font-montserrat flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                      />
                    </svg>
                    <span>Настройки</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors font-montserrat flex items-center space-x-2 disabled:opacity-50"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>{logout.isPending ? 'Выход...' : 'Выйти'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isSettingsOpen ? (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
              )}
            </button>
          </div>

          {/* Mobile navigation menu */}
          {isSettingsOpen && (
            <div className="md:hidden border-t border-white/10 py-4">
              <nav className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex items-center space-x-3 text-white/80 hover:text-white hover:bg-white/5 font-montserrat transition-colors py-3 px-2 rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Главная</span>
                </Link>

                <Link
                  href="/projects"
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex items-center space-x-3 text-white/80 hover:text-white hover:bg-white/5 font-montserrat transition-colors py-3 px-2 rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <span>Проекты</span>
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex items-center space-x-3 text-[#00A851] hover:bg-white/5 font-montserrat font-medium transition-colors py-3 px-2 rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Профиль</span>
                </Link>

                <div className="border-t border-white/10 my-2" />

                <button
                  onClick={() => {
                    router.push('/settings');
                    setIsSettingsOpen(false);
                  }}
                  className="flex items-center space-x-3 text-white/80 hover:text-white hover:bg-white/5 font-montserrat transition-colors py-3 px-2 rounded-lg w-full text-left"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Настройки</span>
                </button>

                <button
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="flex items-center space-x-3 text-red-400 hover:text-red-300 hover:bg-white/5 font-montserrat transition-colors py-3 px-2 rounded-lg w-full text-left disabled:opacity-50"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>{logout.isPending ? 'Выход...' : 'Выйти'}</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
