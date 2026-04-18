// ============================================================
// DOMAIN TYPES — aligned with backend DTOs exactly
// src/shared/types/domain.types.ts
// ============================================================
import type { AuthUser } from '@/modules/auth/types/auth.types';
export type { AuthUser as User };

// ── Category (matches CategoryDto) ──────────────────────────
export interface Category {
  id:          string;
  name:        string;
  slug:        string;
  description?:string | null;
  imageUrl?:   string | null;
  parentId?:   string | null;
  parentName?: string | null;
  isActive:    boolean;
  sortOrder:   number;
  createdAt:   string;
  updatedAt:   string;
  children:    Category[];
  fullPath:    string;
  displayOrder:number;
  productCount:number;
  commissionRate?: number | null;
  metaTitle?:      string | null;
  metaDescription?:string | null;
}

// ── Product Image ───────────────────────────────────────────
export interface ProductImage {
  id:           string;
  imageUrl:     string;
  isPrimary:    boolean;
  displayOrder: number;
}

// ── Product ─────────────────────────────────────────────────
export interface Product {
  id:           string;
  categoryId:   string;
  categoryName: string;
  name:         string;
  slug:         string;
  description?: string | null;
  sku:          string;
  barcode?:     string | null;
  unitPrice:    number;
  costPrice:    number;
  reorderLevel: number;
  reorderQty:   number;
  status:       string;
  weightKg?:    number | null;
  primaryImage?:string | null;
  images:       ProductImage[];
  totalStock:   number;
  createdAt:    string;
  updatedAt:    string;
  price?:       number;
  stock?:       number;
  reservedStock?:number;
  warehouse?:   string;
}

export interface ProductListItem {
  id:           string;
  name:         string;
  sku:          string;
  categoryName: string;
  unitPrice:    number;
  costPrice:    number;
  status:       string;
  primaryImage?:string | null;
  totalStock:   number;
  createdAt:    string;
}

// ── Supplier ────────────────────────────────────────────────
export interface Supplier {
  id:           string;
  name:         string;
  contactPerson?:string | null;
  email?:       string | null;
  phone?:       string | null;
  address?:     string | null;
  city?:        string | null;
  state?:       string | null;
  country?:     string | null;
  postalCode?:  string | null;
  gstin?:       string | null;
  paymentTerms: number;
  leadTime:     number;
  notes?:       string | null;
  isActive:     boolean;
  createdAt:    string;
  updatedAt:    string;
  rating?:      number;
  status?:      string;
  category?:    string;
  totalOrders?: number;
  totalValue?:  number;
}

// ── Warehouse Address (matches AddressDto) ──────────────────
export interface WarehouseAddress {
  street:  string;
  city:    string;
  state:   string;
  pincode: string;
  country: string;
}

// ── Warehouse (matches WarehouseDto + WarehouseListDto) ─────
export interface Warehouse {
  id:              string;
  name:            string;
  code:            string;
  isActive:        boolean;
  status:          string;
  phone?:          string | null;
  email?:          string | null;
  capacity?:       number | null;
  utilization?:    number | null;
  managerId?:      string | null;
  managerName?:    string | null;
  totalStockLines: number;
  address?:        WarehouseAddress | null;
  addressString?:  string | null;
  version:         number;
  createdAt:       string;
  updatedAt:       string;
}

// ── Stock ───────────────────────────────────────────────────
export interface Stock {
  id:              string;
  productId:       string;
  productName:     string;
  productSku:      string;
  warehouseId:     string;
  warehouseName:   string;
  quantityOnHand:  number;
  quantityReserved:number;
  quantityAvailable:number;
  reorderLevel:    number;
  lastMovementAt?: string | null;
  updatedAt:       string;
}

export interface StockMovement {
  id:            string;
  productId:     string;
  product?:      string;
  sku?:          string;
  warehouseId?:  string;
  type:          string;
  quantity:      number;
  reference?:    string | null;
  notes?:        string | null;
  createdAt:     string;
  createdBy?:    string | null;
  fromWarehouse?:string;
  toWarehouse?:  string;
  date?:         string;
  reason?:       string;
}

// ── Purchase Order ──────────────────────────────────────────
export interface PurchaseOrderItem {
  id:               string;
  productId:        string;
  productName:      string;
  productSku:       string;
  quantityOrdered:  number;
  quantityReceived: number;
  unitCost:         number;
  totalCost:        number;
}

export interface PurchaseOrder {
  id:              string;
  orderNumber:     string;
  supplierId:      string;
  supplierName:    string;
  warehouseId:     string;
  warehouseName:   string;
  status:          string;
  notes?:          string | null;
  cancelReason?:   string | null;
  totalAmount:     number;
  items:           PurchaseOrderItem[];
  createdAt:       string;
  updatedAt:       string;
  submittedAt?:    string | null;
  approvedAt?:     string | null;
  receivedAt?:     string | null;
}

// ── Sales Order ─────────────────────────────────────────────
export interface SalesOrderItem {
  id:          string;
  productId:   string;
  productName: string;
  productSku:  string;
  quantity:    number;
  unitPrice:   number;
  discount:    number;
  totalPrice:  number;
}

export interface SalesOrder {
  id:             string;
  orderNumber:    string;
  customerId?:    string | null;
  customerName?:  string | null;
  customerEmail?: string | null;
  warehouseId:    string;
  warehouseName:  string;
  status:         string;
  notes?:         string | null;
  cancelReason?:  string | null;
  totalAmount:    number;
  items:          SalesOrderItem[];
  createdAt:      string;
  updatedAt:      string;
  submittedAt?:   string | null;
  approvedAt?:    string | null;
  shippedAt?:     string | null;
  deliveredAt?:   string | null;
}

export interface Order {
  id:              string;
  orderNumber:     string;
  customer:        string;
  email?:          string;
  items:           number;
  total:           number;
  status:          string;
  createdAt:       string;
  deliveryPartner?:string;
  warehouse?:      string;
}

export interface Delivery {
  id:            string;
  orderId:       string;
  orderNumber:   string;
  partner:       string;
  status:        string;
  address:       string;
  estimatedTime?:string;
  actualTime?:   string;
  earnings?:     number;
}

export interface ReturnItem {
  productId:   string;
  productName: string;
  sku:         string;
  quantity:    number;
  reason:      string;
  condition:   string;
}

export interface ReturnRequest {
  id:           string;
  rmaNumber:    string;
  orderId:      string;
  orderNumber:  string;
  reason:       string;
  items:        ReturnItem[];
  status:       string;
  refundAmount?:number;
  createdAt:    string;
}

export interface Notification {
  id:         string;
  type:       string;
  title:      string;
  message:    string;
  read:       boolean;
  actionUrl?: string;
  createdAt:  string;
  priority?:  string;
}

export interface AuditLog {
  id:          string;
  userId:      string;
  userName:    string;
  userRole:    string;
  action:      string;
  resource:    string;
  resourceId?: string;
  oldValue?:   unknown;
  newValue?:   unknown;
  timestamp:   string;
  ipAddress?:  string;
}

export interface DashboardMetrics {
  totalRevenue:      number;
  revenueChange:     number;
  totalOrders:       number;
  ordersChange:      number;
  totalProducts:     number;
  lowStockCount:     number;
  pendingDeliveries: number;
  activeWarehouses:  number;
}

// ── Paged Result (matches backend PagedResult<T>) ───────────
export interface PagedResult<T> {
  items:       T[];
  totalCount:  number;
  pageNumber:  number;
  pageSize:    number;
  totalPages:  number;
  hasPrevious: boolean;
  hasNext:     boolean;
}
