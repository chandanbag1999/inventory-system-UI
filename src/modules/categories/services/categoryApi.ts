// ============================================================
// CATEGORY API — React Query hooks for categories
// Backend: GET    /api/v1/categories           → CategoryDto[] (hierarchical)
//          POST   /api/v1/categories           → multipart/form-data (CreateCategoryRequestDto)
//          PUT    /api/v1/categories/{id}      → JSON (UpdateCategoryCommand)
//          DELETE /api/v1/categories/{id}
//          POST   /api/v1/categories/{id}/image → multipart/form-data
// src/modules/categories/services/categoryApi.ts
// ============================================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/services/api/apiClient';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { QUERY_KEYS } from '@/shared/services/api/queryKeys';
import type { Category, CategoryFormData, SelectOption } from '../types/category.types';

// ── Raw API functions ────────────────────────────────────────
export const categoryApiClient = {
  getAll: async (includeInactive = false): Promise<Category[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.CATEGORIES.BASE, {
      params: { includeInactive },
    });
    const raw: Category[] = data.data ?? [];
    return attachHelpers(raw, '');
  },

  getById: async (id: string): Promise<Category> => {
    const { data } = await apiClient.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    return attachHelper(data.data, '');
  },

  // POST uses multipart/form-data — backend binds IFormFile? ImageFile
  create: async (payload: CategoryFormData): Promise<Category> => {
    const form = new FormData();
    form.append('name', payload.name);
    if (payload.description)  form.append('description', payload.description);
    if (payload.parentId)     form.append('parentId', payload.parentId);
    form.append('sortOrder', String(payload.sortOrder ?? payload.displayOrder ?? 0));
    if (payload.imageFile)    form.append('imageFile', payload.imageFile);

    const { data } = await apiClient.post(API_ENDPOINTS.CATEGORIES.BASE, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return attachHelper(data.data, '');
  },

  // PUT uses JSON — backend: UpdateCategoryCommand (no image field)
  update: async (id: string, payload: CategoryFormData): Promise<Category> => {
    const body = {
      name:        payload.name,
      description: payload.description,
      parentId:    payload.parentId || null,
      sortOrder:   payload.sortOrder ?? payload.displayOrder ?? 0,
    };
    const { data } = await apiClient.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), body);
    return attachHelper(data.data, '');
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  },

  // Separate image upload — POST /api/v1/categories/{id}/image
  uploadImage: async (id: string, file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await apiClient.post(API_ENDPOINTS.CATEGORIES.IMAGE(id), form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.imageUrl;
  },
};

// ── Helper: attach computed fields expected by CategoryTree ──
function attachHelper(cat: Category, parentPath: string): Category {
  const fullPath = parentPath ? `${parentPath} > ${cat.name}` : cat.name;
  return {
    ...cat,
    fullPath,
    displayOrder: cat.sortOrder ?? 0,
    productCount: (cat as any).productCount ?? 0,
    children: (cat.children ?? []).map((c) => attachHelper(c, fullPath)),
  };
}

function attachHelpers(cats: Category[], parentPath: string): Category[] {
  return cats.map((c) => attachHelper(c, parentPath));
}

// ── React Query Hooks ────────────────────────────────────────

export function useCategories(includeInactive = false) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CATEGORIES, includeInactive],
    queryFn:  () => categoryApiClient.getAll(includeInactive),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoryById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORY(id),
    queryFn:  () => categoryApiClient.getById(id),
    enabled:  !!id,
  });
}

export function useCategoryOptions() {
  return useQuery({
    queryKey: [...QUERY_KEYS.CATEGORIES, 'options'],
    queryFn:  async (): Promise<SelectOption[]> => {
      const cats = await categoryApiClient.getAll(false);
      return flattenToOptions(cats, '');
    },
    staleTime: 5 * 60 * 1000,
  });
}

function flattenToOptions(cats: Category[], prefix: string): SelectOption[] {
  const result: SelectOption[] = [];
  for (const cat of cats) {
    const label = prefix ? `${prefix} > ${cat.name}` : cat.name;
    result.push({ value: cat.id, label: cat.name });
    if (cat.children?.length) {
      result.push(...flattenToOptions(cat.children, label));
    }
  }
  return result;
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryFormData) => categoryApiClient.create(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES }); },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryFormData }) =>
      categoryApiClient.update(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES }); },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryApiClient.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES }); },
  });
}

export function useUploadCategoryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      categoryApiClient.uploadImage(id, file),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES }); },
  });
}
