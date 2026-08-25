import api from './client';
import { Order } from '../types';

export const orderApi = {
  create: () => api.post<Order>('/orders'),
  getAll: () => api.get<Order[]>('/orders'),
  getById: (id: number) => api.get<Order>(`/orders/${id}`),
};
