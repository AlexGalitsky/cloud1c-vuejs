<template>
  <v-chip :color="chipColor[status]" size="small" class="font-weight-medium">
    <template v-if="showDot">
      <v-avatar :color="dotColor[status]" size="8" class="mr-2" />
    </template>
    {{ text }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BaseStatus } from '@/api/bases'

const props = withDefaults(defineProps<{
  status: BaseStatus
  showDot?: boolean
  customText?: string
}>(), {
  showDot: true
})

const textMap: Record<BaseStatus | 'deleted', string> = {
  ready: 'Готова к работе',
  processing: 'Обработка...',
  error: 'Ошибка',
  deleted: 'На удалении...',
}

const chipColor: Record<BaseStatus | 'deleted', string> = {
  ready: 'success',
  processing: 'warning',
  error: 'error',
  deleted: 'grey',
}

const dotColor: Record<BaseStatus | 'deleted', string> = {
  ready: 'success',
  processing: 'warning',
  error: 'error',
  deleted: 'grey',
}

const text = computed(() => props.customText || textMap[props.status])
</script>
