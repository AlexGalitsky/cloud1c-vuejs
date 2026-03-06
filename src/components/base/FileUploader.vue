<template>
  <div>
    <label v-if="label" class="block text-sm font-semibold text-gray-700 mb-2">
      {{ label }}
    </label>
    <div
      :class="[
        'border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer',
        'hover:border-purple-400 hover:bg-purple-50',
        isDragging ? 'border-purple-400 bg-purple-50' : 'border-gray-300',
        hasFile ? 'border-green-400 bg-green-50 hover:border-green-400 hover:bg-green-50' : '',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="$refs.fileInput.click()"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        class="hidden"
        :disabled="disabled"
        @change="handleFileSelect"
      />

      <div v-if="file" class="text-green-600">
        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="font-semibold">{{ file.name }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ formatFileSize(file.size) }}</p>
        <button
          v-if="!disabled"
          type="button"
          class="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
          @click.stop="clearFile"
        >
          Удалить файл
        </button>
      </div>

      <div v-else class="text-gray-500">
        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p class="font-medium">
          {{ placeholder || 'Перетащите файл сюда' }}
        </p>
        <p class="text-sm mt-1">
          {{ hint || 'или кликните для выбора' }}
        </p>
        <p v-if="accept" class="text-xs text-gray-400 mt-2">
          Допустимые: {{ accept }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = withDefaults(defineProps<{
  modelValue?: File | File[] | null;
  label?: string;
  accept?: string;
  multiple?: boolean;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
}>(), {
  multiple: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [file: File | File[] | null];
}>();

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const file = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue[0] || null;
  }
  return props.modelValue || null;
});

const hasFile = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.length > 0;
  }
  return !!props.modelValue;
});

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function handleDrop(event: DragEvent) {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    emitFile(files[0]);
  }
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (files && files.length > 0) {
    emitFile(files[0]);
  }
}

function emitFile(file: File) {
  if (props.multiple) {
    emit('update:modelValue', [file]);
  } else {
    emit('update:modelValue', file);
  }
}

function clearFile() {
  emit('update:modelValue', null);
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}
</script>
