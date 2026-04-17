// ============================================================
// ADD PRODUCT PAGE — real backend
// POST /api/v1/products  (multipart/form-data)
// src/pages/AddProductPage.tsx
// ============================================================
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import ProductForm, { type ProductFormValues } from '@/components/ProductForm';
import { useCreateProduct } from '@/modules/products/services/productApi';
import { useCategoryOptions } from '@/modules/categories/services/categoryApi';
import { useWarehouses } from '@/modules/warehouses/services/warehouseApi';

export default function AddProductPage() {
  const navigate      = useNavigate();
  const createProduct = useCreateProduct();
  const { data: categoryOptions = [] } = useCategoryOptions();
  const { data: warehouses = [] }      = useWarehouses(true);

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      // Find categoryId from selected category name
      const catOption = categoryOptions.find((c) => c.label === values.category || c.value === values.category);
      const categoryId = catOption?.value ?? values.category;

      await createProduct.mutateAsync({
        categoryId,
        name:        values.name,
        sku:         values.sku,
        description: values.description || undefined,
        unitPrice:   values.price,
        costPrice:   0,
        weightKg:    values.weight ? Number(values.weight) : undefined,
      });

      toast.success('Product created successfully');
      navigate('/products');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to create product');
    }
  };

  return (
    <PageTransition>
      <div className="page-container max-w-3xl">
        <div className="page-header">
          <div>
            <h1 className="page-title">Add Product</h1>
            <p className="page-subtitle">Create a new product in your catalogue</p>
          </div>
        </div>
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/products')}
          submitLabel="Create Product"
        />
      </div>
    </PageTransition>
  );
}
