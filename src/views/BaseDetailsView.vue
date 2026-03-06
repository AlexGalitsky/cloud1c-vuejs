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
                  <v-btn
                    v-if="base"
                    color="success"
                    prepend-icon="mdi-cloud-upload"
                    :loading="isPublishing"
                    @click="handlePublish"
                  >
                    Опубликовать
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
            <v-card elevation="2">
              <v-card-title class="pa-4">
                <div class="d-flex align-center justify-space-between w-100">
                  <v-icon icon="mdi-file-multiple" />
                  <span class="text-subtitle-1 font-weight-bold">Файлы .dt (версии)</span>
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    size="small"
                    @click="showUploadDialog = true"
                  >
                    DT
                  </v-btn>
                </div>
              </v-card-title>
              <v-card-text class="pa-0">
                <DtFilesList
                  :files="dtFiles"
                  :applying-id="applyingId"
                  @apply="handleApplyFile"
                  @delete="handleDeleteFile"
                />
              </v-card-text>
            </v-card>

            <!-- Upload DT Dialog -->
            <v-dialog v-model="showUploadDialog" max-width="500">
              <v-card>
                <v-card-title class="pa-4">
                  <span class="text-h6 font-weight-bold">Загрузить файл .dt</span>
                </v-card-title>
                <v-card-text class="pa-4">
                  <FileUploader
                    v-model="selectedDtFile"
                    label="Файл .dt"
                    accept=".dt"
                    placeholder="Перетащите файл .dt сюда"
                    hint="или кликните для выбора"
                  />
                </v-card-text>
                <v-card-actions class="pa-4">
                  <v-spacer />
                  <v-btn variant="outlined" @click="showUploadDialog = false">
                    Отмена
                  </v-btn>
                  <v-btn
                    color="primary"
                    :loading="isUploading"
                    :disabled="!selectedDtFile"
                    @click="handleUploadDt"
                  >
                    Загрузить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Apply DT Dialog -->
            <v-dialog v-model="showApplyDialog" max-width="500">
              <v-card>
                <v-card-title class="pa-4">
                  <span class="text-h6 font-weight-bold">Применить файл .dt</span>
                </v-card-title>
                <v-card-text class="pa-4">
                  <p class="text-body-2 mb-4">
                    Для применения файла .dt введите учетные данные 1С
                  </p>
                  <AppInput
                    v-model="applyForm.adminUser"
                    label="Пользователь 1С"
                    placeholder="Admin"
                    icon="mdi-account"
                    class="mb-3"
                  />
                  <AppInput
                    v-model="applyForm.adminPass"
                    type="password"
                    label="Пароль 1С"
                    placeholder="••••••"
                    icon="mdi-lock"
                  />
                </v-card-text>
                <v-card-actions class="pa-4">
                  <v-spacer />
                  <v-btn variant="outlined" @click="showApplyDialog = false">
                    Отмена
                  </v-btn>
                  <v-btn
                    color="primary"
                    :loading="isApplying"
                    @click="confirmApply"
                  >
                    Применить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
import FileUploader from '@/components/base/FileUploader.vue'
import AppInput from '@/components/ui/AppInput.vue'

const route = useRoute()
const basesStore = useBasesStore()

const baseId = computed(() => Number(route.params.id))
const base = computed(() => basesStore.currentBase)
const dtFiles = computed(() => basesStore.dtFiles)
const isPolling = computed(() => basesStore.isPolling)
const applyingId = ref<number | null>(null)

// Dialog states
const showUploadDialog = ref(false)
const showApplyDialog = ref(false)
const showPublishDialog = ref(false)
const selectedDtFile = ref<File | null>(null)
const isUploading = ref(false)
const isApplying = ref(false)
const isPublishing = ref(false)
const applyForm = ref({ adminUser: '', adminPass: '' })
const pendingApplyId = ref<number | null>(null)

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

async function handleUploadDt() {
  if (!selectedDtFile.value) return
  
  isUploading.value = true
  try {
    await basesStore.uploadDt(baseId.value, selectedDtFile.value)
    await basesStore.fetchDtFiles(baseId.value)
    showUploadDialog.value = false
    selectedDtFile.value = null
  } catch (e) {
    // Ошибка уже установлена в store
  } finally {
    isUploading.value = false
  }
}

async function handleApplyFile(id: number) {
  // Проверяем нужно ли запрашивать логин/пароль
  // IB_USER_PASS_REQUIRED=true И is_empty=false => показываем диалог
  const ibUserPassRequired = import.meta.env.VITE_IB_USER_PASS_REQUIRED === 'true'
  const isEmpty = base.value?.isEmpty ?? true
  
  if (ibUserPassRequired && !isEmpty) {
    // Показываем диалог ввода логина/пароля
    pendingApplyId.value = id
    applyForm.value = { adminUser: '', adminPass: '' }
    showApplyDialog.value = true
  } else {
    // Сразу применяем без логина/пароля (не передаем их вообще)
    await doApply(id, undefined, undefined)
  }
}

async function confirmApply() {
  if (!pendingApplyId.value) return
  // Передаем логин/пароль только если они были введены
  const data = {
    adminUser: applyForm.value.adminUser || undefined,
    adminPass: applyForm.value.adminPass || undefined,
  }
  await doApply(pendingApplyId.value, data.adminUser, data.adminPass)
}

async function doApply(id: number, adminUser?: string, adminPass?: string) {
  applyingId.value = id
  isApplying.value = true
  showApplyDialog.value = false
  
  try {
    // Передаем логин/пароль только если оба указаны
    const applyData = (adminUser && adminPass) ? { adminUser, adminPass } : undefined
    await basesStore.applyDtFile(baseId.value, id, applyData)
    // Обновляем список файлов после применения
    setTimeout(async () => {
      await basesStore.fetchDtFiles(baseId.value)
      applyingId.value = null
    }, 2000)
  } catch (e) {
    applyingId.value = null
  } finally {
    isApplying.value = false
  }
}

async function handleDeleteFile(id: number) {
  if (confirm('Вы уверены, что хотите удалить этот файл?')) {
    await basesStore.deleteDtFile(baseId.value, id)
  }
}

async function handlePublish() {
  if (!confirm('Опубликовать базу на веб-сервере?')) return
  
  isPublishing.value = true
  try {
    await basesStore.publishBase(baseId.value)
    // Обновляем информацию о базе после публикации
    await basesStore.fetchBaseById(baseId.value)
  } catch (e) {
    // Ошибка уже установлена в store
  } finally {
    isPublishing.value = false
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
