<template>
  <div class="glass rounded-2xl shadow-xl p-6 card-hover animate-fade-in border border-gray-100">
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center gap-3">
        <div
          :class="{
            'gradient-success': base.status === 'ready',
            'gradient-warning': base.status === 'processing',
            'gradient-danger': base.status === 'error',
          }"
          class="w-10 h-10 rounded-full flex items-center justify-center"
        >
          <svg v-if="base.status === 'ready'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="base.status === 'processing'" class="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-800">{{ base.name }}</h3>
          <span
            :class="{
              'bg-green-100 text-green-700': base.status === 'ready',
              'bg-yellow-100 text-yellow-700': base.status === 'processing',
              'bg-red-100 text-red-700': base.status === 'error',
            }"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
          >
            <span v-if="base.status === 'processing'" class="w-1.5 h-1.5 bg-yellow-500 rounded-full pulse-dot"></span>
            {{ statusText }}
          </span>
        </div>
      </div>
    </div>

    <div class="space-y-3 mb-4">
      <div class="flex items-start gap-2 text-sm">
        <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
        <div>
          <span class="text-gray-500">Сервер:</span>
          <span class="text-gray-700 font-medium ml-1">{{ base.serverPath }}</span>
        </div>
      </div>
      <div class="flex items-start gap-2 text-sm">
        <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <div>
          <span class="text-gray-500">Пользователь:</span>
          <span class="text-gray-700 font-medium ml-1">{{ base.adminUser }}</span>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Последний лог</span>
      </div>
      <div class="bg-gray-900 rounded-xl p-3 h-20 overflow-y-auto console-scroll">
        <p class="text-green-400 font-mono text-xs leading-relaxed">{{ base.lastLog || 'Нет логов' }}</p>
      </div>
    </div>

    <div class="flex gap-2 pt-4 border-t border-gray-100">
      <button
        @click="$emit('edit')"
        class="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-purple-700 px-4 py-2.5 rounded-xl font-medium hover:bg-purple-100 transition-all"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Изменить
      </button>
      <button
        @click="$emit('delete')"
        class="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 px-4 py-2.5 rounded-xl font-medium hover:bg-red-100 transition-all"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
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
    ready: 'Готова к работе',
    processing: 'Обработка...',
    error: 'Ошибка',
  };
  return statusMap[props.base.status as keyof typeof statusMap];
});
</script>
