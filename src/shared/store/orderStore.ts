// ============================================================
// ORDER STORE - Zustand Store with Mock Data
// src/shared/store/orderStore.ts
// ============================================================

import { create } from 'zustand';
import type { Order } from '@/shared/types';
import { orders as initialOrders } from '@/data/mock';

export const ORDER_STATUS_FLOW: Record<Order['status'], Order['status'][]> = {
  pending:    ['confirmed', 'cancelled'],
  confirmed:  ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped:    ['delivered'],
  delivered:  [],
  cancelled:  [],
  returned:   [],
};

interface OrderStore {
  orders:           Order[];
  isLoading:        boolean;
  addOrder:         (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrder:      (id: string, data: Partial<Order>) => void;
  deleteOrder:      (id: string) => void;
  getOrder:         (id: string) => Order | undefined;
  setOrders:        (orders: Order[]) => void;
  setLoading:       (loading: boolean) => void;
  transitionStatus: (id: string, newStatus: Order['status']) => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders:    [...initialOrders],
  isLoading: false,

  addOrder: (order) => {
    const newOrder: Order = {
      ...order,
      id:        crypto.randomUUID(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((s) => ({ orders: [newOrder, ...s.orders] }));
  },

  updateOrder: (id, data) => {
    set((s) => ({
      orders: s.orders.map((o) => o.id === id ? { ...o, ...data } : o),
    }));
  },

  deleteOrder: (id) => {
    set((s) => ({ orders: s.orders.filter((o) => o.id !== id) }));
  },

  getOrder: (id) => get().orders.find((o) => o.id === id),

  setOrders: (orders) => set({ orders }),

  setLoading: (isLoading) => set({ isLoading }),

  transitionStatus: (id, newStatus) => {
    const order   = get().getOrder(id);
    if (!order)   return;
    const allowed = ORDER_STATUS_FLOW[order.status];
    if (!allowed.includes(newStatus)) return;
    set((s) => ({
      orders: s.orders.map((o) => o.id === id ? { ...o, status: newStatus } : o),
    }));
  },
}));
