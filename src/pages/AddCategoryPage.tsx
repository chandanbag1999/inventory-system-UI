// ============================================================
// ADD CATEGORY PAGE — real backend
// POST /api/v1/categories (multipart/form-data)
// src/pages/AddCategoryPage.tsx
// ============================================================
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import CategoryForm from '@/modules/categories/components/CategoryForm';
import { useCreateCategory } from '@/modules/categories/services/categoryApi';
import type { CategoryFormData } from '@/modules/categories/types/category.types';

export default function AddCategoryPage() {
  const navigate       = useNavigate();
  const createCategory = useCreateCategory();

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      await createCategory.mutateAsync(data);
      toast.success('Category created successfully');
      navigate('/categories');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to create category');
    }
  };

  return (
    <PageTransition>
      <div className="page-container max-w-2xl">
        <div className="page-header">
          <div>
            <h1 className="page-title">Add Category</h1>
            <p className="page-subtitle">Create a new product category</p>
          </div>
        </div>
        <CategoryForm
          mode="page"
          onSubmit={handleSubmit}
          isLoading={createCategory.isPending}
        />
      </div>
    </PageTransition>
  );
}
