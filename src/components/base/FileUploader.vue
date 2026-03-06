<template>
  <div
    :class="[
      'border-2 border-dashed rounded-lg pa-6 text-center cursor-pointer transition-swing',
      isDragging ? 'border-primary bg-primary bg-opacity-5' : 'border-grey-lighten-2',
      hasFile ? 'border-success bg-success bg-opacity-5' : '',
    ]"
    @dragover.prevent="isDragging = true"
    @dragleave="isDragging = false"
    @drop.prevent="handleDrop"
    @click="fileInput?.click()"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      class="d-none"
      :disabled="disabled"
      @change="handleFileSelect"
    />

    <div v-if="file" class="text-success">
      <v-icon icon="mdi-check-circle" size="64" class="mb-3" />
      <p class="text-body-1 font-weight-bold mb-1">{{ file.name }}</p>
      <p class="text-body-2 text-medium-emphasis mb-2">{{ formatFileSize(file.size) }}</p>
      <v-btn v-if="!disabled" color="error" variant="text" size="small" @click.stop="clearFile">
        Удалить файл
      </v-btn>
    </div>

    <div v-else class="text-medium-emphasis">
      <v-icon icon="mdi-cloud-upload" size="64" class="mb-3" />
      <p class="text-body-1 font-weight-bold mb-1">
        {{ placeholder || 'Перетащите файл сюда' }}
      </p>
      <p class="text-body-2 mb-2">
        {{ hint || 'или кликните для выбора' }}
      </p>
      <p v-if="accept" class="text-caption">{{ accept }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: File | File[] | null
  label?: string
  accept?: string
  multiple?: boolean
  placeholder?: string
  hint?: string
  disabled?: boolean
}>(), {
  multiple: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [file: File | File[] | null]
}>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const file = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue[0] || null
  }
  return props.modelValue || null
})

const hasFile = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.length > 0
  }
  return !!props.modelValue
})

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    emitFile(files[0])
  }
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (files && files.length > 0) {
    emitFile(files[0])
  }
}

function emitFile(file: File | undefined) {
  if (!file) return
  if (props.multiple) {
    emit('update:modelValue', [file])
  } else {
    emit('update:modelValue', file)
  }
}

function clearFile() {
  emit('update:modelValue', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.border-2 {
  border-width: 2px !important;
}

.transition-swing {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.d-none {
  display: none !important;
}
</style>
