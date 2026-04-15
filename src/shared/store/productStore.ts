// ============================================================
// PRODUCT STORE - Zustand Store with Mock Data
// src/shared/store/productStore.ts
// ============================================================

import { create } from 'zustand';
import type { Product } from '@/shared/types';
import { products as initialProducts } from '@/data/mock';

interface ProductStore {
  products:      Product[];
  isLoading:     boolean;
  addProduct:    (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct:    (id: string) => Product | undefined;
  setProducts:   (products: Product[]) => void;
  setLoading:    (loading: boolean) => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products:  [...initialProducts],
  isLoading: false,

  addProduct: (product) => {
    const newProduct: Product = {
      ...product,
      id:        crypto.randomUUID(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((s) => ({ products: [newProduct, ...s.products] }));
  },

  updateProduct: (id, data) => {
    set((s) => ({
      products: s.products.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    }));
  },

  deleteProduct: (id) => {
    set((s) => ({
      products: s.products.filter((p) => p.id !== id),
    }));
  },

  getProduct: (id) => get().products.find((p) => p.id === id),

  setProducts: (products) => set({ products }),

  setLoading: (isLoading) => set({ isLoading }),
}));
