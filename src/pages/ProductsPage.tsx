import { useState, useMemo }  from 'react';
import { useNavigate }        from 'react-router-dom';
import { motion }             from 'framer-motion';
import {
  Plus, MoreHorizontal, Eye, Edit, Trash2,
  ArrowUpDown, ArrowUp, ArrowDown,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import SearchInput  from '@/components/SearchInput';
import StatusBadge  from '@/components/StatusBadge';
import { Button }   from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useProducts, useDeleteProduct } from '@/modules/products/services/productApi';
import { useCategoryOptions } from '@/modules/categories/services/categoryApi';
import type { ProductFilters, Product } from '@/shared/types';
import { toast } from 'sonner';

type SortKey = 'name' | 'sku' | 'category' | 'price' | 'stock' | 'status';
type SortDir = 'asc' | 'desc';

const STATUS_ORDER = ['active', 'draft', 'archived'];

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-40" />;
  return dir === 'asc'
    ? <ArrowUp   className="h-3.5 w-3.5 ml-1" />
    : <ArrowDown className="h-3.5 w-3.5 ml-1" />;
}

export default function ProductsPage() {
  const navigate      = useNavigate();
  const [search,        setSearch]        = useState('');
  const [categoryFilter,setCategoryFilter]= useState('all');
  const [deleteTarget,  setDeleteTarget]  = useState<{ id: string; name: string } | null>(null);
  const [sortKey,       setSortKey]       = useState<SortKey>('name');
  const [sortDir,       setSortDir]       = useState<SortDir>('asc');
  const [page,          setPage]          = useState(1);
  const [pageSize,      setPageSize]      = useState(10);

  const filters: ProductFilters = {
    search: search || undefined,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
    page,
    pageSize,
    sortKey,
    sortDir,
  };

  const { data: productsResponse, isLoading, error, refetch } = useProducts(filters);
  const { data: categoryOptions } = useCategoryOptions();
  const deleteProduct = useDeleteProduct();

  const products = useMemo(() => {
    if (!productsResponse?.items) return [];
    return productsResponse.items;
  }, [productsResponse]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const categories = useMemo(
    () => {
      const opts = categoryOptions?.map(c => c.label) || [];
      return ['all', ...opts];
    },
    [categoryOptions]
  );

  const columns: { key: SortKey; label: string }[] = [
    { key: 'name',     label: 'Product'  },
    { key: 'sku',      label: 'SKU'      },
    { key: 'category', label: 'Category' },
    { key: 'price',    label: 'Price'    },
    { key: 'stock',    label: 'Stock'    },
    { key: 'status',   label: 'Status'   },
  ];

  const totalCount = productsResponse?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast.success('Product deleted', { description: `${deleteTarget.name} has been removed.` });
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteTarget(null);
    }
  };

  if (error) {
    return (
      <PageTransition>
        <div className="page-container">
          <div className="text-center py-16">
            <p className="text-destructive">Failed to load products. Please try again.</p>
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
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Products</h1>
            <p className="page-subtitle">{totalCount} products across all categories</p>
          </div>
          <Button className="h-9 gap-2 rounded-lg" onClick={() => navigate('/products/add')}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>

        {/* Filters */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search products or SKU…"
          />
          <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategoryFilter(cat as string); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible" className="data-table-container rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className="text-left py-3 px-5 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                    >
                      <span className="inline-flex items-center">
                        {col.label}
                        <SortIcon active={sortKey === col.key} dir={sortDir} />
                      </span>
                    </th>
                  ))}
                  <th className="py-3 px-5" />
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td colSpan={7} className="py-4 px-5">
                        <div className="h-4 bg-muted animate-pulse rounded w-full" />
                      </td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                      No products found.
                    </td>
                  </tr>
                ) : products.map((p: Product) => (
                  <tr
                    key={p.id}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/products/${p.id}`)}
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-muted-foreground font-mono text-xs">{p.sku}</td>
                    <td className="py-3 px-5 text-muted-foreground">{p.category}</td>
                    <td className="py-3 px-5 tabular-nums">₹{p.price?.toLocaleString() ?? 0}</td>
                    <td className="py-3 px-5">
                      <span className={(p.stock ?? 0) < 50 ? 'text-destructive font-medium tabular-nums' : 'tabular-nums'}>
                        {(p.stock ?? 0).toLocaleString()}
                      </span>
                      {(p.reservedStock ?? 0) > 0 && (
                        <span className="text-xs text-muted-foreground ml-1">({p.reservedStock} reserved)</span>
                      )}
                    </td>
                    <td className="py-3 px-5"><StatusBadge status={p.status} /></td>
                    <td className="py-3 px-5" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => navigate(`/products/${p.id}`)}>
                            <Eye  className="h-4 w-4 mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/products/${p.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                          >
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
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {[10, 25, 50].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span>
                  {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, totalCount)} of {totalCount}
                </span>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8"
                    disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>
                    <ChevronLeft  className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8"
                    disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{' '}
              <span className="font-semibold text-foreground">{deleteTarget?.name}</span>{' '}
              from your catalog. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
}