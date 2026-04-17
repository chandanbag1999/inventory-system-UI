// ============================================================
// WAREHOUSE API — React Query hooks
// Backend: GET    /api/v1/warehouses?isActive=true
//          GET    /api/v1/warehouses/{id}
//          POST   /api/v1/warehouses   JSON
//          PUT    /api/v1/warehouses/{id} JSON
//          DELETE /api/v1/warehouses/{id}
// src/modules/warehouses/services/warehouseApi.ts
// ============================================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/services/api/apiClient';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { QUERY_KEYS } from '@/shared/services/api/queryKeys';
import type { Warehouse } from '@/shared/types/domain.types';

export interface WarehouseFormData {
  name:          string;
  code?:         string;
  addressLine1?: string;
  addressLine2?: string;
  city?:         string;
  state?:        string;
  country?:      string;
  postalCode?:   string;
  phone?:        string;
  email?:        string;
  managerId?:    string;
  isActive?:     boolean;
}

export const warehouseApiClient = {
  getAll: async (isActive?: boolean): Promise<Warehouse[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.WAREHOUSES.BASE, {
      params: isActive !== undefined ? { isActive } : {},
    });
    return data.data ?? [];
  },

  getById: async (id: string): Promise<Warehouse> => {
    const { data } = await apiClient.get(API_ENDPOINTS.WAREHOUSES.BY_ID(id));
    return data.data;
  },

  create: async (payload: WarehouseFormData): Promise<Warehouse> => {
    const { data } = await apiClient.post(API_ENDPOINTS.WAREHOUSES.BASE, payload);
    return data.data;
  },

  update: async (id: string, payload: WarehouseFormData): Promise<Warehouse> => {
    const { data } = await apiClient.put(API_ENDPOINTS.WAREHOUSES.BY_ID(id), payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WAREHOUSES.BY_ID(id));
  },
};

export function useWarehouses(isActive?: boolean) {
  return useQuery({
    queryKey: [...QUERY_KEYS.WAREHOUSES, isActive],
    queryFn:  () => warehouseApiClient.getAll(isActive),
    staleTime: 5 * 60 * 1000,
  });
}

export function useWarehouseById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.WAREHOUSE(id),
    queryFn:  () => warehouseApiClient.getById(id),
    enabled:  !!id,
  });
}

export function useCreateWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: WarehouseFormData) => warehouseApiClient.create(payload),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.WAREHOUSES }); },
  });
}

export function useUpdateWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: WarehouseFormData }) =>
      warehouseApiClient.update(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.WAREHOUSES }); },
  });
}

export function useDeleteWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => warehouseApiClient.delete(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.WAREHOUSES }); },
  });
}
