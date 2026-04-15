import { useState, useMemo }  from 'react';
import { motion }             from 'framer-motion';
import { AlertTriangle, Boxes, Package, TrendingDown, Plus, Download } from 'lucide-react';
import PageTransition, { staggerContainer, staggerItem } from '@/components/PageTransition';
import StatCard    from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { DataTable, type Column } from '@/shared/components/tables/DataTable';
import { useProductStore } from '@/shared/store/productStore';
import { useExport }       from '@/shared/hooks/useExport';
import { Button }          from '@/components/ui/button';
import { Badge }           from '@/components/ui/badge';
import { cn }              from '@/lib/utils';
import type { Product }    from '@/shared/types';

export default function InventoryPage() {
  const products   = useProductStore((s) => s.products);
  const { exportCSV, exportExcel, isExporting } = useExport();
  const [filter, setFilter] = useState<'all'|'low'|'out'>('all');

  const lowStock  = products.filter((p) => p.stock > 0 && p.stock <= 50);
  const outStock  = products.filter((p) => p.stock === 0);
  const inStock   = products.filter((p) => p.stock > 50);
  const totalValue = products.reduce((a, p) => a + (p.price * p.stock), 0);

  const filtered = useMemo(() => {
    if (filter === 'low') return lowStock;
    if (filter === 'out') return outStock;
    return products;
  }, [filter, products, lowStock, outStock]);

  const columns: Column<Product>[] = [
    {
      key: 'name', label: 'Product',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{row.sku}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'warehouse', label: 'Warehouse' },
    {
      key: 'stock', label: 'Stock',
      render: (val) => {
        const v = val as number;
        return (
          <span className={cn('font-semibold tabular-nums',
            v === 0 ? 'text-destructive' : v <= 50 ? 'text-amber-500' : 'text-green-500')}>
            {v.toLocaleString()}
          </span>
        );
      },
    },
    {
      key: 'reservedStock', label: 'Reserved',
      render: (val) => <span className="text-muted-foreground tabular-nums">{(val as number).toLocaleString()}</span>,
    },
    {
      key: 'price', label: 'Value',
      render: (_, row) => (
        <span className="tabular-nums font-medium">
          Rs.{(row.price * row.stock).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (_, row) => {
        const label = row.stock === 0 ? 'out_of_stock' : row.stock <= 50 ? 'low_stock' : 'in_stock';
        const colors = {
          out_of_stock: 'bg-destructive/10 text-destructive',
          low_stock:    'bg-amber-500/10 text-amber-600',
          in_stock:     'bg-green-500/10 text-green-600',
        };
        const labels = { out_of_stock: 'Out of Stock', low_stock: 'Low Stock', in_stock: 'In Stock' };
        return <Badge variant="outline" className={cn('text-xs', colors[label])}>{labels[label]}</Badge>;
      },
    },
  ];

  const handleExport = () => {
    const data = filtered.map((p) => ({
      Name: p.name, SKU: p.sku, Category: p.category,
      Stock: p.stock, Reserved: p.reservedStock,
      Price: p.price, Value: p.price * p.stock,
      Warehouse: p.warehouse, Status: p.status,
    }));
    exportExcel(data, 'inventory-report');
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Inventory</h1>
            <p className="page-subtitle">{products.length} products tracked across all warehouses</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Total Products',  value: String(products.length),                    icon: Boxes,         changeType: 'neutral'  as const, change: 'All products'       },
            { title: 'In Stock',        value: String(inStock.length),                     icon: Package,       changeType: 'positive' as const, change: 'Healthy stock'      },
            { title: 'Low Stock',       value: String(lowStock.length),                    icon: AlertTriangle, changeType: 'negative' as const, change: 'Need reorder'       },
            { title: 'Out of Stock',    value: String(outStock.length),                    icon: TrendingDown,  changeType: 'negative' as const, change: 'Immediate action'   },
          ].map((s) => <StatCard key={s.title} {...s} />)}
        </motion.div>

        {/* Total Value Card */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible"
          className="glass-card rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Inventory Value</p>
            <p className="text-2xl font-bold mt-1">Rs.{totalValue.toLocaleString()}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Boxes className="h-6 w-6 text-primary" />
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible" className="flex gap-2">
          {([
            { key: 'all', label: 'All Products', count: products.length },
            { key: 'low', label: 'Low Stock',    count: lowStock.length },
            { key: 'out', label: 'Out of Stock', count: outStock.length },
          ] as const).map((tab) => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === tab.key ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent')}>
              {tab.label}
              <span className={cn('text-xs px-1.5 py-0.5 rounded-full',
                filter === tab.key ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                {tab.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Table */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <DataTable
            data={filtered}
            columns={columns}
            searchable
            searchPlaceholder="Search products, SKU..."
            emptyMessage="No products match your filter."
            defaultSort={{ key: 'stock', dir: 'asc' }}
          />
        </motion.div>
      </div>
    </PageTransition>
  );
}
