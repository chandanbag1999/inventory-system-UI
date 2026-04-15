import { useParams, useNavigate } from 'react-router-dom';
import { useForm }                from 'react-hook-form';
import { zodResolver }            from '@hookform/resolvers/zod';
import { z }                      from 'zod';
import { ArrowLeft }              from 'lucide-react';
import { motion }                 from 'framer-motion';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import { useOrderStore } from '@/shared/store/orderStore';
import { Button }        from '@/components/ui/button';
import { Input }         from '@/components/ui/input';
import { Label }         from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast }         from 'sonner';

const schema = z.object({
  customer:  z.string().min(1, 'Customer name required'),
  email:     z.string().email('Valid email required'),
  status:    z.enum(['pending','confirmed','processing','shipped','delivered','cancelled','returned']),
  warehouse: z.string().min(1, 'Warehouse required'),
});

type FormValues = z.infer<typeof schema>;

export default function EditOrderPage() {
  const { id }      = useParams<{ id: string }>();
  const navigate    = useNavigate();
  const order       = useOrderStore((s) => s.getOrder(id!));
  const updateOrder = useOrderStore((s) => s.updateOrder);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: order ? {
      customer:  order.customer,
      email:     order.email,
      status:    order.status as FormValues['status'],
      warehouse: order.warehouse,
    } : undefined,
  });

  if (!order) {
    return (
      <div className="page-container flex items-center justify-center py-24">
        <p className="text-muted-foreground">Order not found.</p>
      </div>
    );
  }

  const onSubmit = (data: FormValues) => {
    updateOrder(id!, data);
    toast.success('Order updated successfully');
    navigate('/orders/' + id);
  };

  const orderStatuses = ['pending','confirmed','processing','shipped','delivered','cancelled','returned'] as const;

  return (
    <PageTransition>
      <div className="page-container max-w-2xl">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="page-title">Edit Order</h1>
              <p className="page-subtitle">{order.orderNumber}</p>
            </div>
          </div>
        </div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <Card>
            <CardHeader><CardTitle className="text-base">Order Details</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input {...register('customer')} />
                  {errors.customer && <p className="text-xs text-destructive">{errors.customer.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" {...register('email')} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(v) => setValue('status', v as FormValues['status'])}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Warehouse</Label>
                  <Input {...register('warehouse')} />
                  {errors.warehouse && <p className="text-xs text-destructive">{errors.warehouse.message}</p>}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
