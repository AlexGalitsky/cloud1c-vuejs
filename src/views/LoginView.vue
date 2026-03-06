<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-100">
    <AppCard>
      <template #header>
        <div class="w-14 h-14 rounded-full bg-[#4F46E5] flex items-center justify-center shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-[#4B5563] my-auto">Облачная 1С</h1>
      </template>

      <div class="text-sm font-light text-[#6B7280] pb-8">
        Войдите в свой аккаунт
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col">
        <AppInput
          v-model="email"
          type="email"
          label="Email"
          placeholder="name@company.com"
          icon="email"
          autocomplete="off"
          required
        />

        <AppInput
          v-model="password"
          type="password"
          label="Пароль"
          placeholder="••••••••"
          icon="password"
          autocomplete="new-password"
          required
        />

        <AppButton
          type="submit"
          variant="primary"
          :loading="isLoading"
          class="mb-6"
        >
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </AppButton>

        <div class="text-sm font-light text-[#6B7280]">
          Нет аккаунта?
          <router-link to="/register" class="font-medium text-[#4F46E5] hover:underline">
            Зарегистрироваться
          </router-link>
        </div>
      </form>

      <AppDivider />

      <div class="flex flex-row gap-2 justify-center">
        <AppButton variant="secondary" class="w-32">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
            <path d="M9 18c-4.51 2-5-2-7-2"></path>
          </svg>
          <span class="font-medium mx-auto">Github</span>
        </AppButton>
        <AppButton variant="secondary" class="w-32">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
          </svg>
          <span class="font-medium mx-auto">Twitter</span>
        </AppButton>
      </div>

      <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
        {{ error }}
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
import AppDivider from '@/components/ui/AppDivider.vue';

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
