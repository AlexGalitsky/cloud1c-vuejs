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
  adminUser?: string;
  status: BaseStatus;
  lastLog: string;
  ownerId: number;
  description?: string;
  isEmpty: boolean;
}

export interface DtFile {
  id: number;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  baseId: number;
  createdAt: string;
  lastAppliedAt: string | null;
  applied: boolean;
}

export interface CreateBaseRequest {
  name: string;
  description?: string;
}

export interface UpdateBaseRequest {
  description?: string;
}

export interface UploadDtRequest {
  adminUser?: string;
  adminPass?: string;
}

export interface ApplyDtRequest {
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

  create: async (data: CreateBaseRequest): Promise<Base1C> => {
    const response = await api.post<Base1C>('/bases', data);
    return response.data;
  },

  uploadDt: async (id: number, data: FormData): Promise<DtFile> => {
    const response = await api.post<DtFile>(`/bases/${id}/dt-files`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number, data: UpdateBaseRequest): Promise<Base1C> => {
    const response = await api.patch<Base1C>(`/bases/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string; log: string }> => {
    const response = await api.delete<{ message: string; log: string }>(`/bases/${id}`);
    return response.data;
  },
};

export const dtFilesApi = {
  getAll: async (baseId: number): Promise<DtFile[]> => {
    const response = await api.get<DtFile[]>(`/bases/${baseId}/dt-files`);
    return response.data;
  },

  delete: async (baseId: number, id: number): Promise<void> => {
    await api.delete(`/bases/${baseId}/dt-files/${id}`);
  },

  apply: async (baseId: number, id: number, data?: ApplyDtRequest): Promise<void> => {
    await api.post(`/bases/${baseId}/dt-files/${id}/apply`, data);
  },
};
