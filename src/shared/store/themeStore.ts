// ============================================================
// THEME STORE
// src/shared/store/themeStore.ts
// ============================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme:    Theme;
  resolved: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const getResolved = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme:    'dark',
      resolved: getResolved('dark'),
      setTheme: (theme) => set({ theme, resolved: getResolved(theme) }),
      toggle: () =>
        set((state) => ({
          theme: state.resolved === 'dark' ? 'light' : 'dark',
          resolved: state.resolved === 'dark' ? 'light' : 'dark',
        })),
    }),
    { name: 'theme-store' }
  )
);
