// ============================================================
// WAREHOUSE API - TanStack Query Hooks
// src/modules/warehouses/services/warehouseApi.ts
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warehouseService } from './warehouseService';
import type { Warehouse, WarehouseFilters } from '@/shared/types';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/common.types';

const WAREHOUSES_KEY = ['warehouses'];

export const useWarehouses = (filters?: WarehouseFilters) => {
  return useQuery({
    queryKey: [...WAREHOUSES_KEY, filters],
    queryFn: () => warehouseService.getWarehouses(filters) as Promise<ApiResponse<PaginatedResponse<Warehouse>>>,
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000,
  });
};

export const useWarehouse = (id: string) => {
  return useQuery({
    queryKey: [...WAREHOUSES_KEY, id],
    queryFn: () => warehouseService.getWarehouse(id) as Promise<ApiResponse<Warehouse>>,
    select: (response) => response.data,
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Warehouse>) => warehouseService.createWarehouse(data) as Promise<ApiResponse<Warehouse>>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_KEY });
    },
  });
};

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Warehouse> }) =>
      warehouseService.updateWarehouse(id, data) as Promise<ApiResponse<Warehouse>>,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_KEY });
      queryClient.invalidateQueries({ queryKey: [...WAREHOUSES_KEY, id] });
    },
  });
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => warehouseService.deleteWarehouse(id) as Promise<ApiResponse<void>>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WAREHOUSES_KEY });
    },
  });
};

export const useWarehouseZones = (id: string) => {
  return useQuery({
    queryKey: [...WAREHOUSES_KEY, id, 'zones'],
    queryFn: () => warehouseService.getWarehouseZones(id),
    enabled: !!id,
  });
};