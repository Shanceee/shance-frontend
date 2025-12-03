import ky, { type KyInstance, type Options } from 'ky';

import { ApiError } from '@/types/api';

const TOKEN_KEY = 'shance_jwt_token';
const REFRESH_KEY = 'shance_refresh_token';

export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(TOKEN_KEY);
    // Filter out invalid values that might have been stored
    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    return token;
  },

  setToken: (token: string | undefined | null): void => {
    if (typeof window === 'undefined') return;
    // Only set valid tokens
    if (token && token !== 'undefined' && token !== 'null') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(REFRESH_KEY);
    // Filter out invalid values that might have been stored
    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    return token;
  },

  setRefreshToken: (token: string | undefined | null): void => {
    if (typeof window === 'undefined') return;
    // Only set valid tokens
    if (token && token !== 'undefined' && token !== 'null') {
      localStorage.setItem(REFRESH_KEY, token);
    }
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken();
  },
};

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    throw new ApiError('No refresh token', 401);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://185.171.82.179:8000/api/v1'}/auth/refresh/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    }
  );

  if (!response.ok) {
    tokenManager.clearTokens();
    throw new ApiError('Token refresh failed', response.status);
  }

  const data = await response.json();
  tokenManager.setToken(data.access);
  if (data.refresh) {
    tokenManager.setRefreshToken(data.refresh);
  }

  return data.access;
};

const baseApi: KyInstance = ky.create({
  prefixUrl:
    process.env.NEXT_PUBLIC_API_URL || 'http://185.171.82.179:8000/api/v1',
  timeout: 30000,
  hooks: {
    beforeRequest: [
      request => {
        const token = tokenManager.getToken();

        // Add Authorization header if token exists
        if (token) {
          request.headers.set('Authorization', `JWT ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401 && !request.url.includes('/auth/refresh')) {
          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshAccessToken().finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
          }

          try {
            const newToken = await refreshPromise;
            if (newToken) {
              request.headers.set('Authorization', `JWT ${newToken}`);
              return ky(request, options);
            }
          } catch {
            tokenManager.clearTokens();
            if (
              typeof window !== 'undefined' &&
              !window.location.pathname.includes('/login')
            ) {
              window.location.href = '/login';
            }
          }
        }
        return response;
      },
    ],
    beforeError: [
      async error => {
        const { response } = error;
        if (response) {
          try {
            const data = (await response.json()) as Record<string, unknown>;
            const message =
              (data.detail as string) ||
              (data.message as string) ||
              `HTTP error ${response.status}`;
            throw new ApiError(message, response.status, data);
          } catch (e) {
            if (e instanceof ApiError) throw e;
            throw new ApiError(
              `HTTP error ${response.status}`,
              response.status
            );
          }
        }
        return error;
      },
    ],
  },
});

type RequestParams = Record<
  string,
  string | number | boolean | undefined | null
>;

function buildSearchParams(params?: RequestParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  const str = searchParams.toString();
  return str ? `?${str}` : '';
}

export const api = {
  get: <T>(
    url: string,
    params?: RequestParams,
    options?: Options
  ): Promise<T> =>
    baseApi.get(`${url}${buildSearchParams(params)}`, options).json<T>(),

  post: <T>(url: string, data?: unknown, options?: Options): Promise<T> =>
    baseApi.post(url, { json: data, ...options }).json<T>(),

  put: <T>(url: string, data?: unknown, options?: Options): Promise<T> =>
    baseApi.put(url, { json: data, ...options }).json<T>(),

  patch: <T>(url: string, data?: unknown, options?: Options): Promise<T> =>
    baseApi.patch(url, { json: data, ...options }).json<T>(),

  delete: <T>(url: string, options?: Options): Promise<T> =>
    baseApi.delete(url, options).json<T>(),

  upload: <T>(url: string, formData: FormData, options?: Options): Promise<T> =>
    baseApi.post(url, { body: formData, ...options }).json<T>(),
};
