// ============================================================
// ORDER API - TanStack Query Hooks
// src/modules/orders/services/orderApi.ts
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from './orderService';
import type { Order, OrderFilters } from '@/shared/types';
import type { OrderStatus } from '@/shared/types/domain.types';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/common.types';

const ORDERS_KEY = ['orders'];

export const useOrders = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: [...ORDERS_KEY, filters],
    queryFn: () => orderService.getOrders(filters) as Promise<ApiResponse<PaginatedResponse<Order>>>,
    select: (response) => response.data,
    staleTime: 1 * 60 * 1000,
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: [...ORDERS_KEY, id],
    queryFn: () => orderService.getOrder(id) as Promise<ApiResponse<Order>>,
    select: (response) => response.data,
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  });
};

export const useOrderByNumber = (orderNumber: string) => {
  return useQuery({
    queryKey: [...ORDERS_KEY, 'number', orderNumber],
    queryFn: () => orderService.getOrder(orderNumber) as Promise<ApiResponse<Order>>,
    enabled: !!orderNumber,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Order>) => orderService.createOrder(data) as Promise<ApiResponse<Order>>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateOrderStatus(id, status) as Promise<ApiResponse<Order>>,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [...ORDERS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      orderService.cancelOrder(id, reason) as Promise<ApiResponse<Order>>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id) as Promise<ApiResponse<void>>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
    },
  });
};