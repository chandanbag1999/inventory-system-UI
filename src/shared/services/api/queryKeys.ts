// ============================================================
// QUERY KEYS — React Query cache keys
// src/shared/services/api/queryKeys.ts
// ============================================================

export const QUERY_KEYS = {
  // Auth
  ME: ['auth', 'me'] as const,

  // Categories
  CATEGORIES:         ['categories'] as const,
  CATEGORY:           (id: string) => ['categories', id] as const,

  // Products
  PRODUCTS:           ['products'] as const,
  PRODUCTS_FILTERED:  (params: Record<string, unknown>) => ['products', params] as const,
  PRODUCT:            (id: string) => ['products', id] as const,
  PRODUCT_BY_SKU:     (sku: string) => ['products', 'sku', sku] as const,

  // Suppliers
  SUPPLIERS:          ['suppliers'] as const,
  SUPPLIER:           (id: string) => ['suppliers', id] as const,

  // Warehouses
  WAREHOUSES:         ['warehouses'] as const,
  WAREHOUSE:          (id: string) => ['warehouses', id] as const,

  // Stocks
  STOCK_BY_PRODUCT:   (productId: string) => ['stocks', 'product', productId] as const,
  STOCK_BY_WAREHOUSE: (warehouseId: string) => ['stocks', 'warehouse', warehouseId] as const,
  LOW_STOCK_ALERTS:   ['stocks', 'low-stock-alerts'] as const,

  // Purchase Orders
  PURCHASE_ORDERS:    ['purchase-orders'] as const,
  PURCHASE_ORDER:     (id: string) => ['purchase-orders', id] as const,

  // Sales Orders
  SALES_ORDERS:       ['sales-orders'] as const,
  SALES_ORDER:        (id: string) => ['sales-orders', id] as const,

  // Users
  USERS:              ['users'] as const,
  USER:               (id: string) => ['users', id] as const,

  // Roles & Permissions
  ROLES:              ['roles'] as const,
  PERMISSIONS:        ['permissions'] as const,
} as const;
