// ============================================================
// EDIT PRODUCT PAGE — real backend
// GET /api/v1/products/{id}
// PUT /api/v1/products/{id}  (JSON)
// src/pages/EditProductPage.tsx
// ============================================================
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import ProductForm, { type ProductFormValues } from '@/components/ProductForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button }   from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useProductById, useUpdateProduct } from '@/modules/products/services/productApi';
import { useCategoryOptions } from '@/modules/categories/services/categoryApi';

export default function EditProductPage() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();

  const { data: product, isLoading, error } = useProductById(id ?? '');
  const { data: categoryOptions = [] }      = useCategoryOptions();
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (values: ProductFormValues) => {
    if (!id) return;
    try {
      const catOption = categoryOptions.find((c) => c.label === values.category || c.value === values.category);
      const categoryId = catOption?.value ?? values.category;

      await updateProduct.mutateAsync({
        id,
        payload: {
          categoryId,
          name:        values.name,
          description: values.description || undefined,
          unitPrice:   values.price,
          weightKg:    values.weight ? Number(values.weight) : undefined,
          status:      values.status === 'active' ? 'Active' : values.status === 'archived' ? 'Archived' : 'Draft',
        },
      });

      toast.success('Product updated successfully');
      navigate(`/products/${id}`);
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to update product');
    }
  };

  if (isLoading) return (
    <PageTransition>
      <div className="page-container max-w-3xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </PageTransition>
  );

  if (error || !product) return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive">Product not found</p>
        <Button onClick={() => navigate('/products')}><RefreshCw className="h-4 w-4 mr-2" />Back</Button>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <div className="page-container max-w-3xl">
        <div className="page-header">
          <div>
            <h1 className="page-title">Edit Product</h1>
            <p className="page-subtitle">{product.name}</p>
          </div>
        </div>
        <ProductForm
          defaultValues={{
            name:     product.name,
            sku:      product.sku,
            category: product.categoryName,
            price:    product.unitPrice,
            stock:    product.totalStock,
            status:   product.status.toLowerCase() as any,
            description: product.description ?? '',
            warehouse: '',
            trackInventory: true,
            weight: product.weightKg ?? undefined,
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/products/${id}`)}
          submitLabel="Update Product"
          isEdit
        />
      </div>
    </PageTransition>
  );
}
