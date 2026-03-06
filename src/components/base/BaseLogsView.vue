<template>
  <v-card color="grey-darken-4">
    <v-card-title class="d-flex justify-space-between align-center py-3 px-4 bg-grey-darken-3">
      <div class="d-flex align-center">
        <div class="d-flex me-2">
          <span class="rounded-circle bg-error d-inline-block" style="width: 12px; height: 12px;" />
          <span class="rounded-circle bg-warning d-inline-block mx-1" style="width: 12px; height: 12px;" />
          <span class="rounded-circle bg-success d-inline-block" style="width: 12px; height: 12px;" />
        </div>
        <span class="text-subtitle-2 font-weight-bold text-success">Консоль 1С</span>
      </div>
      <BaseStatusBadge v-if="status" :status="status" :show-dot="false" />
    </v-card-title>
    <v-card-text :style="{ height: height || '120px' }" class="overflow-y-auto bg-black font-mono text-success py-3 px-4">
      <pre class="text-body-2 mb-0" style="white-space: pre-wrap; word-break: break-word;">{{ log || 'Ожидание логов...' }}</pre>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { BaseStatus } from '@/api/bases'
import BaseStatusBadge from './BaseStatusBadge.vue'

defineProps<{
  log?: string
  status?: BaseStatus
  height?: string
}>()
</script>

<style scoped>
.font-mono {
  font-family: 'Courier New', Courier, monospace;
}
</style>
