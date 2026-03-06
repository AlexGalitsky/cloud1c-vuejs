<template>
  <div class="pb-4">
    <label v-if="label" :for="inputId" class="block mb-2 text-sm font-medium text-[#111827]">
      {{ label }}
    </label>

    <div class="relative text-gray-400">
      <!-- Иконка слева -->
      <span class="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
        <slot v-if="$slots.icon" name="icon" />
        <svg v-else-if="icon === 'email'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail">
          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
        <svg v-else-if="icon === 'password'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-asterisk">
          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
          <path d="M12 8v8"></path>
          <path d="m8.5 14 7-4"></path>
          <path d="m8.5 10 7 4"></path>
        </svg>
        <svg v-else-if="icon === 'user'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <svg v-else-if="icon === 'server'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-server">
          <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
          <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
          <line x1="6" x2="6.01" y1="6" y2="6"></line>
          <line x1="6" x2="6.01" y1="18" y2="18"></line>
        </svg>
        <svg v-else-if="icon === 'search'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <svg v-else-if="icon === 'text'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text">
          <path d="M17 6.1H3"></path>
          <path d="M21 12.1H3"></path>
          <path d="M15.1 18H3"></path>
        </svg>
        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      </span>

      <!-- Поле ввода -->
      <input
        :id="inputId"
        :type="computedType"
        v-model="model"
        v-bind="$attrs"
        :placeholder="placeholder"
        :required="required"
        :minlength="minlength"
        :disabled="disabled"
        class="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4 disabled:bg-gray-100 disabled:cursor-not-allowed"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
        @change="$emit('change', $event)"
      />

      <!-- Кнопка показа пароля -->
      <button
        v-if="type === 'password'"
        type="button"
        tabindex="-1"
        class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        @click="showPassword = !showPassword"
      >
        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye">
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off">
          <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path>
          <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path>
          <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path>
          <path d="m2 2 20 20"></path>
        </svg>
      </button>
    </div>

    <!-- Текст подсказки или ошибки -->
    <p v-if="hint || error" :class="['text-xs mt-1', error ? 'text-red-500' : 'text-gray-500']">
      {{ error || hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';

export type InputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
export type IconName = 'email' | 'password' | 'user' | 'server' | 'text' | 'search';

export interface AppInputProps {
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

const model = defineModel<string>({ required: false });

const props = withDefaults(defineProps<AppInputProps>(), {
  type: 'text',
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  change: [event: Event];
}>();

defineSlots<{
  icon?: () => any;
}>();

defineOptions({
  inheritAttrs: false,
});

const generatedId = useId();
const inputId = computed(() => props.id || generatedId);
const showPassword = ref(false);
const computedType = computed(() => props.type === 'password' && showPassword.value ? 'text' : props.type);
</script>
