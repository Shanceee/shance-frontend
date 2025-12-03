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
    <div className="min-h-screen bg-[#161419] relative overflow-hidden">
      {/* Decorative blurred ellipses */}
      <div
        className="absolute w-[488px] h-[488px] rounded-full opacity-40"
        style={{
          background: '#00A851',
          filter: 'blur(244px)',
          left: '-100px',
          top: '-50px',
        }}
      />
      <div
        className="absolute w-[488px] h-[488px] rounded-full opacity-40"
        style={{
          background: '#12FF78',
          filter: 'blur(244px)',
          right: '-100px',
          bottom: '50px',
        }}
      />

      <div className="absolute h-[102px] left-1/2 transform -translate-x-1/2 top-[101px] w-[100.455px]">
        <Image
          src="/images/logo.svg"
          width={500}
          height={500}
          alt="Shance Logo"
        />
      </div>

      {/* Main form container */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[220px] w-[456px] max-w-[90vw]">
        <div className="flex flex-col gap-5 items-center justify-start">
          {/* Header with title and forgot password link */}
          <div className="flex items-center justify-between px-7 py-0 w-full">
            <h1 className="font-unbounded font-semibold text-[#ebebeb] text-[20px] leading-[36px]">
              Авторизация
            </h1>
            <button className="font-unbounded font-normal text-[#ebebeb] text-[14px] leading-[16px] hover:text-white transition-colors">
              Забыли пароль?
            </button>
          </div>

          {/* Form */}
          <div className="bg-[#202122] flex flex-col gap-[22px] items-center justify-center p-[28px] rounded-[20px] w-full">
            <LoginForm />
          </div>

          {/* Registration link */}
          <div className="flex items-center justify-between px-7 py-0 w-full">
            <span className="font-unbounded font-normal text-[#aaaaaa] text-[14px] leading-[16px]">
              Нет аккаунта?
            </span>
            <a
              href="/register"
              className="font-unbounded font-normal text-[#ebebeb] text-[14px] leading-[16px] hover:text-white transition-colors"
            >
              Зарегистрироваться
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
