// ============================================================
// SUPPLIER API — React Query hooks
// Backend: GET    /api/v1/suppliers
//          GET    /api/v1/suppliers/{id}
//          POST   /api/v1/suppliers   JSON
//          PUT    /api/v1/suppliers/{id} JSON
//          DELETE /api/v1/suppliers/{id}
// src/modules/suppliers/services/supplierApi.ts
// ============================================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/services/api/apiClient';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { QUERY_KEYS } from '@/shared/services/api/queryKeys';
import type { Supplier } from '@/shared/types/domain.types';
import type { SupplierFormData } from '../types/supplier.types';

export interface GetAllSuppliersParams {
  pageNumber?: number;
  pageSize?:   number;
  search?:     string;
  isActive?:   boolean;
}

export const supplierApiClient = {
  getAll: async (params?: GetAllSuppliersParams) => {
    const { data } = await apiClient.get(API_ENDPOINTS.SUPPLIERS.BASE, { params });
    return data.data;
  },

  getById: async (id: string): Promise<Supplier> => {
    const { data } = await apiClient.get(API_ENDPOINTS.SUPPLIERS.BY_ID(id));
    return data.data;
  },

  create: async (payload: SupplierFormData): Promise<Supplier> => {
    const { data } = await apiClient.post(API_ENDPOINTS.SUPPLIERS.BASE, payload);
    return data.data;
  },

  update: async (id: string, payload: SupplierFormData): Promise<Supplier> => {
    const { data } = await apiClient.put(API_ENDPOINTS.SUPPLIERS.BY_ID(id), payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.SUPPLIERS.BY_ID(id));
  },
};

export function useSuppliers(params?: GetAllSuppliersParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.SUPPLIERS, params],
    queryFn:  () => supplierApiClient.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSupplierById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SUPPLIER(id),
    queryFn:  () => supplierApiClient.getById(id),
    enabled:  !!id,
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SupplierFormData) => supplierApiClient.create(payload),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.SUPPLIERS }); },
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SupplierFormData }) =>
      supplierApiClient.update(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.SUPPLIERS }); },
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supplierApiClient.delete(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.SUPPLIERS }); },
  });
}
