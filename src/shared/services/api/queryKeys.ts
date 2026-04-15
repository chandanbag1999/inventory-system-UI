// ============================================================
// QUERY KEYS - TanStack Query centralized keys
// src/shared/services/api/queryKeys.ts
// ============================================================

export const queryKeys = {
  // ─── AUTH ─────────────────────────────────────────────────
  auth: {
    me: ['auth', 'me'] as const,
  },

  // ─── PRODUCTS ─────────────────────────────────────────────
  products: {
    all:    ['products'] as const,
    list:   (filters?: object) => ['products', 'list', filters] as const,
    detail: (id: string)       => ['products', 'detail', id] as const,
    export: ['products', 'export'] as const,
  },

  // ─── ORDERS ───────────────────────────────────────────────
  orders: {
    all:    ['orders'] as const,
    list:   (filters?: object) => ['orders', 'list', filters] as const,
    detail: (id: string)       => ['orders', 'detail', id] as const,
    export: ['orders', 'export'] as const,
  },

  // ─── INVENTORY ────────────────────────────────────────────
  inventory: {
    all:       ['inventory'] as const,
    list:      (filters?: object) => ['inventory', 'list', filters] as const,
    movements: (filters?: object) => ['inventory', 'movements', filters] as const,
    alerts:    ['inventory', 'alerts'] as const,
    valuation: ['inventory', 'valuation'] as const,
  },

  // ─── WAREHOUSES ───────────────────────────────────────────
  warehouses: {
    all:    ['warehouses'] as const,
    list:   (filters?: object) => ['warehouses', 'list', filters] as const,
    detail: (id: string)       => ['warehouses', 'detail', id] as const,
    zones:  (id: string)       => ['warehouses', 'zones', id] as const,
  },

  // ─── DELIVERIES ───────────────────────────────────────────
  deliveries: {
    all:      ['deliveries'] as const,
    list:     (filters?: object) => ['deliveries', 'list', filters] as const,
    detail:   (id: string)       => ['deliveries', 'detail', id] as const,
    track:    (id: string)       => ['deliveries', 'track', id] as const,
    earnings: ['deliveries', 'earnings'] as const,
    tasks:    ['deliveries', 'tasks'] as const,
  },

  // ─── SUPPLIERS ────────────────────────────────────────────
  suppliers: {
    all:    ['suppliers'] as const,
    list:   (filters?: object) => ['suppliers', 'list', filters] as const,
    detail: (id: string)       => ['suppliers', 'detail', id] as const,
  },

  // ─── PURCHASE ORDERS ──────────────────────────────────────
  purchaseOrders: {
    all:    ['purchase-orders'] as const,
    list:   (filters?: object) => ['purchase-orders', 'list', filters] as const,
    detail: (id: string)       => ['purchase-orders', 'detail', id] as const,
  },

  // ─── RETURNS ──────────────────────────────────────────────
  returns: {
    all:    ['returns'] as const,
    list:   (filters?: object) => ['returns', 'list', filters] as const,
    detail: (id: string)       => ['returns', 'detail', id] as const,
  },

  // ─── NOTIFICATIONS ────────────────────────────────────────
  notifications: {
    all:         ['notifications'] as const,
    list:        ['notifications', 'list'] as const,
    preferences: ['notifications', 'preferences'] as const,
  },

  // ─── ANALYTICS ────────────────────────────────────────────
  analytics: {
    dashboard:  ['analytics', 'dashboard'] as const,
    revenue:    (filters?: object) => ['analytics', 'revenue', filters] as const,
    inventory:  (filters?: object) => ['analytics', 'inventory', filters] as const,
    orders:     (filters?: object) => ['analytics', 'orders', filters] as const,
    deliveries: (filters?: object) => ['analytics', 'deliveries', filters] as const,
  },

  // ─── ADMIN ────────────────────────────────────────────────
  admin: {
    users:       (filters?: object) => ['admin', 'users', filters] as const,
    userDetail:  (id: string)       => ['admin', 'users', id] as const,
    auditLogs:   (filters?: object) => ['admin', 'audit', filters] as const,
    settings:    ['admin', 'settings'] as const,
    systemHealth:['admin', 'health'] as const,
  },

  // ─── PROFILE ──────────────────────────────────────────────
  profile: {
    get: ['profile'] as const,
  },
} as const;
