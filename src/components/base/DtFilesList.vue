<template>
  <v-card elevation="2">
    <v-card-title class="pa-4">
      <div class="d-flex align-center ga-2">
        <v-icon icon="mdi-file-multiple" />
        <span class="text-subtitle-1 font-weight-bold">Файлы .dt (версии)</span>
      </div>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list v-if="files.length > 0" lines="three" class="pa-0">
        <v-list-item
          v-for="file in files"
          :key="file.id"
          :class="['border-b', file.applied ? 'bg-success bg-opacity-5' : '']"
        >
          <template v-slot:prepend>
            <v-avatar :color="file.applied ? 'success' : 'grey-lighten-3'" size="40">
              <v-icon :color="file.applied ? 'white' : 'grey'" icon="mdi-file-document" />
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-medium">
            {{ file.originalName }}
          </v-list-item-title>

          <v-list-item-subtitle class="mt-1">
            <div class="d-flex flex-wrap ga-4">
              <span class="text-caption">
                <v-icon icon="mdi-calendar" size="12" class="me-1" />
                {{ formatDate(file.createdAt) }}
              </span>
              <span class="text-caption">
                <v-icon icon="mdi-weight" size="12" class="me-1" />
                {{ formatFileSize(file.fileSize) }}
              </span>
              <span v-if="file.lastAppliedAt" class="text-caption">
                <v-icon icon="mdi-history" size="12" class="me-1" />
                Применён: {{ formatDate(file.lastAppliedAt) }}
              </span>
            </div>
          </v-list-item-subtitle>

          <template v-slot:append>
            <div class="d-flex ga-1">
              <v-chip v-if="file.applied" color="success" size="small" class="me-2">
                <v-icon icon="mdi-check" size="12" class="me-1" />
                Актуальный
              </v-chip>

              <v-btn
                icon="mdi-play"
                size="small"
                variant="tonal"
                color="primary"
                :loading="applyingId === file.id"
                :disabled="applyingId !== null || file.applied"
                @click="$emit('apply', file.id)"
              >
                <v-icon icon="mdi-play" size="18" />
              </v-btn>

              <v-btn
                icon="mdi-delete"
                size="small"
                variant="tonal"
                color="error"
                :disabled="applyingId !== null"
                @click="$emit('delete', file.id)"
              >
                <v-icon icon="mdi-delete" size="18" />
              </v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <div v-else class="pa-8 text-center text-medium-emphasis">
        <v-icon icon="mdi-file-off" size="48" class="mb-2" />
        <p>Нет сохранённых файлов .dt</p>
        <p class="text-caption">Файлы будут появляться здесь при создании или обновлении базы</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { DtFile } from '@/api/bases'

defineProps<{
  files: DtFile[]
  applyingId?: number | null
}>()

defineEmits<{
  apply: [id: number]
  delete: [id: number]
}>()

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgb(var(--v-theme-grey-lighten-4));
}
</style>
