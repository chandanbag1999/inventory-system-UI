// ============================================================
// INVENTORY / STOCK API — React Query hooks
// Backend: GET  /api/v1/stocks/product/{productId}
//          GET  /api/v1/stocks/warehouse/{warehouseId}
//          GET  /api/v1/stocks/low-stock-alerts
//          POST /api/v1/stocks/adjust
// src/modules/inventory/services/inventoryService.ts
// ============================================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/services/api/apiClient';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { QUERY_KEYS } from '@/shared/services/api/queryKeys';
import type { Stock } from '@/shared/types/domain.types';

export interface AdjustStockPayload {
  productId:   string;
  warehouseId: string;
  quantity:    number;     // positive = add, negative = remove
  movementType:string;     // 'StockIn' | 'StockOut' | 'Adjustment' | 'Transfer'
  reference?:  string;
  notes?:      string;
}

export const stockApiClient = {
  getByProduct: async (productId: string): Promise<Stock[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.STOCKS.BY_PRODUCT(productId));
    return data.data ?? [];
  },

  getByWarehouse: async (warehouseId: string): Promise<Stock[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.STOCKS.BY_WAREHOUSE(warehouseId));
    return data.data ?? [];
  },

  getLowStockAlerts: async (warehouseId?: string): Promise<Stock[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.STOCKS.LOW_STOCK_ALERTS, {
      params: warehouseId ? { warehouseId } : {},
    });
    return data.data ?? [];
  },

  adjust: async (payload: AdjustStockPayload) => {
    const { data } = await apiClient.post(API_ENDPOINTS.STOCKS.ADJUST, payload);
    return data.data;
  },
};

export function useStockByProduct(productId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.STOCK_BY_PRODUCT(productId),
    queryFn:  () => stockApiClient.getByProduct(productId),
    enabled:  !!productId,
  });
}

export function useStockByWarehouse(warehouseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.STOCK_BY_WAREHOUSE(warehouseId),
    queryFn:  () => stockApiClient.getByWarehouse(warehouseId),
    enabled:  !!warehouseId,
  });
}

export function useLowStockAlerts(warehouseId?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.LOW_STOCK_ALERTS, warehouseId],
    queryFn:  () => stockApiClient.getLowStockAlerts(warehouseId),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useAdjustStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdjustStockPayload) => stockApiClient.adjust(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.LOW_STOCK_ALERTS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    },
  });
}
