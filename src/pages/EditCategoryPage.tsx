// ============================================================
// EDIT CATEGORY PAGE — real backend
// GET  /api/v1/categories/{id}
// PUT  /api/v1/categories/{id}          → JSON (UpdateCategoryCommand)
// POST /api/v1/categories/{id}/image    → multipart/form-data (if new image)
// src/pages/EditCategoryPage.tsx
// ============================================================
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import CategoryForm from '@/modules/categories/components/CategoryForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button }   from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import {
  useCategoryById,
  useUpdateCategory,
  useUploadCategoryImage,
} from '@/modules/categories/services/categoryApi';
import type { CategoryFormData } from '@/modules/categories/types/category.types';

export default function EditCategoryPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: category, isLoading, error } = useCategoryById(id ?? '');
  const updateCategory = useUpdateCategory();
  const uploadImage    = useUploadCategoryImage();

  const handleSubmit = async (data: CategoryFormData) => {
    if (!id) return;
    try {
      // 1. Update text fields via PUT (JSON — no image)
      await updateCategory.mutateAsync({ id, payload: data });

      // 2. If user picked a new image, upload via separate endpoint
      if (data.imageFile) {
        await uploadImage.mutateAsync({ id, file: data.imageFile });
      }

      toast.success('Category updated successfully');
      navigate('/categories');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to update category');
    }
  };

  if (isLoading) return (
    <PageTransition>
      <div className="page-container max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </PageTransition>
  );

  if (error || !category) return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive">Category not found</p>
        <Button onClick={() => navigate('/categories')}>
          <RefreshCw className="h-4 w-4 mr-2" />Back
        </Button>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <div className="page-container max-w-2xl">
        <div className="page-header">
          <div>
            <h1 className="page-title">Edit Category</h1>
            <p className="page-subtitle">{category.name}</p>
          </div>
        </div>
        <CategoryForm
          mode="page"
          category={category}
          onSubmit={handleSubmit}
          isLoading={updateCategory.isPending || uploadImage.isPending}
        />
      </div>
    </PageTransition>
  );
}
