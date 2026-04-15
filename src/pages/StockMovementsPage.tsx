import { motion }       from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowLeftRight, Download } from 'lucide-react';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { useExport }    from '@/shared/hooks/useExport';
import { stockMovements } from '@/data/mock';
import { Button }       from '@/components/ui/button';
import { cn }           from '@/lib/utils';
import type { StockMovement } from '@/shared/types';

const typeConfig = {
  inbound:    { icon: ArrowDown,       color: 'text-green-500',  bg: 'bg-green-500/10',  label: 'Inbound'   },
  outbound:   { icon: ArrowUp,         color: 'text-red-500',    bg: 'bg-red-500/10',    label: 'Outbound'  },
  transfer:   { icon: ArrowLeftRight,  color: 'text-blue-500',   bg: 'bg-blue-500/10',   label: 'Transfer'  },
  adjustment: { icon: ArrowLeftRight,  color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Adjustment'},
  return:     { icon: ArrowDown,       color: 'text-amber-500',  bg: 'bg-amber-500/10',  label: 'Return'    },
};

export default function StockMovementsPage() {
  const { exportExcel, isExporting } = useExport();

  const columns: Column<StockMovement>[] = [
    {
      key: 'product', label: 'Product',
      render: (_, row) => (
        <div>
          <p className="font-medium text-sm">{row.product}</p>
          <p className="text-xs font-mono text-muted-foreground">{row.sku}</p>
        </div>
      ),
    },
    {
      key: 'type', label: 'Type',
      render: (val) => {
        const cfg = typeConfig[val as keyof typeof typeConfig] ?? typeConfig.transfer;
        const Icon = cfg.icon;
        return (
          <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', cfg.bg, cfg.color)}>
            <Icon className="h-3 w-3" />{cfg.label}
          </div>
        );
      },
    },
    {
      key: 'quantity', label: 'Quantity',
      render: (val, row) => {
        const cfg = typeConfig[row.type as keyof typeof typeConfig];
        return (
          <span className={cn('font-semibold tabular-nums', cfg?.color)}>
            {row.type === 'outbound' ? '-' : '+'}{(val as number).toLocaleString()}
          </span>
        );
      },
    },
    {
      key: 'fromWarehouse', label: 'From',
      render: (val) => <span className="text-sm">{(val as string) || '—'}</span>,
    },
    {
      key: 'toWarehouse', label: 'To',
      render: (val) => <span className="text-sm">{(val as string) || '—'}</span>,
    },
    { key: 'reference', label: 'Reference', render: (val) => <span className="font-mono text-xs">{val as string}</span> },
    {
      key: 'date', label: 'Date',
      render: (val) => <span className="text-sm text-muted-foreground">{new Date(val as string).toLocaleDateString('en-IN')}</span>,
    },
  ];

  const handleExport = () => {
    exportExcel(
      stockMovements.map((m) => ({
        Product: m.product, SKU: m.sku, Type: m.type,
        Quantity: m.quantity, From: m.fromWarehouse ?? '',
        To: m.toWarehouse ?? '', Reference: m.reference, Date: m.date,
      })),
      'stock-movements'
    );
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Stock Movements</h1>
            <p className="page-subtitle">{stockMovements.length} recent movements</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>

        {/* Summary Cards */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible"
          className="grid grid-cols-3 gap-4">
          {(['inbound','outbound','transfer'] as const).map((type) => {
            const cfg   = typeConfig[type];
            const Icon  = cfg.icon;
            const count = stockMovements.filter((m) => m.type === type).length;
            const qty   = stockMovements.filter((m) => m.type === type).reduce((a, m) => a + m.quantity, 0);
            return (
              <div key={type} className="glass-card rounded-xl p-4 flex items-center gap-4">
                <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', cfg.bg)}>
                  <Icon className={cn('h-5 w-5', cfg.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground capitalize">{type}</p>
                  <p className="text-lg font-bold">{qty.toLocaleString()} units</p>
                  <p className="text-xs text-muted-foreground">{count} movements</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Table */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={stockMovements}
            columns={columns}
            searchable
            searchPlaceholder="Search by product, SKU, reference..."
            emptyMessage="No stock movements found."
            defaultSort={{ key: 'date', dir: 'desc' }}
          />
        </motion.div>
      </div>
    </PageTransition>
  );
}
