<template>
  <div class="min-vh-100 bg-background">
    <v-container fluid class="py-8">
      <v-row justify="center">
        <v-col cols="12" max-width="1400">
          <!-- Header -->
          <v-card class="mb-6" elevation="2">
            <v-card-text class="pa-6">
              <div class="d-flex flex-column flex-md-row justify-space-between align-center ga-4">
                <div class="d-flex align-center ga-4">
                  <v-avatar color="primary" size="56">
                    <v-icon icon="mdi-database" size="28" color="white" />
                  </v-avatar>
                  <div>
                    <h1 class="text-h5 font-weight-bold">Облачная 1С</h1>
                    <p class="text-subtitle-2 text-medium-emphasis mb-0">Управление базами данных</p>
                  </div>
                </div>
                <div class="d-flex ga-2 flex-wrap align-center">
                  <!-- Информация о пользователе -->
                  <v-menu>
                    <template #activator="{ props }">
                      <v-btn variant="outlined" v-bind="props">
                        <v-icon start>mdi-account</v-icon>
                        {{ authStore.user?.email }}
                        <v-chip v-if="authStore.user?.status === 'pending'" color="warning" size="x-small" class="ml-2">
                          Ожидает
                        </v-chip>
                        <v-chip v-if="authStore.isAdmin" color="error" size="x-small" class="ml-2">
                          Админ
                        </v-chip>
                        <v-icon end>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item to="/profile" prepend-icon="mdi-account">
                        <v-list-item-title>Профиль</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="authStore.isAdmin"
                        to="/admin"
                        prepend-icon="mdi-account-group"
                      >
                        <v-list-item-title>Пользователи</v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list-item @click="logout" prepend-icon="mdi-logout">
                        <v-list-item-title>Выйти</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  
                  <v-btn v-if="!authStore.isPending" color="primary" prepend-icon="mdi-plus" to="/bases/create">
                    Новая база
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Alert для ожидающих подтверждения -->
          <v-alert
            v-if="authStore.isPending"
            type="warning"
            variant="tonal"
            class="mb-6"
            border="start"
            density="comfortable"
          >
            <div class="text-body-1">
              <strong>Ваша учетная запись ожидает подтверждения.</strong><br>
              После подтверждения администратором вы сможете создавать и управлять базами 1С.
            </div>
          </v-alert>

          <!-- Stats -->
          <v-row class="mb-6">
            <v-col cols="12" sm="6" md="3" v-for="(stat, index) in stats" :key="index">
              <v-card elevation="2">
                <v-card-text class="pa-5">
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <p class="text-subtitle-2 text-medium-emphasis mb-1">{{ stat.title }}</p>
                      <p :class="`text-h4 font-weight-bold ${stat.color}`">{{ stat.value }}</p>
                    </div>
                    <v-avatar :color="stat.bg" size="56">
                      <v-icon :color="stat.iconColor" :icon="stat.icon" size="28" />
                    </v-avatar>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Loading -->
          <v-card v-if="basesStore.isLoading" class="pa-12 text-center" elevation="2">
            <v-progress-circular indeterminate color="primary" size="64" class="mb-4" />
            <p class="text-body-1 text-medium-emphasis">Загрузка баз...</p>
          </v-card>

          <!-- Empty -->
          <v-card v-else-if="basesStore.bases.length === 0" class="pa-12 text-center" elevation="2">
            <v-avatar color="grey-lighten-3" size="80" class="mb-6">
              <v-icon icon="mdi-database-off" size="40" color="grey" />
            </v-avatar>
            <h3 class="text-h6 font-weight-bold mb-2">Нет созданных баз</h3>
            <p class="text-body-2 text-medium-emphasis mb-6">
              {{ authStore.isPending ? 'Дождитесь подтверждения администратора' : 'Создайте первую базу 1С для начала работы' }}
            </p>
            <v-btn
              v-if="!authStore.isPending"
              color="primary"
              prepend-icon="mdi-plus"
              to="/bases/create"
            >
              Создать базу
            </v-btn>
          </v-card>

          <!-- Grid -->
          <v-row v-else>
            <v-col
              v-for="base in basesStore.bases"
              :key="base.id"
              cols="12"
              md="6"
              lg="4"
            >
              <BaseCard
                :base="base"
                @edit="handleEdit(base.id)"
                @delete="handleDelete(base.id)"
                @click="handleClick(base.id)"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBasesStore } from '@/stores/bases'
import { useAuthStore } from '@/stores/auth'
import BaseCard from '@/components/base/BaseCard.vue'

const router = useRouter()
const basesStore = useBasesStore()
const authStore = useAuthStore()

const stats = computed(() => [
  { title: 'Всего баз', value: basesStore.totalCount, color: 'text-primary', bg: 'purple-lighten-4', icon: 'mdi-database', iconColor: 'primary' },
  { title: 'Готовы', value: basesStore.readyCount, color: 'text-success', bg: 'green-lighten-4', icon: 'mdi-check-circle', iconColor: 'success' },
  { title: 'В процессе', value: basesStore.processingCount, color: 'text-warning', bg: 'amber-lighten-4', icon: 'mdi-progress-clock', iconColor: 'warning' },
  { title: 'Ошибки', value: basesStore.errorCount, color: 'text-error', bg: 'red-lighten-4', icon: 'mdi-alert-circle', iconColor: 'error' },
])

onMounted(() => {
  loadBases()
})

async function loadBases() {
  await basesStore.fetchBases()
}

function handleClick(baseId: number) {
  router.push(`/bases/${baseId}`)
}

function handleEdit(baseId: number) {
  router.push(`/bases/${baseId}/edit`)
}

async function handleDelete(baseId: number) {
  const base = basesStore.bases.find(b => b.id === baseId)
  const isEmpty = base?.isEmpty ?? true
  
  let confirmMessage = 'Вы уверены, что хотите удалить эту базу?'
  if (!isEmpty) {
    confirmMessage = 'База активна и содержит данные!\n\nБудут удалены:\n- База из кластера 1С\n- База данных PostgreSQL\n- Все файлы .dt\n- Публикация на веб-сервере\n\nПродолжить?'
  }
  
  if (confirm(confirmMessage)) {
    await basesStore.deleteBase(baseId)
  }
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
