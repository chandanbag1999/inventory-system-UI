// ============================================================
// CATEGORY TYPES
// src/modules/categories/types/category.types.ts
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  parentName?: string | null;
  fullPath: string;
  displayOrder: number;
  imageUrl?: string | null;
  isActive: boolean;
  isDeleted?: boolean;
  deletedAt?: string | null;
  productCount: number;
  children: Category[];
  commissionRate?: number | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  displayOrder?: number;
  commissionRate?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export interface CategoryCreateRequest {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  displayOrder?: number;
  commissionRate?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export type CategoryUpdateRequest = CategoryCreateRequest;

export type { Category as CategoryResponse };