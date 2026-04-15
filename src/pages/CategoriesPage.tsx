import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, MoreHorizontal, Edit, Trash2, FolderOpen, ChevronRight, ChevronDown,
  Loader2, AlertCircle, Image as ImageIcon, X,
} from 'lucide-react';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import SearchInput from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory,
} from '@/hooks/useCategories';
import type { CategoryResponseDto, CreateCategoryDto } from '@/types/product-catalog';

const emptyForm: CreateCategoryDto = {
  name: '',
  slug: '',
  description: '',
  parentId: undefined,
  displayOrder: 0,
  metaTitle: '',
  metaDescription: '',
  commissionRate: undefined,
};

function flattenCategories(cats: CategoryResponseDto[], depth = 0): (CategoryResponseDto & { depth: number })[] {
  const result: (CategoryResponseDto & { depth: number })[] = [];
  for (const cat of cats) {
    result.push({ ...cat, depth });
    if (cat.children?.length) {
      result.push(...flattenCategories(cat.children, depth + 1));
    }
  }
  return result;
}

function CategoryRow({
  category,
  depth,
  expanded,
  hasChildren,
  onToggle,
  onEdit,
  onDelete,
}: {
  category: CategoryResponseDto;
  depth: number;
  expanded: boolean;
  hasChildren: boolean;
  onToggle: () => void;
  onEdit: (cat: CategoryResponseDto) => void;
  onDelete: (cat: CategoryResponseDto) => void;
}) {
  return (
    <tr className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group">
      <td className="py-3 px-5">
        <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 24}px` }}>
          {hasChildren ? (
            <button onClick={onToggle} className="p-0.5 rounded hover:bg-accent transition-colors">
              {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </button>
          ) : (
            <span className="w-5" />
          )}
          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
            {category.imageUrl ? (
              <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover" />
            ) : (
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <span className="font-medium">{category.name}</span>
        </div>
      </td>
      <td className="py-3 px-5 text-muted-foreground font-mono text-xs">{category.slug}</td>
      <td className="py-3 px-5 text-muted-foreground text-center tabular-nums">{category.productCount}</td>
      <td className="py-3 px-5 text-center tabular-nums">{category.displayOrder}</td>
      <td className="py-3 px-5 text-center">
        <Badge variant={category.isActive ? 'default' : 'secondary'}>
          {category.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </td>
      <td className="py-3 px-5 text-muted-foreground text-xs">
        {category.commissionRate != null ? `${category.commissionRate}%` : '—'}
      </td>
      <td className="py-3 px-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(category)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

export default function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponseDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryResponseDto | null>(null);
  const [form, setForm] = useState<CreateCategoryDto>({ ...emptyForm });
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const allCategories = categories || [];
  const flat = flattenCategories(allCategories);

  // Filter by search
  const filtered = search
    ? flat.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase()))
    : flat;

  // For tree view, track which are visible based on expanded state
  const visibleRows = search
    ? filtered
    : filtered.filter((cat) => {
        if (cat.depth === 0) return true;
        // Check all ancestors are expanded
        let current = cat;
        const parentChain: string[] = [];
        // Walk up via parentId
        let parentId = cat.parentId;
        while (parentId) {
          parentChain.push(parentId);
          const parent = flat.find((c) => c.id === parentId);
          parentId = parent?.parentId;
        }
        return parentChain.every((pid) => expandedIds.has(pid));
      });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openCreate = () => {
    setEditingCategory(null);
    setForm({ ...emptyForm });
    setDialogOpen(true);
  };

  const openEdit = (cat: CategoryResponseDto) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      parentId: cat.parentId || undefined,
      displayOrder: cat.displayOrder,
      metaTitle: cat.metaTitle || '',
      metaDescription: cat.metaDescription || '',
      commissionRate: cat.commissionRate,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    if (editingCategory) {
      await updateMutation.mutateAsync({ id: editingCategory.id, data: form });
    } else {
      await createMutation.mutateAsync(form);
    }
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const columns = ['Category', 'Slug', 'Products', 'Order', 'Status', 'Commission', ''];

  return (
    <PageTransition>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Categories</h1>
            <p className="page-subtitle">{allCategories.length} top-level categories</p>
          </div>
          <Button className="h-9 gap-2 rounded-lg" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        </div>

        <motion.div variants={staggerItem} initial="hidden" animate="visible" className="flex gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search categories…" />
        </motion.div>

        {isError && (
          <motion.div variants={staggerItem} initial="hidden" animate="visible" className="flex items-center gap-2 p-4 mb-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Failed to load categories. Please try again.</span>
          </motion.div>
        )}

        <motion.div variants={staggerItem} initial="hidden" animate="visible" className="data-table-container rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className={`text-left py-3 px-5 text-xs font-medium text-muted-foreground ${
                        ['Products', 'Order', 'Status'].includes(col) ? 'text-center' : ''
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-3 px-5"><Skeleton className="h-8 w-40" /></td>
                      <td className="py-3 px-5"><Skeleton className="h-4 w-24" /></td>
                      <td className="py-3 px-5"><Skeleton className="h-4 w-8 mx-auto" /></td>
                      <td className="py-3 px-5"><Skeleton className="h-4 w-8 mx-auto" /></td>
                      <td className="py-3 px-5"><Skeleton className="h-6 w-16 mx-auto" /></td>
                      <td className="py-3 px-5"><Skeleton className="h-4 w-10" /></td>
                      <td className="py-3 px-5"><Skeleton className="h-8 w-8" /></td>
                    </tr>
                  ))
                ) : visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                      {search ? 'No categories match your search.' : 'No categories yet. Create your first category to get started.'}
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((cat) => (
                    <CategoryRow
                      key={cat.id}
                      category={cat}
                      depth={cat.depth}
                      expanded={expandedIds.has(cat.id)}
                      hasChildren={cat.children?.length > 0}
                      onToggle={() => toggleExpand(cat.id)}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update the category details below.' : 'Fill in the details to create a new category.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="cat-name">Name *</Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Electronics"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                value={form.slug || ''}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="auto-generated if empty"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                value={form.description || ''}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Brief description…"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cat-parent">Parent Category</Label>
                <Select
                  value={form.parentId || 'none'}
                  onValueChange={(v) => setForm((f) => ({ ...f, parentId: v === 'none' ? undefined : v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None (top-level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (top-level)</SelectItem>
                    {flat
                      .filter((c) => c.id !== editingCategory?.id)
                      .map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {'—'.repeat(c.depth)} {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cat-order">Display Order</Label>
                <Input
                  id="cat-order"
                  type="number"
                  value={form.displayOrder ?? 0}
                  onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cat-commission">Commission Rate (%)</Label>
                <Input
                  id="cat-commission"
                  type="number"
                  step="0.1"
                  value={form.commissionRate ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, commissionRate: e.target.value ? Number(e.target.value) : undefined }))
                  }
                  placeholder="e.g. 10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cat-meta-title">Meta Title</Label>
                <Input
                  id="cat-meta-title"
                  value={form.metaTitle || ''}
                  onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cat-meta-desc">Meta Description</Label>
              <Textarea
                id="cat-meta-desc"
                value={form.metaDescription || ''}
                onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSaving || !form.name.trim()}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-semibold text-foreground">{deleteTarget?.name}</span>
              {deleteTarget?.productCount ? ` and unlink ${deleteTarget.productCount} product(s)` : ''}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
}
