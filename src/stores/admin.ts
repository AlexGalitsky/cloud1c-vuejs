import { defineStore } from 'pinia';
import { ref } from 'vue';
import { adminApi, type User, type UpdateUserDto } from '@/api/admin';

export const useAdminStore = defineStore('admin', () => {
  const users = ref<User[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchUsers() {
    isLoading.value = true;
    error.value = null;
    try {
      users.value = await adminApi.getUsers();
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка загрузки пользователей';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function confirmUser(id: number) {
    try {
      const updatedUser = await adminApi.confirmUser(id);
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка подтверждения';
      throw e;
    }
  }

  async function blockUser(id: number) {
    try {
      const updatedUser = await adminApi.blockUser(id);
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка блокировки';
      throw e;
    }
  }

  async function deleteUser(id: number) {
    try {
      await adminApi.deleteUser(id);
      users.value = users.value.filter((u) => u.id !== id);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка удаления';
      throw e;
    }
  }

  async function updateUser(id: number, data: UpdateUserDto) {
    try {
      const updatedUser = await adminApi.updateUser(id, data);
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка обновления';
      throw e;
    }
  }

  return { users, isLoading, error, fetchUsers, confirmUser, blockUser, deleteUser, updateUser };
});
