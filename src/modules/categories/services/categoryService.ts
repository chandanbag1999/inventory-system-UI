// ============================================================
// CATEGORY SERVICE - API Calls
// src/modules/categories/services/categoryService.ts
// ============================================================

import { http, type BackendResponse } from '@/shared/services/api/apiClient';
import { ENDPOINTS } from '@/shared/services/api/endpoints';
import type { Category, CategoryFormData } from '../types/category.types';

export const categoryService = {
  getCategories: (): Promise<Category[]> =>
    http.get<Category[]>(ENDPOINTS.categories.list).then(res => res.data),

  getCategory: (id: string): Promise<Category> =>
    http.get<Category>(ENDPOINTS.categories.detail(id)).then(res => res.data),

  createCategory: (data: CategoryFormData): Promise<Category> =>
    http.post<Category>(ENDPOINTS.categories.create, data).then(res => res.data),

  updateCategory: (id: string, data: CategoryFormData): Promise<Category> =>
    http.put<Category>(ENDPOINTS.categories.update(id), data).then(res => res.data),

  deleteCategory: (id: string): Promise<boolean> =>
    http.delete<boolean>(ENDPOINTS.categories.delete(id)).then(res => res.data),

  uploadImage: (id: string, file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return http.upload<{ imageUrl: string }>(ENDPOINTS.categories.uploadImage(id), formData).then(res => res.data);
  },

  getDeletedCategories: (): Promise<Category[]> =>
    http.get<Category[]>('/categories/deleted').then(res => res.data),

  restoreCategory: async (id: string): Promise<boolean> => {
    try {
      const response = await http.post<boolean>(`/categories/${id}/restore`, undefined);
      return response.data;
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { data?: { message?: string; errors?: string[] } } };
      console.error('Restore category error:', err);
      throw error;
    }
  },

  permanentlyDeleteOld: (monthsOld: number = 12): Promise<number> =>
    http.delete<number>(`/categories/permanent?monthsOld=${monthsOld}`).then(res => res.data),
};

export default categoryService;