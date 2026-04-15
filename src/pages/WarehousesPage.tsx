import { useMemo } from 'react';
import { motion }     from 'framer-motion';
import { Warehouse, Package, TrendingUp, AlertCircle } from 'lucide-react';
import PageTransition, { staggerContainer, staggerItem } from '@/components/PageTransition';
import StatCard        from '@/components/StatCard';
import StatusBadge     from '@/components/StatusBadge';
import { useWarehouses } from '@/modules/warehouses/services/warehouseApi';
import type { Warehouse as WarehouseType } from '@/shared/types';
import { cn }          from '@/lib/utils';

export default function WarehousesPage() {
  const { data: warehousesResponse, isLoading, error, refetch } = useWarehouses();
  
  const warehouses = useMemo(() => {
    if (!warehousesResponse?.items) return [];
    return warehousesResponse.items;
  }, [warehousesResponse]);

  const active = useMemo(() => warehouses.filter((w) => w.status === 'active'), [warehouses]);
  const maintenance = useMemo(() => warehouses.filter((w) => w.status === 'maintenance'), [warehouses]);
  const totalCap = useMemo(() => warehouses.reduce((a, w) => a + (w.capacity ?? 0), 0), [warehouses]);
  const avgUtil = useMemo(() => {
    if (warehouses.length === 0) return 0;
    return Math.round(warehouses.reduce((a, w) => a + (w.utilization ?? 0), 0) / warehouses.length);
  }, [warehouses]);

  const columns = [
    {
      key: 'name', label: 'Warehouse',
      render: (_: unknown, row: WarehouseType) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Warehouse className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.location ?? row.City ?? ''}</p>
          </div>
        </div>
      ),
    },
    { key: 'manager', label: 'Manager', render: (_: unknown, row: WarehouseType) => row.manager ?? 'Unassigned' },
    {
      key: 'capacity', label: 'Capacity',
      render: (val: unknown) => <span className="tabular-nums">{(val as number)?.toLocaleString() ?? 0} units</span>,
    },
    {
      key: 'utilization', label: 'Utilization',
      render: (val: unknown) => {
        const v = val as number;
        const color = v >= 90 ? 'text-destructive' : v >= 70 ? 'text-amber-500' : 'text-green-500';
        const bgColor = v >= 90 ? 'bg-destructive' : v >= 70 ? 'bg-amber-500' : 'bg-green-500';
        return (
          <div className="flex items-center gap-3 min-w-[140px]">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className={cn('h-full rounded-full transition-all', bgColor)} style={{ width: v + '%' }} />
            </div>
            <span className={cn('text-sm font-semibold tabular-nums w-10 text-right', color)}>{v}%</span>
          </div>
        );
      },
    },
    {
      key: 'status', label: 'Status',
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
  ];

  if (error) {
    return (
      <PageTransition>
        <div className="page-container">
          <div className="text-center py-16">
            <p className="text-destructive">Failed to load warehouses. Please try again.</p>
            <button className="mt-4 px-4 py-2 bg-secondary rounded-lg" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Warehouses</h1>
            <p className="page-subtitle">{warehouses.length} warehouses across India</p>
          </div>
        </div>

        {/* Stats */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Total Warehouses', value: String(warehouses.length), icon: Warehouse,    changeType: 'neutral'  as const, change: 'All locations'       },
            { title: 'Active',           value: String(active.length),     icon: TrendingUp,   changeType: 'positive' as const, change: 'Operational'        },
            { title: 'In Maintenance',   value: String(maintenance.length),icon: AlertCircle,  changeType: 'negative' as const, change: 'Under maintenance'  },
            { title: 'Avg Utilization',  value: avgUtil + '%',             icon: Package,      changeType: avgUtil > 80 ? 'negative' as const : 'neutral' as const, change: 'Across all' },
          ].map((s) => <StatCard key={s.title} {...s} />)}
        </motion.div>

        {/* Capacity Bar */}
        {warehouses.length > 0 && (
          <motion.div variants={staggerItem} initial="hidden" animate="visible"
            className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-4">Warehouse Utilization Overview</h3>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 bg-muted animate-pulse rounded" />
                ))
              ) : warehouses.map((w) => {
                const util = w.utilization ?? 0;
                const color = util >= 90 ? 'bg-destructive' : util >= 70 ? 'bg-amber-500' : 'bg-green-500';
                return (
                  <div key={w.id}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium">{w.name}</span>
                      <span className="text-muted-foreground">{util}% · {(w.capacity ?? 0).toLocaleString()} units</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={cn('h-full rounded-full', color)}
                        initial={{ width: 0 }}
                        animate={{ width: util + '%' }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Table */}
        {warehouses.length > 0 && (
          <motion.div variants={staggerItem} initial="hidden" animate="visible"
            className="data-table-container rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {columns.map((col) => (
                      <th key={col.key} className="text-left py-3 px-5 text-xs font-medium text-muted-foreground">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td colSpan={5} className="py-4 px-5">
                          <div className="h-4 bg-muted animate-pulse rounded w-full" />
                        </td>
                      </tr>
                    ))
                  ) : warehouses.map((w) => (
                    <tr key={w.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      {columns.map((col) => (
                        <td key={col.key} className="py-3 px-5">
                          {col.render ? col.render(w[col.key as keyof WarehouseType], w) : String(w[col.key as keyof WarehouseType] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {!isLoading && warehouses.length === 0 && (
          <motion.div variants={staggerItem} initial="hidden" animate="visible"
            className="glass-card rounded-xl p-16 text-center">
            <Warehouse className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No warehouses found.</p>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}