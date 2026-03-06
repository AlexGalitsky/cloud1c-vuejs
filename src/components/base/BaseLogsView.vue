<template>
  <div class="bg-gray-900 rounded-xl overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 bg-gray-800">
      <div class="flex items-center gap-2">
        <div class="flex gap-1.5">
          <div class="w-3 h-3 rounded-full bg-red-500" />
          <div class="w-3 h-3 rounded-full bg-yellow-500" />
          <div class="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span class="text-green-400 text-sm font-semibold ml-2">Консоль 1С</span>
      </div>
      <BaseStatusBadge v-if="status" :status="status" :show-dot="false" size="sm" />
    </div>
    <div
      ref="logContainer"
      class="bg-black p-4 font-mono text-sm text-green-400 console-scroll"
      :style="{ height: height }"
    >
      <pre class="whitespace-pre-wrap break-words">{{ log || 'Ожидание логов...' }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseStatusBadge from './BaseStatusBadge.vue';
import type { BaseStatus } from '@/api/bases';

defineProps<{
  log?: string;
  status?: BaseStatus;
  height?: string;
}>();

const logContainer = ref<HTMLElement | null>(null);

// Автопрокрутка вниз при новых логах
watch(() => logContainer.value?.scrollHeight, () => {
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight;
  }
}, { immediate: true });
</script>
