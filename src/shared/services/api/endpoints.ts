// ============================================================
// API ENDPOINTS — exact backend routes
// src/shared/services/api/endpoints.ts
// ============================================================

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN:          '/auth/login',
    REGISTER:       '/auth/register',
    LOGOUT:         '/auth/logout',
    REFRESH_TOKEN:  '/auth/refresh-token',
    ME:             '/auth/me',
    VERIFY_EMAIL:   '/auth/verify-email',
    FORGOT_PASSWORD:'/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD:'/auth/change-password',
  },

  CATEGORIES: {
    BASE:  '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
    IMAGE: (id: string) => `/categories/${id}/image`,
  },

  PRODUCTS: {
    BASE:         '/products',
    BY_ID:        (id: string) => `/products/${id}`,
    BY_SKU:       (sku: string) => `/products/sku/${sku}`,
    IMAGES:       (id: string) => `/products/${id}/images`,
    IMAGE_DELETE: (id: string, imageId: string) => `/products/${id}/images/${imageId}`,
  },

  SUPPLIERS: {
    BASE:  '/suppliers',
    BY_ID: (id: string) => `/suppliers/${id}`,
  },

  WAREHOUSES: {
    BASE:       '/warehouses',
    BY_ID:      (id: string) => `/warehouses/${id}`,
    ACTIVATE:   (id: string) => `/warehouses/${id}/activate`,
    DEACTIVATE: (id: string) => `/warehouses/${id}/deactivate`,
  },

  STOCKS: {
    BY_PRODUCT:       (productId: string) => `/stocks/product/${productId}`,
    BY_WAREHOUSE:     (warehouseId: string) => `/stocks/warehouse/${warehouseId}`,
    LOW_STOCK_ALERTS: '/stocks/low-stock-alerts',
    ADJUST:           '/stocks/adjust',
  },

  PURCHASE_ORDERS: {
    BASE:    '/purchase-orders',
    BY_ID:   (id: string) => `/purchase-orders/${id}`,
    ITEMS:   (id: string) => `/purchase-orders/${id}/items`,
    ITEM:    (id: string, itemId: string) => `/purchase-orders/${id}/items/${itemId}`,
    SUBMIT:  (id: string) => `/purchase-orders/${id}/submit`,
    APPROVE: (id: string) => `/purchase-orders/${id}/approve`,
    REJECT:  (id: string) => `/purchase-orders/${id}/reject`,
    RECEIVE: (id: string) => `/purchase-orders/${id}/receive`,
    CANCEL:  (id: string) => `/purchase-orders/${id}/cancel`,
  },

  SALES_ORDERS: {
    BASE:    '/sales-orders',
    BY_ID:   (id: string) => `/sales-orders/${id}`,
    ITEMS:   (id: string) => `/sales-orders/${id}/items`,
    ITEM:    (id: string, itemId: string) => `/sales-orders/${id}/items/${itemId}`,
    SUBMIT:  (id: string) => `/sales-orders/${id}/submit`,
    APPROVE: (id: string) => `/sales-orders/${id}/approve`,
    SHIP:    (id: string) => `/sales-orders/${id}/ship`,
    DELIVER: (id: string) => `/sales-orders/${id}/deliver`,
    CANCEL:  (id: string) => `/sales-orders/${id}/cancel`,
  },

  USERS: {
    BASE:          '/users',
    BY_ID:         (id: string) => `/users/${id}`,
    ACTIVATE:      (id: string) => `/users/${id}/activate`,
    DEACTIVATE:    (id: string) => `/users/${id}/deactivate`,
    ASSIGN_ROLE:   (id: string) => `/users/${id}/assign-role`,
    REVOKE_ROLE:   (id: string, roleId: string) => `/users/${id}/revoke-role/${roleId}`,
    PROFILE_IMAGE: (id: string) => `/users/${id}/profile-image`,
  },

  ROLES: {
    BASE:        '/roles',
    PERMISSIONS: '/permissions',
  },
} as const;
