// ============================================================
// WAREHOUSE SERVICE - API calls for warehouses
// src/modules/warehouses/services/warehouseService.ts
// ============================================================

import { http } from '@/shared/services/api/apiClient';
import type { Warehouse, WarehouseFilters, PaginatedResponse } from '@/shared/types';
import { ENDPOINTS } from '@/shared/services/api/endpoints';

export const warehouseService = {
  getWarehouses: async (filters?: WarehouseFilters) => {
    const params = filters ? {
      search: filters.search,
      status: filters.status,
      page: filters.page,
      pageSize: filters.pageSize,
      sortKey: filters.sortKey,
      sortDir: filters.sortDir,
    } : undefined;
    
    return http.get<PaginatedResponse<Warehouse>>(ENDPOINTS.warehouses.list, params);
  },

  getWarehouse: async (id: string) => {
    return http.get<Warehouse>(ENDPOINTS.warehouses.detail(id));
  },

  createWarehouse: async (data: Partial<Warehouse>) => {
    return http.post<Warehouse>(ENDPOINTS.warehouses.create, data);
  },

  updateWarehouse: async (id: string, data: Partial<Warehouse>) => {
    return http.put<Warehouse>(ENDPOINTS.warehouses.update(id), data);
  },

  deleteWarehouse: async (id: string) => {
    return http.delete<void>(ENDPOINTS.warehouses.delete(id));
  },

  getWarehouseZones: async (id: string) => {
    return http.get<WarehouseZone[]>(ENDPOINTS.warehouses.detail(id) + '/zones');
  },

  getWarehouseBins: async (id: string) => {
    return http.get<WarehouseBin[]>(ENDPOINTS.warehouses.detail(id) + '/bins');
  },

  getWarehouseStats: async (id: string) => {
    return http.get<WarehouseStats>(ENDPOINTS.warehouses.detail(id) + '/stats');
  },
};

export interface WarehouseZone {
  id: string;
  warehouseId: string;
  name: string;
  type: 'storage' | 'picking' | 'shipping' | 'receiving' | 'staging';
  capacity: number;
  currentUtilization: number;
}

export interface WarehouseBin {
  id: string;
  warehouseId: string;
  zoneId: string;
  code: string;
  type: 'rack' | 'shelf' | 'floor';
  capacity: number;
  currentUtilization: number;
}

export interface WarehouseStats {
  totalProducts: number;
  totalUnits: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
 Utilization: number;
}

export default warehouseService;