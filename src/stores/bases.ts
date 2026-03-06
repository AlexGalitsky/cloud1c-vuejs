import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { basesApi, dtFilesApi } from '@/api/bases';
import type { Base1C, CreateBaseRequest, BaseStatusResponse, DtFile } from '@/api/bases';

const POLLING_INTERVAL = 1000; // 1 секунда

export const useBasesStore = defineStore('bases', () => {
  const bases = ref<Base1C[]>([]);
  const currentBase = ref<Base1C | null>(null);
  const dtFiles = ref<DtFile[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const pollingTimer = ref<number | null>(null);
  const isPolling = ref(false);

  // Computed
  const totalCount = computed(() => bases.value.length);
  const readyCount = computed(() => bases.value.filter(b => b.status === 'ready').length);
  const processingCount = computed(() => bases.value.filter(b => b.status === 'processing').length);
  const errorCount = computed(() => bases.value.filter(b => b.status === 'error').length);

  // Actions
  async function fetchBases() {
    isLoading.value = true;
    error.value = null;
    try {
      bases.value = await basesApi.getAll();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка загрузки баз';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchBaseById(id: number) {
    isLoading.value = true;
    error.value = null;
    try {
      currentBase.value = await basesApi.getById(id);
      return currentBase.value;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка загрузки базы';
      throw e;
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
      if (currentBase.value?.id === id) {
        currentBase.value = updatedBase;
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

  // Long Polling для конкретной базы
  function startPollingForBase(baseId: number) {
    if (isPolling.value) {
      return;
    }
    isPolling.value = true;
    
    stopPolling();
    pollBase(baseId);
    
    pollingTimer.value = window.setInterval(() => {
      pollBase(baseId);
    }, POLLING_INTERVAL);
  }

  function stopPolling() {
    if (pollingTimer.value) {
      clearInterval(pollingTimer.value);
      pollingTimer.value = null;
    }
    isPolling.value = false;
  }

  async function pollBase(baseId: number) {
    try {
      const status = await basesApi.getStatus(baseId);
      if (currentBase.value && currentBase.value.id === baseId) {
        currentBase.value.status = status.status;
        currentBase.value.lastLog = status.lastLog;
      }
    } catch (e) {
      console.error('Polling error:', e);
    }
  }

  function setCurrentBase(base: Base1C | null) {
    currentBase.value = base;
  }

  async function fetchDtFiles(baseId: number) {
    isLoading.value = true;
    error.value = null;
    try {
      dtFiles.value = await dtFilesApi.getAll(baseId);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка загрузки файлов';
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteDtFile(baseId: number, id: number) {
    error.value = null;
    try {
      await dtFilesApi.delete(baseId, id);
      dtFiles.value = dtFiles.value.filter(f => f.id !== id);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка удаления файла';
      throw e;
    }
  }

  async function applyDtFile(baseId: number, id: number) {
    error.value = null;
    try {
      await dtFilesApi.apply(baseId, id);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка применения файла';
      throw e;
    }
  }

  return {
    // State
    bases,
    currentBase,
    dtFiles,
    isLoading,
    error,
    isPolling,

    // Computed
    totalCount,
    readyCount,
    processingCount,
    errorCount,

    // Actions
    fetchBases,
    fetchBaseById,
    fetchBaseStatus,
    createBase,
    updateBase,
    deleteBase,
    startPollingForBase,
    stopPolling,
    setCurrentBase,
    fetchDtFiles,
    deleteDtFile,
    applyDtFile,
  };
});
