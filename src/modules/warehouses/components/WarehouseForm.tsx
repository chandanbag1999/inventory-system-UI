// ============================================================
// WAREHOUSE FORM — shared by Add & Edit dialogs
// Fields: name, code, phone, email, capacity, manager, address
// Uses react-hook-form + zod validation
// src/modules/warehouses/components/WarehouseForm.tsx
// ============================================================
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Warehouse as WarehouseIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useManagerOptions } from '../services/warehouseApi';
import type { Warehouse } from '@/shared/types/domain.types';
import type { WarehouseFormData } from '../services/warehouseApi';

const warehouseSchema = z.object({
  name:     z.string().trim().min(2, 'Name must be at least 2 characters').max(150, 'Name too long'),
  code:     z.string().trim().min(1, 'Code is required').max(20, 'Code too long'),
  phone:    z.string().max(20, 'Phone too long').optional().or(z.literal('')),
  email:    z.string().email('Invalid email format').optional().or(z.literal('')),
  capacity: z.string().optional().or(z.literal('')),
  managerId:z.string().optional().or(z.literal('')),
  street:   z.string().optional().or(z.literal('')),
  city:     z.string().optional().or(z.literal('')),
  state:    z.string().optional().or(z.literal('')),
  pincode:  z.string().optional().or(z.literal('')),
  country:  z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof warehouseSchema>;

interface WarehouseFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  warehouse?: Warehouse | null;
  onSubmit: (data: WarehouseFormData) => void;
  isLoading?: boolean;
  mode?: 'modal' | 'page';
}

export default function WarehouseForm({
  open = true,
  onOpenChange,
  warehouse,
  onSubmit,
  isLoading,
  mode = 'modal',
}: WarehouseFormProps) {
  const isModalMode = mode === 'modal' && open !== undefined;
  const { data: managerOptions } = useManagerOptions();
  const isEdit = !!warehouse;

  const form = useForm<FormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name:      '',
      code:      '',
      phone:     '',
      email:     '',
      capacity:  '',
      managerId: '',
      street:    '',
      city:      '',
      state:     '',
      pincode:   '',
      country:   'India',
    },
  });

  // Reset form values whenever warehouse prop changes
  useEffect(() => {
    form.reset({
      name:      warehouse?.name      ?? '',
      code:      warehouse?.code      ?? '',
      phone:     warehouse?.phone     ?? '',
      email:     warehouse?.email     ?? '',
      capacity:  warehouse?.capacity?.toString() ?? '',
      managerId: warehouse?.managerId ?? '',
      street:    warehouse?.address?.street  ?? '',
      city:      warehouse?.address?.city    ?? '',
      state:     warehouse?.address?.state   ?? '',
      pincode:   warehouse?.address?.pincode ?? '',
      country:   warehouse?.address?.country ?? 'India',
    });
  }, [warehouse, form]);

  const handleSubmit = (data: FormValues) => {
    const hasAddress = data.street || data.city || data.state || data.pincode;
    const address = hasAddress
      ? {
          street:  data.street  ?? '',
          city:    data.city    ?? '',
          state:   data.state   ?? '',
          pincode: data.pincode ?? '',
          country: data.country || 'India',
        }
      : null;

    const payload: WarehouseFormData = {
      name:      data.name,
      code:      data.code,
      phone:     data.phone     || undefined,
      email:     data.email     || undefined,
      capacity:  data.capacity  ? parseInt(data.capacity, 10) : undefined,
      managerId: data.managerId === '__NONE__' ? undefined : (data.managerId || undefined),
      version:   warehouse?.version,
      address,
    };
    onSubmit(payload);
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* ── Basic Information ─────────────────────────── */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Basic Information</CardTitle>
            <CardDescription>Name, code and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mumbai Central" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. WH-MUM-01"
                        {...field}
                        disabled={isEdit}
                      />
                    </FormControl>
                    <FormDescription>
                      {isEdit ? 'Code cannot be changed' : 'Letters, numbers, hyphens'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 98765 43210" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="warehouse@company.com" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="e.g. 5000" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription>Max stock lines this warehouse can hold</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="managerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager</FormLabel>
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__NONE__">No Manager</SelectItem>
                        {managerOptions?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Address ───────────────────────────────────── */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Address</CardTitle>
            <CardDescription>Warehouse location details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Industrial Area" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Mumbai" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Maharashtra" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="400001" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="India" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Actions ───────────────────────────────────── */}
        <div className="flex justify-end gap-3 pt-2 border-t">
          {isModalMode && (
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)} className="min-w-[100px]">
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <><span className="animate-spin mr-2">&#9203;</span>Saving...</>
            ) : (
              <>{isEdit ? 'Update' : 'Create'} Warehouse</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isModalMode) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <WarehouseIcon className="h-5 w-5" />
              {isEdit ? 'Edit Warehouse' : 'Create Warehouse'}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? `Update details for ${warehouse?.name ?? 'warehouse'}`
                : 'Add a new warehouse to your inventory network'}
            </DialogDescription>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return formContent;
}
