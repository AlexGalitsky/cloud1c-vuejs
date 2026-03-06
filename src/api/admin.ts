import api from './index';

export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  status: 'pending' | 'active' | 'blocked';
  confirmedAt?: string | null;
  confirmedBy?: number | null;
}

export interface UpdateUserDto {
  role?: 'admin' | 'user';
  status?: 'pending' | 'active' | 'blocked';
}

export const adminApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/admin/users');
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserDto): Promise<User> => {
    const response = await api.patch<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  confirmUser: async (id: number): Promise<User> => {
    const response = await api.post<User>(`/admin/users/${id}/confirm`);
    return response.data;
  },

  blockUser: async (id: number): Promise<User> => {
    const response = await api.post<User>(`/admin/users/${id}/block`);
    return response.data;
  },

  deleteUser: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (email: string, password: string, role?: 'admin' | 'user'): Promise<User> => {
    const response = await api.post<User>('/admin/users', { email, password, role });
    return response.data;
  },
};
