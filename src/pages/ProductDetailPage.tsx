import { useState }                from 'react';
import { useNavigate, useParams }  from 'react-router-dom';
import { motion }                  from 'framer-motion';
import {
  ArrowLeft, Edit, Trash2, Package,
  Warehouse, CalendarDays, Tag, BarChart3,
} from 'lucide-react';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import StatusBadge    from '@/components/StatusBadge';
import { Button }     from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useProductStore } from '@/shared/store/productStore';
import { toast }           from 'sonner';

export default function ProductDetailPage() {
  const { id }          = useParams<{ id: string }>();
  const navigate        = useNavigate();
  const product         = useProductStore((s) => s.getProduct(id!));
  const deleteProduct   = useProductStore((s) => s.deleteProduct);
  const [showDelete, setShowDelete] = useState(false);

  if (!product) {
    return (
      <div className="page-container flex items-center justify-center py-24">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const handleDelete = () => {
    deleteProduct(id!);
    toast.success('Product deleted');
    navigate('/products');
  };

  const stockStatus =
    product.stock === 0       ? { label: 'Out of Stock', color: 'text-destructive' } :
    product.stock < 50        ? { label: 'Low Stock',    color: 'text-amber-500'   } :
                                { label: 'In Stock',     color: 'text-green-500'   };

  return (
    <PageTransition>
      <div className="page-container max-w-4xl">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="page-title">{product.name}</h1>
              <p className="page-subtitle font-mono text-xs">{product.sku}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/products/" + id + "/edit")}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <motion.div variants={staggerItem} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" /> Product Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Name',      value: product.name                            },
                  { label: 'SKU',       value: product.sku,      mono: true             },
                  { label: 'Category',  value: product.category                        },
                  { label: 'Price',     value: "Rs." + product.price.toLocaleString() },
                  { label: 'Status',    value: <StatusBadge status={product.status} /> },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    {typeof row.value === 'string'
                      ? <span className={"text-sm font-medium " + (row.mono ? 'font-mono text-xs' : '')}>{row.value}</span>
                      : row.value
                    }
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" /> Inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Total Stock',    value: product.stock.toLocaleString()         },
                  { label: 'Reserved Stock', value: product.reservedStock.toLocaleString() },
                  { label: 'Available',      value: (product.stock - product.reservedStock).toLocaleString() },
                  { label: 'Stock Status',   value: <span className={"text-sm font-medium " + stockStatus.color}>{stockStatus.label}</span> },
                  { label: 'Warehouse',      value: product.warehouse                      },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    {typeof row.value === 'string'
                      ? <span className="text-sm font-medium">{row.value}</span>
                      : row.value
                    }
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem} initial="hidden" animate="visible">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" /> Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">{new Date(product.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-semibold text-foreground">{product.name}</span>. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
}
