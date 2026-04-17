// ============================================================
// CATEGORY FORM — shared by Add & Edit pages
// Includes image upload with preview (native file input)
// src/modules/categories/components/CategoryForm.tsx
// ============================================================
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FolderTree, Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB — matches backend CloudinaryService

interface CategoryFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  category?: Category | null;
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
  mode?: 'modal' | 'page';
}

export default function CategoryForm({
  open = true,
  onOpenChange,
  category,
  onSubmit,
  isLoading,
  mode = 'modal',
}: CategoryFormProps) {
  const isModalMode = mode === 'modal' && open !== undefined;

  // ── Image state ──────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category?.imageUrl || null,
  );
  const [imageError, setImageError] = useState<string | null>(null);

  const { data: parentOptions } = useCategoryOptions();

  // ── Form ─────────────────────────────────────────────────
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

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

  const handleNameChange = (value: string) => {
    if (!category && !form.getValues('slug')) {
      form.setValue('slug', generateSlug(value));
    }
    form.setValue('name', value);
  };

  // ── Image handlers ───────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Only PNG, JPG, and WebP images are allowed.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError('File size must not exceed 5 MB.');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setImageError(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Only PNG, JPG, and WebP images are allowed.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError('File size must not exceed 5 MB.');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ── Submit ───────────────────────────────────────────────
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
      imageFile: imageFile,
    };
    onSubmit(submitData);
  };

  const filteredParentOptions =
    parentOptions?.filter((opt) => opt.value !== category?.id) || [];

  // ── Form content ─────────────────────────────────────────
  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* ── Basic Information ─────────────────────────── */}
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

        {/* ── Category Image ────────────────────────────── */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Category Image</CardTitle>
            <CardDescription>PNG, JPG, or WebP — max 5 MB</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            {imagePreview ? (
              <div className="flex items-start gap-4">
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="h-28 w-28 rounded-lg object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive/90"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {imageFile && (
                    <>
                      <p className="text-sm font-medium truncate max-w-[200px]">{imageFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(imageFile.size / 1024).toFixed(1)} KB
                      </p>
                    </>
                  )}
                  {!imageFile && category?.imageUrl && (
                    <p className="text-xs text-muted-foreground">Current image — upload a new one to replace</p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 w-fit text-xs h-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    {imageFile ? 'Replace' : 'Change'}
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
              >
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click or drag & drop to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WebP — max 5 MB
                </p>
              </div>
            )}

            {imageError && (
              <p className="text-sm text-destructive mt-2">{imageError}</p>
            )}
          </CardContent>
        </Card>

        {/* ── Hierarchy ─────────────────────────────────── */}
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
                  <Select value={field.value || ''} onValueChange={field.onChange}>
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
                    <Input type="number" min="0" placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>Lower numbers appear first</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* ── Advanced Settings ─────────────────────────── */}
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

        {/* ── Actions ───────────────────────────────────── */}
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
                <span className="animate-spin mr-2">&#9203;</span>
                Saving...
              </>
            ) : (
              <>{category ? 'Update' : 'Create'} Category</>
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
