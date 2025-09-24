'use client';
import { useState } from 'react';

import PhoneIcon from '@/assets/phone.svg';
import LockIcon from '@/assets/lock.svg';
import EyeIcon from '@/assets/eye.svg';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* Phone number input */}
      <div className="bg-[rgba(217,217,217,0.05)] flex gap-3 h-[58px] items-center justify-start px-5 py-2.5 relative rounded-[12px] w-full max-w-[400px]">
        <div className="absolute border border-[#adadad] border-solid inset-0 pointer-events-none rounded-[12px]" />
        <div className="relative shrink-0 size-[17.964px]">
          <PhoneIcon className="block max-w-none size-full" />
        </div>
        <div className="bg-[#575757] h-5 shrink-0 w-px" />
        <input
          type="tel"
          placeholder="Номер телефона"
          className="font-unbounded font-medium text-[18px] leading-[24px] text-[grey] bg-transparent border-none outline-none flex-1 placeholder:text-[grey]"
        />
      </div>

      {/* Password input */}
      <div className="bg-[rgba(217,217,217,0.05)] flex h-[58px] items-center justify-between px-5 py-2.5 relative rounded-[12px] w-full max-w-[400px]">
        <div className="absolute border border-[#adadad] border-solid inset-0 pointer-events-none rounded-[12px]" />
        <div className="flex gap-3 items-center justify-start relative shrink-0">
          <div className="h-5 relative shrink-0 w-[16.667px]">
            <LockIcon className="block max-w-none size-full" />
          </div>
          <div className="bg-[#575757] h-5 shrink-0 w-px" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Пароль"
            className="font-unbounded font-medium text-[18px] leading-[24px] text-[grey] bg-transparent border-none outline-none flex-1 placeholder:text-[grey]"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="relative shrink-0 size-5 hover:opacity-70 transition-opacity"
        >
          <div className="absolute inset-[10%_-0.06%_12.13%_0.02%]">
            <EyeIcon className="block max-w-none size-full" />
          </div>
        </button>
      </div>

      {/* Submit button and privacy policy */}
      <div className="flex flex-col gap-3.5 items-center justify-center relative shrink-0">
        <button className="flex gap-2.5 h-[58px] items-center justify-center overflow-clip px-[52px] py-0 relative rounded-[12px] shrink-0 w-full max-w-[400px] bg-gradient-to-r from-[#4A90E2] to-[#357ABD] hover:from-[#357ABD] hover:to-[#2E6BA8] transition-all duration-300">
          <span className="font-unbounded font-medium text-[#d8d8d8] text-[18px] text-center">
            Зарегистрироваться
          </span>
        </button>

        <p className="font-miracode text-[#aaaaaa] text-[13px] leading-[16px] text-center">
          <span>Продолжая, я соглашаюсь с </span>
          <span className="text-[#ebebeb] hover:text-white cursor-pointer transition-colors">
            Политикой конфиденциальности
          </span>
        </p>
      </div>
    </>
  );
}
