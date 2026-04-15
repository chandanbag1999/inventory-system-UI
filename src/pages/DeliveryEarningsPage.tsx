import { motion }      from 'framer-motion';
import { DollarSign, TrendingUp, Truck, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageTransition, { staggerContainer, staggerItem } from '@/components/PageTransition';
import StatCard         from '@/components/StatCard';
import { deliveries }   from '@/data/mock';

const weeklyData = [
  { day:'Mon', earnings:150 },
  { day:'Tue', earnings:200 },
  { day:'Wed', earnings:120 },
  { day:'Thu', earnings:280 },
  { day:'Fri', earnings:350 },
  { day:'Sat', earnings:190 },
  { day:'Sun', earnings:220 },
];

const monthlyData = [
  { week:'Week 1', earnings:890  },
  { week:'Week 2', earnings:1240 },
  { week:'Week 3', earnings:980  },
  { week:'Week 4', earnings:1510 },
];

export default function DeliveryEarningsPage() {
  const total     = deliveries.reduce((a,d)=>a+d.earnings,0);
  const completed = deliveries.filter((d)=>d.status==='delivered').length;
  const avgPerDel = completed > 0 ? Math.round(total/completed) : 0;

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Earnings</h1>
            <p className="page-subtitle">Track your delivery income</p>
          </div>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title:'Total Earnings',  value:'Rs.'+total,       icon:DollarSign,  changeType:'positive' as const, change:'All time'         },
            { title:'This Month',      value:'Rs.4,620',        icon:TrendingUp,  changeType:'positive' as const, change:'+12% vs last month'},
            { title:'Completed',       value:String(completed), icon:Truck,       changeType:'positive' as const, change:'Deliveries'        },
            { title:'Avg Per Delivery',value:'Rs.'+avgPerDel,  icon:Star,        changeType:'neutral'  as const, change:'Per delivery'      },
          ].map((s)=><StatCard key={s.title} {...s} />)}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div variants={staggerItem} initial="hidden" animate="visible"
            className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-4">This Week</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v)=>'Rs.'+v} />
                  <Tooltip formatter={(v:number)=>['Rs.'+v,'Earnings']}
                    contentStyle={{backgroundColor:'hsl(var(--card))',border:'1px solid hsl(var(--border))',borderRadius:'8px',fontSize:'12px'}} />
                  <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} initial="hidden" animate="visible"
            className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-4">This Month</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{fontSize:11}} stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v)=>'Rs.'+(v/1000).toFixed(1)+'k'} />
                  <Tooltip formatter={(v:number)=>['Rs.'+v,'Earnings']}
                    contentStyle={{backgroundColor:'hsl(var(--card))',border:'1px solid hsl(var(--border))',borderRadius:'8px',fontSize:'12px'}} />
                  <Bar dataKey="earnings" fill="hsl(142, 72%, 40%)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Delivery History */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible"
          className="glass-card rounded-xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-semibold">Delivery History</h3>
          </div>
          <div className="divide-y divide-border">
            {deliveries.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium">{d.orderNumber}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[240px]">{d.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">Rs.{d.earnings}</p>
                  <p className="text-xs text-muted-foreground capitalize">{d.status.replace('_',' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
