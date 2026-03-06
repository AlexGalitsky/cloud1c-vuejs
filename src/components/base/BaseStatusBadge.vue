<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
      statusClasses[status].bg,
      statusClasses[status].text,
    ]"
  >
    <span
      v-if="showDot"
      :class="[
        'w-2 h-2 rounded-full',
        statusClasses[status].dot,
        status === 'processing' ? 'pulse-dot' : '',
      ]"
    />
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BaseStatus } from '@/api/bases';

const props = withDefaults(defineProps<{
  status: BaseStatus;
  showDot?: boolean;
  customText?: string;
}>(), {
  showDot: true,
});

const textMap: Record<BaseStatus, string> = {
  ready: 'Готова к работе',
  processing: 'Обработка...',
  error: 'Ошибка',
};

const statusClasses: Record<BaseStatus, { bg: string; text: string; dot: string }> = {
  ready: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  processing: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  error: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const text = computed(() => props.customText || textMap[props.status]);
</script>
