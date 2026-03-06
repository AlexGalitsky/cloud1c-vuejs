<template>
  <div class="min-vh-100 d-flex align-center justify-center bg-background">
    <v-card class="mx-auto" max-width="400" elevation="4">
      <v-card-text class="pa-8">
        <div class="text-center mb-6">
          <v-avatar color="primary" size="64" class="mb-4">
            <v-icon icon="mdi-lock" size="32" color="white" />
          </v-avatar>
          <h2 class="text-h4 font-weight-bold">Вход в систему</h2>
          <p class="text-subtitle-2 text-medium-emphasis mt-2">Облачная 1С</p>
        </div>

        <v-form @submit.prevent="handleSubmit">
          <AppInput
            v-model="email"
            type="email"
            label="Email"
            placeholder="name@company.com"
            icon="mdi-email"
            :rules="[v => !!v || 'Введите email']"
            required
          />

          <AppInput
            v-model="password"
            type="password"
            label="Пароль"
            placeholder="••••••••"
            icon="mdi-lock"
            :rules="[v => !!v || 'Введите пароль']"
            required
          />

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            class="mt-4 mb-4"
            :loading="isLoading"
          >
            {{ isLoading ? 'Вход...' : 'Войти' }}
          </v-btn>
        </v-form>

        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4">
          {{ error }}
        </v-alert>

        <v-alert
          v-if="pendingNotice"
          type="warning"
          variant="tonal"
          density="compact"
          class="mb-4"
          border="start"
        >
          <strong>Учетная запись ожидает подтверждения.</strong><br>
          Обратитесь к администратору для активации аккаунта.
        </v-alert>

        <div class="text-center text-body-2 text-medium-emphasis">
          Нет аккаунта?
          <router-link to="/register" class="text-primary font-weight-medium text-decoration-none">
            Зарегистрироваться
          </router-link>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppInput from '@/components/ui/AppInput.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)
const pendingNotice = ref(false)

async function handleSubmit() {
  isLoading.value = true
  error.value = null
  pendingNotice.value = false
  try {
    const response = await authStore.login({ email: email.value, password: password.value })
    if (response.user.status === 'pending') {
      pendingNotice.value = true
      authStore.logout()
    } else {
      router.push('/dashboard')
    }
  } catch (e: any) {
    error.value = authStore.error
  } finally {
    isLoading.value = false
  }
}
</script>
