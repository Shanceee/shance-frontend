'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';

import PhoneIcon from '@/assets/phone.svg';
import LockIcon from '@/assets/lock.svg';
import EyeIcon from '@/assets/eye.svg';
import { useRegister } from '@/modules/auth';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const { mutate: register, isPending, error: apiError } = useRegister();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    register(data);
  };

  return (
    <div className="min-h-screen bg-[#161419] relative overflow-hidden">
      {/* Decorative blurred ellipses */}
      <div
        className="absolute w-[488px] h-[488px] rounded-full opacity-40"
        style={{
          background: '#00A851',
          filter: 'blur(244px)',
          left: '1217px',
          top: '-25px',
        }}
      />
      <div
        className="absolute w-[488px] h-[488px] rounded-full opacity-40"
        style={{
          background: '#12FF78',
          filter: 'blur(244px)',
          left: '-34px',
          top: '721px',
        }}
      />

      {/* Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[101px] w-[100.455px] h-[102px]">
        <Image
          src="/images/logo.svg"
          width={100}
          height={102}
          alt="Shance Logo"
          priority
        />
      </div>

      {/* Main form container */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[220px] w-[456px] max-w-[90vw]">
        <div className="flex flex-col gap-3 items-start justify-center">
          {/* Header with title */}
          <div className="flex items-center justify-between px-7 py-0 w-full">
            <h1 className="font-unbounded font-semibold text-[#ebebeb] text-[20px] leading-[1.8em]">
              Регистрация
            </h1>
          </div>

          {/* Form Card */}
          <div className="bg-[#202122] flex flex-col gap-[22px] items-center justify-center p-[28px] rounded-[20px] w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-[22px] items-center"
            >
              {/* Email input */}
              <div className="w-full max-w-[400px]">
                <div className="bg-[rgba(217,217,217,0.05)] flex gap-3 h-[58px] items-center justify-start px-5 py-2.5 relative rounded-[12px] w-full">
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[12px]"
                    style={{
                      border: '1px solid',
                      borderImage:
                        'linear-gradient(131deg, rgba(173, 173, 173, 1) 0%, rgba(32, 30, 35, 0.2) 31%, rgba(178, 178, 178, 0.2) 68%, rgba(176, 176, 176, 1) 100%) 1',
                    }}
                  />
                  <div className="relative shrink-0 size-[17.964px]">
                    <PhoneIcon className="block max-w-none size-full text-[#575757]" />
                  </div>
                  <div className="bg-[#575757] h-5 shrink-0 w-px" />
                  <input
                    type="email"
                    {...formRegister('email')}
                    placeholder="Email"
                    disabled={isPending}
                    className="font-unbounded font-medium text-[18px] leading-[24px] text-white bg-transparent border-none outline-none flex-1 placeholder:text-[#808080]"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 ml-2 font-unbounded">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Username input */}
              <div className="w-full max-w-[400px]">
                <div className="bg-[rgba(217,217,217,0.05)] flex gap-3 h-[58px] items-center justify-start px-5 py-2.5 relative rounded-[12px] w-full">
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[12px]"
                    style={{
                      border: '1px solid',
                      borderImage:
                        'linear-gradient(131deg, rgba(173, 173, 173, 1) 0%, rgba(32, 30, 35, 0.2) 31%, rgba(178, 178, 178, 0.2) 68%, rgba(176, 176, 176, 1) 100%) 1',
                    }}
                  />
                  <svg
                    className="shrink-0"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z"
                      stroke="#575757"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.4425 16.5C15.4425 13.6005 12.6217 11.25 9.00001 11.25C5.37826 11.25 2.55751 13.6005 2.55751 16.5"
                      stroke="#575757"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="bg-[#575757] h-5 shrink-0 w-px" />
                  <input
                    type="text"
                    {...formRegister('username')}
                    placeholder="Имя пользователя"
                    disabled={isPending}
                    className="font-unbounded font-medium text-[18px] leading-[24px] text-white bg-transparent border-none outline-none flex-1 placeholder:text-[#808080]"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-400 text-xs mt-1 ml-2 font-unbounded">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password input */}
              <div className="w-full max-w-[400px]">
                <div className="bg-[rgba(217,217,217,0.05)] flex h-[58px] items-center justify-between px-5 py-2.5 relative rounded-[12px] w-full">
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[12px]"
                    style={{
                      border: '1px solid',
                      borderImage:
                        'linear-gradient(131deg, rgba(173, 173, 173, 1) 0%, rgba(32, 30, 35, 0.2) 31%, rgba(178, 178, 178, 0.2) 68%, rgba(176, 176, 176, 1) 100%) 1',
                    }}
                  />
                  <div className="flex gap-3 items-center justify-start relative flex-1">
                    <div className="h-5 relative shrink-0 w-[16.667px]">
                      <LockIcon className="block max-w-none size-full text-[#575757]" />
                    </div>
                    <div className="bg-[#575757] h-5 shrink-0 w-px" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...formRegister('password')}
                      placeholder="Пароль"
                      disabled={isPending}
                      className="font-unbounded font-medium text-[18px] leading-[24px] text-white bg-transparent border-none outline-none flex-1 placeholder:text-[#808080]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="relative shrink-0 size-5 hover:opacity-70 transition-opacity ml-3"
                  >
                    <EyeIcon className="block max-w-none size-full text-[#575757]" />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1 ml-2 font-unbounded">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Password confirmation input */}
              <div className="w-full max-w-[400px]">
                <div className="bg-[rgba(217,217,217,0.05)] flex h-[58px] items-center justify-between px-5 py-2.5 relative rounded-[12px] w-full">
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[12px]"
                    style={{
                      border: '1px solid',
                      borderImage:
                        'linear-gradient(131deg, rgba(173, 173, 173, 1) 0%, rgba(32, 30, 35, 0.2) 31%, rgba(178, 178, 178, 0.2) 68%, rgba(176, 176, 176, 1) 100%) 1',
                    }}
                  />
                  <div className="flex gap-3 items-center justify-start relative flex-1">
                    <div className="h-5 relative shrink-0 w-[16.667px]">
                      <LockIcon className="block max-w-none size-full text-[#575757]" />
                    </div>
                    <div className="bg-[#575757] h-5 shrink-0 w-px" />
                    <input
                      type={showPasswordConfirm ? 'text' : 'password'}
                      {...formRegister('password_confirm')}
                      placeholder="Подтвердите пароль"
                      disabled={isPending}
                      className="font-unbounded font-medium text-[18px] leading-[24px] text-white bg-transparent border-none outline-none flex-1 placeholder:text-[#808080]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="relative shrink-0 size-5 hover:opacity-70 transition-opacity ml-3"
                  >
                    <EyeIcon className="block max-w-none size-full text-[#575757]" />
                  </button>
                </div>
                {errors.password_confirm && (
                  <p className="text-red-400 text-xs mt-1 ml-2 font-unbounded">
                    {errors.password_confirm.message}
                  </p>
                )}
              </div>

              {/* Submit button and privacy policy */}
              <div className="flex flex-col gap-3.5 items-center justify-center relative shrink-0 w-full">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex gap-2.5 h-[58px] items-center justify-center overflow-clip px-[52px] py-0 relative rounded-[12px] shrink-0 w-full max-w-[400px] bg-gradient-to-br from-[#232323] to-[#2f835e] hover:from-[#2f835e] hover:to-[#3a9e72] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <span className="font-unbounded font-medium text-[#d8d8d8] text-[18px] text-center">
                    {isPending ? 'Регистрация...' : 'Зарегистрироваться'}
                  </span>
                </button>

                {apiError && (
                  <p className="text-red-400 text-sm font-unbounded text-center">
                    {apiError.message || 'Ошибка регистрации'}
                  </p>
                )}

                <p className="font-jost font-medium text-[#aaaaaa] text-[13px] leading-[1.23em] text-center max-w-[400px]">
                  <span>Продолжая, я соглашаюсь с </span>
                  <Link
                    href="/privacy"
                    className="text-[#ebebeb] hover:text-white cursor-pointer transition-colors"
                  >
                    Политикой конфиденциальности
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Login link */}
          <div className="flex items-center justify-between px-7 py-0 w-full">
            <span className="font-unbounded font-normal text-[#aaaaaa] text-[14px] leading-[16px]">
              Есть аккаунт?
            </span>
            <Link
              href="/login"
              className="font-unbounded font-normal text-[#ebebeb] text-[14px] leading-[16px] hover:text-white transition-colors"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
