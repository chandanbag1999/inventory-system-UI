// ============================================================
// ADD CATEGORY PAGE - Create New Category
// src/pages/AddCategoryPage.tsx
// ============================================================

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuthStore } from '@/shared/store/authStore';
import { useCreateCategory } from '@/modules/categories/services/categoryApi';
import type { CategoryFormData } from '@/modules/categories/types/category.types';
import CategoryForm from '@/modules/categories/components/CategoryForm';

export default function AddCategoryPage() {
  const navigate = useNavigate();
  const { hasPermission, isAdmin } = useAuthStore();
  const isAdminUser = isAdmin();
  const canCreate = isAdminUser || hasPermission('product', 'create');
  const createCategory = useCreateCategory();

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await createCategory.mutateAsync(data);
      toast.success('Category created', {
        description: `"${data.name}" has been created successfully`,
      });
      navigate('/categories');
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error('Failed to create category', {
        description: error?.message || 'An error occurred',
      });
      throw err;
    }
  };

  if (!canCreate) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-4">
          <p className="text-destructive text-center">You don't have permission to create categories</p>
          <Button onClick={() => navigate('/categories')}>
            Go Back
          </Button>
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
              <h1 className="text-xl sm:text-2xl font-bold">Add Category</h1>
              <p className="text-sm text-muted-foreground">
                Create a new category for your products
              </p>
            </div>
          </div>
        </div>
        <CategoryForm
          mode="page"
          onSubmit={onSubmit}
          isLoading={createCategory.isPending}
        />
      </div>
    </PageTransition>
  );
}