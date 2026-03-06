<template>
  <div class="min-vh-100 d-flex align-center justify-center bg-background">
    <v-card class="mx-auto" max-width="400" elevation="4">
      <v-card-text class="pa-8">
        <div class="text-center mb-6">
          <v-avatar color="success" size="64" class="mb-4">
            <v-icon icon="mdi-account-plus" size="32" color="white" />
          </v-avatar>
          <h2 class="text-h4 font-weight-bold">Регистрация</h2>
          <p class="text-subtitle-2 text-medium-emphasis mt-2">Создайте аккаунт для доступа</p>
        </div>

        <v-form @submit.prevent="handleSubmit">
          <AppInput
            v-model="email"
            type="email"
            label="Email"
            placeholder="name@company.com"
            icon="mdi-email"
            :rules="[v => !!v || 'Введите email', v => /.+@.+\..+/.test(v) || 'Некорректный email']"
            required
          />

          <AppInput
            v-model="password"
            type="password"
            label="Пароль"
            placeholder="••••••••"
            icon="mdi-lock"
            :rules="[v => !!v || 'Введите пароль', v => (v && v.length >= 6) || 'Минимум 6 символов']"
            required
          />

          <v-btn
            type="submit"
            color="success"
            block
            size="large"
            class="mt-4 mb-4"
            :loading="isLoading"
          >
            {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </v-btn>
        </v-form>

        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4">
          {{ error }}
        </v-alert>

        <v-alert
          v-if="registrationSuccess"
          type="success"
          variant="tonal"
          density="comfortable"
          class="mb-4"
          border="start"
        >
          <strong>Регистрация успешна!</strong><br>
          Ваша учетная запись ожидает подтверждения администратором.<br>
          После подтверждения вы сможете войти в систему.
        </v-alert>

        <div class="text-center text-body-2 text-medium-emphasis">
          Уже есть аккаунт?
          <router-link to="/login" class="text-success font-weight-medium text-decoration-none">
            Войти
          </router-link>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppInput from '@/components/ui/AppInput.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)
const registrationSuccess = ref(false)

async function handleSubmit() {
  isLoading.value = true
  error.value = null
  registrationSuccess.value = false
  try {
    await authStore.register({ email: email.value, password: password.value })
    registrationSuccess.value = true
    authStore.logout()
  } catch (e: any) {
    error.value = authStore.error
  } finally {
    isLoading.value = false
  }
}
</script>
