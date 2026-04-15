import { Link, useLocation } from 'react-router-dom';
import {
  X, LayoutDashboard, Package, ShoppingCart, Boxes,
  Warehouse as WarehouseIcon, Truck, ArrowLeftRight,
  Store, TrendingUp, MapPin, Wallet, Users, Settings, Shield, LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/shared/store/authStore';
import { navigation }   from '@/config/navigation';
import { cn }           from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, Package, ShoppingCart, Boxes,
  Warehouse: WarehouseIcon, Truck, ArrowLeftRight,
  Store, TrendingUp, MapPin, Wallet, Users, Settings, Shield,
};

interface Props { open: boolean; onClose: () => void; }

export default function MobileNav({ open, onClose }: Props) {
  const location       = useLocation();
  const { user, logout } = useAuthStore();

  if (!open) return null;

  const filteredNav = navigation
    .map((g) => ({ ...g, items: g.items.filter((i) => user && i.roles.includes(user.role as import('@/types').UserRole)) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border flex flex-col animate-fade-in-left">
        <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border shrink-0">
          <span className="font-bold text-base">StockPulse</span>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-sidebar-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {filteredNav.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon   = iconMap[item.icon] ?? LayoutDashboard;
                  const active = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        active
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => { logout(); onClose(); }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
