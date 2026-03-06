<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <AppCard class="w-full max-w-md !p-8 animate-fade-in">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-800">Вход в систему</h2>
        <p class="text-gray-500 mt-2">Облачная 1С</p>
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
          required
        />

        <AppButton
          type="submit"
          variant="primary"
          class="w-full"
          :loading="isLoading"
        >
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </AppButton>
      </form>

      <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
        {{ error }}
      </div>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          Нет аккаунта?
          <router-link to="/register" class="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-all">
            Зарегистрироваться
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
    await authStore.login({ email: email.value, password: password.value });
    router.push('/dashboard');
  } catch (e: any) {
    error.value = authStore.error;
  } finally {
    isLoading.value = false;
  }
}
</script>
