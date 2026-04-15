// ============================================================
// CATEGORIES PAGE - Full CRUD Management
// src/modules/categories/pages/CategoriesPage.tsx
// ============================================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, RefreshCw, FolderTree, Package, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import SearchInput from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useAuthStore } from '@/shared/store/authStore';
import {
  useCategories,
  useDeleteCategory,
} from '../services/categoryApi';
import type { Category } from '../types/category.types';
import CategoryTree from '../components/CategoryTree';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { hasPermission, isAdmin } = useAuthStore();
  const isAdminUser = isAdmin();
  const canCreate = isAdminUser || hasPermission('product', 'create');
  const canUpdate = isAdminUser || hasPermission('product', 'update');
  const canDelete = isAdminUser || hasPermission('product', 'delete');
  const showActions = canCreate || canUpdate || canDelete;

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [allExpanded, setAllExpanded] = useState(true);

  const { data: categoriesResponse, isLoading, error, refetch } = useCategories();
  const deleteCategory = useDeleteCategory();

  const categories = useMemo(() => {
    return categoriesResponse || [];
  }, [categoriesResponse]);

  const stats = useMemo(() => {
    const total = countAllCategories(categories);
    const active = countActiveCategories(categories);
    const inactive = total - active;
    const withProducts = countCategoriesWithProducts(categories);
    return { total, active, inactive, withProducts };
  }, [categories]);

  const handleEdit = (category: Category) => {
    navigate(`/categories/${category.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success('Category deleted', {
        description: 'Category has been deleted successfully',
      });
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error('Delete failed', {
        description: err?.message || 'Failed to delete category',
      });
    }
  };

  const toggleAllExpanded = () => {
    setAllExpanded(!allExpanded);
  };

  if (error) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[50vh] sm:h-[60vh] gap-4 p-4">
          <p className="text-destructive text-center">Failed to load categories</p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <FolderTree className="h-6 w-6" />
              Categories
            </h1>
            <p className="page-subtitle">Manage product categories and hierarchy</p>
          </div>
          <div className="flex gap-2">
            {canCreate && (
              <Button className="h-9 gap-2 rounded-lg" onClick={() => navigate('/categories/add')}>
                <Plus className="h-4 w-4" /> Add Category
              </Button>
            )}
            <Button variant="outline" size="sm" className="h-9 gap-2 rounded-lg" onClick={() => navigate('/categories/deleted')}>
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Deleted</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <motion.div
          variants={staggerItem}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="stat-card">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FolderTree className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inactive}</p>
                  <p className="text-xs text-muted-foreground">Inactive</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.withProducts}</p>
                  <p className="text-xs text-muted-foreground">With Products</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search & Actions */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search categories..."
            className="flex-1"
          />
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={toggleAllExpanded} className="flex-1 sm:flex-none h-9">
              <span className="hidden sm:inline">{allExpanded ? 'Collapse All' : 'Expand All'}</span>
              <span className="sm:hidden">{allExpanded ? 'Collapse' : 'Expand'}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="flex-1 sm:flex-none h-9">
              <RefreshCw className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </motion.div>

        {/* Category Tree */}
        <motion.div variants={staggerItem} initial="hidden" animate="visible">
          <Card className="data-table-container">
            <CardContent className="p-4 sm:p-6">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-md shrink-0" />
                    <Skeleton className="h-6 flex-1" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <CategoryTree
                categories={categories}
                onEdit={canUpdate ? handleEdit : () => {}}
                onDelete={canDelete ? (id) => {
                  const cat = findCategory(categories, id);
                  if (cat) setDeleteTarget({ id, name: cat.name });
                } : () => {}}
                searchTerm={searchTerm}
                showActions={showActions}
              />
            )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteTarget?.name}"?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTransition>
  );
}

// Helper functions
function countAllCategories(categories: Category[]): number {
  let count = categories.length;
  for (const cat of categories) {
    if (cat.children?.length) {
      count += countAllCategories(cat.children);
    }
  }
  return count;
}

function countActiveCategories(categories: Category[]): number {
  let count = categories.filter(c => c.isActive).length;
  for (const cat of categories) {
    if (cat.children?.length) {
      count += countActiveCategories(cat.children);
    }
  }
  return count;
}

function countCategoriesWithProducts(categories: Category[]): number {
  let count = categories.filter(c => c.productCount > 0).length;
  for (const cat of categories) {
    if (cat.children?.length) {
      count += countCategoriesWithProducts(cat.children);
    }
  }
  return count;
}

function findCategory(categories: Category[], id: string): Category | null {
  for (const cat of categories) {
    if (cat.id === id) return cat;
    if (cat.children?.length) {
      const found = findCategory(cat.children, id);
      if (found) return found;
    }
  }
  return null;
}