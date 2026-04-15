// ============================================================
// STORAGE SERVICE
// src/shared/services/storage/storageService.ts
// ============================================================

export const storageService = {
  // ── LocalStorage ─────────────────────────────────────────
  get: <T>(key: string, fallback?: T): T | undefined => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : fallback;
    } catch {
      return fallback;
    }
  },

  set: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('[Storage] Set error:', e);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },

  // ── SessionStorage ───────────────────────────────────────
  session: {
    get: <T>(key: string, fallback?: T): T | undefined => {
      try {
        const item = sessionStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : fallback;
      } catch {
        return fallback;
      }
    },
    set: (key: string, value: unknown): void => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('[Storage] Session set error:', e);
      }
    },
    remove: (key: string): void => sessionStorage.removeItem(key),
  },

  // ── Table Preferences ────────────────────────────────────
  getTablePrefs: (tableId: string) =>
    storageService.get<{ pageSize: number; columns: string[] }>(
      'table-prefs-' + tableId
    ),

  setTablePrefs: (tableId: string, prefs: { pageSize?: number; columns?: string[] }) =>
    storageService.set('table-prefs-' + tableId, prefs),

  // ── Saved Filters ────────────────────────────────────────
  getSavedFilters: (page: string) =>
    storageService.get<Record<string, unknown>>('filters-' + page),

  setSavedFilters: (page: string, filters: Record<string, unknown>) =>
    storageService.set('filters-' + page, filters),
};

export default storageService;
