import { useState }    from 'react';
import { motion }      from 'framer-motion';
import {
  TrendingUp, ShoppingCart, Package,
  Truck, Download, Calendar,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie,
  Cell, AreaChart, Area, Legend,
} from 'recharts';
import PageTransition, { staggerContainer, staggerItem } from '@/components/PageTransition';
import StatCard        from '@/components/StatCard';
import { Button }      from '@/components/ui/button';
import { useExport }   from '@/shared/hooks/useExport';
import { cn }          from '@/lib/utils';

const COLORS = ['hsl(220,72%,50%)','hsl(142,72%,40%)','hsl(38,92%,50%)','hsl(280,65%,60%)','hsl(340,75%,55%)'];

const revenueData = [
  { month:'Oct', revenue:186400, orders:324, target:180000 },
  { month:'Nov', revenue:215800, orders:398, target:200000 },
  { month:'Dec', revenue:289600, orders:512, target:250000 },
  { month:'Jan', revenue:247300, orders:445, target:260000 },
  { month:'Feb', revenue:312500, orders:578, target:290000 },
  { month:'Mar', revenue:278900, orders:501, target:300000 },
];

const categoryData = [
  { name:'Electronics', value:35, revenue:1240000 },
  { name:'Apparel',     value:25, revenue:885000  },
  { name:'Kitchen',     value:20, revenue:708000  },
  { name:'Sports',      value:12, revenue:425000  },
  { name:'Other',       value:8,  revenue:283000  },
];

const warehousePerf = [
  { warehouse:'Mumbai Central', inbound:1200, outbound:980,  transfers:150 },
  { warehouse:'Delhi Hub',      inbound:980,  outbound:850,  transfers:200 },
  { warehouse:'Bangalore South',inbound:750,  outbound:690,  transfers:80  },
  { warehouse:'Chennai Port',   inbound:200,  outbound:180,  transfers:20  },
];

const deliveryPerf = [
  { week:'W1', delivered:42, failed:3, pending:8  },
  { week:'W2', delivered:58, failed:2, pending:12 },
  { week:'W3', delivered:51, failed:4, pending:7  },
  { week:'W4', delivered:67, failed:1, pending:9  },
];

type Range = '7d' | '30d' | '90d' | '1y';

export default function AnalyticsPage() {
  const [range, setRange]   = useState<Range>('30d');
  const { exportExcel, isExporting } = useExport();

  const ranges: { key: Range; label: string }[] = [
    { key:'7d',  label:'7 Days'  },
    { key:'30d', label:'30 Days' },
    { key:'90d', label:'90 Days' },
    { key:'1y',  label:'1 Year'  },
  ];

  const handleExport = () => {
    exportExcel(revenueData.map((d)=>({
      Month:d.month, Revenue:d.revenue, Orders:d.orders, Target:d.target
    })), 'analytics-report');
  };

  const tooltipStyle = {
    backgroundColor:'hsl(var(--card))',
    border:'1px solid hsl(var(--border))',
    borderRadius:'8px',
    fontSize:'12px',
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Analytics</h1>
            <p className="page-subtitle">Business intelligence and performance metrics</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Date Range */}
            <div className="flex rounded-lg border border-border bg-secondary/50 p-0.5">
              {ranges.map((r) => (
                <button key={r.key} onClick={()=>setRange(r.key)}
                  className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    range === r.key ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                  {r.label}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title:'Total Revenue',  value:'Rs.15.3L',  icon:TrendingUp,  changeType:'positive' as const, change:'+12.5% vs last period' },
            { title:'Total Orders',   value:'2,758',     icon:ShoppingCart,changeType:'positive' as const, change:'+8.2% vs last period'  },
            { title:'Avg Order Value',value:'Rs.5,548',  icon:Package,     changeType:'positive' as const, change:'+4.1% vs last period'  },
            { title:'Delivery Rate',  value:'94.2%',     icon:Truck,       changeType:'positive' as const, change:'+1.3% vs last period'  },
          ].map((s)=><StatCard key={s.title} {...s} />)}
        </motion.div>

        {/* Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div variants={staggerItem} initial="hidden" animate="visible"
            className="lg:col-span-2 glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-1">Revenue vs Target</h3>
            <p className="text-xs text-muted-foreground mb-4">Monthly performance comparison</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="hsl(220,72%,50%)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="hsl(220,72%,50%)" stopOpacity={0}   />
                    </linearGradient>
                    <linearGradient id="target" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="hsl(142,72%,40%)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="hsl(142,72%,40%)" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v)=>'Rs.'+(v/1000).toFixed(0)+'k'} />
                  <Tooltip contentStyle={tooltipStyle}
                    formatter={(v:number,n:string)=>['Rs.'+v.toLocaleString(), n==='revenue'?'Revenue':'Target']} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(220,72%,50%)" fill="url(#revenue)" strokeWidth={2} name="revenue" />
                  <Area type="monotone" dataKey="target"  stroke="hsl(142,72%,40%)" fill="url(#target)"  strokeWidth={2} strokeDasharray="5 5" name="target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} initial="hidden" animate="visible"
            className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-1">Sales by Category</h3>
            <p className="text-xs text-muted-foreground mb-4">Revenue distribution</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                    paddingAngle={3} dataKey="value">
                    {categoryData.map((_,i)=><Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v:number)=>[v+'%','Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {categoryData.map((c,i)=>(
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{backgroundColor:COLORS[i]}} />
                    <span className="text-muted-foreground">{c.name}</span>
                  </div>
                  <span className="font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Warehouse + Delivery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div variants={staggerItem} initial="hidden" animate="visible"
            className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-1">Warehouse Performance</h3>
            <p className="text-xs text-muted-foreground mb-4">Stock movements by warehouse</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={warehousePerf} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{fontSize:10}} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="warehouse" tick={{fontSize:9}} width={100} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="inbound"  fill="hsl(142,72%,40%)" radius={[0,4,4,0]} barSize={8} name="Inbound"  />
                  <Bar dataKey="outbound" fill="hsl(220,72%,50%)" radius={[0,4,4,0]} barSize={8} name="Outbound" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} initial="hidden" animate="visible"
            className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-1">Delivery Performance</h3>
            <p className="text-xs text-muted-foreground mb-4">Weekly delivery success rate</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveryPerf}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="delivered" fill="hsl(142,72%,40%)" radius={[4,4,0,0]} name="Delivered" />
                  <Bar dataKey="failed"    fill="hsl(0,72%,51%)"   radius={[4,4,0,0]} name="Failed"    />
                  <Bar dataKey="pending"   fill="hsl(38,92%,50%)"  radius={[4,4,0,0]} name="Pending"   />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Top Products Table */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible"
          className="glass-card rounded-xl overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Top Performing Products</h3>
            <span className="text-xs text-muted-foreground">By revenue this period</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground">#</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground">Category</th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-muted-foreground">Units Sold</th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-muted-foreground">Revenue</th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-muted-foreground">Growth</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank:1, name:'Wireless BT Headphones', cat:'Electronics', units:342, revenue:854958, growth:'+23%' },
                  { rank:2, name:'Cotton T-Shirt Pack',    cat:'Apparel',     units:890, revenue:800110, growth:'+15%' },
                  { rank:3, name:'Stainless Steel Bottle', cat:'Kitchen',     units:1240,revenue:743600, growth:'+31%' },
                  { rank:4, name:'USB-C Fast Charger',     cat:'Electronics', units:567, revenue:736533, growth:'+8%'  },
                  { rank:5, name:'Portable Power Bank',    cat:'Electronics', units:445, revenue:711555, growth:'+19%' },
                ].map((p) => (
                  <tr key={p.rank} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-5">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {p.rank}
                      </span>
                    </td>
                    <td className="py-3 px-5 font-medium">{p.name}</td>
                    <td className="py-3 px-5 text-muted-foreground">{p.cat}</td>
                    <td className="py-3 px-5 text-right tabular-nums">{p.units.toLocaleString()}</td>
                    <td className="py-3 px-5 text-right tabular-nums font-semibold">Rs.{(p.revenue/100000).toFixed(1)}L</td>
                    <td className="py-3 px-5 text-right">
                      <span className="text-green-600 font-semibold">{p.growth}</span>
                    </td>
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
