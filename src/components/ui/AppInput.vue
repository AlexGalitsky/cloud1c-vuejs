<template>
  <div class="space-y-1.5">
    <!-- Лейбл -->
    <label v-if="label" :for="inputId" class="block text-sm font-semibold text-gray-700">
      {{ label }}
    </label>

    <div class="relative group">
      <!-- Иконка слева (слот или встроенная) -->
      <div
        v-if="$slots.icon || icon"
        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors"
      >
        <slot v-if="$slots.icon" name="icon" />
        <span v-else v-html="iconSvg" />
      </div>

      <!-- Поле ввода -->
      <input
        :id="inputId"
        :type="computedType"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :minlength="minlength"
        :disabled="disabled"
        :class="[
          'block w-full border border-gray-200 rounded-xl',
          'placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
          'transition-all duration-200 shadow-sm',
          ($slots.icon || icon) ? 'pl-12 pr-4' : 'pl-4 pr-4',
          hasPasswordToggle ? 'pr-12' : 'pr-4',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
        ]"
        @input="handleInput"
      />

      <!-- Кнопка показа пароля -->
      <button
        v-if="type === 'password'"
        type="button"
        tabindex="-1"
        class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        @click="showPassword = !showPassword"
      >
        <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
    </div>

    <!-- Текст подсказки или ошибки -->
    <p v-if="hint || error" :class="['text-xs', error ? 'text-red-500' : 'text-gray-500']">
      {{ error || hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

export type InputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
export type IconName = 'email' | 'password' | 'user' | 'server' | 'text' | 'search' | 'phone' | 'link';

export interface AppInputProps {
  modelValue?: string;
  type?: InputType;
  label?: string;
  placeholder?: string;
  icon?: IconName;
  hint?: string;
  error?: string;
  required?: boolean;
  minlength?: number | string;
  disabled?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<AppInputProps>(), {
  modelValue: '',
  type: 'text',
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// Слоты для TypeScript подсказок
defineSlots<{
  icon?: () => any;
}>();

const showPassword = ref(false);

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`);
const computedType = computed(() => props.type === 'password' && showPassword.value ? 'text' : props.type);
const hasPasswordToggle = computed(() => props.type === 'password');

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

const iconSvgs: Record<IconName, string> = {
  email: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>',
  password: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>',
  user: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
  server: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>',
  text: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>',
  search: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>',
  phone: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>',
  link: '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>',
};

const iconSvg = computed(() => iconSvgs[props.icon || 'text']);
</script>
