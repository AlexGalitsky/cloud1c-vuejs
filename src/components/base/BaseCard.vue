<template>
  <v-card class="hover-elevation">
    <v-card-text class="pa-6">
      <div class="d-flex justify-space-between align-start mb-4">
        <div class="d-flex align-center ga-3">
          <v-avatar :color="statusColor[base.status]" size="48">
            <v-icon v-if="base.status === 'ready'" icon="mdi-check-circle" />
            <v-icon v-else-if="base.status === 'processing'" icon="mdi-progress-clock" class="animate-spin" />
            <v-icon v-else icon="mdi-alert-circle" />
          </v-avatar>
          <div>
            <h3 class="text-h6 font-weight-bold">{{ base.name }}</h3>
            <BaseStatusBadge :status="base.status" />
          </div>
        </div>
      </div>

      <div class="mb-4">
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
      </div>

      <BaseLogsView :log="base.lastLog" :status="base.status" class="mb-4" />

      <v-divider class="mb-4" />
      <div class="d-flex ga-2 flex-nowrap">
        <v-btn variant="tonal" size="small" prepend-icon="mdi-pencil" @click="$emit('edit')">
          Изменить
        </v-btn>
        <v-btn color="error" variant="tonal" size="small" prepend-icon="mdi-delete" @click="$emit('delete')">
          Удалить
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Base1C } from '@/api/bases'
import BaseStatusBadge from '@/components/base/BaseStatusBadge.vue'
import BaseLogsView from '@/components/base/BaseLogsView.vue'

defineProps<{
  base: Base1C
}>()

defineEmits<{
  edit: []
  delete: []
}>()

const statusColor: Record<Base1C['status'], string> = {
  ready: 'success',
  processing: 'warning',
  error: 'error',
}
</script>

<style scoped>
.hover-elevation:hover {
  transform: translateY(-4px);
  transition: transform 0.3s ease;
}

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
