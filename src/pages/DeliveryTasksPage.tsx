import { motion }      from 'framer-motion';
import { Truck, MapPin, Clock, CheckCircle, Package } from 'lucide-react';
import PageTransition, { staggerContainer, staggerItem } from '@/components/PageTransition';
import StatCard         from '@/components/StatCard';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { deliveries }   from '@/data/mock';
import { Button }       from '@/components/ui/button';
import { toast }        from 'sonner';
import { cn }           from '@/lib/utils';
import type { Delivery } from '@/shared/types';

const statusColors: Record<string, string> = {
  assigned:   'bg-blue-500/10 text-blue-600',
  picked_up:  'bg-purple-500/10 text-purple-600',
  in_transit: 'bg-amber-500/10 text-amber-600',
  delivered:  'bg-green-500/10 text-green-600',
  failed:     'bg-red-500/10 text-red-600',
};

export default function DeliveryTasksPage() {
  const active    = deliveries.filter((d) => d.status !== 'delivered');
  const completed = deliveries.filter((d) => d.status === 'delivered');

  const columns: Column<Delivery>[] = [
    {
      key:'orderNumber', label:'Order',
      render:(val)=><span className="font-medium">{val as string}</span>,
    },
    {
      key:'address', label:'Delivery Address',
      render:(val)=>(
        <div className="flex items-center gap-1.5 max-w-[200px]">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="truncate text-sm">{val as string}</span>
        </div>
      ),
    },
    {
      key:'status', label:'Status',
      render:(val)=>(
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium capitalize', statusColors[val as string])}>
          {(val as string).replace('_',' ')}
        </span>
      ),
    },
    {
      key:'estimatedTime', label:'ETA',
      render:(val)=>(
        <div className="flex items-center gap-1.5 text-sm">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          {new Date(val as string).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
        </div>
      ),
    },
    {
      key:'earnings', label:'Earning',
      render:(val)=><span className="font-semibold text-green-600">Rs.{val as number}</span>,
    },
    {
      key:'id', label:'Action', sortable:false,
      render:(_, row)=>(
        row.status !== 'delivered' ? (
          <Button size="sm" variant="outline" className="h-7 text-xs"
            onClick={()=>toast.success('Status updated for '+row.orderNumber)}>
            Update Status
          </Button>
        ) : (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" /> Done
          </span>
        )
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Deliveries</h1>
            <p className="page-subtitle">{deliveries.length} total assignments</p>
          </div>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title:'Total Tasks',    value:String(deliveries.length), icon:Package,      changeType:'neutral'  as const, change:'All assigned'   },
            { title:'Active',         value:String(active.length),     icon:Truck,        changeType:'neutral'  as const, change:'In progress'    },
            { title:'Completed',      value:String(completed.length),  icon:CheckCircle,  changeType:'positive' as const, change:'Successfully'   },
            { title:'Total Earnings', value:'Rs.'+deliveries.reduce((a,d)=>a+d.earnings,0), icon:MapPin, changeType:'positive' as const, change:'This period' },
          ].map((s)=><StatCard key={s.title} {...s} />)}
        </motion.div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={deliveries}
            columns={columns}
            searchable
            searchPlaceholder="Search orders..."
            emptyMessage="No delivery tasks assigned."
          />
        </motion.div>
      </div>
    </PageTransition>
  );
}
