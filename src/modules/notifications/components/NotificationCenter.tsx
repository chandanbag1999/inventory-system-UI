// ============================================================
// NOTIFICATION CENTER
// src/modules/notifications/components/NotificationCenter.tsx
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, CheckCheck, Trash2, Package, ShoppingCart, Truck, AlertTriangle, Info } from 'lucide-react';
import { useNotificationStore } from '@/shared/store/notificationStore';
import { formatRelativeTime }   from '@/shared/utils/formatters';
import { cn }                   from '@/lib/utils';
import { Button }               from '@/components/ui/button';
import type { Notification }    from '@/shared/types';

const typeConfig = {
  order:    { icon: ShoppingCart,  color: 'text-blue-500',   bg: 'bg-blue-500/10'   },
  stock:    { icon: Package,       color: 'text-amber-500',  bg: 'bg-amber-500/10'  },
  delivery: { icon: Truck,         color: 'text-green-500',  bg: 'bg-green-500/10'  },
  alert:    { icon: AlertTriangle, color: 'text-red-500',    bg: 'bg-red-500/10'    },
  system:   { icon: Info,          color: 'text-purple-500', bg: 'bg-purple-500/10' },
  payment:  { icon: Info,          color: 'text-green-500',  bg: 'bg-green-500/10'  },
};

const priorityDot = {
  low:      'bg-muted-foreground',
  medium:   'bg-blue-500',
  high:     'bg-amber-500',
  critical: 'bg-red-500',
};

function NotificationItem({ n, onRead, onDelete }: {
  n:        Notification;
  onRead:   (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const config = typeConfig[n.type] ?? typeConfig.system;
  const Icon   = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0  }}
      exit={{    opacity: 0, x: 20  }}
      className={cn(
        'flex gap-3 p-4 border-b border-border/50 last:border-0 transition-colors group',
        !n.read && 'bg-primary/5'
      )}
    >
      <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
        <Icon className={cn('h-4 w-4', config.color)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {!n.read && (
              <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', priorityDot[n.priority])} />
            )}
            <p className={cn('text-sm leading-snug', !n.read ? 'font-semibold' : 'font-medium')}>
              {n.title}
            </p>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {!n.read && (
              <button onClick={() => onRead(n.id)}
                className="p-1 rounded hover:bg-accent transition-colors" title="Mark as read">
                <Check className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
            <button onClick={() => onDelete(n.id)}
              className="p-1 rounded hover:bg-accent transition-colors" title="Delete">
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
        <p className="text-[11px] text-muted-foreground/60 mt-1">{formatRelativeTime(n.createdAt)}</p>
      </div>
    </motion.div>
  );
}

export function NotificationCenter() {
  const {
    notifications,
    panelOpen,
    setPanelOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    unreadCount,
  } = useNotificationStore();

  const count = unreadCount();

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className="relative h-9 w-9 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
      >
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive flex items-center justify-center text-[9px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setPanelOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1    }}
              exit={{    opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 z-50 w-96 glass-card rounded-xl shadow-2xl border border-border overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  {count > 0 && (
                    <span className="h-5 px-1.5 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center">
                      {count}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {count > 0 && (
                    <button onClick={markAllAsRead}
                      className="flex items-center gap-1 text-xs text-primary hover:underline px-2 py-1 rounded hover:bg-accent transition-colors">
                      <CheckCheck className="h-3 w-3" /> Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button onClick={clearAll}
                      className="p-1.5 rounded hover:bg-accent transition-colors" title="Clear all">
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="max-h-[420px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">All caught up!</p>
                    <p className="text-xs text-muted-foreground mt-1">No new notifications</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {notifications.map((n) => (
                      <NotificationItem
                        key={n.id}
                        n={n}
                        onRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-border p-3">
                  <Button variant="ghost" className="w-full h-8 text-xs" onClick={() => setPanelOpen(false)}>
                    View all notifications
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
