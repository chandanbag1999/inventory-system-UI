// ============================================================
// COMMAND PALETTE - Cmd+K Global Search
// src/shared/components/navigation/CommandPalette.tsx
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { useNavigate }   from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, Package, ShoppingCart,
  Boxes, Warehouse, Truck, ArrowLeftRight,
  Users, Settings, Shield, TrendingUp, X,
} from 'lucide-react';
import { useUIStore }      from '@/shared/store/uiStore';
import { useProductStore } from '@/shared/store/productStore';
import { useOrderStore }   from '@/shared/store/orderStore';
import { useAuthStore }    from '@/shared/store/authStore';
import { cn }              from '@/lib/utils';

interface CommandItem {
  id:       string;
  label:    string;
  subtitle?: string;
  icon:     React.ReactNode;
  action:   () => void;
  category: string;
  keywords?: string[];
}

export function CommandPalette() {
  const navigate          = useNavigate();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const products          = useProductStore((s) => s.products);
  const orders            = useOrderStore((s) => s.orders);
  const { user }          = useAuthStore();

  const [query,       setQuery]       = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const close = useCallback(() => {
    setCommandPaletteOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, [setCommandPaletteOpen]);

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, setCommandPaletteOpen, close]);

  const navItems: CommandItem[] = [
    { id: 'nav-dashboard',  label: 'Dashboard',       icon: <LayoutDashboard className="h-4 w-4" />, action: () => navigate('/'),                   category: 'Navigation' },
    { id: 'nav-products',   label: 'Products',        icon: <Package          className="h-4 w-4" />, action: () => navigate('/products'),           category: 'Navigation' },
    { id: 'nav-orders',     label: 'Orders',          icon: <ShoppingCart     className="h-4 w-4" />, action: () => navigate('/orders'),             category: 'Navigation' },
    { id: 'nav-inventory',  label: 'Inventory',       icon: <Boxes            className="h-4 w-4" />, action: () => navigate('/inventory'),          category: 'Navigation' },
    { id: 'nav-warehouses', label: 'Warehouses',      icon: <Warehouse        className="h-4 w-4" />, action: () => navigate('/warehouses'),         category: 'Navigation' },
    { id: 'nav-deliveries', label: 'Deliveries',      icon: <Truck            className="h-4 w-4" />, action: () => navigate('/deliveries'),         category: 'Navigation' },
    { id: 'nav-stock',      label: 'Stock Movements', icon: <ArrowLeftRight   className="h-4 w-4" />, action: () => navigate('/stock-movements'),    category: 'Navigation' },
    { id: 'nav-users',      label: 'Users',           icon: <Users            className="h-4 w-4" />, action: () => navigate('/admin/users'),        category: 'Navigation' },
    { id: 'nav-settings',   label: 'Settings',        icon: <Settings         className="h-4 w-4" />, action: () => navigate('/admin/settings'),     category: 'Navigation' },
    { id: 'nav-audit',      label: 'Audit Log',       icon: <Shield           className="h-4 w-4" />, action: () => navigate('/admin/audit'),        category: 'Navigation' },
    { id: 'nav-revenue',    label: 'Revenue',         icon: <TrendingUp       className="h-4 w-4" />, action: () => navigate('/seller/revenue'),     category: 'Navigation' },
  ];

  const productItems: CommandItem[] = products.slice(0, 5).map((p) => ({
    id:       'product-' + p.id,
    label:    p.name,
    subtitle: p.sku + ' · ' + p.category,
    icon:     <Package className="h-4 w-4 text-blue-500" />,
    action:   () => navigate('/products/' + p.id),
    category: 'Products',
    keywords: [p.sku, p.category],
  }));

  const orderItems: CommandItem[] = orders.slice(0, 5).map((o) => ({
    id:       'order-' + o.id,
    label:    o.orderNumber,
    subtitle: o.customer + ' · Rs.' + o.total.toLocaleString(),
    icon:     <ShoppingCart className="h-4 w-4 text-green-500" />,
    action:   () => navigate('/orders/' + o.id),
    category: 'Orders',
    keywords: [o.customer, o.status],
  }));

  const allItems = [...navItems, ...productItems, ...orderItems];

  const filtered = query.trim()
    ? allItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q)       ||
          item.subtitle?.toLowerCase().includes(q)   ||
          item.category.toLowerCase().includes(q)    ||
          item.keywords?.some((k) => k.toLowerCase().includes(q))
        );
      })
    : navItems;

  // Group by category
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Keyboard navigation
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') {
      const item = filtered[activeIndex];
      if (item) { item.action(); close(); }
    }
  };

  let globalIndex = -1;

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={close}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1,    y: 0    }}
            exit={{    opacity: 0, scale: 0.96, y: -10  }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
          >
            <div className="glass-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages, products, orders..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {query && (
                  <button onClick={() => setQuery('')}>
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
                <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {Object.keys(grouped).length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No results for "{query}"
                  </div>
                ) : (
                  Object.entries(grouped).map(([category, items]) => (
                    <div key={category}>
                      <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {category}
                      </div>
                      {items.map((item) => {
                        globalIndex++;
                        const idx     = globalIndex;
                        const isActive = activeIndex === idx;
                        return (
                          <button
                            key={item.id}
                            onClick={() => { item.action(); close(); }}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                              isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                            )}
                          >
                            <span className={cn('shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')}>
                              {item.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.label}</p>
                              {item.subtitle && (
                                <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                              )}
                            </div>
                            {isActive && (
                              <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono shrink-0">↵</kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><kbd className="bg-muted px-1 rounded">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="bg-muted px-1 rounded">↵</kbd> select</span>
                <span className="flex items-center gap-1"><kbd className="bg-muted px-1 rounded">ESC</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
