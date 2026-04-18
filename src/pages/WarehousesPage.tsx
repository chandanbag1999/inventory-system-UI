// ============================================================
// WAREHOUSES PAGE — real backend with pagination + search
// src/pages/WarehousesPage.tsx
// ============================================================
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Warehouse, MoreHorizontal, Pencil, Trash2, RefreshCw,
  CheckCircle, XCircle, Power, PowerOff, ChevronLeft, ChevronRight,
  Package, BarChart3, MapPin, User,
} from 'lucide-react';
import { toast } from 'sonner';
import PageTransition, { staggerItem, staggerContainer } from '@/components/PageTransition';
import StatCard from '@/components/StatCard';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge }  from '@/components/ui/badge';
import { Input }  from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import WarehouseForm from '@/modules/warehouses/components/WarehouseForm';
import {
  useWarehouses, useCreateWarehouse, useUpdateWarehouse,
  useDeleteWarehouse, useActivateWarehouse, useDeactivateWarehouse,
  type WarehouseFormData,
} from '@/modules/warehouses/services/warehouseApi';
import type { Warehouse as WarehouseType } from '@/shared/types/domain.types';

/** Build a display string from whatever address data is available */
function getLocationDisplay(w: WarehouseType): string {
  if (w.addressString && w.addressString.trim()) return w.addressString;
  if (w.address) {
    const parts = [
      w.address.street,
      w.address.city,
      w.address.state,
      w.address.pincode ? `- ${w.address.pincode}` : '',
      w.address.country,
    ].filter((p) => p && p.trim());
    if (parts.length > 0) return parts.join(', ');
  }
  return '';
}

export default function WarehousesPage() {
  const [showDialog, setShowDialog]       = useState(false);
  const [editTarget, setEditTarget]       = useState<WarehouseType | null>(null);
  const [deleteTarget, setDeleteTarget]   = useState<{ id: string; name: string } | null>(null);
  const [searchTerm, setSearchTerm]       = useState('');
  const [page, setPage]                  = useState(1);
  const pageSize                          = 20;

  const { data: pagedResult, isLoading, error, refetch } = useWarehouses({
    search: searchTerm || undefined,
    pageNumber: page,
    pageSize,
  });

  const warehouses  = pagedResult?.items ?? [];
  const totalCount  = pagedResult?.totalCount ?? 0;
  const totalPages  = pagedResult?.totalPages ?? 1;

  const createWarehouse    = useCreateWarehouse();
  const updateWarehouse    = useUpdateWarehouse();
  const deleteWarehouse    = useDeleteWarehouse();
  const activateWarehouse  = useActivateWarehouse();
  const deactivateWarehouse = useDeactivateWarehouse();

  const stats = {
    total:       totalCount,
    active:      warehouses.filter((w) => w.isActive).length,
    inactive:    warehouses.filter((w) => !w.isActive).length,
    stockLines:  warehouses.reduce((sum, w) => sum + (w.totalStockLines ?? 0), 0),
  };

  const openAdd = () => { setEditTarget(null); setShowDialog(true); };
  const openEdit = (w: WarehouseType) => { setEditTarget(w); setShowDialog(true); };

  const handleSave = async (data: WarehouseFormData) => {
    try {
      if (editTarget) {
        await updateWarehouse.mutateAsync({ id: editTarget.id, payload: data });
        toast.success('Warehouse updated');
      } else {
        await createWarehouse.mutateAsync(data);
        toast.success('Warehouse created');
      }
      setShowDialog(false);
    } catch (err: any) {
      toast.error(err?.message ?? 'Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWarehouse.mutateAsync(id);
      toast.success('Warehouse deleted');
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message ?? 'Delete failed');
    }
  };

  const handleToggleActive = async (w: WarehouseType) => {
    try {
      if (w.isActive) {
        await deactivateWarehouse.mutateAsync(w.id);
        toast.success(`${w.name} deactivated`);
      } else {
        await activateWarehouse.mutateAsync(w.id);
        toast.success(`${w.name} activated`);
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Status change failed');
    }
  };

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const columns: Column<WarehouseType>[] = [
    {
      key: 'name', label: 'Warehouse',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Warehouse className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{row.code}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'location', label: 'Location',
      render: (_, row) => {
        const loc = getLocationDisplay(row);
        return loc ? (
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {loc}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/40 italic">No address</span>
        );
      },
    },
    {
      key: 'managerName', label: 'Manager',
      render: (_, row) => row.managerName ? (
        <span className="text-sm flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {row.managerName}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground/40 italic">Not assigned</span>
      ),
    },
    {
      key: 'totalStockLines', label: 'Stock Lines',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-medium">{row.totalStockLines ?? 0}</span>
        </div>
      ),
    },
    {
      key: 'utilization', label: 'Utilization',
      render: (_, row) => {
        if (row.utilization == null) {
          return <span className="text-xs text-muted-foreground/40 italic">N/A</span>;
        }
        const pct = row.utilization;
        return (
          <div className="flex items-center gap-2 min-w-[80px]">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground w-9 text-right">{pct}%</span>
          </div>
        );
      },
    },
    {
      key: 'isActive', label: 'Status',
      render: (val) => val
        ? <Badge className="bg-green-500/10 text-green-600 border-0 text-xs">Active</Badge>
        : <Badge className="bg-muted text-muted-foreground border-0 text-xs">Inactive</Badge>,
    },
  ];

  if (error) return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive">Failed to load warehouses</p>
        <Button onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-2" />Retry</Button>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Warehouses</h1>
            <p className="page-subtitle">{isLoading ? '...' : `${totalCount} warehouses`}</p>
          </div>
          <Button size="sm" className="h-9 gap-2" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Warehouse
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="Total"       value={String(stats.total)}      icon={Warehouse}   changeType="neutral"  change="All warehouses" />
            <StatCard title="Active"      value={String(stats.active)}     icon={CheckCircle} changeType="positive" change="Operational" />
            <StatCard title="Inactive"    value={String(stats.inactive)}   icon={XCircle}     changeType="neutral"  change="Offline" />
            <StatCard title="Stock Lines" value={String(stats.stockLines)} icon={Package}     changeType="neutral"  change="Across all" />
          </motion.div>
        )}

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={warehouses}
            columns={columns}
            isLoading={isLoading}
            searchable
            searchValue={searchTerm}
            onSearchChange={handleSearch}
            searchPlaceholder="Search by name, code, or city..."
            emptyMessage="No warehouses found."
            actions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => openEdit(row)}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleToggleActive(row)}>
                    {row.isActive
                      ? <><PowerOff className="h-4 w-4 mr-2" /> Deactivate</>
                      : <><Power className="h-4 w-4 mr-2" /> Activate</>}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ id: row.id, name: row.name })}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </motion.div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-sm text-muted-foreground">
              Showing {warehouses.length} of {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="icon" className="h-8 w-8"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <WarehouseForm
          open={showDialog}
          onOpenChange={setShowDialog}
          warehouse={editTarget}
          onSubmit={handleSave}
          isLoading={createWarehouse.isPending || updateWarehouse.isPending}
          mode="modal"
        />

        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Warehouse</AlertDialogTitle>
              <AlertDialogDescription>
                Delete "{deleteTarget?.name}"? This action cannot be undone.
                Any existing stock references will be preserved.
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
