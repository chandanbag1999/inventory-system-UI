// ============================================================
// PRODUCT DETAIL PAGE — real backend
// GET /api/v1/products/{id}
// src/pages/ProductDetailPage.tsx
// ============================================================
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Pencil, Package, Tag, Boxes } from 'lucide-react';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import { Button }   from '@/components/ui/button';
import { Badge }    from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProductById } from '@/modules/products/services/productApi';
import { useStockByProduct } from '@/modules/inventory/services/inventoryService';
import { formatINR, formatDate } from '@/shared/utils/formatters';
import { cn } from '@/lib/utils';

const statusColor: Record<string, string> = {
  Active:       'bg-green-500/10 text-green-600',
  Draft:        'bg-amber-500/10 text-amber-600',
  Archived:     'bg-muted text-muted-foreground',
  Discontinued: 'bg-red-500/10 text-red-600',
};

export default function ProductDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useProductById(id ?? '');
  const { data: stocks = [] } = useStockByProduct(id ?? '');

  if (isLoading) return (
    <PageTransition>
      <div className="page-container max-w-4xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </PageTransition>
  );

  if (error || !product) return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive">Product not found</p>
        <Button onClick={() => navigate('/products')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <div className="page-container max-w-4xl">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/products')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="page-title mb-0">{product.name}</h1>
              <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium',
                statusColor[product.status] ?? 'bg-muted text-muted-foreground')}>
                {product.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              SKU: <span className="font-mono">{product.sku}</span>
              {product.barcode && <> · Barcode: <span className="font-mono">{product.barcode}</span></>}
            </p>
          </div>
          <Button size="sm" className="gap-2 shrink-0" onClick={() => navigate(`/products/${id}/edit`)}>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Primary Image */}
            {product.primaryImage && (
              <motion.div variants={staggerItem} initial="hidden" animate="visible">
                <Card>
                  <CardContent className="p-4">
                    <img src={product.primaryImage} alt={product.name}
                      className="w-full h-64 object-contain rounded-lg bg-muted" />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Description */}
            {product.description && (
              <motion.div variants={staggerItem} initial="hidden" animate="visible">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Description</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground">{product.description}</p></CardContent>
                </Card>
              </motion.div>
            )}

            {/* Stock by Warehouse */}
            <motion.div variants={staggerItem} initial="hidden" animate="visible">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-muted-foreground" /> Stock by Warehouse
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {stocks.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">No stock data</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left py-2 px-4 text-xs font-semibold text-muted-foreground">Warehouse</th>
                          <th className="text-right py-2 px-4 text-xs font-semibold text-muted-foreground">On Hand</th>
                          <th className="text-right py-2 px-4 text-xs font-semibold text-muted-foreground">Reserved</th>
                          <th className="text-right py-2 px-4 text-xs font-semibold text-muted-foreground">Available</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stocks.map((s) => (
                          <tr key={s.id} className="border-b border-border/50 last:border-0">
                            <td className="py-2.5 px-4 font-medium">{s.warehouseName}</td>
                            <td className="py-2.5 px-4 text-right tabular-nums">{s.quantityOnHand}</td>
                            <td className="py-2.5 px-4 text-right tabular-nums text-muted-foreground">{s.quantityReserved}</td>
                            <td className={cn('py-2.5 px-4 text-right tabular-nums font-semibold',
                              s.quantityAvailable === 0 ? 'text-red-600' : s.quantityAvailable < 10 ? 'text-amber-600' : 'text-green-600')}>
                              {s.quantityAvailable}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right: Info */}
          <div className="space-y-4">
            {/* Pricing */}
            <motion.div variants={staggerItem} initial="hidden" animate="visible">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" /> Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Selling Price</span>
                    <span className="font-bold text-lg">{formatINR(product.unitPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cost Price</span>
                    <span className="font-medium">{formatINR(product.costPrice)}</span>
                  </div>
                  {product.unitPrice > product.costPrice && (
                    <div className="flex justify-between items-center pt-1 border-t border-border">
                      <span className="text-sm text-muted-foreground">Margin</span>
                      <span className="font-medium text-green-600">
                        {(((product.unitPrice - product.costPrice) / product.unitPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Details */}
            <motion.div variants={staggerItem} initial="hidden" animate="visible">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" /> Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-sm">
                  {[
                    { label: 'Category',     value: product.categoryName },
                    { label: 'Total Stock',  value: String(product.totalStock) },
                    { label: 'Reorder At',   value: String(product.reorderLevel) },
                    { label: 'Reorder Qty',  value: String(product.reorderQty) },
                    { label: 'Weight',       value: product.weightKg ? `${product.weightKg} kg` : '—' },
                    { label: 'Created',      value: formatDate(product.createdAt) },
                    { label: 'Updated',      value: formatDate(product.updatedAt) },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">{row.label}</span>
                      <span className="font-medium text-right">{row.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
