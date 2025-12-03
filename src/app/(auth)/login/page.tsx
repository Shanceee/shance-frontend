'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { LoginForm } from '@/modules/auth';
import { tokenManager } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication only once on mount
  useEffect(() => {
    if (!isClient) return;

    const token = tokenManager.getToken();
    if (token) {
      // User is already logged in, redirect to profile
      router.replace('/profile');
    } else {
      // No token, show login form
      setIsChecking(false);
    }
  }, [isClient, router]);

  // Show loading state while checking auth
  if (!isClient || isChecking) {
    return (
      <div className="min-h-screen bg-[#161419] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00A851] mx-auto mb-4"></div>
          <p className="text-white/80 font-montserrat">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161419] relative overflow-x-hidden overflow-y-auto">
      {/* Decorative blurred ellipses */}
      <div
        className="absolute w-[300px] h-[300px] sm:w-[488px] sm:h-[488px] rounded-full opacity-40 -left-[100px] -top-[50px]"
        style={{
          background: '#00A851',
          filter: 'blur(244px)',
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] sm:w-[488px] sm:h-[488px] rounded-full opacity-40 -right-[100px] bottom-[50px]"
        style={{
          background: '#12FF78',
          filter: 'blur(244px)',
        }}
      />

      {/* Content container with proper mobile scrolling */}
      <div className="relative flex flex-col items-center min-h-screen px-4 sm:px-6 py-8 sm:py-0">
        {/* Logo */}
        <div className="w-[80px] h-[81px] sm:w-[100px] sm:h-[102px] mt-8 sm:mt-[101px] mb-6 sm:mb-8">
          <Image
            src="/images/logo.svg"
            width={100}
            height={102}
            alt="Shance Logo"
            className="w-full h-full"
          />
        </div>

        {/* Main form container */}
        <div className="w-full max-w-[456px]">
          <div className="flex flex-col gap-4 sm:gap-5 items-center justify-start">
            {/* Header with title and forgot password link */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-7 py-0 w-full gap-2 sm:gap-0">
              <h1 className="font-unbounded font-semibold text-[#ebebeb] text-[18px] sm:text-[20px] leading-[28px] sm:leading-[36px]">
                Авторизация
              </h1>
              <button className="font-unbounded font-normal text-[#ebebeb] text-[13px] sm:text-[14px] leading-[16px] hover:text-white transition-colors">
                Забыли пароль?
              </button>
            </div>

            {/* Form */}
            <div className="bg-[#202122] flex flex-col gap-[18px] sm:gap-[22px] items-center justify-center p-5 sm:p-[28px] rounded-[16px] sm:rounded-[20px] w-full">
              <LoginForm />
            </div>

            {/* Registration link */}
            <div className="flex items-center justify-between px-4 sm:px-7 py-0 w-full">
              <span className="font-unbounded font-normal text-[#aaaaaa] text-[13px] sm:text-[14px] leading-[16px]">
                Нет аккаунта?
              </span>
              <a
                href="/register"
                className="font-unbounded font-normal text-[#ebebeb] text-[13px] sm:text-[14px] leading-[16px] hover:text-white transition-colors"
              >
                Зарегистрироваться
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
