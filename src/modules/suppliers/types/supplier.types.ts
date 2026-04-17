// ============================================================
// SUPPLIER TYPES — aligned with backend SupplierDto
// src/modules/suppliers/types/supplier.types.ts
// ============================================================
import type { Supplier } from '@/shared/types/domain.types';
export type { Supplier };

export interface SupplierFormData {
  name:           string;
  contactPerson?: string;
  email?:         string;
  phone?:         string;
  address?:       string;
  city?:          string;
  state?:         string;
  country?:       string;
  postalCode?:    string;
  gstin?:         string;
  paymentTerms?:  number;
  leadTime?:      number;
  notes?:         string;
}
