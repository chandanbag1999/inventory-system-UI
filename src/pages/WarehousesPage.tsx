// ============================================================
// WAREHOUSES PAGE — real backend data
// GET    /api/v1/warehouses
// POST   /api/v1/warehouses
// PUT    /api/v1/warehouses/{id}
// DELETE /api/v1/warehouses/{id}
// src/pages/WarehousesPage.tsx
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Warehouse, MoreHorizontal, Pencil, Trash2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition, { staggerItem, staggerContainer } from '@/components/PageTransition';
import StatCard from '@/components/StatCard';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge }  from '@/components/ui/badge';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useWarehouses, useCreateWarehouse, useUpdateWarehouse, useDeleteWarehouse,
  type WarehouseFormData,
} from '@/modules/warehouses/services/warehouseApi';
import type { Warehouse as WarehouseType } from '@/shared/types/domain.types';
import { cn } from '@/lib/utils';

const emptyForm: WarehouseFormData = {
  name: '', code: '', city: '', state: '', country: 'India',
  phone: '', email: '', isActive: true,
};

export default function WarehousesPage() {
  const [showDialog, setShowDialog]   = useState(false);
  const [editTarget, setEditTarget]   = useState<WarehouseType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [form, setForm]               = useState<WarehouseFormData>(emptyForm);

  const { data: warehouses = [], isLoading, error, refetch } = useWarehouses();
  const createWarehouse = useCreateWarehouse();
  const updateWarehouse = useUpdateWarehouse();
  const deleteWarehouse = useDeleteWarehouse();

  const stats = {
    total:    warehouses.length,
    active:   warehouses.filter((w) => w.isActive).length,
    inactive: warehouses.filter((w) => !w.isActive).length,
  };

  const openAdd = () => { setEditTarget(null); setForm(emptyForm); setShowDialog(true); };
  const openEdit = (w: WarehouseType) => {
    setEditTarget(w);
    setForm({
      name:    w.name,
      code:    w.code ?? '',
      city:    w.city ?? '',
      state:   w.state ?? '',
      country: w.country ?? 'India',
      phone:   w.phone ?? '',
      email:   w.email ?? '',
      isActive: w.isActive,
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Warehouse name is required'); return; }
    try {
      if (editTarget) {
        await updateWarehouse.mutateAsync({ id: editTarget.id, payload: form });
        toast.success('Warehouse updated');
      } else {
        await createWarehouse.mutateAsync(form);
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
            {row.code && <p className="text-xs text-muted-foreground font-mono">{row.code}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'city', label: 'Location',
      render: (_, row) => (
        <span className="text-sm text-muted-foreground">
          {[row.city, row.state, row.country].filter(Boolean).join(', ') || '—'}
        </span>
      ),
    },
    { key: 'phone', label: 'Phone', render: (val) => <span className="text-sm font-mono text-muted-foreground">{(val as string) || '—'}</span> },
    { key: 'email', label: 'Email', render: (val) => <span className="text-sm text-muted-foreground">{(val as string) || '—'}</span> },
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
            <p className="page-subtitle">{isLoading ? '...' : `${stats.total} warehouses`}</p>
          </div>
          <Button size="sm" className="h-9 gap-2" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Warehouse
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Total"    value={String(stats.total)}    icon={Warehouse}    changeType="neutral"  change="All warehouses" />
            <StatCard title="Active"   value={String(stats.active)}   icon={CheckCircle}  changeType="positive" change="Operational" />
            <StatCard title="Inactive" value={String(stats.inactive)} icon={XCircle}      changeType="neutral"  change="Offline" />
          </motion.div>
        )}

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={warehouses}
            columns={columns}
            isLoading={isLoading}
            searchable
            searchPlaceholder="Search warehouses..."
            emptyMessage="No warehouses found."
            actions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem onClick={() => openEdit(row)}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit
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

        {/* Add/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editTarget ? 'Edit Warehouse' : 'Add Warehouse'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="col-span-2 space-y-1.5">
                <Label>Name <span className="text-destructive">*</span></Label>
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Mumbai Central" />
              </div>
              <div className="space-y-1.5">
                <Label>Code</Label>
                <Input value={form.code ?? ''} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. WH-MUM-01" />
              </div>
              <div className="space-y-1.5">
                <Label>City</Label>
                <Input value={form.city ?? ''} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} placeholder="Mumbai" />
              </div>
              <div className="space-y-1.5">
                <Label>State</Label>
                <Input value={form.state ?? ''} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} placeholder="Maharashtra" />
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Input value={form.country ?? ''} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} placeholder="India" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={form.phone ?? ''} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+91..." />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.email ?? ''} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="warehouse@company.com" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button
                onClick={handleSave}
                disabled={createWarehouse.isPending || updateWarehouse.isPending}
              >
                {editTarget ? 'Update' : 'Create'} Warehouse
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Warehouse</AlertDialogTitle>
              <AlertDialogDescription>
                Delete "{deleteTarget?.name}"? This cannot be undone.
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
