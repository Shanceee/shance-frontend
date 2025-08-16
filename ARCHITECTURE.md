# Модульная архитектура Shance

## 🏗️ Обзор архитектуры

Проект Shance построен по принципу **Feature-based модульной архитектуры**, что обеспечивает:

- **Масштабируемость** - легко добавлять новые функции
- **Поддерживаемость** - четкое разделение ответственности
- **Переиспользование** - общие компоненты и утилиты
- **Тестируемость** - изолированные модули проще тестировать

## 📁 Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Главный layout с провайдерами
│   └── page.tsx           # Главная страница
├── components/            # Переиспользуемые UI компоненты
│   └── ui/               # Базовые UI компоненты
│       ├── button.tsx    # Компонент кнопки
│       ├── input.tsx     # Компонент поля ввода
│       └── index.ts      # Экспорт компонентов
├── contexts/              # React Context провайдеры
│   └── AuthContext.tsx   # Контекст аутентификации
├── lib/                   # Утилиты и API клиент
│   ├── api.ts            # HTTP клиент
│   └── utils.ts          # Общие утилиты
├── modules/               # Модули приложения
│   ├── auth/             # Модуль аутентификации
│   │   ├── api/          # API методы
│   │   ├── components/   # UI компоненты
│   │   ├── hooks/        # React хуки
│   │   ├── types/        # TypeScript типы
│   │   └── index.ts      # Экспорт модуля
│   ├── dashboard/        # Модуль dashboard
│   │   ├── api/          # API методы
│   │   ├── hooks/        # React хуки
│   │   ├── types/        # TypeScript типы
│   │   └── index.ts      # Экспорт модуля
│   └── index.ts          # Главный экспорт всех модулей
├── types/                 # Общие типы
│   └── index.ts          # Базовые интерфейсы
├── constants/             # Константы приложения
│   └── index.ts          # Конфигурация и константы
└── examples/              # Примеры использования
    └── module-usage.tsx  # Демонстрация модулей
```

## 🚀 Модули

### Auth Module (`/modules/auth`)

**Назначение**: Управление аутентификацией пользователей

**Структура**:

- `types/` - интерфейсы User, LoginCredentials, RegisterCredentials
- `api/` - методы для работы с API аутентификации
- `hooks/` - хук useAuth для управления состоянием
- `components/` - формы входа и регистрации

**Использование**:

```tsx
import { useAuthContext, LoginForm } from '@/modules';
import { useAuthContext } from '@/contexts/AuthContext';

function App() {
  const { user, isAuthenticated, login } = useAuthContext();

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => console.log('Logged in!')} />;
  }

  return <div>Welcome, {user?.username}!</div>;
}
```

### Dashboard Module (`/modules/dashboard`)

**Назначение**: Отображение аналитики и статистики

**Структура**:

- `types/` - интерфейсы DashboardStats, ChartData, RecentActivity
- `api/` - методы для получения данных dashboard
- `hooks/` - хук useDashboard для загрузки данных

**Использование**:

```tsx
import { useDashboard } from '@/modules';

function DashboardPage() {
  const { stats, chartData, isLoading, loadDashboard } = useDashboard();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {stats?.totalUsers}</p>
    </div>
  );
}
```

## 🛠️ Основные компоненты

### API Client (`/lib/api.ts`)

Централизованный HTTP клиент с:

- Автоматической обработкой ошибок
- Таймаутами и retry логикой
- Типизированными методами
- Поддержкой всех HTTP методов

```tsx
import { apiClient } from '@/lib/api';

// GET запрос
const data = await apiClient.get<User>('/users/1');

// POST запрос
const response = await apiClient.post<User>('/users', userData);

// Запрос с пагинацией
const paginated = await apiClient.getPaginated<User>('/users', 1, 10);
```

### UI Components (`/components/ui/`)

Переиспользуемые компоненты с:

- TypeScript поддержкой
- Различными вариантами и размерами
- Доступностью из коробки
- Tailwind CSS стилизацией

```tsx
import { Button, Input } from '@/components/ui';

<Button variant="primary" size="lg" loading={isLoading}>
  Отправить
</Button>

<Input
  label="Email"
  type="email"
  error={errors.email}
  placeholder="your@email.com"
/>
```

### Context Providers (`/contexts/`)

React Context для глобального состояния:

- AuthContext - управление аутентификацией
- Легко расширяется для других состояний

```tsx
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

## 📝 Создание нового модуля

### 1. Создание структуры

```bash
mkdir -p src/modules/your-module/{api,components,hooks,types}
touch src/modules/your-module/index.ts
```

### 2. Определение типов (`types/index.ts`)

```tsx
export interface YourEntity {
  id: string;
  name: string;
  // ... другие поля
}

export interface YourState {
  data: YourEntity[];
  isLoading: boolean;
  error: string | null;
}
```

### 3. Создание API (`api/yourApi.ts`)

```tsx
import { apiClient } from '@/lib/api';
import type { ApiResponse } from '@/types';
import type { YourEntity } from '../types';

export const yourApi = {
  async getAll(): Promise<ApiResponse<YourEntity[]>> {
    return apiClient.get<ApiResponse<YourEntity[]>>('/your-endpoint');
  },

  async create(data: Omit<YourEntity, 'id'>): Promise<ApiResponse<YourEntity>> {
    return apiClient.post<ApiResponse<YourEntity>>('/your-endpoint', data);
  },
};
```

### 4. Создание хука (`hooks/useYour.ts`)

```tsx
import { useState, useEffect, useCallback } from 'react';
import { yourApi } from '../api/yourApi';
import type { YourState, YourEntity } from '../types';

export const useYour = () => {
  const [state, setState] = useState<YourState>({
    data: [],
    isLoading: false,
    error: null,
  });

  const loadData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await yourApi.getAll();

      if (response.success) {
        setState(prev => ({ ...prev, data: response.data, isLoading: false }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Ошибка загрузки',
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { ...state, loadData };
};
```

### 5. Создание компонентов (`components/YourComponent.tsx`)

```tsx
import React from 'react';
import { useYour } from '../hooks/useYour';

export const YourComponent: React.FC = () => {
  const { data, isLoading, error, loadData } = useYour();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

### 6. Экспорт модуля (`index.ts`)

```tsx
// Экспорт типов
export type { YourEntity, YourState } from './types';

// Экспорт API
export { yourApi } from './api/yourApi';

// Экспорт хуков
export { useYour } from './hooks/useYour';

// Экспорт компонентов
export { YourComponent } from './components/YourComponent';
```

### 7. Добавление в главный экспорт

```tsx
// src/modules/index.ts
export * from './auth';
export * from './dashboard';
export * from './your-module'; // Добавить эту строку
```

## 🎯 Лучшие практики

### Разделение ответственности

- Каждый модуль отвечает только за свою область
- Общие компоненты выносятся в `components/`
- Утилиты размещаются в `lib/`

### Типизация

- Все API методы строго типизированы
- Интерфейсы для всех сущностей
- Использование generic типов для API

### Переиспользование

- Общие UI компоненты в `components/ui/`
- Утилиты в `lib/utils.ts`
- Константы в `constants/index.ts`

### Консистентность

- Единый стиль именования
- Одинаковая структура модулей
- Консистентные паттерны API

## 🔍 Отладка и тестирование

### Логирование

```tsx
// В хуках и API методах
console.error('Failed to load data:', error);
console.log('Data loaded successfully:', data);
```

### Обработка ошибок

```tsx
try {
  const response = await api.getData();
  // Обработка успешного ответа
} catch (error) {
  console.error('API error:', error);
  // Показать пользователю ошибку
}
```

### Валидация данных

```tsx
// Проверка типов в runtime
if (typeof data.id !== 'string') {
  throw new Error('Invalid data format');
}
```

## 🚧 Расширение архитектуры

### Добавление новых провайдеров

```tsx
// src/contexts/ThemeContext.tsx
export const ThemeProvider: React.FC = ({ children }) => {
  // Логика управления темой
};
```

### Интеграция с внешними сервисами

```tsx
// src/lib/externalService.ts
export class ExternalService {
  // Методы для работы с внешним API
}
```

### Middleware для API

```tsx
// src/lib/apiMiddleware.ts
export const apiMiddleware = {
  // Логирование, кэширование, retry логика
};
```

## 📚 Дополнительные ресурсы

- [Next.js Documentation](https://nextjs.org/docs)
- [React Context API](https://react.dev/reference/react/createContext)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Вклад в проект

При добавлении новых модулей следуйте установленным паттернам:

1. Создайте структуру папок
2. Определите типы
3. Реализуйте API методы
4. Создайте хуки
5. Добавьте компоненты
6. Экспортируйте модуль
7. Обновите документацию
