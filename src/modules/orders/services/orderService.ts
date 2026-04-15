// ============================================================
// ORDER SERVICE - Fixed
// src/modules/orders/services/orderService.ts
// ============================================================

import { http }      from '@/shared/services/api/apiClient';
import { ENDPOINTS } from '@/shared/services/api/endpoints';
import type { Order, OrderFilters, PaginatedResponse } from '@/shared/types';
import type { OrderStatus } from '@/shared/types/domain.types';

export const orderService = {
  getOrders: (filters?: Partial<OrderFilters>) =>
    http.get<PaginatedResponse<Order>>(ENDPOINTS.orders.list, filters),

  getOrder: (id: string) =>
    http.get<Order>(ENDPOINTS.orders.detail(id)),

  createOrder: (data: Partial<Order>) =>
    http.post<Order>(ENDPOINTS.orders.create, data),

  updateOrder: (id: string, data: Partial<Order>) =>
    http.put<Order>(ENDPOINTS.orders.update(id), data),

  updateOrderStatus: (id: string, status: OrderStatus) =>
    http.put<Order>(ENDPOINTS.orders.updateStatus(id), { status }),

  deleteOrder: (id: string) =>
    http.delete<void>(ENDPOINTS.orders.delete(id)),

  cancelOrder: (id: string, reason: string) =>
    http.put<Order>(ENDPOINTS.orders.cancel(id), { reason }),

  assignDeliveryPartner: (id: string, partnerId: string) =>
    http.put<Order>(ENDPOINTS.orders.assignPartner(id), { partnerId }),

  getOrderTimeline: (id: string) =>
    http.get<OrderTimelineEvent[]>(ENDPOINTS.orders.timeline(id)),

  addOrderNote: (id: string, note: string) =>
    http.post<OrderNote>(ENDPOINTS.orders.addNote(id), { note }),
};

export interface OrderTimelineEvent {
  id:        string;
  status:    OrderStatus;
  comment?:  string;
  createdAt: string;
  createdBy: string;
}

export interface OrderNote {
  id:        string;
  note:      string;
  createdAt: string;
  createdBy: string;
}

export default orderService;
