<template>
  <AppCard class="card-hover animate-fade-in">
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
          <h3 class="text-lg font-bold text-gray-800">{{ base.name }}</h3>
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

    <BaseLogsView :log="base.lastLog" :status="base.status" height="h-20" class="mb-4" />

    <template #footer>
      <div class="flex gap-2">
        <AppButton variant="secondary" size="sm" class="flex-1" @click="$emit('edit')">
          <template #icon>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </template>
          Изменить
        </AppButton>
        <AppButton variant="danger" size="sm" class="flex-1" @click="$emit('delete')">
          <template #icon>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </template>
          Удалить
        </AppButton>
      </div>
    </template>
  </AppCard>
</template>

<script setup lang="ts">
import type { Base1C } from '@/api/bases';
import AppCard from '@/components/ui/AppCard.vue';
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
  ready: 'gradient-success',
  processing: 'gradient-warning',
  error: 'gradient-danger',
};
</script>
