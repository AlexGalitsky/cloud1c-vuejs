import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api/auth';
import type { LoginRequest, RegisterRequest, User } from '@/api/auth';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isPending = computed(() => user.value?.status === 'pending');

  async function login(data: LoginRequest) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await authApi.login(data);
      token.value = response.access_token;
      user.value = response.user;
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
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
      user.value = response.user;
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
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
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  function loadUserFromStorage() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch {
        user.value = null;
      }
    }
  }

  async function fetchProfile() {
    try {
      const profile = await authApi.getProfile();
      user.value = profile;
      localStorage.setItem('user', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to fetch profile', e);
    }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    isLoading.value = true;
    error.value = null;
    try {
      await authApi.changePassword(currentPassword, newPassword);
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Ошибка смены пароля';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return { 
    token, 
    user,
    isLoading, 
    error, 
    isAuthenticated,
    isAdmin,
    isPending,
    login, 
    register, 
    logout,
    loadUserFromStorage,
    fetchProfile,
    changePassword,
  };
});
