import api from './client';
import { Product } from '../types';

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

export const productApi = {
  getAll: (params?: { categoryId?: number; search?: string; page?: number }) =>
    api.get<ProductsResponse>('/products', { params }),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (data: Omit<Product, 'id' | 'category' | 'createdAt'> & { categoryId: number }) =>
    api.post<Product>('/products', data),
  update: (id: number, data: Partial<Product>) => api.put<Product>(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};
