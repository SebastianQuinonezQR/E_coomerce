import api from './client';
import { User } from '../types';

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<{ token: string; user: User }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/login', data),
  me: () => api.get<User>('/auth/me'),
};
