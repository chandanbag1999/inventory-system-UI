// ============================================================
// EDIT PRODUCT PAGE - Fixed
// src/pages/EditProductPage.tsx
// ============================================================
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft }              from 'lucide-react';
import PageTransition             from '@/components/PageTransition';
import { Button }                 from '@/components/ui/button';
import ProductForm, { type ProductFormValues } from '@/components/ProductForm';
import { useProductStore } from '@/shared/store/productStore';
import { toast }           from 'sonner';

export default function EditProductPage() {
  const { id }        = useParams<{ id: string }>();
  const navigate      = useNavigate();
  const product       = useProductStore((s) => s.getProduct(id!));
  const updateProduct = useProductStore((s) => s.updateProduct);

  if (!product) {
    return (
      <div className="page-container flex items-center justify-center py-24">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const onSubmit = (data: ProductFormValues) => {
    updateProduct(id!, {
      ...data,
      weight: data.weight ? Number(data.weight) : undefined,
    });
    toast.success('Product updated successfully');
    navigate('/products/' + id);
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
              <h1 className="page-title">Edit Product</h1>
              <p className="page-subtitle">{product.name}</p>
            </div>
          </div>
        </div>
        <ProductForm
          onSubmit={onSubmit}
          onCancel={() => navigate('/products/' + id)}
          submitLabel="Save Changes"
          isEdit
          defaultValues={{
            name:          product.name,
            sku:           product.sku,
            category:      product.category,
            price:         product.price,
            stock:         product.stock,
            status:        product.status,
            warehouse:     product.warehouse,
            description:   product.description ?? '',
            weight:        product.weight ?? undefined,
            trackInventory:product.trackInventory ?? true,
          }}
        />
      </div>
    </PageTransition>
  );
}
