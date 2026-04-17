// ============================================================
// PRODUCTS PAGE — real backend data
// GET /api/v1/products (PagedResult<ProductListItem>)
// src/pages/ProductsPage.tsx
// ============================================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Package, TrendingUp, AlertTriangle, Archive, RefreshCw, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition, { staggerItem, staggerContainer } from '@/components/PageTransition';
import StatCard from '@/components/StatCard';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge }  from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts, useDeleteProduct } from '@/modules/products/services/productApi';
import { formatINR, formatDate } from '@/shared/utils/formatters';
import { cn } from '@/lib/utils';
import type { ProductListItem } from '@/shared/types/domain.types';

const statusConfig: Record<string, { label: string; color: string }> = {
  Active:       { label: 'Active',       color: 'bg-green-500/10 text-green-600' },
  Draft:        { label: 'Draft',        color: 'bg-amber-500/10 text-amber-600' },
  Archived:     { label: 'Archived',     color: 'bg-muted text-muted-foreground' },
  Discontinued: { label: 'Discontinued', color: 'bg-red-500/10 text-red-600' },
};

export default function ProductsPage() {
  const navigate      = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading, error, refetch } = useProducts({ pageSize: 100 });
  const deleteProduct = useDeleteProduct();

  const products: ProductListItem[] = data?.items ?? [];

  const stats = {
    total:    products.length,
    active:   products.filter((p) => p.status === 'Active').length,
    lowStock: products.filter((p) => p.totalStock < 10).length,
    archived: products.filter((p) => p.status === 'Archived').length,
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success('Product deleted');
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message ?? 'Delete failed');
    }
  };

  const columns: Column<ProductListItem>[] = [
    {
      key: 'name', label: 'Product',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
            {row.primaryImage
              ? <img src={row.primaryImage} alt={row.name} className="h-full w-full object-cover" />
              : <Package className="h-4 w-4 text-muted-foreground" />}
          </div>
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{row.sku}</p>
          </div>
        </div>
      ),
    },
    { key: 'categoryName', label: 'Category', render: (val) => <Badge variant="outline" className="text-xs">{val as string}</Badge> },
    { key: 'unitPrice',    label: 'Price',    render: (val) => <span className="font-semibold text-sm">{formatINR(val as number)}</span> },
    {
      key: 'totalStock', label: 'Stock',
      render: (val) => {
        const n = val as number;
        return (
          <span className={cn('font-medium text-sm tabular-nums', n < 10 && 'text-red-600', n === 0 && 'text-red-700 font-bold')}>
            {n === 0 ? 'Out of stock' : n.toLocaleString()}
          </span>
        );
      },
    },
    {
      key: 'status', label: 'Status',
      render: (val) => {
        const cfg = statusConfig[val as string] ?? { label: val as string, color: 'bg-muted text-muted-foreground' };
        return <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', cfg.color)}>{cfg.label}</span>;
      },
    },
    { key: 'createdAt', label: 'Created', render: (val) => <span className="text-xs text-muted-foreground">{formatDate(val as string)}</span> },
  ];

  if (error) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <p className="text-destructive">Failed to load products</p>
          <Button onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-2" />Retry</Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Products</h1>
            <p className="page-subtitle">{isLoading ? '...' : `${stats.total} products`}</p>
          </div>
          <Button size="sm" className="h-9 gap-2" onClick={() => navigate('/products/add')}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Products" value={String(stats.total)}    icon={Package}       changeType="neutral"  change="In catalogue" />
            <StatCard title="Active"          value={String(stats.active)}   icon={TrendingUp}    changeType="positive" change="Listed" />
            <StatCard title="Low Stock"       value={String(stats.lowStock)} icon={AlertTriangle} changeType="negative" change="< 10 units" />
            <StatCard title="Archived"        value={String(stats.archived)} icon={Archive}       changeType="neutral"  change="Hidden" />
          </motion.div>
        )}

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={products}
            columns={columns}
            isLoading={isLoading}
            searchable
            searchPlaceholder="Search by name, SKU, category..."
            emptyMessage="No products found."
            defaultSort={{ key: 'createdAt', dir: 'desc' }}
            onRowClick={(row) => navigate(`/products/${row.id}`)}
            actions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => navigate(`/products/${row.id}`)}>
                    <Eye className="h-4 w-4 mr-2" /> View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/products/${row.id}/edit`)}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setDeleteTarget({ id: row.id, name: row.name })}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </motion.div>

        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTransition>
  );
}
