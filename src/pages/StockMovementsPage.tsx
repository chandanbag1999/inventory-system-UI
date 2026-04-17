// ============================================================
// STOCK MOVEMENTS PAGE — real backend via warehouse selection
// GET /api/v1/stocks/warehouse/{warehouseId}
// src/pages/StockMovementsPage.tsx
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useWarehouses }   from '@/modules/warehouses/services/warehouseApi';
import { useStockByWarehouse } from '@/modules/inventory/services/inventoryService';
import { cn } from '@/lib/utils';
import type { Stock } from '@/shared/types/domain.types';

export default function StockMovementsPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');

  const { data: warehouses = [], isLoading: wLoad } = useWarehouses();
  const { data: stocks = [], isLoading: sLoad, refetch } = useStockByWarehouse(selectedWarehouse);

  const isLoading = wLoad || (!!selectedWarehouse && sLoad);

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
    { key: 'quantityOnHand',    label: 'On Hand',   render: (val) => <span className="tabular-nums font-medium">{val as number}</span> },
    { key: 'quantityReserved',  label: 'Reserved',  render: (val) => <span className="tabular-nums text-muted-foreground">{val as number}</span> },
    {
      key: 'quantityAvailable', label: 'Available',
      render: (val) => {
        const n = val as number;
        return (
          <span className={cn('tabular-nums font-semibold',
            n === 0 ? 'text-red-600' : n < 10 ? 'text-amber-600' : 'text-green-600')}>
            {n}
          </span>
        );
      },
    },
    { key: 'reorderLevel',    label: 'Reorder At', render: (val) => <span className="tabular-nums text-muted-foreground">{val as number}</span> },
    {
      key: 'lastMovementAt', label: 'Last Movement',
      render: (val) => <span className="text-xs text-muted-foreground">{val ? new Date(val as string).toLocaleDateString() : '—'}</span>,
    },
  ];

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" /> Stock Levels
            </h1>
            <p className="page-subtitle">View stock by warehouse</p>
          </div>
          {selectedWarehouse && (
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          )}
        </div>

        {/* Warehouse Selector */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <div className="max-w-sm">
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder={wLoad ? 'Loading warehouses...' : 'Select a warehouse'} />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          {!selectedWarehouse ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm text-muted-foreground">Select a warehouse to view stock levels</p>
            </div>
          ) : (
            <DataTable
              data={stocks}
              columns={columns}
              isLoading={isLoading}
              searchable
              searchPlaceholder="Search by product, SKU..."
              emptyMessage="No stock data for this warehouse."
            />
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
