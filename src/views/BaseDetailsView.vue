<template>
  <div class="min-vh-100 bg-background">
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" max-width="1200">
          <!-- Header -->
          <v-card class="mb-6" elevation="2">
            <v-card-text class="pa-6">
              <div class="d-flex justify-space-between align-center flex-wrap ga-4">
                <div class="d-flex align-center ga-4">
                  <v-btn variant="text" icon="mdi-arrow-left" @click="$router.push('/dashboard')" />
                  <div>
                    <h1 class="text-h5 font-weight-bold">{{ base?.name || 'Загрузка...' }}</h1>
                    <p class="text-subtitle-2 text-medium-emphasis mb-0">
                      {{ base?.serverPath || '' }}
                    </p>
                  </div>
                </div>
                <div class="d-flex ga-2 flex-wrap">
                  <v-btn
                    v-if="base"
                    variant="outlined"
                    prepend-icon="mdi-pencil"
                    :to="`/bases/${base.id}/edit`"
                  >
                    Редактировать
                  </v-btn>
                  <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="$router.push('/dashboard')">
                    Назад
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Loading -->
          <v-card v-if="basesStore.isLoading" class="pa-12 text-center" elevation="2">
            <v-progress-circular indeterminate color="primary" size="64" class="mb-4" />
            <p class="text-body-1 text-medium-emphasis">Загрузка информации о базе...</p>
          </v-card>

          <!-- Content -->
          <template v-else-if="base">
            <!-- Info Cards -->
            <v-row class="mb-6">
              <v-col cols="12" md="6">
                <v-card elevation="2">
                  <v-card-text class="pa-5">
                    <div class="d-flex align-center mb-3">
                      <v-avatar :color="statusColor[base.status]" size="48" class="me-3">
                        <v-icon v-if="base.status === 'ready'" icon="mdi-check-circle" />
                        <v-icon v-else-if="base.status === 'processing'" icon="mdi-progress-clock" class="animate-spin" />
                        <v-icon v-else icon="mdi-alert-circle" />
                      </v-avatar>
                      <div>
                        <p class="text-subtitle-2 text-medium-emphasis mb-1">Статус</p>
                        <BaseStatusBadge :status="base.status" :show-dot="false" />
                      </div>
                    </div>
                    <v-divider class="mb-3" />
                    <div class="d-flex align-center mb-2">
                      <v-icon icon="mdi-server" size="16" class="me-2 text-medium-emphasis" />
                      <span class="text-body-2 text-medium-emphasis">Сервер:</span>
                      <span class="text-body-2 font-weight-medium ms-1">{{ base.serverPath }}</span>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-account" size="16" class="me-2 text-medium-emphasis" />
                      <span class="text-body-2 text-medium-emphasis">Пользователь:</span>
                      <span class="text-body-2 font-weight-medium ms-1">{{ base.adminUser }}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card elevation="2">
                  <v-card-text class="pa-5">
                    <p class="text-subtitle-2 text-medium-emphasis mb-3">Информация</p>
                    <v-divider class="mb-3" />
                    <div class="d-flex align-center mb-2">
                      <v-icon icon="mdi-identifier" size="16" class="me-2 text-medium-emphasis" />
                      <span class="text-body-2 text-medium-emphasis">ID:</span>
                      <span class="text-body-2 font-weight-medium ms-1">{{ base.id }}</span>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-database" size="16" class="me-2 text-medium-emphasis" />
                      <span class="text-body-2 text-medium-emphasis">Владелец:</span>
                      <span class="text-body-2 font-weight-medium ms-1">{{ base.ownerId }}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Console -->
            <v-card elevation="2" class="mb-6">
              <v-card-title class="pa-4">
                <div class="d-flex align-center ga-2">
                  <div class="d-flex">
                    <span class="rounded-circle bg-error d-inline-block" style="width: 12px; height: 12px;" />
                    <span class="rounded-circle bg-warning d-inline-block mx-1" style="width: 12px; height: 12px;" />
                    <span class="rounded-circle bg-success d-inline-block" style="width: 12px; height: 12px;" />
                  </div>
                  <span class="text-subtitle-1 font-weight-bold">Консоль выполнения</span>
                  <v-chip v-if="isPolling" color="success" size="x-small" class="ms-2">
                    <v-icon icon="mdi-wifi" size="12" class="me-1" />
                    Live
                  </v-chip>
                </div>
              </v-card-title>
              <v-card-text class="pa-0">
                <BaseLogsView :log="base.lastLog" :status="base.status" height="300" />
              </v-card-text>
            </v-card>

            <!-- DT Files -->
            <DtFilesList
              :files="dtFiles"
              :applying-id="applyingId"
              @apply="handleApplyFile"
              @delete="handleDeleteFile"
            />
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBasesStore } from '@/stores/bases'
import BaseStatusBadge from '@/components/base/BaseStatusBadge.vue'
import BaseLogsView from '@/components/base/BaseLogsView.vue'
import DtFilesList from '@/components/base/DtFilesList.vue'

const route = useRoute()
const basesStore = useBasesStore()

const baseId = computed(() => Number(route.params.id))
const base = computed(() => basesStore.currentBase)
const dtFiles = computed(() => basesStore.dtFiles)
const isPolling = computed(() => basesStore.isPolling)
const applyingId = ref<number | null>(null)

const statusColor: Record<string, string> = {
  ready: 'success',
  processing: 'warning',
  error: 'error',
}

onMounted(async () => {
  await basesStore.fetchBaseById(baseId.value)
  await basesStore.fetchDtFiles(baseId.value)
  basesStore.startPollingForBase(baseId.value)
})

onUnmounted(() => {
  basesStore.stopPolling()
  basesStore.setCurrentBase(null)
})

// Обновление при изменении ID в роуте
watch(baseId, async (newId) => {
  basesStore.stopPolling()
  await basesStore.fetchBaseById(newId)
  await basesStore.fetchDtFiles(newId)
  basesStore.startPollingForBase(newId)
})

async function handleApplyFile(id: number) {
  applyingId.value = id
  try {
    await basesStore.applyDtFile(baseId.value, id)
    // Обновляем список файлов после применения
    setTimeout(async () => {
      await basesStore.fetchDtFiles(baseId.value)
      applyingId.value = null
    }, 2000)
  } catch (e) {
    applyingId.value = null
  }
}

async function handleDeleteFile(id: number) {
  if (confirm('Вы уверены, что хотите удалить этот файл?')) {
    await basesStore.deleteDtFile(baseId.value, id)
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
