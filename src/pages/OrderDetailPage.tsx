import { useParams, useNavigate } from 'react-router-dom';
import { motion }                 from 'framer-motion';
import { ArrowLeft, Edit, Trash2, Package, User, Truck, Calendar, CreditCard } from 'lucide-react';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import StatusBadge from '@/components/StatusBadge';
import { useOrderStore, ORDER_STATUS_FLOW } from '@/shared/store/orderStore';
import { Button }  from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useState } from 'react';

const allStatuses = ['pending','confirmed','processing','shipped','delivered'] as const;

export default function OrderDetailPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { getOrder, transitionStatus, deleteOrder } = useOrderStore();
  const order       = getOrder(id!);
  const [showDelete, setShowDelete] = useState(false);

  if (!order) {
    return (
      <div className="page-container flex items-center justify-center py-24">
        <p className="text-muted-foreground">Order not found.</p>
      </div>
    );
  }

  const allowedNext = ORDER_STATUS_FLOW[order.status] ?? [];

  const handleDelete = () => {
    deleteOrder(id!);
    toast.success('Order deleted');
    navigate('/orders');
  };

  return (
    <PageTransition>
      <div className="page-container max-w-4xl">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="page-title">{order.orderNumber}</h1>
              <p className="page-subtitle">{order.customer}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/orders/" + id + "/edit")}>
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
                  <Package className="h-4 w-4 text-muted-foreground" /> Order Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Order Number', value: order.orderNumber },
                  { label: 'Status',       value: <StatusBadge status={order.status} /> },
                  { label: 'Items',        value: String(order.items) },
                  { label: 'Total',        value: "Rs." + order.total.toLocaleString() },
                  { label: 'Date',         value: new Date(order.createdAt).toLocaleDateString('en-IN') },
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
                  <User className="h-4 w-4 text-muted-foreground" /> Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Name',      value: order.customer  },
                  { label: 'Email',     value: order.email     },
                  { label: 'Warehouse', value: order.warehouse },
                  ...(order.deliveryPartner ? [{ label: 'Delivery Partner', value: order.deliveryPartner }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <span className="text-sm font-medium">{row.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {allowedNext.length > 0 && (
            <motion.div variants={staggerItem} initial="hidden" animate="visible" className="md:col-span-2">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Update Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {allowedNext.map((s) => (
                      <Button key={s} variant="outline" size="sm"
                        onClick={() => { transitionStatus(id!, s); toast.success("Status updated to " + s); }}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete order?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-semibold text-foreground">{order.orderNumber}</span>. This cannot be undone.
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
