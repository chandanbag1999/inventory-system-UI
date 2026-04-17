// ============================================================
// CATEGORY TYPES — aligned with backend CategoryDto
// src/modules/categories/types/category.types.ts
// ============================================================
import type { Category } from '@/shared/types/domain.types';
export type { Category };

export interface CategoryFormData {
  name:             string;
  description?:     string;
  parentId?:        string;
  sortOrder?:       number;
  displayOrder?:    number;
  slug?:            string;
  commissionRate?:  number;
  metaTitle?:       string;
  metaDescription?: string;
  imageFile?:       File | null;
}

export interface SelectOption {
  value: string;
  label: string;
}
