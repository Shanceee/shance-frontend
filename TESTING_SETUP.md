# Настройка тестирования и линтинга

## Установленные инструменты

### 1. ESLint + Prettier

- **ESLint** - статический анализ кода
- **Prettier** - автоматическое форматирование кода
- **husky** - Git hooks для автоматической проверки
- **lint-staged** - проверка только измененных файлов

### 2. Jest + Testing Library

- **Jest** - фреймворк для тестирования
- **@testing-library/react** - утилиты для тестирования React компонентов
- **@testing-library/jest-dom** - дополнительные матчеры для Jest

## Команды

### Линтинг и форматирование

```bash
# Проверка ESLint
npm run lint

# Автоматическое исправление ESLint ошибок
npm run lint:fix

# Форматирование кода с Prettier
npm run format

# Проверка форматирования
npm run format:check
```

### Тестирование

```bash
# Запуск всех тестов
npm test

# Запуск тестов в watch режиме
npm run test:watch

# Запуск тестов с покрытием
npm run test:coverage
```

## Pre-commit хуки

При каждом коммите автоматически:

1. Запускается ESLint проверка
2. Запускаются все тесты
3. Если что-то не проходит - коммит блокируется

## Структура тестов

```
src/
├── lib/__tests__/
│   └── utils.test.ts          # Тесты для utility функций
└── stores/__tests__/
    └── authStore.test.ts      # Тесты для auth store
```

## Написание тестов

### Пример теста для utility функции

```typescript
import { isValidEmail } from '../utils';

describe('isValidEmail', () => {
  it('should validate correct emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
  });
});
```

### Пример теста для store

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authStore';

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it('should set user correctly', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser({ id: '1', email: 'test@test.com' });
    });

    expect(result.current.user).toEqual({ id: '1', email: 'test@test.com' });
  });
});
```

## Конфигурация

### ESLint (.eslintrc.js)

- Строгие правила для качества кода
- Интеграция с Prettier
- Правила для TypeScript и React

### Prettier (.prettierrc)

- Одинарные кавычки
- Точка с запятой
- Ширина строки: 80 символов

### Jest (jest.config.js)

- Поддержка Next.js
- Покрытие кода: 70%
- Mock для Next.js router

## Troubleshooting

### ESLint ошибки

1. Запустите `npm run lint:fix` для автоматического исправления
2. Проверьте правила в `.eslintrc.js`
3. Используйте комментарии `// eslint-disable-next-line` для исключений

### Тесты не проходят

1. Проверьте консоль на ошибки
2. Убедитесь, что все зависимости установлены
3. Проверьте mock'и в `jest.setup.js`

### Pre-commit не работает

1. Убедитесь, что husky установлен: `npx husky install`
2. Проверьте права на файл: `chmod +x .husky/pre-commit`
3. Проверьте, что Git hooks включены в проекте
