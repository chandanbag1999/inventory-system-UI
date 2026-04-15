import { motion }           from 'framer-motion';
import {
  ShoppingCart, Package, DollarSign, TrendingUp,
  Boxes, Truck, AlertTriangle, Activity,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import PageTransition, { staggerContainer, staggerItem } from '@/components/PageTransition';
import StatCard   from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { useAuthStore }  from '@/shared/store/authStore';
import { useOrderStore } from '@/shared/store/orderStore';

const revenueData = [
  { month: 'Oct', revenue: 186400 },
  { month: 'Nov', revenue: 215800 },
  { month: 'Dec', revenue: 289600 },
  { month: 'Jan', revenue: 247300 },
  { month: 'Feb', revenue: 312500 },
  { month: 'Mar', revenue: 278900 },
];

const orderTrend = [
  { day: 'Mon', orders: 42 },
  { day: 'Tue', orders: 58 },
  { day: 'Wed', orders: 35 },
  { day: 'Thu', orders: 67 },
  { day: 'Fri', orders: 84 },
  { day: 'Sat', orders: 91 },
  { day: 'Sun', orders: 63 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Apparel',     value: 25 },
  { name: 'Kitchen',     value: 20 },
  { name: 'Sports',      value: 12 },
  { name: 'Other',       value:  8 },
];

const COLORS = [
  'hsl(220, 72%, 50%)',
  'hsl(142, 72%, 40%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 65%, 60%)',
  'hsl(340, 75%, 55%)',
];

const activityFeed = [
  { text: 'New order ORD-7846 placed by Divya Joshi',          time: '2 min ago',  type: 'order'     },
  { text: 'Low stock alert: USB-C Fast Charger (12 units)',    time: '15 min ago', type: 'alert'     },
  { text: 'Delivery completed: ORD-7842 by Vikram Singh',      time: '1 hr ago',   type: 'delivery'  },
  { text: 'Warehouse Chennai Port moved to maintenance',       time: '3 hrs ago',  type: 'warehouse' },
  { text: 'Bulk stock inbound: 2000 units at Bangalore South', time: '5 hrs ago',  type: 'stock'     },
];

export default function DashboardPage() {
  const { user }   = useAuthStore();
  const orders     = useOrderStore((s) => s.orders);

  const adminStats = [
    { title: 'Total Revenue',      value: '₹12,78,900', change: '+12.5% from last month', changeType: 'positive' as const, icon: DollarSign  },
    { title: 'Total Orders',       value: '1,284',      change: '+8.2% from last month',  changeType: 'positive' as const, icon: ShoppingCart },
    { title: 'Products Active',    value: '847',        change: '+23 new this week',       changeType: 'positive' as const, icon: Package      },
    { title: 'Pending Deliveries', value: '42',         change: '6 delayed',              changeType: 'negative' as const, icon: Truck        },
  ];
  const warehouseStats = [
    { title: 'Total Stock Units', value: '8,604', change: '+500 inbound today',  changeType: 'positive' as const, icon: Boxes        },
    { title: 'Low Stock Items',   value: '3',     change: 'Requires attention',  changeType: 'negative' as const, icon: AlertTriangle },
    { title: 'Stock Movements',   value: '28',    change: 'Today',               changeType: 'neutral'  as const, icon: Activity     },
    { title: 'Warehouse Util.',   value: '72%',   change: 'Mumbai Central',      changeType: 'neutral'  as const, icon: Package      },
  ];
  const deliveryStats = [
    { title: 'Active Deliveries', value: '2',    change: '1 in transit', changeType: 'neutral'  as const, icon: Truck        },
    { title: 'Completed Today',   value: '1',    change: 'On time',      changeType: 'positive' as const, icon: Package      },
    { title: "Today's Earnings",  value: '₹120', change: '+₹120',        changeType: 'positive' as const, icon: DollarSign   },
    { title: 'This Month',        value: '₹650', change: '4 deliveries', changeType: 'positive' as const, icon: TrendingUp   },
  ];
  const sellerStats = [
    { title: 'My Revenue',  value: '₹4,82,300', change: '+18.3% this month', changeType: 'positive' as const, icon: DollarSign   },
    { title: 'My Orders',   value: '342',        change: '+15 today',          changeType: 'positive' as const, icon: ShoppingCart },
    { title: 'My Products', value: '124',        change: '8 drafts',           changeType: 'neutral'  as const, icon: Package      },
    { title: 'Avg. Rating', value: '4.7',        change: '+0.2 this month',    changeType: 'positive' as const, icon: TrendingUp   },
  ];

  const stats =
    user?.role === 'warehouse' ? warehouseStats :
    user?.role === 'delivery'  ? deliveryStats  :
    user?.role === 'seller'    ? sellerStats     :
    adminStats;

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Welcome back, {user?.name.split(' ')[0]}</h1>
            <p className="page-subtitle">Here's what's happening across your operations today.</p>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((s) => <StatCard key={s.title} {...s} />)}
        </motion.div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            variants={staggerItem} initial="hidden" animate="visible"
            className="lg:col-span-2 glass-card rounded-xl p-5"
          >
            <h3 className="text-sm font-semibold mb-4">Revenue Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            variants={staggerItem} initial="hidden" animate="visible"
            className="glass-card rounded-xl p-5"
          >
            <h3 className="text-sm font-semibold mb-4">Sales by Category</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {categoryData.map((c, i) => (
                <div key={c.name} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {c.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            variants={staggerItem} initial="hidden" animate="visible"
            className="glass-card rounded-xl p-5"
          >
            <h3 className="text-sm font-semibold mb-4">Orders This Week</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={orderTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            variants={staggerItem} initial="hidden" animate="visible"
            className="lg:col-span-2 glass-card rounded-xl p-5"
          >
            <h3 className="text-sm font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activityFeed.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{a.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders Table */}
        <motion.div
          variants={staggerItem} initial="hidden" animate="visible"
          className="glass-card rounded-xl overflow-hidden"
        >
          <div className="p-5 pb-3">
            <h3 className="text-sm font-semibold">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground">Order</th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-5 text-xs font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-5 font-medium">{o.orderNumber}</td>
                    <td className="py-3 px-5 text-muted-foreground">{o.customer}</td>
                    <td className="py-3 px-5"><StatusBadge status={o.status} /></td>
                    <td className="py-3 px-5 text-right tabular-nums">₹{o.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
