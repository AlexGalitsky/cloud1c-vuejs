<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <AppCard>
          <template #title>
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-account</v-icon>
              Профиль
            </div>
          </template>

          <div v-if="authStore.user" class="mb-6">
            <div class="text-subtitle-2 text-medium-emphasis mb-1">Email</div>
            <div class="text-body-1 mb-4">{{ authStore.user.email }}</div>

            <div class="text-subtitle-2 text-medium-emphasis mb-1">Роль</div>
            <v-chip :color="authStore.user.role === 'admin' ? 'error' : 'primary'" size="small" class="mb-4">
              {{ authStore.user.role === 'admin' ? 'Администратор' : 'Пользователь' }}
            </v-chip>

            <div class="text-subtitle-2 text-medium-emphasis mb-1">Статус</div>
            <v-chip :color="statusColor" size="small" class="mb-4">
              {{ statusText }}
            </v-chip>

            <div v-if="authStore.user.confirmedAt" class="text-subtitle-2 text-medium-emphasis mb-1">
              Подтвержден
            </div>
            <div v-if="authStore.user.confirmedAt" class="text-body-2 text-disabled mb-4">
              {{ formatDate(authStore.user.confirmedAt) }}
            </div>
          </div>

          <AppDivider class="mb-6">Изменить пароль</AppDivider>

          <v-form @submit.prevent="handleChangePassword">
            <AppInput
              v-model="form.currentPassword"
              label="Текущий пароль"
              type="password"
              :rules="[rules.required]"
              prepend-icon="mdi-lock"
              class="mb-3"
            />

            <AppInput
              v-model="form.newPassword"
              label="Новый пароль"
              type="password"
              :rules="[rules.required, rules.minLength]"
              prepend-icon="mdi-lock"
              class="mb-3"
            />

            <AppInput
              v-model="form.confirmPassword"
              label="Подтвердите новый пароль"
              type="password"
              :rules="[rules.required, rules.match]"
              prepend-icon="mdi-lock"
              class="mb-4"
            />

            <v-alert v-if="error" type="error" variant="tonal" class="mb-4" density="compact">
              {{ error }}
            </v-alert>

            <v-alert v-if="success" type="success" variant="tonal" class="mb-4" density="compact">
              Пароль успешно изменен
            </v-alert>

            <AppButton type="submit" color="primary" block :loading="authStore.isLoading">
              Изменить пароль
            </AppButton>
          </v-form>
        </AppCard>

        <div class="text-center mt-4">
          <AppButton variant="outlined" color="secondary" @click="goBack">
            <v-icon start>mdi-arrow-left</v-icon>
            Назад
          </AppButton>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppCard from '@/components/ui/AppCard.vue';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';
import AppDivider from '@/components/ui/AppDivider.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const error = ref<string | null>(null);
const success = ref(false);

const statusColor = computed(() => {
  if (!authStore.user) return 'grey';
  switch (authStore.user.status) {
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'blocked':
      return 'error';
    default:
      return 'grey';
  }
});

const statusText = computed(() => {
  if (!authStore.user) return '';
  switch (authStore.user.status) {
    case 'active':
      return 'Активен';
    case 'pending':
      return 'Ожидает подтверждения';
    case 'blocked':
      return 'Заблокирован';
    default:
      return '';
  }
});

const rules = {
  required: (v: string) => !!v || 'Обязательное поле',
  minLength: (v: string) => v.length >= 6 || 'Минимум 6 символов',
  match: (v: string) => v === form.value.newPassword || 'Пароли не совпадают',
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU');
};

const handleChangePassword = async () => {
  error.value = null;
  success.value = false;

  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = 'Пароли не совпадают';
    return;
  }

  try {
    await authStore.changePassword(form.value.currentPassword, form.value.newPassword);
    success.value = true;
    form.value.currentPassword = '';
    form.value.newPassword = '';
    form.value.confirmPassword = '';
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Ошибка смены пароля';
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  authStore.fetchProfile();
});
</script>
