import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronLeft, LogOut, LayoutDashboard, Package, ShoppingCart,
  Boxes, Warehouse as WarehouseIcon, Truck, ArrowLeftRight,
  Store, TrendingUp, MapPin, Wallet, Users, Settings, Shield, RotateCcw,
  FolderTree,
} from 'lucide-react';
import { useAuthStore }  from '@/shared/store/authStore';
import { navigation }    from '@/config/navigation';
import { cn }            from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  Warehouse: WarehouseIcon,
  Truck,
  ArrowLeftRight,
  Store,
  TrendingUp,
  MapPin,
  Wallet,
  Users,
  Settings,
  Shield,
  RotateCcw,
  FolderTree,
};

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location                  = useLocation();
  const { user, logout }          = useAuthStore();

  const userRole = user?.role ?? 'viewer';
  const displayName = user?.fullName ?? 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const filteredNav = navigation
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => user && item.roles.includes(userRole)
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className={cn(
      'hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 sticky top-0',
      collapsed ? 'w-16' : 'w-60'
    )}>
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border justify-between shrink-0">
        {!collapsed && <span className="font-bold text-base tracking-tight">StockPulse</span>}
        <button onClick={() => setCollapsed(!collapsed)}
          className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-sidebar-accent transition-colors">
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2 space-y-4">
        {filteredNav.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-1.5">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon   = iconMap[item.icon] ?? LayoutDashboard;
                const active = location.pathname === item.href;
                return (
                  <Link key={item.href} to={item.href} title={collapsed ? item.title : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                      active
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    )}>
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3 shrink-0">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <Link to="/profile"
            className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 hover:ring-2 hover:ring-primary/30 transition-all">
            {initials}
          </Link>
          {!collapsed && (
            <Link to="/profile" className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </Link>
          )}
          {!collapsed && (
            <button onClick={() => logout()} className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors" title="Logout">
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
