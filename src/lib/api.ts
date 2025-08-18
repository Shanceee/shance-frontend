class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    this.timeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT || 10000);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        500
      );
    }
  }

  // GET запрос
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST запрос
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT запрос
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH запрос
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE запрос
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Запрос с пагинацией
  async getPaginated<T>(
    endpoint: string,
    page: number = 1,
    limit: number = 10
  ): Promise<import('@/types').PaginatedResponse<T>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.get(`${endpoint}?${params}`);
  }
}

export const apiClient = new ApiClient();
export { ApiError };

// API для идеальных проектов
export const getPerfectProjects = async () => {
  // TODO: Заменить на реальный API endpoint
  // const response = await fetch('/api/perfect-projects')
  // return response.json()

  // Моковые данные для демонстрации
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: 'perfect-1',
          title: 'GreenScan – анализ',
          description:
            'Sed ut perspiciatis, unde omnis iste voluptatem perspiciatis omnis iste sed ut unde omnis sed ut',
          date: '09/01/2024',
          imageSrc: '/images/fon2.png',
          imageAlt: 'GreenScan анализ',
          tags: [
            '#анализ',
            '#углерод',
            '#неросети',
            '#знакомство',
            '#сближение',
          ],
        },
        {
          id: 'perfect-2',
          title: 'дневник здоровья с AI-анализом',
          description:
            'Sed ut perspiciatis, unde omnis iste voluptatem perspiciatis omnis iste sed ut unde omnis sed ut',
          date: '12/03/2024',
          imageSrc: '/images/fon1.png',
          imageAlt: 'Дневник здоровья',
          tags: ['#рефлексия', '#игра', '#медицина', '#ИИ', '#здоровье'],
        },
        {
          id: 'perfect-3',
          title: 'Мобильное приложение "Честно"',
          description:
            'Sed ut perspiciatis, unde omnis iste voluptatem perspiciatis omnis iste sed ut unde omnis sed ut',
          date: '12/03/2025',
          imageSrc: '/images/fon3.png',
          imageAlt: 'Приложение Честно',
          tags: ['#рефлексия', '#игра', '#друзья', '#знакомство', '#сближение'],
          isPrototype: true,
        },
        {
          id: 'perfect-4',
          title: 'EduMind – платформа с курсами',
          description:
            'Sed ut perspiciatis, unde omnis iste voluptatem perspiciatis omnis iste sed ut unde omnis sed ut',
          date: '11/04/2025',
          imageSrc: '/images/fon1.png',
          imageAlt: 'Платформа EduMind',
          tags: ['#курсы', '#обучение', '#ИИ', '#нейросети', '#анализ'],
        },
        {
          id: 'perfect-5',
          title: 'FaceLock – биометрический замок',
          description:
            'Sed ut perspiciatis, unde omnis iste voluptatem perspiciatis omnis iste sed ut unde omnis sed ut',
          date: '12/03/2025',
          imageSrc: '/images/fon2.png',
          imageAlt: 'FaceLock',
          tags: [
            '#биометрия',
            '#безопасность',
            '#facelock',
            '#security',
            '#защита',
          ],
        },
      ]);
    }, 500);
  });
};
