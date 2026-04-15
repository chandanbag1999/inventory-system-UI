import { motion }       from 'framer-motion';
import { DollarSign, Truck, CheckCircle, Clock, MapPin, Package } from 'lucide-react';
import PageTransition, { staggerContainer, staggerItem } from '@/components/PageTransition';
import StatCard          from '@/components/StatCard';
import StatusBadge       from '@/components/StatusBadge';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { deliveries }    from '@/data/mock';
import { cn }            from '@/lib/utils';
import type { Delivery } from '@/shared/types';

const statusConfig: Record<string, { color: string; label: string }> = {
  assigned:   { color: 'bg-blue-500/10 text-blue-600',   label: 'Assigned'   },
  picked_up:  { color: 'bg-purple-500/10 text-purple-600',label: 'Picked Up'  },
  in_transit: { color: 'bg-amber-500/10 text-amber-600',  label: 'In Transit' },
  delivered:  { color: 'bg-green-500/10 text-green-600',  label: 'Delivered'  },
  failed:     { color: 'bg-red-500/10 text-red-600',      label: 'Failed'     },
  returned:   { color: 'bg-gray-500/10 text-gray-600',    label: 'Returned'   },
};

export default function DeliveriesPage() {
  const totalEarnings = deliveries.reduce((a, d) => a + d.earnings, 0);
  const completed     = deliveries.filter((d) => d.status === 'delivered').length;
  const inTransit     = deliveries.filter((d) => d.status === 'in_transit').length;
  const assigned      = deliveries.filter((d) => d.status === 'assigned').length;

  const columns: Column<Delivery>[] = [
    {
      key: 'orderNumber', label: 'Order',
      render: (val) => <span className="font-medium">{val as string}</span>,
    },
    { key: 'partner', label: 'Partner' },
    {
      key: 'address', label: 'Delivery Address',
      render: (val) => (
        <div className="flex items-center gap-1.5 max-w-[200px]">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="truncate text-sm">{val as string}</span>
        </div>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (val) => {
        const cfg = statusConfig[val as string] ?? { color: '', label: val as string };
        return (
          <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', cfg.color)}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: 'estimatedTime', label: 'ETA',
      render: (val) => (
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{new Date(val as string).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
    },
    {
      key: 'earnings', label: 'Earnings',
      render: (val) => <span className="font-semibold tabular-nums text-green-600">Rs.{(val as number).toLocaleString()}</span>,
    },
  ];

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Deliveries</h1>
            <p className="page-subtitle">{deliveries.length} total deliveries</p>
          </div>
        </div>

        {/* Stats */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Total Deliveries',  value: String(deliveries.length), icon: Truck,        changeType: 'neutral'  as const, change: 'All time'        },
            { title: 'Completed',         value: String(completed),         icon: CheckCircle,  changeType: 'positive' as const, change: 'Successfully delivered' },
            { title: 'In Transit',        value: String(inTransit),         icon: MapPin,       changeType: 'neutral'  as const, change: 'On the way'      },
            { title: 'Total Earnings',    value: 'Rs.' + totalEarnings,    icon: DollarSign,   changeType: 'positive' as const, change: 'All deliveries'  },
          ].map((s) => <StatCard key={s.title} {...s} />)}
        </motion.div>

        {/* Live Tracking Card */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible"
          className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Active Deliveries</h3>
          <div className="space-y-3">
            {deliveries.filter((d) => d.status !== 'delivered').map((d) => {
              const cfg = statusConfig[d.status] ?? { color: '', label: d.status };
              return (
                <div key={d.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{d.orderNumber}</p>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', cfg.color)}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{d.address}</p>
                    <p className="text-xs text-muted-foreground">Partner: {d.partner}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={deliveries}
            columns={columns}
            searchable
            searchPlaceholder="Search by order or partner..."
            emptyMessage="No deliveries found."
          />
        </motion.div>
      </div>
    </PageTransition>
  );
}
