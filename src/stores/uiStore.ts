import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  createdAt: Date;
  duration?: number;
}

export interface Modal {
  id: string;
  component: React.ComponentType<Record<string, unknown>>;
  props?: Record<string, unknown>;
}

export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  modals: Modal[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  searchResults: Record<string, unknown>[];

  setTheme: (_theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;

  openModal: (
    _id: string,
    _component: React.ComponentType<Record<string, unknown>>,
    _props?: Record<string, unknown>
  ) => void;

  closeModal: (_id: string) => void;

  addNotification: (
    _notification: Omit<Notification, 'id' | 'createdAt'>
  ) => void;

  removeNotification: (_id: string) => void;
  clearNotifications: () => void;

  setLoading: (_loading: boolean) => void;

  setError: (_error: string | null) => void;

  setSearchQuery: (_query: string) => void;

  setSearchResults: (_results: Record<string, unknown>[]) => void;
  clearSearch: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      sidebarOpen: false,
      modals: [],
      notifications: [],
      loading: false,
      error: null,
      searchQuery: '',
      searchResults: [],

      setTheme: theme => set({ theme }),

      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

      openModal: (id, component, props) =>
        set(state => ({
          modals: [...state.modals, { id, component, props }],
        })),

      closeModal: id =>
        set(state => ({
          modals: state.modals.filter(modal => modal.id !== id),
        })),

      addNotification: notification => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        };

        set(state => ({
          notifications: [...state.notifications, newNotification],
        }));

        if (notification.duration) {
          setTimeout(() => {
            get().removeNotification(newNotification.id);
          }, notification.duration);
        }
      },

      removeNotification: id =>
        set(state => ({
          notifications: state.notifications.filter(
            notification => notification.id !== id
          ),
        })),

      clearNotifications: () => set({ notifications: [] }),

      setLoading: loading => set({ loading }),

      setError: error => set({ error }),

      setSearchQuery: query => set({ searchQuery: query }),

      setSearchResults: results => set({ searchResults: results }),

      clearSearch: () => set({ searchQuery: '', searchResults: [] }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

export const notify = {
  success: (title: string, message: string) =>
    useUIStore.getState().addNotification({ type: 'success', title, message }),
  error: (title: string, message: string) =>
    useUIStore.getState().addNotification({ type: 'error', title, message }),
  warning: (title: string, message: string) =>
    useUIStore.getState().addNotification({ type: 'warning', title, message }),
  info: (title: string, message: string) =>
    useUIStore.getState().addNotification({ type: 'info', title, message }),
};
