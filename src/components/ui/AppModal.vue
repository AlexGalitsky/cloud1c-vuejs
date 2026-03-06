<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          @click="closeOnBackdrop && $emit('update:modelValue', false)"
        />

        <!-- Modal Panel -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            :class="[
              'relative glass rounded-2xl shadow-2xl w-full',
              'transform transition-all',
              sizeClasses[size],
            ]"
          >
            <!-- Header -->
            <div v-if="title || $slots.header" class="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 v-if="title" class="text-2xl font-bold text-gray-800">{{ title }}</h2>
              <slot name="header" />
              <button
                v-if="showClose"
                class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
                @click="$emit('update:modelValue', false)"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div :class="['p-6', contentClass]">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

withDefaults(defineProps<{
  modelValue?: boolean;
  title?: string;
  size?: ModalSize;
  showClose?: boolean;
  closeOnBackdrop?: boolean;
  contentClass?: string;
}>(), {
  modelValue: false,
  size: 'md',
  showClose: true,
  closeOnBackdrop: true,
});

defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(-10px);
}
</style>
