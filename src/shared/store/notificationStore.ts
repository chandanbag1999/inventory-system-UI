// ============================================================
// NOTIFICATION STORE
// src/shared/store/notificationStore.ts
// ============================================================

import { create } from 'zustand';
import type { Notification, NotificationType, NotificationPriority } from '@/shared/types';

// ─── Mock Notifications ──────────────────────────────────────
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Portable Power Bank 20000mAh is running low (12 units left)',
    read: false,
    actionUrl: '/inventory',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    priority: 'high',
  },
  {
    id: '2',
    type: 'order',
    title: 'New Order Received',
    message: 'Order ORD-7850 received from Neha Gupta for ₹3,299',
    read: false,
    actionUrl: '/orders',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    priority: 'medium',
  },
  {
    id: '3',
    type: 'delivery',
    title: 'Delivery Completed',
    message: 'Order ORD-7842 delivered successfully by Vikram Singh',
    read: false,
    actionUrl: '/deliveries',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    priority: 'low',
  },
  {
    id: '4',
    type: 'alert',
    title: 'Warehouse Capacity Warning',
    message: 'Bangalore South warehouse is at 91% capacity',
    read: true,
    actionUrl: '/warehouses',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
  },
  {
    id: '5',
    type: 'system',
    title: 'System Update',
    message: 'StockPulse has been updated to v1.0.0',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    priority: 'low',
  },
];

// ─── Store Interface ─────────────────────────────────────────
interface NotificationStore {
  // State
  notifications:   Notification[];
  isLoading:       boolean;
  panelOpen:       boolean;

  // Computed
  unreadCount:     () => number;
  unreadByType:    (type: NotificationType) => number;

  // Actions
  addNotification:    (n: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead:         (id: string) => void;
  markAllAsRead:      () => void;
  deleteNotification: (id: string) => void;
  clearAll:           () => void;
  setPanelOpen:       (open: boolean) => void;
  togglePanel:        () => void;
  setLoading:         (loading: boolean) => void;

  // Real-time (WebSocket ready)
  handleWSNotification: (n: Notification) => void;
}

// ─── Store ───────────────────────────────────────────────────
export const useNotificationStore = create<NotificationStore>(
  (set, get) => ({
    // ── State ──────────────────────────────────────────────
    notifications: mockNotifications,
    isLoading:     false,
    panelOpen:     false,

    // ── Computed ───────────────────────────────────────────
    unreadCount: () =>
      get().notifications.filter((n) => !n.read).length,

    unreadByType: (type) =>
      get().notifications.filter((n) => !n.read && n.type === type).length,

    // ── Actions ────────────────────────────────────────────
    addNotification: (n) => {
      const newNotification: Notification = {
        ...n,
        id:        crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      set((s) => ({
        notifications: [newNotification, ...s.notifications],
      }));
    },

    markAsRead: (id) =>
      set((s) => ({
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),

    markAllAsRead: () =>
      set((s) => ({
        notifications: s.notifications.map((n) => ({
          ...n,
          read: true,
        })),
      })),

    deleteNotification: (id) =>
      set((s) => ({
        notifications: s.notifications.filter((n) => n.id !== id),
      })),

    clearAll: () => set({ notifications: [] }),

    setPanelOpen: (open) => set({ panelOpen: open }),

    togglePanel: () =>
      set((s) => ({ panelOpen: !s.panelOpen })),

    setLoading: (isLoading) => set({ isLoading }),

    // ── WebSocket Handler ──────────────────────────────────
    handleWSNotification: (n) => {
      set((s) => ({
        notifications: [n, ...s.notifications],
      }));
      // Auto-open panel for critical
      if (n.priority === 'critical') {
        set({ panelOpen: true });
      }
    },
  })
);
