// ============================================================
// CONSTANTS
// src/shared/utils/constants.ts
// ============================================================

export const APP_NAME    = 'StockPulse';
export const APP_VERSION = '1.0.0';

// ─── Pagination ──────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE  = 10;
export const PAGE_SIZE_OPTIONS  = [10, 25, 50, 100];

// ─── Stock ───────────────────────────────────────────────────
export const LOW_STOCK_THRESHOLD = 50;
export const REORDER_ALERT_DAYS  = 7;

// ─── GST Rates ───────────────────────────────────────────────
export const GST_RATES = ['0', '5', '12', '18', '28'] as const;

// ─── Indian States ───────────────────────────────────────────
export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu and Kashmir','Ladakh','Puducherry',
] as const;

// ─── WebSocket Events ────────────────────────────────────────
export const WS_EVENTS = {
  ORDER_CREATED:     'ORDER_CREATED',
  ORDER_UPDATED:     'ORDER_UPDATED',
  STOCK_ALERT:       'STOCK_ALERT',
  DELIVERY_LOCATION: 'DELIVERY_LOCATION',
  NOTIFICATION:      'NOTIFICATION',
  USER_CONNECTED:    'USER_CONNECTED',
  USER_DISCONNECTED: 'USER_DISCONNECTED',
} as const;

// ─── Local Storage Keys ──────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH:        'auth-store',
  THEME:       'theme-store',
  TABLE_PREFS: 'table-preferences',
  FILTERS:     'saved-filters',
} as const;

// ─── Routes ──────────────────────────────────────────────────
export const ROUTES = {
  LOGIN:           '/login',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD:       '/',
  PRODUCTS:        '/products',
  PRODUCT_ADD:     '/products/add',
  PRODUCT_DETAIL:  (id: string) => '/products/' + id,
  PRODUCT_EDIT:    (id: string) => '/products/' + id + '/edit',
  ORDERS:          '/orders',
  ORDER_DETAIL:    (id: string) => '/orders/' + id,
  ORDER_EDIT:      (id: string) => '/orders/' + id + '/edit',
  INVENTORY:       '/inventory',
  WAREHOUSES:      '/warehouses',
  DELIVERIES:      '/deliveries',
  STOCK_MOVEMENTS: '/stock-movements',
  SUPPLIERS:       '/suppliers',
  RETURNS:         '/returns',
  ANALYTICS:       '/analytics',
  PROFILE:         '/profile',
  ADMIN_USERS:     '/admin/users',
  ADMIN_SETTINGS:  '/admin/settings',
  ADMIN_AUDIT:     '/admin/audit',
} as const;

// ─── Timeouts ────────────────────────────────────────────────
export const DEBOUNCE_DELAY     = 300;
export const TOAST_DURATION     = 4000;
export const SESSION_TIMEOUT    = 24 * 60 * 60 * 1000;
export const WS_RECONNECT_DELAY = 3000;
export const WS_MAX_RETRIES     = 5;
