import { useState }    from 'react';
import { motion }      from 'framer-motion';
import {
  Plus, MoreHorizontal, Star, Truck,
  Phone, Mail, FileText, Download,
} from 'lucide-react';
import PageTransition, { staggerContainer, staggerItem } from '@/components/PageTransition';
import StatCard        from '@/components/StatCard';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { Button }      from '@/components/ui/button';
import { Badge }       from '@/components/ui/badge';
import { Input }       from '@/components/ui/input';
import { Label }       from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExport }   from '@/shared/hooks/useExport';
import { toast }       from 'sonner';
import { cn }          from '@/lib/utils';
import type { Supplier } from '@/modules/suppliers/types/supplier.types';

const mockSuppliers: Supplier[] = [
  { id:'1', name:'TechComponents India',    email:'tech@components.in',    phone:'+91 98001 11111', gstin:'29ABCDE1234F1Z5', category:'Electronics', paymentTerms:30, leadTime:7,  rating:4.8, status:'active',   totalOrders:142, totalValue:2840000, createdAt:'2024-01-15' },
  { id:'2', name:'GreenLeaf Organics',      email:'supply@greenleaf.com',  phone:'+91 98001 22222', gstin:'27XYZAB5678G2H6', category:'Beverages',   paymentTerms:15, leadTime:3,  rating:4.5, status:'active',   totalOrders:89,  totalValue:890000,  createdAt:'2024-02-01' },
  { id:'3', name:'SportsPro Distributors',  email:'orders@sportspro.com',  phone:'+91 98001 33333', gstin:'19PQRST9012I3J7', category:'Sports',      paymentTerms:45, leadTime:14, rating:4.2, status:'active',   totalOrders:56,  totalValue:1120000, createdAt:'2024-03-10' },
  { id:'4', name:'KitchenKing Wholesale',   email:'b2b@kitchenking.com',   phone:'+91 98001 44444', gstin:'06UVWXY3456K4L8', category:'Kitchen',     paymentTerms:30, leadTime:10, rating:3.8, status:'active',   totalOrders:73,  totalValue:730000,  createdAt:'2024-04-05' },
  { id:'5', name:'FashionFirst Textiles',   email:'supply@fashionfirst.in',phone:'+91 98001 55555', gstin:'07MNOPQ7890M5N9', category:'Apparel',     paymentTerms:60, leadTime:21, rating:4.1, status:'inactive', totalOrders:34,  totalValue:510000,  createdAt:'2024-05-20' },
  { id:'6', name:'HomeDecor Suppliers',     email:'info@homedecor.com',    phone:'+91 98001 66666', gstin:'33RSTUV2345O6P0', category:'Home',        paymentTerms:30, leadTime:5,  rating:2.9, status:'blacklisted',totalOrders:12, totalValue:240000,  createdAt:'2024-06-01' },
];

const statusConfig = {
  active:      { label:'Active',      color:'bg-green-500/10 text-green-600'  },
  inactive:    { label:'Inactive',    color:'bg-muted text-muted-foreground'  },
  blacklisted: { label:'Blacklisted', color:'bg-red-500/10 text-red-600'      },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={cn('h-3 w-3',
          i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
        )} />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  );
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [showAdd, setShowAdd]     = useState(false);
  const [newSupp, setNewSupp]     = useState({ name:'', email:'', phone:'', category:'Electronics' });
  const { exportExcel, isExporting } = useExport();

  const active      = suppliers.filter((s) => s.status === 'active').length;
  const totalValue  = suppliers.reduce((a, s) => a + s.totalValue, 0);
  const avgRating   = (suppliers.reduce((a, s) => a + s.rating, 0) / suppliers.length).toFixed(1);

  const handleAdd = () => {
    if (!newSupp.name || !newSupp.email) { toast.error('Fill required fields'); return; }
    const s: Supplier = {
      id:           crypto.randomUUID(),
      name:         newSupp.name,
      email:        newSupp.email,
      phone:        newSupp.phone,
      category:     newSupp.category,
      paymentTerms: 30,
      leadTime:     7,
      rating:       4.0,
      status:       'active',
      totalOrders:  0,
      totalValue:   0,
      createdAt:    new Date().toISOString().split('T')[0],
    };
    setSuppliers((p) => [s, ...p]);
    setShowAdd(false);
    setNewSupp({ name:'', email:'', phone:'', category:'Electronics' });
    toast.success('Supplier added!');
  };

  const columns: Column<Supplier>[] = [
    {
      key:'name', label:'Supplier',
      render:(_, row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key:'category', label:'Category', render:(val)=><Badge variant="outline" className="text-xs">{val as string}</Badge> },
    { key:'phone',    label:'Phone',    render:(val)=><span className="text-sm text-muted-foreground font-mono">{val as string}</span> },
    { key:'rating',   label:'Rating',   render:(val)=><StarRating rating={val as number} /> },
    { key:'leadTime', label:'Lead Time',render:(val)=><span className="text-sm">{val as number} days</span> },
    { key:'paymentTerms', label:'Payment Terms', render:(val)=><span className="text-sm">Net {val as number}</span> },
    { key:'totalOrders',  label:'Orders',        render:(val)=><span className="tabular-nums font-medium">{val as number}</span> },
    {
      key:'totalValue', label:'Total Value',
      render:(val)=><span className="font-semibold tabular-nums text-green-600">Rs.{((val as number)/100000).toFixed(1)}L</span>,
    },
    {
      key:'status', label:'Status',
      render:(val)=>{
        const cfg = statusConfig[val as keyof typeof statusConfig];
        return <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', cfg.color)}>{cfg.label}</span>;
      },
    },
  ];

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Suppliers</h1>
            <p className="page-subtitle">{suppliers.length} suppliers in your network</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"
              onClick={()=>exportExcel(suppliers.map((s)=>({Name:s.name,Email:s.email,Category:s.category,Rating:s.rating,Status:s.status})),'suppliers')}
              disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />Export
            </Button>
            <Button size="sm" onClick={()=>setShowAdd(true)}>
              <Plus className="h-4 w-4 mr-2" />Add Supplier
            </Button>
          </div>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title:'Total Suppliers', value:String(suppliers.length), icon:Truck,    changeType:'neutral'  as const, change:'In network'      },
            { title:'Active',          value:String(active),           icon:FileText, changeType:'positive' as const, change:'Operational'     },
            { title:'Total Value',     value:'Rs.'+(totalValue/100000).toFixed(0)+'L', icon:Star, changeType:'positive' as const, change:'All time' },
            { title:'Avg Rating',      value:String(avgRating),        icon:Star,     changeType:'positive' as const, change:'Out of 5.0'      },
          ].map((s)=><StatCard key={s.title} {...s} />)}
        </motion.div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={suppliers}
            columns={columns}
            searchable
            searchPlaceholder="Search suppliers by name, email..."
            emptyMessage="No suppliers found."
            defaultSort={{ key:'rating', dir:'desc' }}
          />
        </motion.div>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add New Supplier</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Company Name <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. TechSupply India" value={newSupp.name}
                onChange={(e)=>setNewSupp((p)=>({...p,name:e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input type="email" placeholder="supplier@company.com" value={newSupp.email}
                onChange={(e)=>setNewSupp((p)=>({...p,email:e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="+91 98000 00000" value={newSupp.phone}
                onChange={(e)=>setNewSupp((p)=>({...p,phone:e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newSupp.category} onValueChange={(v)=>setNewSupp((p)=>({...p,category:v}))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Electronics','Beverages','Sports','Kitchen','Apparel','Home','Health','Books'].map((c)=>(
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
