// ============================================================
// DOMAIN TYPES (Products, Orders, Inventory, etc.)
// src/shared/types/domain.types.ts
// ============================================================

import type { Address } from './common.types';

// ─── PRODUCT ────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  barcode?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  shortDescription?: string;
  category: string;
  subCategory?: string;
  brand?: string;
  tags?: string[];
  hsn?: string;
  price: number;
  mrp?: number;
  costPrice?: number;
  gstRate?: '0' | '5' | '12' | '18' | '28';
  discount?: number;
  stock: number;
  reservedStock: number;
  minStockLevel?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  status: 'active' | 'draft' | 'archived';
  warehouse: string;
  binLocation?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images?: string[];
  hasVariants?: boolean;
  variants?: ProductVariant[];
  trackInventory?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  status?: Product['status'];
  warehouse?: string;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  page: number;
  pageSize: number;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
}

// ─── ORDER ──────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  discount?: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  phone?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  items: number;
  orderItems?: OrderItem[];
  subtotal?: number;
  tax?: number;
  shippingCost?: number;
  discount?: number;
  total: number;
  status: OrderStatus;
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod?: string;
  notes?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt?: string;
  deliveryPartner?: string;
  warehouse: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface OrderFilters {
  search?: string;
  status?: OrderStatus;
  warehouse?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  pageSize: number;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
}

// ─── WAREHOUSE ──────────────────────────────────────────────

export type WarehouseStatus = 'active' | 'maintenance' | 'inactive';

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  address?: Address;
  capacity: number;
  utilization: number;
  manager: string;
  managerId?: string;
  status: WarehouseStatus;
  phone?: string;
  email?: string;
  zones?: WarehouseZone[];
  createdAt?: string;
}

export interface WarehouseZone {
  id: string;
  name: string;
  type: 'storage' | 'picking' | 'packing' | 'shipping' | 'receiving';
  capacity: number;
  utilization: number;
}

// ─── DELIVERY ───────────────────────────────────────────────

export type DeliveryStatus =
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'failed'
  | 'returned';

export interface DeliveryLocation {
  lat: number;
  lng: number;
  timestamp: string;
  address?: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  partner: string;
  partnerId?: string;
  status: DeliveryStatus;
  address: string;
  shippingAddress?: Address;
  estimatedTime: string;
  actualTime?: string;
  earnings: number;
  trackingNumber?: string;
  carrier?: string;
  awb?: string;
  proofOfDelivery?: string;
  failureReason?: string;
  attempts?: number;
  locations?: DeliveryLocation[];
  createdAt?: string;
}

// ─── STOCK MOVEMENT ─────────────────────────────────────────

export type StockMovementType = 'inbound' | 'outbound' | 'transfer' | 'adjustment' | 'return';

export interface StockMovement {
  id: string;
  product: string;
  productId?: string;
  sku: string;
  type: StockMovementType;
  quantity: number;
  fromWarehouse?: string;
  toWarehouse?: string;
  date: string;
  reference: string;
  reason?: string;
  performedBy?: string;
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
}

// ─── SUPPLIER ───────────────────────────────────────────────

export type SupplierStatus = 'active' | 'inactive' | 'blacklisted';

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  gstin?: string;
  address?: Address;
  paymentTerms?: number;
  leadTime?: number;
  rating?: number;
  status: SupplierStatus;
  createdAt?: string;
}

// ─── PURCHASE ORDER ─────────────────────────────────────────

export type POStatus =
  | 'draft'
  | 'sent'
  | 'acknowledged'
  | 'partial'
  | 'received'
  | 'cancelled';

export interface POItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  receivedQuantity?: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  supplierId: string;
  items: POItem[];
  subtotal: number;
  tax?: number;
  total: number;
  status: POStatus;
  expectedDate: string;
  receivedDate?: string;
  warehouse: string;
  notes?: string;
  createdAt: string;
}

// ─── RETURN / RMA ───────────────────────────────────────────

export type ReturnStatus =
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'received'
  | 'refunded';

export interface ReturnItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  reason: string;
  condition: 'good' | 'damaged' | 'defective';
}

export interface ReturnRequest {
  id: string;
  rmaNumber: string;
  orderId: string;
  orderNumber: string;
  customerId?: string;
  reason: string;
  items: ReturnItem[];
  status: ReturnStatus;
  refundAmount?: number;
  refundMethod?: string;
  notes?: string;
  createdAt: string;
  resolvedAt?: string;
}

// ─── NOTIFICATION ───────────────────────────────────────────

export type NotificationType =
  | 'order'
  | 'stock'
  | 'delivery'
  | 'system'
  | 'alert'
  | 'payment';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  priority: NotificationPriority;
  userId?: string;
}

// ─── AUDIT LOG ──────────────────────────────────────────────

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  sessionId?: string;
}

// ─── NAVIGATION ─────────────────────────────────────────────

import type { UserRole } from '@/modules/auth/types/auth.types';

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: UserRole[];
  badge?: string | number;
  badgeVariant?: 'default' | 'destructive' | 'warning';
  children?: NavItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// ─── CATEGORY ────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  parentName?: string | null;
  fullPath: string;
  displayOrder: number;
  imageUrl?: string | null;
  isActive: boolean;
  productCount: number;
  children: Category[];
  commissionRate?: number | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  displayOrder?: number;
  commissionRate?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}

// ─── DASHBOARD ──────────────────────────────────────────────

export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalProducts: number;
  lowStockCount: number;
  pendingDeliveries: number;
  activeWarehouses: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}
