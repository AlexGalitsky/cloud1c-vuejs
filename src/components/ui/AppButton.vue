<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    v-bind="$attrs"
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
      sizeClasses[size],
      variantClasses[variant],
      loading ? 'hover:scale-100' : 'hover:scale-[1.02]',
      className,
    ]"
    @click="handleClick"
  >
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

    <!-- Иконка справа (через слот) -->
    <span v-if="$slots['icon-right']" class="shrink-0">
      <slot name="icon-right" />
    </span>
  </button>
</template>

<script setup lang="ts">
export type ButtonVariant = 'primary' | 'success' | 'danger' | 'warning' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIconPath?: string;
  className?: string;
}

const props = withDefaults(defineProps<AppButtonProps>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// Слоты для TypeScript подсказок
defineSlots<{
  default: () => any;
  icon?: () => any;
  'icon-right'?: () => any;
}>();

// Наследуем атрибуты на button элемент
defineOptions({
  inheritAttrs: false,
});

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'gradient-primary text-white hover:shadow-lg',
  success: 'gradient-success text-white hover:shadow-lg',
  danger: 'gradient-danger text-white hover:shadow-lg',
  warning: 'gradient-warning text-white hover:shadow-lg',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

function handleClick(event: MouseEvent) {
  // Дополнительная защита от клика при loading/disabled
  if (props.loading || props.disabled) {
    return;
  }
  emit('click', event);
}
</script>
