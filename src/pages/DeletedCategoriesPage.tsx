// ============================================================
// DELETED CATEGORIES PAGE - View and Restore Deleted Categories
// src/pages/DeletedCategoriesPage.tsx
// ============================================================

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trash2, Package, AlertTriangle } from 'lucide-react';
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
import { useState } from 'react';
import { useAuthStore } from '@/shared/store/authStore';
import { useDeletedCategories, useRestoreCategory } from '@/modules/categories/services/categoryApi';
import type { Category } from '@/modules/categories/types/category.types';

export default function DeletedCategoriesPage() {
  const navigate = useNavigate();
  const { hasPermission, isAdmin } = useAuthStore();
  const isAdminUser = isAdmin();
  const canRestore = isAdminUser || hasPermission('product', 'update');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { data: deletedCategories, isLoading, error, refetch } = useDeletedCategories();
  const restoreCategory = useRestoreCategory();

  const handleRestore = async (id: string) => {
    try {
      await restoreCategory.mutateAsync(id);
      toast.success('Category restored', {
        description: 'Category has been restored successfully',
      });
      setSelectedCategory(null);
    } catch (err: unknown) {
      const error = err as { message?: string; response?: { data?: { message?: string; errors?: string[] } } };
      console.error('Restore failed:', error);
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to restore category';
      const errors = error?.response?.data?.errors;
      
      toast.error('Restore failed', {
        description: errors ? `${errorMessage}: ${Object.values(errors).flat().join(', ')}` : errorMessage,
        duration: 5000,
      });
    }
  };

  const filteredCategories = deletedCategories?.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.fullPath.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-4">
          <p className="text-destructive text-center">Failed to load deleted categories</p>
          <Button onClick={() => refetch()}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
              <span className="truncate">Deleted Categories</span>
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Restore deleted categories or they will be permanently deleted after 12 months
            </p>
          </div>
          <Button onClick={() => navigate('/categories')} variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 w-full">
            <SearchInput
              placeholder="Search deleted..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="w-full"
            />
          </div>
          <Button variant="outline" onClick={() => refetch()} className="shrink-0">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Deleted Categories List */}
        <Card>
          <CardContent className="p-3 sm:p-6">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-6 flex-1" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No deleted categories found</p>
                <p className="text-sm">Deleted categories will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCategories.map((category) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{category.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Deleted: {category.deletedAt ? new Date(category.deletedAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                    {canRestore && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="shrink-0"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Restore</span>
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Auto-Delete Policy</p>
                <p>Deleted categories are permanently removed from the database after 12 months. You can restore them at any time before then.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Restore Confirmation Dialog */}
        <AlertDialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Restore Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to restore "{selectedCategory?.name}"?
                This will make the category active again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedCategory && handleRestore(selectedCategory.id)}
                disabled={restoreCategory.isPending}
              >
                {restoreCategory.isPending ? 'Restoring...' : 'Restore'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageTransition>
  );
}