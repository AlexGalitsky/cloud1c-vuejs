import api from './index';

export enum BaseStatus {
  READY = 'ready',
  PROCESSING = 'processing',
  ERROR = 'error',
}

export interface Base1C {
  id: number;
  name: string;
  serverPath: string;
  adminUser: string;
  status: BaseStatus;
  lastLog: string;
  ownerId: number;
}

export interface CreateBaseRequest {
  name: string;
  serverPath: string;
  adminUser: string;
  adminPass: string;
}

export interface UpdateBaseRequest {
  name?: string;
  serverPath?: string;
  adminUser?: string;
  adminPass?: string;
}

export interface BaseStatusResponse {
  status: BaseStatus;
  lastLog: string;
}

export const basesApi = {
  getAll: async (): Promise<Base1C[]> => {
    const response = await api.get<Base1C[]>('/bases');
    return response.data;
  },

  getById: async (id: number): Promise<Base1C> => {
    const response = await api.get<Base1C>(`/bases/${id}`);
    return response.data;
  },

  getStatus: async (id: number): Promise<BaseStatusResponse> => {
    const response = await api.get<BaseStatusResponse>(`/bases/${id}/status`);
    return response.data;
  },

  create: async (data: FormData): Promise<Base1C> => {
    const response = await api.post<Base1C>('/bases', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<Base1C> => {
    const response = await api.patch<Base1C>(`/bases/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/bases/${id}`);
  },
};
