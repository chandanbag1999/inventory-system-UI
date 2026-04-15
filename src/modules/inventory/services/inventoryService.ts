// ============================================================
// INVENTORY SERVICE - Fixed
// src/modules/inventory/services/inventoryService.ts
// ============================================================

import { http }      from '@/shared/services/api/apiClient';
import { ENDPOINTS } from '@/shared/services/api/endpoints';
import type { Product, PaginatedResponse } from '@/shared/types';

// Use Product as InventoryItem (extended view)
export type InventoryItem = Product & {
  availableStock?: number;
  inTransitStock?: number;
  totalValue?:     number;
};

export interface InventoryFilters {
  search?:     string;
  warehouse?:  string;
  category?:   string;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  lowStock?:   boolean;
  page:        number;
  pageSize:    number;
  sortKey?:    string;
  sortDir?:    'asc' | 'desc';
}

export interface InventoryValuation {
  totalValue:   number;
  totalItems:   number;
  totalUnits:   number;
  byWarehouse:  { warehouseId: string; warehouseName: string; value: number }[];
  byCategory:   { category: string; value: number }[];
}

export interface StockMovementRecord {
  id:            string;
  productId:     string;
  productName:   string;
  sku:           string;
  type:          'inbound' | 'outbound' | 'transfer' | 'adjustment' | 'return';
  quantity:      number;
  previousStock: number;
  newStock:      number;
  reason?:       string;
  reference?:    string;
  warehouseName: string;
  createdAt:     string;
  createdBy:     string;
}

export const inventoryService = {
  getInventory: (filters?: Partial<InventoryFilters>) =>
    http.get<PaginatedResponse<InventoryItem>>(ENDPOINTS.inventory.list, filters),

  adjustStock: (id: string, quantity: number, reason: string, type: 'add' | 'remove' | 'set') =>
    http.post<InventoryItem>(ENDPOINTS.inventory.adjust(id), { quantity, reason, type }),

  transferStock: (id: string, toWarehouseId: string, quantity: number) =>
    http.post<InventoryItem>(ENDPOINTS.inventory.transfer(id), { toWarehouseId, quantity }),

  getStockMovements: (productId: string) =>
    http.get<StockMovementRecord[]>(ENDPOINTS.inventory.movements(productId)),

  getLowStockItems: () =>
    http.get<InventoryItem[]>(ENDPOINTS.inventory.lowStock),

  getInventoryValuation: (warehouseId?: string) =>
    http.get<InventoryValuation>(ENDPOINTS.inventory.valuation, { warehouseId }),
};

export default inventoryService;
