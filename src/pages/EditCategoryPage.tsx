// ============================================================
// EDIT CATEGORY PAGE - Edit Existing Category
// src/pages/EditCategoryPage.tsx
// ============================================================

import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuthStore } from '@/shared/store/authStore';
import { useCategory, useUpdateCategory } from '@/modules/categories/services/categoryApi';
import type { CategoryFormData } from '@/modules/categories/types/category.types';
import CategoryForm from '@/modules/categories/components/CategoryForm';

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission, isAdmin } = useAuthStore();
  const isAdminUser = isAdmin();
  const canUpdate = isAdminUser || hasPermission('product', 'update');
  
  const { data: category, isLoading, error } = useCategory(id!);
  const updateCategory = useUpdateCategory();

  const onSubmit = async (data: CategoryFormData) => {
    if (!id || !category) return;
    
    try {
      await updateCategory.mutateAsync({ id, data });
      toast.success('Category updated', {
        description: `"${data.name}" has been updated successfully`,
      });
      navigate('/categories');
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error('Failed to update category', {
        description: error?.message || 'An error occurred',
      });
    }
  };

  if (!canUpdate) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-4">
          <p className="text-destructive text-center">You don't have permission to edit categories</p>
          <Button onClick={() => navigate('/categories')}>
            Go Back
          </Button>
        </div>
      </PageTransition>
    );
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="page-container flex items-center justify-center py-24">
          <p className="text-muted-foreground">Loading category...</p>
        </div>
      </PageTransition>
    );
  }

  if (error || !category) {
    return (
      <PageTransition>
        <div className="page-container flex items-center justify-center py-24">
          <p className="text-destructive">Category not found.</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="page-container max-w-3xl">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="page-title">Edit Category</h1>
              <p className="page-subtitle">{category.name}</p>
            </div>
          </div>
        </div>
        <CategoryForm
          mode="page"
          category={category}
          onSubmit={onSubmit}
          isLoading={updateCategory.isPending}
        />
      </div>
    </PageTransition>
  );
}
