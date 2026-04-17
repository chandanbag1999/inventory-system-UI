// ============================================================
// PRODUCT API — React Query hooks for products
// Backend: GET    /api/v1/products           (query params supported)
//          GET    /api/v1/products/{id}
//          GET    /api/v1/products/sku/{sku}
//          POST   /api/v1/products           multipart/form-data
//          PUT    /api/v1/products/{id}      JSON (UpdateProductCommand)
//          DELETE /api/v1/products/{id}
//          POST   /api/v1/products/{id}/images
//          DELETE /api/v1/products/{id}/images/{imageId}
// src/modules/products/services/productApi.ts
// ============================================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/services/api/apiClient';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { QUERY_KEYS } from '@/shared/services/api/queryKeys';
import type { Product, ProductListItem, PagedResult } from '@/shared/types/domain.types';

// ── Query param types ────────────────────────────────────────
export interface GetAllProductsParams {
  pageNumber?:  number;
  pageSize?:    number;
  search?:      string;
  categoryId?:  string;
  status?:      string;
  sortBy?:      string;
  sortDesc?:    boolean;
}

// ── Create payload (mirrors CreateProductRequestDto) ─────────
export interface CreateProductPayload {
  categoryId:   string;
  name:         string;
  sku:          string;
  description?: string;
  unitPrice:    number;
  costPrice:    number;
  reorderLevel?:number;
  reorderQty?:  number;
  barcode?:     string;
  weightKg?:    number;
  images?:      File[];
}

// ── Update payload (mirrors UpdateProductCommand) ────────────
export interface UpdateProductPayload {
  categoryId?:  string;
  name?:        string;
  description?: string;
  unitPrice?:   number;
  costPrice?:   number;
  reorderLevel?:number;
  reorderQty?:  number;
  barcode?:     string;
  weightKg?:    number;
  status?:      string;
}

// ── Raw API functions ────────────────────────────────────────
export const productApiClient = {
  getAll: async (params?: GetAllProductsParams): Promise<PagedResult<ProductListItem>> => {
    const { data } = await apiClient.get(API_ENDPOINTS.PRODUCTS.BASE, { params });
    return data.data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return data.data;
  },

  getBySku: async (sku: string): Promise<Product> => {
    const { data } = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_SKU(sku));
    return data.data;
  },

  // POST uses multipart/form-data
  create: async (payload: CreateProductPayload): Promise<Product> => {
    const form = new FormData();
    form.append('categoryId',   payload.categoryId);
    form.append('name',         payload.name);
    form.append('sku',          payload.sku);
    form.append('unitPrice',    String(payload.unitPrice));
    form.append('costPrice',    String(payload.costPrice));
    if (payload.description)  form.append('description',  payload.description);
    if (payload.reorderLevel) form.append('reorderLevel', String(payload.reorderLevel));
    if (payload.reorderQty)   form.append('reorderQty',   String(payload.reorderQty));
    if (payload.barcode)      form.append('barcode',      payload.barcode);
    if (payload.weightKg)     form.append('weightKg',     String(payload.weightKg));
    if (payload.images) {
      payload.images.forEach((file) => form.append('Images', file));
    }
    const { data } = await apiClient.post(API_ENDPOINTS.PRODUCTS.BASE, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  // PUT uses JSON
  update: async (id: string, payload: UpdateProductPayload): Promise<Product> => {
    const { data } = await apiClient.put(API_ENDPOINTS.PRODUCTS.BY_ID(id), payload);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  uploadImages: async (id: string, files: File[]): Promise<string[]> => {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    const { data } = await apiClient.post(API_ENDPOINTS.PRODUCTS.IMAGES(id), form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.imageUrls;
  },

  deleteImage: async (id: string, imageId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.IMAGE_DELETE(id, imageId));
  },
};

// ── React Query Hooks ────────────────────────────────────────

export function useProducts(params?: GetAllProductsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS_FILTERED(params ?? {}),
    queryFn:  () => productApiClient.getAll(params),
    staleTime: 3 * 60 * 1000,
  });
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT(id),
    queryFn:  () => productApiClient.getById(id),
    enabled:  !!id,
  });
}

export function useProductBySku(sku: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT_BY_SKU(sku),
    queryFn:  () => productApiClient.getBySku(sku),
    enabled:  !!sku,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productApiClient.create(payload),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS }); },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      productApiClient.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT(id) });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApiClient.delete(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS }); },
  });
}

export function useUploadProductImages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) =>
      productApiClient.uploadImages(id, files),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT(id) });
    },
  });
}

export function useDeleteProductImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, imageId }: { id: string; imageId: string }) =>
      productApiClient.deleteImage(id, imageId),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT(id) });
    },
  });
}
