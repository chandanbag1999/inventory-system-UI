import { motion }      from 'framer-motion';
import { DollarSign, ShoppingCart, Package, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import PageTransition, { staggerContainer, staggerItem } from '@/components/PageTransition';
import StatCard         from '@/components/StatCard';
import StatusBadge      from '@/components/StatusBadge';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { useExport }    from '@/shared/hooks/useExport';
import { useOrderStore } from '@/shared/store/orderStore';
import { useProductStore } from '@/shared/store/productStore';
import { Button }       from '@/components/ui/button';
import type { Order }   from '@/shared/types';

const revenueData = [
  { month:'Jan', revenue:82400  },
  { month:'Feb', revenue:95600  },
  { month:'Mar', revenue:78300  },
  { month:'Apr', revenue:112000 },
  { month:'May', revenue:134500 },
  { month:'Jun', revenue:98700  },
];

const topProducts = [
  { name:'Wireless BT Headphones', sales:142, revenue:354858 },
  { name:'USB-C Fast Charger',     sales:89,  revenue:115711 },
  { name:'Portable Power Bank',    sales:76,  revenue:121524 },
  { name:'LED Desk Lamp',          sales:54,  revenue:94446  },
  { name:'Cotton T-Shirt Pack',    sales:201, revenue:180699 },
];

export default function SellerRevenuePage() {
  const orders         = useOrderStore((s) => s.orders);
  const products       = useProductStore((s) => s.products);
  const { exportExcel, isExporting } = useExport();

  const myRevenue  = orders.reduce((a, o) => a + o.total, 0);
  const myOrders   = orders.length;
  const delivered  = orders.filter((o) => o.status === 'delivered').length;

  const orderColumns: Column<Order>[] = [
    { key:'orderNumber', label:'Order', render:(val)=><span className="font-medium">{val as string}</span> },
    { key:'customer',    label:'Customer' },
    { key:'status',      label:'Status',  render:(val)=><StatusBadge status={val as string} /> },
    { key:'total',       label:'Amount',  render:(val)=><span className="font-semibold tabular-nums">Rs.{(val as number).toLocaleString()}</span> },
    { key:'createdAt',   label:'Date',    render:(val)=><span className="text-muted-foreground text-sm">{new Date(val as string).toLocaleDateString('en-IN')}</span> },
  ];

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Revenue Analytics</h1>
            <p className="page-subtitle">Your sales performance and earnings</p>
          </div>
          <Button variant="outline" size="sm"
            onClick={() => exportExcel(orders.map((o)=>({ Order:o.orderNumber, Customer:o.customer, Total:o.total, Status:o.status, Date:o.createdAt })), 'my-revenue')}
            disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title:'Total Revenue',   value:'Rs.'+myRevenue.toLocaleString(), icon:DollarSign,   changeType:'positive' as const, change:'+18.3% this month' },
            { title:'Total Orders',    value:String(myOrders),                 icon:ShoppingCart,  changeType:'positive' as const, change:'+15 today'         },
            { title:'Delivered',       value:String(delivered),                icon:Package,       changeType:'positive' as const, change:'Successfully'      },
            { title:'My Products',     value:String(products.length),          icon:TrendingUp,    changeType:'neutral'  as const, change:'In catalog'        },
          ].map((s)=><StatCard key={s.title} {...s} />)}
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div variants={staggerItem} initial="hidden" animate="visible"
            className="lg:col-span-2 glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-4">Monthly Revenue</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{fontSize:12}} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{fontSize:12}} stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v)=>'Rs.'+(v/1000).toFixed(0)+'k'} />
                  <Tooltip formatter={(v:number)=>['Rs.'+v.toLocaleString(),'Revenue']}
                    contentStyle={{backgroundColor:'hsl(var(--card))',border:'1px solid hsl(var(--border))',borderRadius:'8px',fontSize:'12px'}} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} initial="hidden" animate="visible"
            className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-4">Top Products</h3>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-4">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.sales} sales</p>
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-green-600">
                    Rs.{(p.revenue/1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Orders Table */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <h3 className="text-sm font-semibold mb-3">Recent Orders</h3>
          <DataTable
            data={orders}
            columns={orderColumns}
            searchable
            searchPlaceholder="Search orders..."
            emptyMessage="No orders found."
            defaultSort={{ key:'createdAt', dir:'desc' }}
          />
        </motion.div>
      </div>
    </PageTransition>
  );
}
