<template>
  <div class="bg-gray-900 rounded-lg p-4 font-mono text-sm">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-green-400 font-semibold">Консоль 1С</h3>
      <span
        :class="{
          'text-green-500': status === 'ready',
          'text-yellow-500': status === 'processing',
          'text-red-500': status === 'error',
        }"
        class="text-xs"
      >
        {{ statusText }}
      </span>
    </div>
    <div class="bg-black rounded p-3 h-48 overflow-y-auto text-green-400">
      <pre class="whitespace-pre-wrap">{{ log || 'Ожидание логов...' }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BaseStatus } from '@/api/bases';

const props = defineProps<{
  status: BaseStatus;
  log: string;
}>();

const statusText = computed(() => {
  const statusMap = {
    ready: 'Готово',
    processing: 'Выполняется...',
    error: 'Ошибка',
  };
  return statusMap[props.status as keyof typeof statusMap];
});
</script>
