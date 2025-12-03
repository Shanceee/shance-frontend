'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import EmailIcon from '@/assets/email.svg';
import LockIcon from '@/assets/lock.svg';
import EyeIcon from '@/assets/eye.svg';
import { useLogin } from '@/modules/auth';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error: apiError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-4 sm:gap-[22px] items-center"
    >
      {/* Email input */}
      <div className="w-full">
        <div className="bg-[rgba(217,217,217,0.05)] flex gap-2 sm:gap-3 h-[50px] sm:h-[58px] items-center justify-start px-4 sm:px-5 py-2.5 relative rounded-[12px] w-full">
          <div className="absolute border border-[#adadad] border-solid inset-0 pointer-events-none rounded-[12px]" />
          <div className="relative shrink-0 size-4 sm:size-[17.964px]">
            <EmailIcon className="block max-w-none size-full text-[#575757]" />
          </div>
          <div className="bg-[#575757] h-4 sm:h-5 shrink-0 w-px" />
          <input
            type="email"
            {...register('email')}
            placeholder="Email"
            disabled={isPending}
            autoComplete="email"
            className="font-unbounded font-medium text-[15px] sm:text-[18px] leading-[20px] sm:leading-[24px] text-white bg-transparent border-none outline-none flex-1 min-w-0 placeholder:text-[#808080]"
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-xs mt-1 ml-2 font-unbounded">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password input */}
      <div className="w-full">
        <div className="bg-[rgba(217,217,217,0.05)] flex h-[50px] sm:h-[58px] items-center justify-between px-4 sm:px-5 py-2.5 relative rounded-[12px] w-full">
          <div className="absolute border border-[#adadad] border-solid inset-0 pointer-events-none rounded-[12px]" />
          <div className="flex gap-2 sm:gap-3 items-center justify-start relative flex-1 min-w-0">
            <div className="h-4 sm:h-5 relative shrink-0 w-4 sm:w-[16.667px]">
              <LockIcon className="block max-w-none size-full text-[#575757]" />
            </div>
            <div className="bg-[#575757] h-4 sm:h-5 shrink-0 w-px" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="Пароль"
              disabled={isPending}
              autoComplete="current-password"
              className="font-unbounded font-medium text-[15px] sm:text-[18px] leading-[20px] sm:leading-[24px] text-white bg-transparent border-none outline-none flex-1 min-w-0 placeholder:text-[#808080]"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="relative shrink-0 size-5 hover:opacity-70 transition-opacity ml-2 sm:ml-3"
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

      {/* Submit button and privacy policy */}
      <div className="flex flex-col gap-3 sm:gap-3.5 items-center justify-center relative shrink-0 w-full">
        <button
          type="submit"
          disabled={isPending}
          className="flex gap-2.5 h-[50px] sm:h-[58px] items-center justify-center overflow-clip px-8 sm:px-[52px] py-0 relative rounded-[12px] shrink-0 w-full bg-gradient-to-br from-[#232323] to-[#2f835e] hover:from-[#2f835e] hover:to-[#3a9e72] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <span className="font-unbounded font-medium text-[#d8d8d8] text-[16px] sm:text-[18px] text-center">
            {isPending ? 'Вход...' : 'Войти'}
          </span>
        </button>

        {apiError && (
          <p className="text-red-400 text-sm font-unbounded text-center">
            {apiError.message || 'Ошибка входа'}
          </p>
        )}

        <p className="font-jost font-medium text-[#aaaaaa] text-[12px] sm:text-[13px] leading-[1.23em] text-center px-2">
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
  );
}

export default LoginForm;
