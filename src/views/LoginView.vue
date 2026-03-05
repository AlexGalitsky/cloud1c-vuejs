<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Вход</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Пароль
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        Нет аккаунта?
        <router-link to="/register" class="text-blue-600 hover:underline">
          Зарегистрироваться
        </router-link>
      </p>
      <p v-if="error" class="mt-4 text-center text-red-500 text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const isLoading = ref(false);
const error = ref<string | null>(null);

async function handleSubmit() {
  isLoading.value = true;
  error.value = null;
  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push('/dashboard');
  } catch (e: any) {
    error.value = authStore.error;
  } finally {
    isLoading.value = false;
  }
}
</script>
