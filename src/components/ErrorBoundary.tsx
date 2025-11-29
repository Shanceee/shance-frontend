'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (_error: Error, _reset: () => void) => ReactNode;
}

class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, _errorInfo);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, () => {
          this.setState({ hasError: false, error: undefined });
        });
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#161419] text-white">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-2xl font-bold text-red-400">
              Что-то пошло не так
            </h1>
            <p className="text-gray-300 max-w-md">
              Произошла неожиданная ошибка. Пожалуйста, попробуйте обновить
              страницу.
            </p>
            <div className="space-x-4">
              <button
                onClick={() =>
                  this.setState({ hasError: false, error: undefined })
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Попробовать снова
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Обновить страницу
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-gray-400 hover:text-white">
                  Детали ошибки (только для разработки)
                </summary>
                <pre className="mt-2 p-4 bg-gray-800 rounded text-sm overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main Error Boundary component with Query Error Reset Boundary
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundaryClass
          fallback={
            fallback ||
            ((_error, _resetError) => (
              <div className="min-h-screen flex items-center justify-center bg-[#161419] text-white">
                <div className="text-center space-y-4 p-8">
                  <h1 className="text-2xl font-bold text-red-400">
                    Ошибка загрузки данных
                  </h1>
                  <p className="text-gray-300 max-w-md">
                    Не удалось загрузить данные. Проверьте подключение к
                    интернету и попробуйте еще раз.
                  </p>
                  <div className="space-x-4">
                    <button
                      onClick={() => {
                        reset();
                        _resetError();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Попробовать снова
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      Обновить страницу
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
        >
          {children}
        </ErrorBoundaryClass>
      )}
    </QueryErrorResetBoundary>
  );
}

export default ErrorBoundary;
