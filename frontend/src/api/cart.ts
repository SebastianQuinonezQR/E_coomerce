import api from './client';
import { Cart } from '../types';

export const cartApi = {
  get: () => api.get<Cart>('/cart'),
  addItem: (productId: number, quantity = 1) =>
    api.post<Cart>('/cart/items', { productId, quantity }),
  updateItem: (itemId: number, quantity: number) =>
    api.put<Cart>(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: number) => api.delete(`/cart/items/${itemId}`),
};
