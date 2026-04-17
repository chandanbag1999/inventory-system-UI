// ============================================================
// INVENTORY PAGE — real backend data
// GET /api/v1/stocks/low-stock-alerts
// POST /api/v1/stocks/adjust
// src/pages/InventoryPage.tsx
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Package, RefreshCw, Sliders } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition, { staggerItem, staggerContainer } from '@/components/PageTransition';
import StatCard from '@/components/StatCard';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useLowStockAlerts, useAdjustStock, type AdjustStockPayload } from '@/modules/inventory/services/inventoryService';
import type { Stock } from '@/shared/types/domain.types';
import { cn } from '@/lib/utils';

export default function InventoryPage() {
  const [adjustTarget, setAdjustTarget] = useState<Stock | null>(null);
  const [adjustForm, setAdjustForm]     = useState({ quantity: 0, movementType: 'Adjustment', notes: '' });

  const { data: lowStock = [], isLoading, error, refetch } = useLowStockAlerts();
  const adjustStock = useAdjustStock();

  const critical = lowStock.filter((s) => s.quantityAvailable === 0).length;
  const warning  = lowStock.filter((s) => s.quantityAvailable > 0 && s.quantityAvailable <= s.reorderLevel).length;

  const handleAdjust = async () => {
    if (!adjustTarget) return;
    if (adjustForm.quantity === 0) { toast.error('Quantity cannot be zero'); return; }
    try {
      const payload: AdjustStockPayload = {
        productId:    adjustTarget.productId,
        warehouseId:  adjustTarget.warehouseId,
        quantity:     adjustForm.quantity,
        movementType: adjustForm.movementType,
        notes:        adjustForm.notes || undefined,
      };
      await adjustStock.mutateAsync(payload);
      toast.success('Stock adjusted successfully');
      setAdjustTarget(null);
      setAdjustForm({ quantity: 0, movementType: 'Adjustment', notes: '' });
    } catch (err: any) {
      toast.error(err?.message ?? 'Adjust failed');
    }
  };

  const columns: Column<Stock>[] = [
    {
      key: 'productName', label: 'Product',
      render: (_, row) => (
        <div>
          <p className="font-medium text-sm">{row.productName}</p>
          <p className="text-xs text-muted-foreground font-mono">{row.productSku}</p>
        </div>
      ),
    },
    { key: 'warehouseName',    label: 'Warehouse', render: (val) => <span className="text-sm">{val as string}</span> },
    { key: 'quantityOnHand',   label: 'On Hand',   render: (val) => <span className="tabular-nums font-medium">{val as number}</span> },
    { key: 'quantityReserved', label: 'Reserved',  render: (val) => <span className="tabular-nums text-muted-foreground">{val as number}</span> },
    {
      key: 'quantityAvailable', label: 'Available',
      render: (val) => {
        const n = val as number;
        return (
          <span className={cn('tabular-nums font-semibold',
            n === 0 ? 'text-red-600' : n <= 5 ? 'text-amber-600' : 'text-green-600')}>
            {n}
          </span>
        );
      },
    },
    { key: 'reorderLevel', label: 'Reorder At', render: (val) => <span className="tabular-nums text-muted-foreground">{val as number}</span> },
    {
      key: 'id', label: 'Action', sortable: false,
      render: (_, row) => (
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
          onClick={() => { setAdjustTarget(row); setAdjustForm({ quantity: 0, movementType: 'Adjustment', notes: '' }); }}>
          <Sliders className="h-3 w-3" /> Adjust
        </Button>
      ),
    },
  ];

  if (error) return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive">Failed to load inventory</p>
        <Button onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-2" />Retry</Button>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Inventory</h1>
            <p className="page-subtitle">Low stock alerts and adjustments</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Low Stock Items" value={String(lowStock.length)} icon={Package}       changeType="neutral"  change="Below reorder" />
            <StatCard title="Critical (0 stock)" value={String(critical)}     icon={AlertTriangle} changeType="negative" change="Out of stock" />
            <StatCard title="Warning"          value={String(warning)}        icon={AlertTriangle} changeType="negative" change="Near reorder" />
          </motion.div>
        )}

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={lowStock}
            columns={columns}
            isLoading={isLoading}
            searchable
            searchPlaceholder="Search by product, warehouse..."
            emptyMessage="No low stock alerts. All items are well stocked! 🎉"
            rowClassName={(row) => row.quantityAvailable === 0 ? 'bg-red-500/5' : ''}
          />
        </motion.div>

        {/* Adjust Stock Dialog */}
        <Dialog open={!!adjustTarget} onOpenChange={() => setAdjustTarget(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adjust Stock — {adjustTarget?.productName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm p-3 rounded-lg bg-muted/50">
                <div><span className="text-muted-foreground">Warehouse:</span><p className="font-medium">{adjustTarget?.warehouseName}</p></div>
                <div><span className="text-muted-foreground">Available:</span><p className="font-semibold">{adjustTarget?.quantityAvailable}</p></div>
              </div>
              <div className="space-y-1.5">
                <Label>Movement Type</Label>
                <Select value={adjustForm.movementType} onValueChange={(v) => setAdjustForm((p) => ({ ...p, movementType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="StockIn">Stock In (add)</SelectItem>
                    <SelectItem value="StockOut">Stock Out (remove)</SelectItem>
                    <SelectItem value="Adjustment">Manual Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Quantity <span className="text-muted-foreground text-xs">(positive = add, negative = remove)</span></Label>
                <Input type="number" value={adjustForm.quantity}
                  onChange={(e) => setAdjustForm((p) => ({ ...p, quantity: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Input value={adjustForm.notes} onChange={(e) => setAdjustForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Reason for adjustment..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAdjustTarget(null)}>Cancel</Button>
              <Button onClick={handleAdjust} disabled={adjustStock.isPending}>
                {adjustStock.isPending ? 'Saving…' : 'Apply Adjustment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
