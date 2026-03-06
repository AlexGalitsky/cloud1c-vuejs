<template>
  <v-container>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4">
          <v-icon class="mr-2" color="primary">mdi-account-group</v-icon>
          Управление пользователями
        </h1>
      </v-col>
      <v-col cols="auto">
        <AppButton variant="outlined" color="secondary" @click="goBack">
          <v-icon start>mdi-arrow-left</v-icon>
          Назад
        </AppButton>
      </v-col>
    </v-row>

    <v-alert v-if="adminStore.error" type="error" variant="tonal" class="mb-4">
      {{ adminStore.error }}
    </v-alert>

    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="adminStore.users"
          :loading="adminStore.isLoading"
          item-value="id"
          class="elevation-0"
        >
          <template #item.email="{ item }">
            <div class="text-body-2 font-weight-medium">{{ item.email }}</div>
          </template>

          <template #item.role="{ item }">
            <v-chip :color="item.role === 'admin' ? 'error' : 'primary'" size="small">
              {{ item.role === 'admin' ? 'Администратор' : 'Пользователь' }}
            </v-chip>
          </template>

          <template #item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" size="small">
              {{ getStatusText(item.status) }}
            </v-chip>
          </template>

          <template #item.confirmedAt="{ item }">
            <span v-if="item.confirmedAt" class="text-body-2">
              {{ formatDate(item.confirmedAt) }}
            </span>
            <span v-else class="text-body-2 text-disabled">—</span>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-tooltip text="Подтвердить" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-if="item.status === 'pending'"
                    v-bind="props"
                    icon="mdi-check-circle"
                    size="small"
                    color="success"
                    variant="text"
                    @click="handleConfirm(item.id)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip :text="item.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :icon="item.status === 'blocked' ? 'mdi-lock-open' : 'mdi-lock'"
                    size="small"
                    :color="item.status === 'blocked' ? 'success' : 'warning'"
                    variant="text"
                    @click="handleBlock(item.id)"
                  />
                </template>
              </v-tooltip>

              <v-tooltip text="Удалить" location="top">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-delete"
                    size="small"
                    color="error"
                    variant="text"
                    @click="handleDelete(item.id)"
                  />
                </template>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/admin';
import AppButton from '@/components/ui/AppButton.vue';

const router = useRouter();
const adminStore = useAdminStore();

const headers = [
  { title: 'Email', key: 'email', align: 'start' },
  { title: 'Роль', key: 'role', align: 'center' },
  { title: 'Статус', key: 'status', align: 'center' },
  { title: 'Подтвержден', key: 'confirmedAt', align: 'center' },
  { title: 'Действия', key: 'actions', align: 'center', sortable: false },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'blocked':
      return 'error';
    default:
      return 'grey';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Активен';
    case 'pending':
      return 'Ожидает';
    case 'blocked':
      return 'Заблокирован';
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU');
};

const handleConfirm = async (id: number) => {
  if (confirm('Подтвердить учетную запись пользователя?')) {
    await adminStore.confirmUser(id);
  }
};

const handleBlock = async (id: number) => {
  const user = adminStore.users.find((u) => u.id === id);
  const action = user?.status === 'blocked' ? 'Разблокировать' : 'Заблокировать';
  if (confirm(`${action} учетную запись пользователя?`)) {
    await adminStore.blockUser(id);
  }
};

const handleDelete = async (id: number) => {
  if (confirm('Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.')) {
    await adminStore.deleteUser(id);
  }
};

const goBack = () => {
  router.push('/dashboard');
};

onMounted(() => {
  adminStore.fetchUsers();
});
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
