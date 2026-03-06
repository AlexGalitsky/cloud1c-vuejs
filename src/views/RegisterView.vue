<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <AppCard class="w-full max-w-md !p-8 animate-fade-in">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-success mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-800">Регистрация</h2>
        <p class="text-gray-500 mt-2">Создайте аккаунт для доступа</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <AppInput
          v-model="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          icon="email"
          required
        />

        <AppInput
          v-model="password"
          type="password"
          label="Пароль"
          placeholder="••••••••"
          icon="password"
          hint="Минимум 6 символов"
          minlength="6"
          required
        />

        <AppButton
          type="submit"
          variant="success"
          class="w-full"
          :loading="isLoading"
        >
          {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </AppButton>
      </form>

      <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
        {{ error }}
      </div>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          Уже есть аккаунт?
          <router-link to="/login" class="text-green-600 font-semibold hover:text-green-700 hover:underline transition-all">
            Войти
          </router-link>
        </p>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppCard from '@/components/ui/AppCard.vue';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';

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
    await authStore.register({ email: email.value, password: password.value });
    router.push('/dashboard');
  } catch (e: any) {
    error.value = authStore.error;
  } finally {
    isLoading.value = false;
  }
}
</script>
