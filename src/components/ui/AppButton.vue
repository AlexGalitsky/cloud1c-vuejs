<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    v-bind="$attrs"
    :class="[
      'w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center',
      'focus:ring-4 focus:outline-hidden',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      className,
    ]"
    @click="handleClick"
  >
    <span class="inline-flex items-center justify-center gap-2">
      <!-- Иконка слева -->
      <span v-if="loading" class="shrink-0">
        <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
      <span v-else-if="$slots.icon" class="shrink-0">
        <slot name="icon" />
      </span>
      <span v-else-if="leftIconPath" class="shrink-0">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="leftIconPath" />
        </svg>
      </span>

      <!-- Контент кнопки -->
      <span class="truncate"><slot /></span>
    </span>
  </button>
</template>

<script setup lang="ts">
export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface AppButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  leftIconPath?: string;
  className?: string;
}

const props = withDefaults(defineProps<AppButtonProps>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

defineSlots<{
  default: () => any;
  icon?: () => any;
}>();

defineOptions({
  inheritAttrs: false,
});

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'text-white bg-[#4F46E5] focus:ring-primary-300 hover:bg-[#4338CA]',
  secondary: 'text-gray-200 bg-gray-600 focus:ring-gray-400 hover:bg-gray-700',
  outline: 'text-gray-600 bg-white border border-gray-300 focus:ring-gray-200 hover:bg-gray-50',
};

function handleClick(event: MouseEvent) {
  if (props.loading || props.disabled) {
    return;
  }
  emit('click', event);
}
</script>
