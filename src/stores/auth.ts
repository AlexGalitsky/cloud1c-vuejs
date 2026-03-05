import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api/auth';
import type { LoginRequest, RegisterRequest } from '@/api/auth';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(data: LoginRequest) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authApi.login(data);
      token.value = response.access_token;
      localStorage.setItem('token', response.access_token);
      return response;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка входа';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(data: RegisterRequest) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authApi.register(data);
      token.value = response.access_token;
      localStorage.setItem('token', response.access_token);
      return response;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка регистрации';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    token.value = null;
    localStorage.removeItem('token');
  }

  return { token, isLoading, error, isAuthenticated, login, register, logout };
});
