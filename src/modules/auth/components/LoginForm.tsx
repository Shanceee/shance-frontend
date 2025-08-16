import React, { useState } from 'react';

import { useLogin } from '@/hooks';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import type { LoginCredentials } from '../types';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const loginMutation = useLogin();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Введите корректный email';
    }

    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const success = await loginMutation.mutateAsync(formData);
      if (success) {
        onSuccess?.();
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleInputChange = (
    field: keyof LoginCredentials,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 font-unbounded">
            Вход в систему
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-montserrat">
            Войдите в свой аккаунт
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {loginMutation.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600 font-montserrat">
                {loginMutation.error.message}
              </p>
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            error={validationErrors.email}
            placeholder="your@email.com"
            required
          />

          <Input
            label="Пароль"
            type="password"
            value={formData.password}
            onChange={e => handleInputChange('password', e.target.value)}
            error={validationErrors.password}
            placeholder="Введите пароль"
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={e =>
                  handleInputChange('rememberMe', e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 font-montserrat">
                Запомнить меня
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loginMutation.isPending}
            fullWidth
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-sm text-blue-600 hover:text-blue-500 font-medium font-montserrat"
          >
            Нет аккаунта? Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
