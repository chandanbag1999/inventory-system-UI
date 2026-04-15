// ============================================================
// ADD PRODUCT PAGE - Fixed
// src/pages/AddProductPage.tsx
// ============================================================
import { useNavigate }  from 'react-router-dom';
import { ArrowLeft }    from 'lucide-react';
import PageTransition   from '@/components/PageTransition';
import { Button }       from '@/components/ui/button';
import ProductForm, { type ProductFormValues } from '@/components/ProductForm';
import { useProductStore } from '@/shared/store/productStore';
import { toast }           from 'sonner';

export default function AddProductPage() {
  const navigate   = useNavigate();
  const addProduct = useProductStore((s) => s.addProduct);

  const onSubmit = (data: ProductFormValues) => {
    addProduct({
      name:          data.name,
      sku:           data.sku,
      category:      data.category,
      price:         data.price,
      stock:         data.stock,
      reservedStock: 0,
      status:        data.status,
      warehouse:     data.warehouse,
      description:   data.description,
      weight:        data.weight ? Number(data.weight) : undefined,
      trackInventory:data.trackInventory,
    });
    toast.success('Product added successfully');
    navigate('/products');
  };

  return (
    <PageTransition>
      <div className="page-container max-w-3xl">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="page-title">Add Product</h1>
              <p className="page-subtitle">Create a new product in your catalog</p>
            </div>
          </div>
        </div>
        <ProductForm
          onSubmit={onSubmit}
          onCancel={() => navigate('/products')}
          submitLabel="Add Product"
        />
      </div>
    </PageTransition>
  );
}
