import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Package, Upload, ImagePlus } from 'lucide-react';
import { staggerItem } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { warehouses } from '@/data/mock';
import { useCategoryOptions } from '@/modules/categories/services/categoryApi';

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Product name must be at least 2 characters').max(120, 'Product name too long'),
  sku: z.string().trim().min(2, 'SKU is required').max(30, 'SKU too long').regex(/^[A-Za-z0-9-]+$/, 'SKU can only contain letters, numbers, and hyphens'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().positive('Price must be greater than 0').max(9999999, 'Price too high'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  warehouse: z.string().min(1, 'Warehouse is required'),
  status: z.enum(['active', 'draft', 'archived']),
  description: z.string().max(1000, 'Description too long').optional(),
  weight: z.coerce.number().positive('Weight must be positive').optional().or(z.literal('')),
  trackInventory: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
  isEdit?: boolean;
}

export default function ProductForm({ defaultValues, onSubmit, onCancel, submitLabel, isEdit }: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: categoryOptions, isLoading: categoriesLoading } = useCategoryOptions();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      price: undefined,
      stock: 0,
      warehouse: '',
      status: 'draft',
      description: '',
      trackInventory: true,
      ...defaultValues,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image too large', { description: 'Max file size is 5MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>Product name, SKU, and category details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Wireless Bluetooth Headphones" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. WBH-001" disabled={isEdit} {...field} />
                      </FormControl>
                      <FormDescription>Unique product identifier</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger disabled={categoriesLoading}>
                            <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select category"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions?.map((cat) => (
                            <SelectItem key={cat.value} value={cat.label}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief product description…" className="resize-none min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Image Upload */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <ImagePlus className="h-4 w-4 text-primary" />
                Product Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label
                htmlFor="product-image"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-auto object-contain rounded-lg p-2" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm font-medium">Click to upload image</span>
                    <span className="text-xs">PNG, JPG up to 5MB</span>
                  </div>
                )}
                <input id="product-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing & Inventory */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Pricing & Inventory</CardTitle>
              <CardDescription>Set price, stock levels, and warehouse assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹) *</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="warehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warehouse *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select warehouse" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warehouses.filter((w) => w.status === 'active').map((w) => (
                            <SelectItem key={w.id} value={w.name}>{w.name} — {w.location}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="trackInventory"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Track Inventory</FormLabel>
                      <FormDescription>Automatically adjust stock on orders</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible" className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pb-8">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="gap-2">
            <Package className="h-4 w-4" /> {submitLabel}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
