import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'postcss.config.mjs',
      'tailwind.config.js',
      'jest.config.js',
      'jest.setup.js'
    ]
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      // Prettier интеграция
      'prettier/prettier': 'error',

      // Строгие правила для качества кода
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      // TypeScript правила
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],

      // React правила
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-key': 'error',

      // Импорты и структура
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
    },
  },
];

export default eslintConfig;
