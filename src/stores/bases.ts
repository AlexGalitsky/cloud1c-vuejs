import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { basesApi } from '@/api/bases';
import type { Base1C, CreateBaseRequest, BaseStatusResponse } from '@/api/bases';

const POLLING_INTERVAL = 1000; // 1 секунда

export const useBasesStore = defineStore('bases', () => {
  const bases = ref<Base1C[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const pollingTimer = ref<number | null>(null);

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
      startPolling(); // Запускаем polling после создания
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
      if (dtFile) {
        startPolling(); // Запускаем polling если загружен новый файл
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

  // Long Polling
  function startPolling() {
    // Очищаем предыдущий таймер
    stopPolling();

    // Немедленно обновляем
    pollBases();

    // Устанавливаем интервал
    pollingTimer.value = window.setInterval(pollBases, POLLING_INTERVAL);
  }

  function stopPolling() {
    if (pollingTimer.value) {
      clearInterval(pollingTimer.value);
      pollingTimer.value = null;
    }
  }

  async function pollBases() {
    try {
      bases.value = await basesApi.getAll();
    } catch (e) {
      // Тихая ошибка при polling - не прерываем работу
      console.error('Polling error:', e);
    }
  }

  // Очистка polling при размонтировании store (опционально)
  function dispose() {
    stopPolling();
  }

  return {
    // State
    bases,
    isLoading,
    error,

    // Computed
    totalCount,
    readyCount,
    processingCount,
    errorCount,

    // Actions
    fetchBases,
    fetchBaseStatus,
    createBase,
    updateBase,
    deleteBase,
    startPolling,
    stopPolling,
    dispose,
  };
});
