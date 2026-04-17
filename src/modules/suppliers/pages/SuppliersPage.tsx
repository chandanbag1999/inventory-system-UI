// ============================================================
// SUPPLIERS PAGE — real backend data
// GET    /api/v1/suppliers
// POST   /api/v1/suppliers
// PUT    /api/v1/suppliers/{id}
// DELETE /api/v1/suppliers/{id}
// src/modules/suppliers/pages/SuppliersPage.tsx
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Truck, MoreHorizontal, Pencil, Trash2, RefreshCw, Star, Download } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition, { staggerItem, staggerContainer } from '@/components/PageTransition';
import StatCard from '@/components/StatCard';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge }  from '@/components/ui/badge';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useExport } from '@/shared/hooks/useExport';
import {
  useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier,
} from '../services/supplierApi';
import type { Supplier } from '@/shared/types/domain.types';
import type { SupplierFormData } from '../types/supplier.types';
import { cn } from '@/lib/utils';

const emptyForm: SupplierFormData = {
  name: '', contactPerson: '', email: '', phone: '',
  gstin: '', paymentTerms: 30, leadTime: 7, notes: '',
};

export default function SuppliersPage() {
  const [showDialog, setShowDialog]   = useState(false);
  const [editTarget, setEditTarget]   = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [form, setForm]               = useState<SupplierFormData>(emptyForm);
  const { exportExcel, isExporting }  = useExport();

  const { data: suppliersData, isLoading, error, refetch } = useSuppliers();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  // Handle both paged and array responses
  const suppliers: Supplier[] = Array.isArray(suppliersData)
    ? suppliersData
    : (suppliersData as any)?.items ?? [];

  const active = suppliers.filter((s) => s.isActive !== false).length;

  const openAdd = () => { setEditTarget(null); setForm(emptyForm); setShowDialog(true); };
  const openEdit = (s: Supplier) => {
    setEditTarget(s);
    setForm({
      name:          s.name,
      contactPerson: s.contactPerson ?? '',
      email:         s.email ?? '',
      phone:         s.phone ?? '',
      gstin:         s.gstin ?? '',
      paymentTerms:  s.paymentTerms,
      leadTime:      s.leadTime,
      notes:         s.notes ?? '',
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Supplier name is required'); return; }
    try {
      if (editTarget) {
        await updateSupplier.mutateAsync({ id: editTarget.id, payload: form });
        toast.success('Supplier updated');
      } else {
        await createSupplier.mutateAsync(form);
        toast.success('Supplier created');
      }
      setShowDialog(false);
    } catch (err: any) {
      toast.error(err?.message ?? 'Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSupplier.mutateAsync(id);
      toast.success('Supplier deleted');
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message ?? 'Delete failed');
    }
  };

  const columns: Column<Supplier>[] = [
    {
      key: 'name', label: 'Supplier',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email || row.contactPerson || '—'}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone',        label: 'Phone',        render: (val) => <span className="text-sm font-mono text-muted-foreground">{(val as string) || '—'}</span> },
    { key: 'gstin',        label: 'GSTIN',        render: (val) => <span className="text-xs font-mono">{(val as string) || '—'}</span> },
    { key: 'paymentTerms', label: 'Payment Terms', render: (val) => <span className="text-sm">Net {val as number}</span> },
    { key: 'leadTime',     label: 'Lead Time',    render: (val) => <span className="text-sm">{val as number} days</span> },
    {
      key: 'isActive', label: 'Status',
      render: (val) => val !== false
        ? <Badge className="bg-green-500/10 text-green-600 border-0 text-xs">Active</Badge>
        : <Badge className="bg-muted text-muted-foreground border-0 text-xs">Inactive</Badge>,
    },
  ];

  if (error) return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive">Failed to load suppliers</p>
        <Button onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-2" />Retry</Button>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Suppliers</h1>
            <p className="page-subtitle">{isLoading ? '...' : `${suppliers.length} suppliers`}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"
              onClick={() => exportExcel(suppliers.map((s) => ({ Name: s.name, Email: s.email, Phone: s.phone, GSTIN: s.gstin, PaymentTerms: s.paymentTerms, LeadTime: s.leadTime })), 'suppliers')}
              disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button size="sm" className="h-9 gap-2" onClick={openAdd}>
              <Plus className="h-4 w-4" /> Add Supplier
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-2 gap-4">
            <StatCard title="Total Suppliers" value={String(suppliers.length)} icon={Truck} changeType="neutral"  change="In network" />
            <StatCard title="Active"           value={String(active)}           icon={Star}  changeType="positive" change="Operational" />
          </motion.div>
        )}

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={suppliers}
            columns={columns}
            isLoading={isLoading}
            searchable
            searchPlaceholder="Search suppliers..."
            emptyMessage="No suppliers found."
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
              <DialogTitle>{editTarget ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="col-span-2 space-y-1.5">
                <Label>Company Name <span className="text-destructive">*</span></Label>
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. TechSupply India" />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Person</Label>
                <Input value={form.contactPerson ?? ''} onChange={(e) => setForm((p) => ({ ...p, contactPerson: e.target.value }))} placeholder="Contact name" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.email ?? ''} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="supplier@company.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={form.phone ?? ''} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+91 98000 00000" />
              </div>
              <div className="space-y-1.5">
                <Label>GSTIN</Label>
                <Input value={form.gstin ?? ''} onChange={(e) => setForm((p) => ({ ...p, gstin: e.target.value }))} placeholder="27AABCT1234A1Z5" />
              </div>
              <div className="space-y-1.5">
                <Label>Payment Terms (days)</Label>
                <Input type="number" min="0" value={form.paymentTerms ?? 30} onChange={(e) => setForm((p) => ({ ...p, paymentTerms: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Lead Time (days)</Label>
                <Input type="number" min="0" value={form.leadTime ?? 7} onChange={(e) => setForm((p) => ({ ...p, leadTime: Number(e.target.value) }))} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Notes</Label>
                <Textarea value={form.notes ?? ''} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Additional notes..." rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={createSupplier.isPending || updateSupplier.isPending}>
                {editTarget ? 'Update' : 'Create'} Supplier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
              <AlertDialogDescription>Delete "{deleteTarget?.name}"? This cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteTarget && handleDelete(deleteTarget.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTransition>
  );
}
