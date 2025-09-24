import Image from 'next/image';

import { LoginForm } from '@/modules/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#161419] relative overflow-hidden">
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
