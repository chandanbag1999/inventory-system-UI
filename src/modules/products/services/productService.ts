// ============================================================
// PRODUCT SERVICE - Fixed
// src/modules/products/services/productService.ts
// ============================================================

import { http }        from '@/shared/services/api/apiClient';
import { ENDPOINTS }   from '@/shared/services/api/endpoints';
import type { Product, ProductFilters, PaginatedResponse } from '@/shared/types';

export const productService = {
  getProducts: (filters?: Partial<ProductFilters>) =>
    http.get<PaginatedResponse<Product>>(ENDPOINTS.products.list, filters).then(res => res.data),

  getProduct: (id: string) =>
    http.get<Product>(ENDPOINTS.products.detail(id)).then(res => res.data),

  createProduct: (data: Partial<Product>) =>
    http.post<Product>(ENDPOINTS.products.create, data).then(res => res.data),

  updateProduct: (id: string, data: Partial<Product>) =>
    http.put<Product>(ENDPOINTS.products.update(id), data).then(res => res.data),

  deleteProduct: (id: string) =>
    http.delete<void>(ENDPOINTS.products.delete(id)).then(res => res.data),

  bulkDeleteProducts: (ids: string[]) =>
    http.post<void>(ENDPOINTS.products.bulkDelete, { ids }).then(res => res.data),

  updateStock: (id: string, stock: number, reason: string) =>
    http.put<Product>(ENDPOINTS.products.updateStock(id), { stock, reason }).then(res => res.data),

  importProducts: (file: FormData) =>
    http.upload<{ success: number; failed: number }>(ENDPOINTS.products.import, file).then(res => res.data),

  getCategories: () =>
    http.get<string[]>(ENDPOINTS.products.categories).then(res => res.data),
};

export default productService;
