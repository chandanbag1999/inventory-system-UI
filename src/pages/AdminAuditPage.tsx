import { motion }    from 'framer-motion';
import { Shield, Download, Filter, LogIn, Package, ShoppingCart, Users, Settings, ArrowLeftRight } from 'lucide-react';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { useExport }  from '@/shared/hooks/useExport';
import { Button }     from '@/components/ui/button';
import { Badge }      from '@/components/ui/badge';
import { cn }         from '@/lib/utils';

interface AuditRow {
  id:       string;
  action:   string;
  resource: string;
  user:     string;
  role:     string;
  time:     string;
  ip:       string;
  status:   string;
}

const auditLogs: AuditRow[] = [
  { id:'1',  action:'User Login',             resource:'auth',      user:'Priya Sharma', role:'admin',     time:'2 min ago',   ip:'103.21.58.xx',  status:'success' },
  { id:'2',  action:'Order Status Updated',   resource:'orders',    user:'System',       role:'system',    time:'15 min ago',  ip:'—',             status:'success' },
  { id:'3',  action:'Product Created',        resource:'products',  user:'Rahul Mehta',  role:'seller',    time:'1 hr ago',    ip:'182.73.12.xx',  status:'success' },
  { id:'4',  action:'Stock Transfer',         resource:'inventory', user:'Anita Desai',  role:'warehouse', time:'3 hrs ago',   ip:'49.207.33.xx',  status:'success' },
  { id:'5',  action:'User Role Changed',      resource:'users',     user:'Priya Sharma', role:'admin',     time:'1 day ago',   ip:'103.21.58.xx',  status:'success' },
  { id:'6',  action:'Product Deleted',        resource:'products',  user:'Rahul Mehta',  role:'seller',    time:'1 day ago',   ip:'182.73.12.xx',  status:'success' },
  { id:'7',  action:'Failed Login Attempt',   resource:'auth',      user:'Unknown',      role:'—',         time:'2 days ago',  ip:'45.33.100.xx',  status:'failed'  },
  { id:'8',  action:'Settings Updated',       resource:'settings',  user:'Priya Sharma', role:'admin',     time:'3 days ago',  ip:'103.21.58.xx',  status:'success' },
  { id:'9',  action:'Report Exported',        resource:'analytics', user:'Priya Sharma', role:'admin',     time:'4 days ago',  ip:'103.21.58.xx',  status:'success' },
  { id:'10', action:'Warehouse Updated',      resource:'warehouses',user:'Anita Desai',  role:'warehouse', time:'5 days ago',  ip:'49.207.33.xx',  status:'success' },
];

const resourceIcon: Record<string, React.ElementType> = {
  auth:       LogIn,
  orders:     ShoppingCart,
  products:   Package,
  inventory:  ArrowLeftRight,
  users:      Users,
  settings:   Settings,
  analytics:  Shield,
  warehouses: Shield,
};

const roleColors: Record<string, string> = {
  admin:     'bg-purple-500/10 text-purple-600',
  seller:    'bg-blue-500/10 text-blue-600',
  warehouse: 'bg-amber-500/10 text-amber-600',
  delivery:  'bg-green-500/10 text-green-600',
  system:    'bg-muted text-muted-foreground',
};

export default function AdminAuditPage() {
  const { exportExcel, isExporting } = useExport();

  const columns: Column<AuditRow>[] = [
    {
      key: 'action', label: 'Action',
      render: (_, row) => {
        const Icon = resourceIcon[row.resource] ?? Shield;
        return (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="font-medium text-sm">{row.action}</span>
          </div>
        );
      },
    },
    {
      key: 'user', label: 'User',
      render: (_, row) => (
        <div>
          <p className="text-sm font-medium">{row.user}</p>
          <Badge variant="outline" className={cn('text-[10px] mt-0.5 capitalize', roleColors[row.role])}>
            {row.role}
          </Badge>
        </div>
      ),
    },
    {
      key: 'resource', label: 'Resource',
      render: (val) => <span className="capitalize text-sm text-muted-foreground">{val as string}</span>,
    },
    {
      key: 'status', label: 'Status',
      render: (val) => (
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium',
          val === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600')}>
          {val === 'success' ? 'Success' : 'Failed'}
        </span>
      ),
    },
    { key: 'ip',   label: 'IP Address', render: (val) => <span className="font-mono text-xs text-muted-foreground">{val as string}</span> },
    { key: 'time', label: 'Time',       render: (val) => <span className="text-sm text-muted-foreground">{val as string}</span> },
  ];

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Audit Log</h1>
            <p className="page-subtitle">Complete system activity trail</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => exportExcel(auditLogs, 'audit-log')} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>

        {/* Summary */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible"
          className="grid grid-cols-3 gap-4">
          {[
            { label:'Total Events',   value:auditLogs.length,                                      color:'text-foreground'  },
            { label:'Successful',     value:auditLogs.filter(l=>l.status==='success').length,      color:'text-green-600'   },
            { label:'Failed',         value:auditLogs.filter(l=>l.status==='failed').length,       color:'text-red-600'     },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-4 text-center">
              <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={auditLogs}
            columns={columns}
            searchable
            searchPlaceholder="Search by action, user, resource..."
            emptyMessage="No audit logs found."
            defaultSort={{ key: 'time', dir: 'asc' }}
          />
        </motion.div>
      </div>
    </PageTransition>
  );
}
