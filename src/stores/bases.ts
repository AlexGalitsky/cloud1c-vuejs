import { defineStore } from 'pinia';
import { ref } from 'vue';
import { basesApi } from '@/api/bases';
import type { Base1C, CreateBaseRequest, BaseStatusResponse } from '@/api/bases';

export const useBasesStore = defineStore('bases', () => {
  const bases = ref<Base1C[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchBases() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await basesApi.getAll();
      console.log('API response for bases:', response);
      bases.value = response;
    } catch (e: any) {
      console.error('Error fetching bases:', e);
      error.value = e.response?.data?.message || 'Ошибка загрузки баз';
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchBaseStatus(id: number): Promise<BaseStatusResponse> {
    return await basesApi.getStatus(id);
  }

  async function createBase(data: CreateBaseRequest, dtFile?: File) {
    error.value = null;
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('serverPath', data.serverPath);
    formData.append('adminUser', data.adminUser);
    formData.append('adminPass', data.adminPass);
    if (dtFile) {
      formData.append('dtFile', dtFile);
    }

    try {
      const newBase = await basesApi.create(formData);
      bases.value.push(newBase);
      return newBase;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка создания базы';
      throw e;
    }
  }

  async function updateBase(id: number, data: Partial<CreateBaseRequest>, dtFile?: File) {
    error.value = null;
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.serverPath) formData.append('serverPath', data.serverPath);
    if (data.adminUser) formData.append('adminUser', data.adminUser);
    if (data.adminPass) formData.append('adminPass', data.adminPass);
    if (dtFile) {
      formData.append('dtFile', dtFile);
    }

    try {
      const updatedBase = await basesApi.update(id, formData);
      const index = bases.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        bases.value[index] = updatedBase;
      }
      return updatedBase;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка обновления базы';
      throw e;
    }
  }

  async function deleteBase(id: number) {
    error.value = null;
    try {
      await basesApi.delete(id);
      bases.value = bases.value.filter((b) => b.id !== id);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка удаления базы';
      throw e;
    }
  }

  return {
    bases,
    isLoading,
    error,
    fetchBases,
    fetchBaseStatus,
    createBase,
    updateBase,
    deleteBase,
  };
});
