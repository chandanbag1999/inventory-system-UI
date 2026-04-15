// src/modules/suppliers/types/supplier.types.ts

export interface Supplier {
  id:           string;
  name:         string;
  email:        string;
  phone:        string;
  gstin?:       string;
  category:     string;
  paymentTerms: number;
  leadTime:     number;
  rating:       number;
  status:       'active' | 'inactive' | 'blacklisted';
  totalOrders:  number;
  totalValue:   number;
  createdAt:    string;
}

export interface PurchaseOrder {
  id:          string;
  poNumber:    string;
  supplier:    string;
  supplierId:  string;
  items:       POItem[];
  total:       number;
  status:      'draft' | 'sent' | 'acknowledged' | 'partial' | 'received' | 'cancelled';
  expectedDate:string;
  warehouse:   string;
  createdAt:   string;
}

export interface POItem {
  productName: string;
  sku:         string;
  quantity:    number;
  unitPrice:   number;
  total:       number;
}
