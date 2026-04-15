// ============================================================
// CATEGORY API - TanStack Query Hooks
// src/modules/categories/services/categoryApi.ts
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from './categoryService';
import type { Category, CategoryFormData, CategoryOption } from '../types/category.types';

const CATEGORIES_KEY = ['categories'];

export const useCategories = () =>
  useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: () => categoryService.getCategories(),
    staleTime: 10 * 60 * 1000,
  });

export const useCategory = (id: string) =>
  useQuery({
    queryKey: [...CATEGORIES_KEY, id],
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id,
  });

export const useCategoryOptions = () =>
  useQuery({
    queryKey: [...CATEGORIES_KEY, 'options'],
    queryFn: () => categoryService.getCategories(),
    select: flattenCategories,
    staleTime: 10 * 60 * 1000,
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryFormData) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
};

export const useDeletedCategories = () =>
  useQuery({
    queryKey: [...CATEGORIES_KEY, 'deleted'],
    queryFn: () => categoryService.getDeletedCategories(),
  });

export const useRestoreCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.restoreCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
    },
  });
};

function flattenCategories(categories?: Category[], prefix = ''): CategoryOption[] {
  if (!categories) return [];
  const result: CategoryOption[] = [];
  for (const cat of categories) {
    const label = prefix ? `${prefix} > ${cat.name}` : cat.name;
    result.push({ value: cat.id, label });
    if (cat.children?.length) {
      result.push(...flattenCategories(cat.children, label));
    }
  }
  return result;
}
