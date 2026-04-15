# Frontend Remaining Work - Detailed TODO

**Analysis based on:** Plan.md Gap Analysis + Current Codebase Audit  
**Last Updated:** April 11, 2026

---

## ✅ COMPLETED - What Already Exists in Codebase

### Shared Infrastructure (Complete ✅)

```
src/shared/
├── services/api/
│   ├── apiClient.ts       ✅ Axios + JWT interceptors + refresh
│   ├── endpoints.ts    ✅ All API endpoints
│   └── queryKeys.ts    ✅ TanStack Query keys
│
├── store/
│   ├── authStore.ts          ✅ JWT auth + permissions
│   ├── productStore.ts     ✅ Product state
│   ├── orderStore.ts       ✅ Order state
│   ├── themeStore.ts       ✅ Dark/Light theme
│   ├── notificationStore.ts ✅ Notifications
│   └── uiStore.ts         ✅ UI state
│
├── hooks/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── usePermission.ts
│   ├── usePagination.ts
│   ├── useTableState.ts
│   ├── useKeyboardShortcuts.ts
│   ├── useMediaQuery.ts
│   ├── useOnlineStatus.ts
│   ├── useClipboard.ts
│   ├── useExport.ts
│   ├── useWebSocket.ts
│   └── index.ts
│
├── components/
│   ├── feedback/
│   │   ├── ErrorBoundary.tsx    ✅
│   │   └── PageSkeleton.tsx      ✅
│   ├── tables/
│   │   └── DataTable.tsx        ✅
│   └── navigation/
│       └── CommandPalette.tsx  ✅
│
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   ├── exportUtils.ts
│   ├── constants.ts
│   └── index.ts
│
└── types/
    ├── index.ts
    ├── domain.types.ts
    └── common.types.ts
```

---

## ❌ REMAINING - What Still Needs Implementation

### PRIORITY: CRITICAL

#### 1. TanStack Query Integration (Not Connected to Pages)

**Current:** 
- TanStack Query installed
- queryKeys.ts created
- But pages still use Zustand stores

**Pages Using Zustand (Need Conversion):**
- `src/pages/DashboardPage.tsx` → needs `useDashboardMetrics()`
- `src/pages/ProductsPage.tsx` → needs `useProducts()`
- `src/pages/OrdersPage.tsx` → needs `useOrders()`
- `src/pages/OrdersPage.tsx` → needs `useOrderMutations()`
- `src/pages/InventoryPage.tsx` → needs `useInventory()`
- `src/pages/WarehousesPage.tsx` → needs `useWarehouses()`
- `src/pages/DeliveriesPage.tsx` → needs `useDeliveries()`

**Hook Files Needed:**
```
src/shared/hooks/
├── useDashboard.ts     # Dashboard data query
├── useProducts.ts      # Products query
├── useProduct.ts      # Single product
├── useProductMutations.ts # CRUD operations
├── useOrders.ts       # Orders query
├── useOrderMutations.ts # Order CRUD
├── useInventory.ts   # Inventory query
├── useWarehouses.ts  # Warehouses query
├── useDeliveries.ts  # Deliveries query
└── useRealTime.ts    # WebSocket integration
```

---

#### 2. Module Services (API Layer)

**Need to Create:**
```
src/shared/services/
├── productService.ts    # Products API calls
├── orderService.ts   # Orders API calls
├── inventoryService.ts # Inventory API calls
├── warehouseService.ts # Warehouse API calls
├── deliveryService.ts # Delivery API calls
├── dashboardService.ts # Dashboard metrics API
└── notificationService.ts # Notifications API
```

---

#### 3. Loading/Empty Error States

**Need to Create:**
```
src/shared/components/feedback/
├── LoadingSpinner.tsx    # Reusable spinner
├── EmptyState.tsx       # Empty state with action
├── ErrorFallback.tsx     # Error display
└── ConfirmDialog.tsx   # Confirmation dialog
```

---

### PRIORITY: HIGH

#### 4. Advanced ProductForm

**Need to Enhance:**
```
src/components/
├── ProductForm.tsx           # Extended enterprise fields
├── ImageUploader.tsx         # Multi-image upload
├── VariantManager.tsx          # Size/Color variants
├── BarcodeScanner.tsx         # Barcode scanning
└── ProductImport.tsx         # CSV import
```

**Missing Form Fields:**
- barcode, description, shortDescription
- subCategory, brand, tags
- hsn (GST HSN code)
- mrp, costPrice, gstRate, discount
- minStockLevel, reorderPoint, reorderQuantity
- binLocation, weight, dimensions
- images (array), hasVariants, variants

---

#### 5. URL State Sync

**Need to Create:**
```
src/shared/hooks/
├── useUrlState.ts    # URL params sync
└── useFilters.ts     # Filter state management
```

---

#### 6. Dashboard API Integration

**Current:** DashboardPage uses hardcoded mock data
- revenueData (hardcoded)
- orderTrend (hardcoded)
- categoryData (hardcoded)

**Need:** Convert to useDashboard hook + API

---

#### 7. Real-time Integration

**Current:** WebSocket hook exists but not connected

**Need to Connect:**
- Dashboard → live metrics, activity feed
- OrdersPage → status updates
- InventoryPage → stock alerts
- DeliveriesPage → live tracking

---

### PRIORITY: MEDIUM

#### 8. New Modules (Not Created)

**Suppliers Module:**
```
src/pages/SuppliersPage.tsx                   # NEEDED
src/pages/PurchaseOrdersPage.tsx               # NEEDED
src/components/SupplierForm.tsx              # NEEDED
src/types/supplier.types.ts                 # NEEDED
```

**Returns/RMA Module:**
```
src/pages/ReturnsPage.tsx                    # NEEDED
src/components/ReturnForm.tsx               # NEEDED
src/types/return.types.ts                    # NEEDED
```

**Compliance (GST) Module:**
```
src/pages/CompliancePage.tsx                  # NEEDED
src/components/GSTInvoice.tsx               # NEEDED
src/components/EWayBill.tsx                  # NEEDED
src/components/EInvoice.tsx                 # NEEDED
src/types/compliance.types.ts                 # NEEDED
```

**Analytics Module:**
```
src/pages/AnalyticsPage.tsx                   # NEEDED
src/components/AnalyticsCharts.tsx          # NEEDED
```

---

#### 9. Navigation Updates

**Need to Update:**
```
src/components/AppSidebar.tsx   # Add dynamic badge counts
src/components/TopBar.tsx    # Add notification bell
```

---

### PRIORITY: LOW

#### 10. i18n

**Need to Create:**
```
src/i18n/
├── index.ts        # i18n setup
├── en.json        # English
└── hi.json       # Hindi
```

**Install:** `react-i18next`, `i18next`

---

#### 11. PWA

**Need to Create:**
```
public/
├── manifest.json  # PWA manifest
└── sw.js       # Service worker
```

**Install:** `vite-plugin-pwa`

---

## Summary: Files Needed

| Priority | Files | What |
|----------|-------|------|
| **CRITICAL** | | |
| TanStack Query Hooks | 10 | useDashboard, useProducts, useOrders, etc |
| API Services | 7 | productService, orderService, etc |
| Feedback States | 4 | LoadingSpinner, EmptyState |
| **HIGH** | | |
| ProductForm Enhanced | 5 | ImageUploader, Variants, etc |
| URL Sync | 2 | useUrlState, useFilters |
| Dashboard API | 1 | Hook integration |
| Real-time | 4 | Connect WS |
| **MEDIUM** | | |
| Suppliers Page | 2 | SuppliersPage, PurchaseOrders |
| Returns Page | 1 | ReturnsPage |
| Compliance Page | 4 | GST, E-Waybill |
| Analytics Page | 2 | AnalyticsPage |
| Navigation Update | 2 | Sidebar, TopBar badges |
| **LOW** | | |
| i18n | 3 | en.json, hi.json |
| PWA | 2 | manifest.json, sw.js |
| | **~55 files** | |

---

## Current Architecture

```
src/
├── pages/              ❌ Still using Zustand, need TanStack Query
├── components/        ✅ Most complete
├── shared/            ✅ Infrastructure complete
│   ├── services/     ✅ apiClient ready
│   ├── store/       ✅ authStore with JWT
│   ├── hooks/       ✅ 12 hooks ready
│   ├── utils/       ✅ formatters, validators
│   └── types/       ✅ API types
├── store/            ⚠️ Old location (moving to shared)
└── hooks/          ⚠️ Old location (moving to shared)
```

---

## What's NOT Remaining (Already Done)

- ✅ API Client with JWT + interceptors
- ✅ Auth Store with permissions
- ✅ Error Boundary
- ✅ DataTable component
- ✅ Command Palette
- ✅ Export functionality (CSV/Excel/PDF)
- ✅ WebSocket hook
- ✅ All custom hooks (12)
- ✅ All stores (auth, product, order, theme, notification, ui)
- ✅ Utilities (formatters, validators)
- ✅ Types (api, domain, common)

---

## What IS Remaining

1. **Module hooks** - useProducts(), useOrders(), etc (10 files)
2. **Module services** - API calls (7 files)
3. **Page updates** - Convert to TanStack Query (7 pages)
4. **Feedback states** - LoadingSpinner, EmptyState (4 files)
5. **ProductForm enhancement** - More fields (5 files)
6. **URL state** - useUrlState (2 files)
7. **Real-time integration** - Connect WebSocket (4 pages)
8. **New pages** - Suppliers, Returns, Compliance (9 pages)
9. **i18n** - Translations (3 files)
10. **PWA** - Service worker (2 files)

---

*This document is accurate as of current codebase audit*
*~55 remaining files need implementation*