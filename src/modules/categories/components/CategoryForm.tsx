// ============================================================
// CATEGORY FORM COMPONENT - Create/Edit Category Modal
// src/modules/categories/components/CategoryForm.tsx
// ============================================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FolderTree, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { useCategoryOptions } from '../services/categoryApi';
import type { Category, CategoryFormData } from '../types/category.types';

const categorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  slug: z.string().trim().max(100, 'Slug too long').optional().or(z.literal('')),
  description: z.string().max(500, 'Description too long').optional().or(z.literal('')),
  parentId: z.string().optional().or(z.literal('')),
  displayOrder: z.coerce.number().int().min(0, 'Order must be positive').default(0),
  commissionRate: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  metaTitle: z.string().max(100, 'Meta title too long').optional().or(z.literal('')),
  metaDescription: z.string().max(200, 'Meta description too long').optional().or(z.literal('')),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  category?: Category | null;
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
  mode?: 'modal' | 'page';
}

export default function CategoryForm({ open = true, onOpenChange, category, onSubmit, isLoading, mode = 'modal' }: CategoryFormProps) {
  const isModalMode = mode === 'modal' && open !== undefined;
  const [imagePreview, setImagePreview] = useState<string | null>(category?.imageUrl || null);
  const { data: parentOptions } = useCategoryOptions();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      parentId: category?.parentId || '',
      displayOrder: category?.displayOrder || 0,
      commissionRate: category?.commissionRate || undefined,
      metaTitle: category?.metaTitle || '',
      metaDescription: category?.metaDescription || '',
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    if (!category && !form.getValues('slug')) {
      form.setValue('slug', generateSlug(value));
    }
    form.setValue('name', value);
  };

  const handleSubmit = (data: CategoryFormValues) => {
    const submitData: CategoryFormData = {
      name: data.name,
      slug: data.slug || undefined,
      description: data.description || undefined,
      parentId: data.parentId === '__ROOT__' ? undefined : (data.parentId || undefined),
      displayOrder: data.displayOrder,
      commissionRate: data.commissionRate || undefined,
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
    };
    onSubmit(submitData);
  };

  const filteredParentOptions = parentOptions?.filter(opt => opt.value !== category?.id) || [];

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Basic Info */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Basic Information</CardTitle>
            <CardDescription>Name and description for the category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Electronics"
                          {...field}
                          onChange={(e) => handleNameChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. electronics" {...field} />
                      </FormControl>
                      <FormDescription>URL-friendly identifier (auto-generated)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of this category..."
                          rows={3}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Hierarchy */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Hierarchy</CardTitle>
                <CardDescription>Parent category and display order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Category</FormLabel>
                      <Select
                        value={field.value || ''}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select parent (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__ROOT__">No Parent (Root Category)</SelectItem>
                          {filteredParentOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Leave empty for root category</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Lower numbers appear first</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Commission & Meta */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Advanced Settings</CardTitle>
                <CardDescription>Commission rate and SEO meta tags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="commissionRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commission Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          placeholder="e.g. 5.00"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormDescription>Applicable for seller categories</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SEO title (recommended: 50-60 chars)"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="SEO description (recommended: 150-160 chars)"
                          rows={2}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t">
              {isModalMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange?.(false)}
                  className="min-w-[100px]"
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    {category ? 'Update' : 'Create'} Category
                  </>
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
              <FolderTree className="h-5 w-5" />
              {category ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return formContent;
}