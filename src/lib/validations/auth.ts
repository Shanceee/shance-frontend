import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный формат email'),
  password: z.string().min(1, 'Введите пароль'),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Введите email')
      .email('Некорректный формат email')
      .max(254, 'Email слишком длинный'),
    username: z
      .string()
      .min(3, 'Минимум 3 символа')
      .max(150, 'Максимум 150 символов')
      .regex(/^[\w.@+-]+$/, 'Только буквы, цифры и @/./+/-/_'),
    password: z.string().min(8, 'Минимум 8 символов'),
    password_confirm: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine(data => data.password === data.password_confirm, {
    message: 'Пароли не совпадают',
    path: ['password_confirm'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
