// ============================================================
// UI STORE - Global UI State
// src/shared/store/uiStore.ts
// ============================================================

import { create } from 'zustand';

interface Modal {
  id:        string;
  isOpen:    boolean;
  data?:     unknown;
}

interface UIStore {
  // Sidebar
  sidebarOpen:        boolean;
  sidebarCollapsed:   boolean;
  setSidebarOpen:     (open: boolean) => void;
  toggleSidebar:      () => void;
  setSidebarCollapsed:(collapsed: boolean) => void;

  // Command Palette
  commandPaletteOpen:    boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette:  () => void;

  // Modals
  modals:      Modal[];
  openModal:   (id: string, data?: unknown) => void;
  closeModal:  (id: string) => void;
  isModalOpen: (id: string) => boolean;
  getModalData:(id: string) => unknown;

  // Global Loading
  globalLoading:    boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Page Title
  pageTitle:    string;
  setPageTitle: (title: string) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // ── Sidebar ───────────────────────────────────────────────
  sidebarOpen:      true,
  sidebarCollapsed: false,

  setSidebarOpen: (open) =>
    set({ sidebarOpen: open }),

  toggleSidebar: () =>
    set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  setSidebarCollapsed: (collapsed) =>
    set({ sidebarCollapsed: collapsed }),

  // ── Command Palette ───────────────────────────────────────
  commandPaletteOpen: false,

  setCommandPaletteOpen: (open) =>
    set({ commandPaletteOpen: open }),

  toggleCommandPalette: () =>
    set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),

  // ── Modals ────────────────────────────────────────────────
  modals: [],

  openModal: (id, data) =>
    set((s) => {
      const exists = s.modals.find((m) => m.id === id);
      if (exists) {
        return {
          modals: s.modals.map((m) =>
            m.id === id ? { ...m, isOpen: true, data } : m
          ),
        };
      }
      return { modals: [...s.modals, { id, isOpen: true, data }] };
    }),

  closeModal: (id) =>
    set((s) => ({
      modals: s.modals.map((m) =>
        m.id === id ? { ...m, isOpen: false } : m
      ),
    })),

  isModalOpen: (id) => {
    const modal = get().modals.find((m) => m.id === id);
    return modal?.isOpen ?? false;
  },

  getModalData: (id) => {
    const modal = get().modals.find((m) => m.id === id);
    return modal?.data;
  },

  // ── Global Loading ────────────────────────────────────────
  globalLoading:    false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),

  // ── Page Title ────────────────────────────────────────────
  pageTitle:    'Dashboard',
  setPageTitle: (title) => set({ pageTitle: title }),
}));
