import { useState }    from 'react';
import { motion }      from 'framer-motion';
import {
  RotateCcw, CheckCircle, XCircle,
  Clock, DollarSign, Plus,
} from 'lucide-react';
import PageTransition, { staggerContainer, staggerItem } from '@/components/PageTransition';
import StatCard        from '@/components/StatCard';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { Button }      from '@/components/ui/button';
import { Badge }       from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input }       from '@/components/ui/input';
import { Label }       from '@/components/ui/label';
import { Textarea }    from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast }       from 'sonner';
import { cn }          from '@/lib/utils';

interface ReturnRow {
  id:          string;
  rmaNumber:   string;
  orderId:     string;
  customer:    string;
  product:     string;
  reason:      string;
  status:      'requested' | 'approved' | 'rejected' | 'received' | 'refunded';
  refundAmount:number;
  createdAt:   string;
}

const mockReturns: ReturnRow[] = [
  { id:'1', rmaNumber:'RMA-001', orderId:'ORD-7842', customer:'Meera Kapoor',  product:'Wireless BT Headphones', reason:'Defective product',      status:'refunded',  refundAmount:2499, createdAt:'2026-03-15' },
  { id:'2', rmaNumber:'RMA-002', orderId:'ORD-7843', customer:'Arjun Patel',   product:'USB-C Fast Charger',     reason:'Wrong item received',     status:'approved',  refundAmount:1299, createdAt:'2026-03-16' },
  { id:'3', rmaNumber:'RMA-003', orderId:'ORD-7844', customer:'Sneha Reddy',   product:'Premium Yoga Mat',       reason:'Not as described',        status:'requested', refundAmount:1899, createdAt:'2026-03-17' },
  { id:'4', rmaNumber:'RMA-004', orderId:'ORD-7845', customer:'Karan Nair',    product:'LED Desk Lamp',          reason:'Damaged during shipping', status:'received',  refundAmount:1749, createdAt:'2026-03-18' },
  { id:'5', rmaNumber:'RMA-005', orderId:'ORD-7846', customer:'Divya Joshi',   product:'Power Bank 20000mAh',    reason:'Battery issues',          status:'rejected',  refundAmount:0,    createdAt:'2026-03-19' },
  { id:'6', rmaNumber:'RMA-006', orderId:'ORD-7849', customer:'Suresh Kumar',  product:'Cotton T-Shirt Pack',    reason:'Size mismatch',           status:'approved',  refundAmount:899,  createdAt:'2026-03-20' },
];

const statusConfig = {
  requested: { label:'Requested', color:'bg-blue-500/10 text-blue-600',    icon:Clock        },
  approved:  { label:'Approved',  color:'bg-amber-500/10 text-amber-600',  icon:CheckCircle  },
  rejected:  { label:'Rejected',  color:'bg-red-500/10 text-red-600',      icon:XCircle      },
  received:  { label:'Received',  color:'bg-purple-500/10 text-purple-600',icon:RotateCcw    },
  refunded:  { label:'Refunded',  color:'bg-green-500/10 text-green-600',  icon:DollarSign   },
};

export default function ReturnsPage() {
  const [returns, setReturns]   = useState<ReturnRow[]>(mockReturns);
  const [showNew, setShowNew]   = useState(false);
  const [newReturn, setNewReturn] = useState({ orderId:'', customer:'', product:'', reason:'' });

  const pending   = returns.filter((r) => r.status === 'requested').length;
  const approved  = returns.filter((r) => r.status === 'approved').length;
  const refunded  = returns.filter((r) => r.status === 'refunded').length;
  const totalRefund = returns.filter((r)=>r.status==='refunded').reduce((a,r)=>a+r.refundAmount,0);

  const handleApprove = (id: string) => {
    setReturns((p) => p.map((r) => r.id === id ? { ...r, status:'approved' } : r));
    toast.success('Return request approved');
  };

  const handleReject = (id: string) => {
    setReturns((p) => p.map((r) => r.id === id ? { ...r, status:'rejected', refundAmount:0 } : r));
    toast.error('Return request rejected');
  };

  const handleCreate = () => {
    if (!newReturn.orderId || !newReturn.customer || !newReturn.reason) {
      toast.error('Fill all required fields'); return;
    }
    const r: ReturnRow = {
      id:           crypto.randomUUID(),
      rmaNumber:    'RMA-' + String(returns.length + 1).padStart(3,'0'),
      orderId:      newReturn.orderId,
      customer:     newReturn.customer,
      product:      newReturn.product,
      reason:       newReturn.reason,
      status:       'requested',
      refundAmount: 0,
      createdAt:    new Date().toISOString().split('T')[0],
    };
    setReturns((p) => [r, ...p]);
    setShowNew(false);
    setNewReturn({ orderId:'', customer:'', product:'', reason:'' });
    toast.success('Return request created - ' + r.rmaNumber);
  };

  const columns: Column<ReturnRow>[] = [
    {
      key:'rmaNumber', label:'RMA',
      render:(val)=><span className="font-mono text-sm font-medium">{val as string}</span>,
    },
    {
      key:'customer', label:'Customer',
      render:(_,row)=>(
        <div>
          <p className="font-medium text-sm">{row.customer}</p>
          <p className="text-xs text-muted-foreground font-mono">{row.orderId}</p>
        </div>
      ),
    },
    { key:'product', label:'Product', render:(val)=><span className="text-sm">{val as string}</span> },
    { key:'reason',  label:'Reason',  render:(val)=><span className="text-sm text-muted-foreground">{val as string}</span> },
    {
      key:'status', label:'Status',
      render:(val)=>{
        const cfg = statusConfig[val as keyof typeof statusConfig];
        const Icon = cfg.icon;
        return (
          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', cfg.color)}>
            <Icon className="h-3 w-3" />{cfg.label}
          </span>
        );
      },
    },
    {
      key:'refundAmount', label:'Refund',
      render:(val)=>(
        <span className={cn('font-semibold tabular-nums', (val as number)>0 ? 'text-green-600' : 'text-muted-foreground')}>
          {(val as number) > 0 ? 'Rs.'+(val as number).toLocaleString() : '—'}
        </span>
      ),
    },
    {
      key:'createdAt', label:'Date',
      render:(val)=><span className="text-muted-foreground text-sm">{new Date(val as string).toLocaleDateString('en-IN')}</span>,
    },
    {
      key:'id', label:'Actions', sortable:false,
      render:(_,row)=>(
        row.status === 'requested' ? (
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50"
              onClick={()=>handleApprove(row.id)}>Approve</Button>
            <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
              onClick={()=>handleReject(row.id)}>Reject</Button>
          </div>
        ) : null
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Returns & RMA</h1>
            <p className="page-subtitle">{returns.length} return requests</p>
          </div>
          <Button size="sm" onClick={()=>setShowNew(true)}>
            <Plus className="h-4 w-4 mr-2" />New Return
          </Button>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title:'Total Returns',  value:String(returns.length), icon:RotateCcw,   changeType:'neutral'  as const, change:'All requests'    },
            { title:'Pending',        value:String(pending),        icon:Clock,        changeType:'negative' as const, change:'Awaiting action' },
            { title:'Approved',       value:String(approved),       icon:CheckCircle,  changeType:'positive' as const, change:'In process'      },
            { title:'Total Refunded', value:'Rs.'+totalRefund.toLocaleString(), icon:DollarSign, changeType:'neutral' as const, change:'Processed' },
          ].map((s)=><StatCard key={s.title} {...s} />)}
        </motion.div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={returns}
            columns={columns}
            searchable
            searchPlaceholder="Search by RMA, customer, order..."
            emptyMessage="No return requests found."
            defaultSort={{ key:'createdAt', dir:'desc' }}
          />
        </motion.div>
      </div>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create Return Request</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Order ID <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. ORD-7850" value={newReturn.orderId}
                onChange={(e)=>setNewReturn((p)=>({...p,orderId:e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Customer Name <span className="text-destructive">*</span></Label>
              <Input placeholder="Customer full name" value={newReturn.customer}
                onChange={(e)=>setNewReturn((p)=>({...p,customer:e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Product</Label>
              <Input placeholder="Product name" value={newReturn.product}
                onChange={(e)=>setNewReturn((p)=>({...p,product:e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Reason <span className="text-destructive">*</span></Label>
              <Textarea placeholder="Describe the return reason..." rows={3} value={newReturn.reason}
                onChange={(e)=>setNewReturn((p)=>({...p,reason:e.target.value}))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setShowNew(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
