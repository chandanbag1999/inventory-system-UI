import { useState, useMemo }  from 'react';
import { useNavigate }        from 'react-router-dom';
import { motion }             from 'framer-motion';
import {
  Eye, Edit, Trash2, MoreHorizontal,
  ArrowUpDown, ArrowUp, ArrowDown,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import SearchInput  from '@/components/SearchInput';
import StatusBadge  from '@/components/StatusBadge';
import { useOrders, useDeleteOrder } from '@/modules/orders/services/orderApi';
import type { OrderFilters, Order } from '@/shared/types';
import { Button }        from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

type SortKey = 'orderNumber' | 'customer' | 'status' | 'total' | 'createdAt';
type SortDir = 'asc' | 'desc';

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-40" />;
  return dir === 'asc' ? <ArrowUp className="h-3.5 w-3.5 ml-1" /> : <ArrowDown className="h-3.5 w-3.5 ml-1" />;
}

export default function OrdersPage() {
  const navigate     = useNavigate();
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; num: string } | null>(null);
  const [sortKey,      setSortKey]      = useState<SortKey>('createdAt');
  const [sortDir,      setSortDir]      = useState<SortDir>('desc');
  const [page,         setPage]         = useState(1);
  const [pageSize,     setPageSize]     = useState(10);

  const filters: OrderFilters = {
    search: search || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter as Order['status'],
    page,
    pageSize,
    sortKey,
    sortDir,
  };

  const { data: ordersResponse, isLoading, error, refetch } = useOrders(filters);
  const deleteOrder = useDeleteOrder();

  const orders = useMemo(() => {
    if (!ordersResponse?.items) return [];
    return ordersResponse.items;
  }, [ordersResponse]);

  const [searchValue, setSearchValue] = useState(search);

  const statuses = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const totalCount = ordersResponse?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage   = Math.min(page, totalPages);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteOrder.mutateAsync(deleteTarget.id);
      toast.success('Order deleted');
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: 'orderNumber', label: 'Order'    },
    { key: 'customer',    label: 'Customer' },
    { key: 'status',      label: 'Status'   },
    { key: 'total',       label: 'Total'    },
    { key: 'createdAt',   label: 'Date'     },
  ];

  if (error) {
    return (
      <PageTransition>
        <div className="page-container">
          <div className="text-center py-16">
            <p className="text-destructive">Failed to load orders. Please try again.</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
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
            <h1 className="page-title">Orders</h1>
            <p className="page-subtitle">{totalCount} total orders</p>
          </div>
        </div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-3">
          <SearchInput 
            value={searchValue} 
            onChange={(v) => { setSearchValue(v); setSearch(v); setPage(1); }} 
            placeholder="Search orders or customers…" 
          />
          <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1">
            {statuses.map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                className={"px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors " +
                  (statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent')}>
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible" className="data-table-container rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {columns.map((col) => (
                    <th key={col.key} onClick={() => toggleSort(col.key)}
                      className="text-left py-3 px-5 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
                      <span className="inline-flex items-center">{col.label}<SortIcon active={sortKey === col.key} dir={sortDir} /></span>
                    </th>
                  ))}
                  <th className="py-3 px-5" />
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td colSpan={6} className="py-4 px-5">
                        <div className="h-4 bg-muted animate-pulse rounded w-full" />
                      </td>
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-sm text-muted-foreground">No orders found.</td>
                  </tr>
                ) : orders.map((o: Order) => (
                  <tr key={o.id} onClick={() => navigate("/orders/" + o.id)}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer">
                    <td className="py-3 px-5 font-medium">{o.orderNumber}</td>
                    <td className="py-3 px-5 text-muted-foreground">{o.customer}</td>
                    <td className="py-3 px-5"><StatusBadge status={o.status} /></td>
                    <td className="py-3 px-5 tabular-nums">Rs.{(o.total ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-5 text-muted-foreground">{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '-'}</td>
                    <td className="py-3 px-5" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => navigate("/orders/" + o.id)}><Eye  className="h-4 w-4 mr-2" /> View</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/orders/" + o.id + "/edit")}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget({ id: o.id, num: o.orderNumber })}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalCount > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                  {[10, 25, 50].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span>{(safePage - 1) * pageSize + 1}-{Math.min(safePage * pageSize, totalCount)} of {totalCount}</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete order?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove order <span className="font-semibold text-foreground">{deleteTarget?.num}</span>. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteOrder.isPending}>
              {deleteOrder.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
}