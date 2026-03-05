<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-xl font-semibold text-gray-800">{{ base.name }}</h3>
      <span
        :class="{
          'bg-green-500': base.status === 'ready',
          'bg-yellow-500': base.status === 'processing',
          'bg-red-500': base.status === 'error',
        }"
        class="px-3 py-1 rounded-full text-white text-xs font-medium"
      >
        {{ statusText }}
      </span>
    </div>

    <div class="space-y-2 text-sm text-gray-600">
      <p><span class="font-medium">Путь:</span> {{ base.serverPath }}</p>
      <p><span class="font-medium">Пользователь:</span> {{ base.adminUser }}</p>
    </div>

    <div class="mt-4 bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs h-24 overflow-y-auto">
      <p class="truncate">{{ base.lastLog || 'Нет логов' }}</p>
    </div>

    <div class="flex gap-2 mt-4">
      <button
        @click="$emit('edit')"
        class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
      >
        Редактировать
      </button>
      <button
        @click="$emit('delete')"
        class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
      >
        Удалить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Base1C } from '@/api/bases';

const props = defineProps<{
  base: Base1C;
}>();

defineEmits<{
  edit: [];
  delete: [];
}>();

const statusText = computed(() => {
  const statusMap = {
    ready: 'Готова',
    processing: 'Обработка',
    error: 'Ошибка',
  };
  return statusMap[props.base.status as keyof typeof statusMap];
});
</script>
