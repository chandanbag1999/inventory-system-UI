// ============================================================
// WAREHOUSE API — React Query hooks
// src/modules/warehouses/services/warehouseApi.ts
// ============================================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/services/api/apiClient';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { QUERY_KEYS }    from '@/shared/services/api/queryKeys';
import type { Warehouse, PagedResult } from '@/shared/types/domain.types';

// ── Form data — matches backend Create/Update commands ──────
export interface WarehouseFormData {
  name:       string;
  code?:      string;
  phone?:     string;
  email?:     string;
  capacity?:  number | null;
  managerId?: string | null;
  version?:   number;
  address?: {
    street:  string;
    city:    string;
    state:   string;
    pincode: string;
    country: string;
  } | null;
}

export interface WarehouseQueryParams {
  isActive?:  boolean;
  search?:    string;
  pageNumber?:number;
  pageSize?:  number;
}

// ── Raw API functions ───────────────────────────────────────
export const warehouseApiClient = {
  getAll: async (params: WarehouseQueryParams = {}): Promise<PagedResult<Warehouse>> => {
    const { data } = await apiClient.get(API_ENDPOINTS.WAREHOUSES.BASE, {
      params: {
        isActive:   params.isActive,
        search:     params.search || undefined,
        pageNumber: params.pageNumber ?? 1,
        pageSize:   params.pageSize   ?? 20,
      },
    });
    return data.data;
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
    // Strip `code` — UpdateWarehouseCommand has no Code property
    const { code, ...updatePayload } = payload;
    // Ensure version is a number (default 0 if undefined)
    updatePayload.version = updatePayload.version ?? 0;
    const { data } = await apiClient.put(
      API_ENDPOINTS.WAREHOUSES.BY_ID(id),
      updatePayload,
    );
    return data.data;
  },

  activate: async (id: string): Promise<Warehouse> => {
    const { data } = await apiClient.patch(API_ENDPOINTS.WAREHOUSES.ACTIVATE(id));
    return data.data;
  },

  deactivate: async (id: string): Promise<Warehouse> => {
    const { data } = await apiClient.patch(API_ENDPOINTS.WAREHOUSES.DEACTIVATE(id));
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WAREHOUSES.BY_ID(id));
  },
};

// ── React Query Hooks ───────────────────────────────────────

export function useWarehouses(params: WarehouseQueryParams = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.WAREHOUSES, params],
    queryFn:  () => warehouseApiClient.getAll(params),
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

export function useActivateWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => warehouseApiClient.activate(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.WAREHOUSES }); },
  });
}

export function useDeactivateWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => warehouseApiClient.deactivate(id),
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

// ── Manager options (for form dropdown) ─────────────────────
export function useManagerOptions() {
  return useQuery({
    queryKey: ['users', 'manager-options'] as const,
    queryFn: async (): Promise<{ value: string; label: string }[]> => {
      const { data } = await apiClient.get(API_ENDPOINTS.USERS.BASE, {
        params: { pageSize: 100, isActive: true },
      });
      const users = data.data?.items ?? data.data ?? [];
      return (Array.isArray(users) ? users : [])
        .map((u: any) => ({ value: u.id, label: u.fullName }));
    },
    staleTime: 5 * 60 * 1000,
  });
}
