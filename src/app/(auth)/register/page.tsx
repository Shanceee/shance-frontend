'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { RegisterForm } from '@/modules/auth';
import { tokenManager } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (tokenManager.getToken()) {
      router.replace('/dashboard');
    }
  }, [router]);

  return <RegisterForm />;
}
