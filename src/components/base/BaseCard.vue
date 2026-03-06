<template>
  <div class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center gap-3">
        <div
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center',
            statusIconClasses[base.status],
          ]"
        >
          <svg v-if="base.status === 'ready'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="base.status === 'processing'" class="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-[#4B5563]">{{ base.name }}</h3>
          <BaseStatusBadge :status="base.status" />
        </div>
      </div>
    </div>

    <div class="space-y-3 mb-4">
      <div class="flex items-start gap-2 text-sm">
        <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
        <div>
          <span class="text-[#6B7280]">Сервер:</span>
          <span class="text-[#111827] font-medium ml-1">{{ base.serverPath }}</span>
        </div>
      </div>
      <div class="flex items-start gap-2 text-sm">
        <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <div>
          <span class="text-[#6B7280]">Пользователь:</span>
          <span class="text-[#111827] font-medium ml-1">{{ base.adminUser }}</span>
        </div>
      </div>
    </div>

    <BaseLogsView :log="base.lastLog" :status="base.status" height="h-20" class="mb-4" />

    <div class="flex gap-2 pt-4 border-t border-gray-100">
      <AppButton variant="outline" size="sm" class="flex-1" @click="$emit('edit')">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10Z"></path>
            <path d="M15 3v4a2 2 0 0 0 2 2h4"></path>
            <path d="m9 15 6-6"></path>
            <path d="m15 9-6 6"></path>
          </svg>
        </template>
        Изменить
      </AppButton>
      <AppButton variant="secondary" size="sm" class="flex-1" @click="$emit('delete')">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </template>
        Удалить
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Base1C } from '@/api/bases';
import AppButton from '@/components/ui/AppButton.vue';
import BaseStatusBadge from '@/components/base/BaseStatusBadge.vue';
import BaseLogsView from '@/components/base/BaseLogsView.vue';

defineProps<{
  base: Base1C;
}>();

defineEmits<{
  edit: [];
  delete: [];
}>();

const statusIconClasses: Record<Base1C['status'], string> = {
  ready: 'bg-green-500',
  processing: 'bg-yellow-500',
  error: 'bg-red-500',
};
</script>
