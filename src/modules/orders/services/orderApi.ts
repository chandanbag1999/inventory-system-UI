// ============================================================
// ORDER API — Sales Orders + Purchase Orders React Query hooks
// Backend Sales Orders:    /api/v1/sales-orders
// Backend Purchase Orders: /api/v1/purchase-orders
// src/modules/orders/services/orderApi.ts
// ============================================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/services/api/apiClient';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { QUERY_KEYS } from '@/shared/services/api/queryKeys';
import type { SalesOrder, PurchaseOrder } from '@/shared/types/domain.types';

// ── Sales Order types ─────────────────────────────────────────
export interface GetAllSalesOrdersParams {
  pageNumber?: number;
  pageSize?:   number;
  status?:     string;
  search?:     string;
}

export interface CreateSalesOrderPayload {
  warehouseId:    string;
  customerName?:  string;
  customerEmail?: string;
  notes?:         string;
}

export interface AddSalesOrderItemPayload {
  productId: string;
  quantity:  number;
  unitPrice: number;
  discount?: number;
}

// ── Purchase Order types ──────────────────────────────────────
export interface GetAllPurchaseOrdersParams {
  pageNumber?: number;
  pageSize?:   number;
  status?:     string;
  search?:     string;
}

export interface CreatePurchaseOrderPayload {
  supplierId:  string;
  warehouseId: string;
  notes?:      string;
}

export interface AddPurchaseOrderItemPayload {
  productId:       string;
  quantityOrdered: number;
  unitCost:        number;
}

export interface ReceivePurchaseOrderPayload {
  items: Array<{ purchaseOrderItemId: string; quantityReceived: number }>;
}

// ── Sales Order API ───────────────────────────────────────────
export const salesOrderApiClient = {
  getAll: async (params?: GetAllSalesOrdersParams) => {
    const { data } = await apiClient.get(API_ENDPOINTS.SALES_ORDERS.BASE, { params });
    return data.data;
  },

  getById: async (id: string): Promise<SalesOrder> => {
    const { data } = await apiClient.get(API_ENDPOINTS.SALES_ORDERS.BY_ID(id));
    return data.data;
  },

  create: async (payload: CreateSalesOrderPayload): Promise<SalesOrder> => {
    const { data } = await apiClient.post(API_ENDPOINTS.SALES_ORDERS.BASE, payload);
    return data.data;
  },

  addItem: async (id: string, payload: AddSalesOrderItemPayload) => {
    const { data } = await apiClient.post(API_ENDPOINTS.SALES_ORDERS.ITEMS(id), payload);
    return data.data;
  },

  removeItem: async (id: string, itemId: string) => {
    const { data } = await apiClient.delete(API_ENDPOINTS.SALES_ORDERS.ITEM(id, itemId));
    return data.data;
  },

  submit:  async (id: string) => { const { data } = await apiClient.post(API_ENDPOINTS.SALES_ORDERS.SUBMIT(id));  return data.data; },
  approve: async (id: string) => { const { data } = await apiClient.post(API_ENDPOINTS.SALES_ORDERS.APPROVE(id)); return data.data; },
  ship:    async (id: string) => { const { data } = await apiClient.post(API_ENDPOINTS.SALES_ORDERS.SHIP(id));    return data.data; },
  deliver: async (id: string) => { const { data } = await apiClient.post(API_ENDPOINTS.SALES_ORDERS.DELIVER(id)); return data.data; },
  cancel:  async (id: string, reason?: string) => {
    const { data } = await apiClient.post(API_ENDPOINTS.SALES_ORDERS.CANCEL(id), { reason });
    return data.data;
  },
};

// ── Purchase Order API ────────────────────────────────────────
export const purchaseOrderApiClient = {
  getAll: async (params?: GetAllPurchaseOrdersParams) => {
    const { data } = await apiClient.get(API_ENDPOINTS.PURCHASE_ORDERS.BASE, { params });
    return data.data;
  },

  getById: async (id: string): Promise<PurchaseOrder> => {
    const { data } = await apiClient.get(API_ENDPOINTS.PURCHASE_ORDERS.BY_ID(id));
    return data.data;
  },

  create: async (payload: CreatePurchaseOrderPayload): Promise<PurchaseOrder> => {
    const { data } = await apiClient.post(API_ENDPOINTS.PURCHASE_ORDERS.BASE, payload);
    return data.data;
  },

  addItem: async (id: string, payload: AddPurchaseOrderItemPayload) => {
    const { data } = await apiClient.post(API_ENDPOINTS.PURCHASE_ORDERS.ITEMS(id), payload);
    return data.data;
  },

  removeItem: async (id: string, itemId: string) => {
    const { data } = await apiClient.delete(API_ENDPOINTS.PURCHASE_ORDERS.ITEM(id, itemId));
    return data.data;
  },

  submit:  async (id: string) => { const { data } = await apiClient.post(API_ENDPOINTS.PURCHASE_ORDERS.SUBMIT(id));  return data.data; },
  approve: async (id: string) => { const { data } = await apiClient.post(API_ENDPOINTS.PURCHASE_ORDERS.APPROVE(id)); return data.data; },
  reject:  async (id: string, reason?: string) => {
    const { data } = await apiClient.post(API_ENDPOINTS.PURCHASE_ORDERS.REJECT(id), { reason });
    return data.data;
  },
  receive: async (id: string, payload: ReceivePurchaseOrderPayload) => {
    const { data } = await apiClient.post(API_ENDPOINTS.PURCHASE_ORDERS.RECEIVE(id), payload);
    return data.data;
  },
  cancel: async (id: string, reason?: string) => {
    const { data } = await apiClient.post(API_ENDPOINTS.PURCHASE_ORDERS.CANCEL(id), { reason });
    return data.data;
  },
};

// ── React Query Hooks — Sales Orders ─────────────────────────

export function useSalesOrders(params?: GetAllSalesOrdersParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.SALES_ORDERS, params],
    queryFn:  () => salesOrderApiClient.getAll(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useSalesOrderById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SALES_ORDER(id),
    queryFn:  () => salesOrderApiClient.getById(id),
    enabled:  !!id,
  });
}

export function useCreateSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateSalesOrderPayload) => salesOrderApiClient.create(p),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.SALES_ORDERS }); },
  });
}

export function useAddSalesOrderItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddSalesOrderItemPayload }) =>
      salesOrderApiClient.addItem(id, payload),
    onSuccess: (_d, { id }) => { qc.invalidateQueries({ queryKey: QUERY_KEYS.SALES_ORDER(id) }); },
  });
}

export function useSubmitSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => salesOrderApiClient.submit(id),
    onSuccess:  (_d, id) => { qc.invalidateQueries({ queryKey: QUERY_KEYS.SALES_ORDER(id) }); qc.invalidateQueries({ queryKey: QUERY_KEYS.SALES_ORDERS }); },
  });
}

export function useApproveSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => salesOrderApiClient.approve(id),
    onSuccess:  (_d, id) => { qc.invalidateQueries({ queryKey: QUERY_KEYS.SALES_ORDER(id) }); qc.invalidateQueries({ queryKey: QUERY_KEYS.SALES_ORDERS }); },
  });
}

export function useShipSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => salesOrderApiClient.ship(id),
    onSuccess:  (_d, id) => { qc.invalidateQueries({ queryKey: QUERY_KEYS.SALES_ORDER(id) }); qc.invalidateQueries({ queryKey: QUERY_KEYS.SALES_ORDERS }); },
  });
}

export function useDeliverSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => salesOrderApiClient.deliver(id),
    onSuccess:  (_d, id) => { qc.invalidateQueries({ queryKey: QUERY_KEYS.SALES_ORDER(id) }); qc.invalidateQueries({ queryKey: QUERY_KEYS.SALES_ORDERS }); },
  });
}

export function useCancelSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      salesOrderApiClient.cancel(id, reason),
    onSuccess: (_d, { id }) => { qc.invalidateQueries({ queryKey: QUERY_KEYS.SALES_ORDER(id) }); qc.invalidateQueries({ queryKey: QUERY_KEYS.SALES_ORDERS }); },
  });
}

// ── React Query Hooks — Purchase Orders ───────────────────────

export function usePurchaseOrders(params?: GetAllPurchaseOrdersParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PURCHASE_ORDERS, params],
    queryFn:  () => purchaseOrderApiClient.getAll(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePurchaseOrderById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PURCHASE_ORDER(id),
    queryFn:  () => purchaseOrderApiClient.getById(id),
    enabled:  !!id,
  });
}

export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreatePurchaseOrderPayload) => purchaseOrderApiClient.create(p),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASE_ORDERS }); },
  });
}

export function useAddPurchaseOrderItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddPurchaseOrderItemPayload }) =>
      purchaseOrderApiClient.addItem(id, payload),
    onSuccess: (_d, { id }) => { qc.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASE_ORDER(id) }); },
  });
}

export function useSubmitPurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => purchaseOrderApiClient.submit(id),
    onSuccess:  (_d, id) => { qc.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASE_ORDER(id) }); qc.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASE_ORDERS }); },
  });
}

export function useApprovePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => purchaseOrderApiClient.approve(id),
    onSuccess:  (_d, id) => { qc.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASE_ORDER(id) }); qc.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASE_ORDERS }); },
  });
}

export function useReceivePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReceivePurchaseOrderPayload }) =>
      purchaseOrderApiClient.receive(id, payload),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASE_ORDER(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASE_ORDERS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.LOW_STOCK_ALERTS });
    },
  });
}

export function useCancelPurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      purchaseOrderApiClient.cancel(id, reason),
    onSuccess: (_d, { id }) => { qc.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASE_ORDER(id) }); qc.invalidateQueries({ queryKey: QUERY_KEYS.PURCHASE_ORDERS }); },
  });
}
