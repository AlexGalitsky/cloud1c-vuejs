<template>
  <v-btn
    :type="type"
    :disabled="disabled || loading"
    :color="color"
    :variant="variant"
    :size="size"
    :block="block"
    v-bind="$attrs"
    @click="handleClick"
  >
    <v-progress-circular v-if="loading" indeterminate size="20" class="me-2" />
    <slot v-else-if="$slots.icon" name="icon" />
    <v-icon v-else-if="icon" :icon="icon" class="me-2" />
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
export type ButtonVariant = 'text' | 'outlined' | 'flat' | 'elevated' | 'tonal' | 'plain'
export type ButtonSize = 'x-small' | 'small' | 'default' | 'large' | 'x-large'

export interface AppButtonProps {
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
  size?: ButtonSize
  color?: string
  disabled?: boolean
  loading?: boolean
  icon?: string
  block?: boolean
}

const props = withDefaults(defineProps<AppButtonProps>(), {
  type: 'button',
  variant: 'elevated',
  size: 'default',
  disabled: false,
  loading: false,
  block: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

defineSlots<{
  default: () => any
  icon?: () => any
}>()

defineOptions({
  inheritAttrs: false,
})

function handleClick(event: MouseEvent) {
  if (props.loading || props.disabled) {
    return
  }
  emit('click', event)
}
</script>
