export const APP_NAME = 'Shance';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Модульное приложение на Next.js';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
export const API_TIMEOUT = 10000;
export const API_RETRY_ATTEMPTS = 3;

export const PAGINATION_DEFAULT_PAGE = 1;
export const PAGINATION_DEFAULT_LIMIT = 10;
export const PAGINATION_MAX_LIMIT = 100;

export const VALIDATION_MIN_PASSWORD_LENGTH = 8;
export const VALIDATION_MAX_PASSWORD_LENGTH = 128;
export const VALIDATION_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LOCALE_DEFAULT = 'ru-RU';
export const LOCALE_SUPPORTED = ['ru-RU', 'en-US'];

export const THEME_DEFAULT = 'light';
export const THEME_SUPPORTED = ['light', 'dark', 'system'];

export const STATUS_ACTIVE = 'active';
export const STATUS_INACTIVE = 'inactive';
export const STATUS_PENDING = 'pending';
