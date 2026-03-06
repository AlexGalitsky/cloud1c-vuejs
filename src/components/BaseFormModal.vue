<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="glass rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ base ? 'Редактирование базы' : 'Новая база' }}
        </h2>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <UiInput
          v-model="form.name"
          label="Название базы"
          placeholder="Бухгалтерия"
          icon="text"
          required
        />

        <UiInput
          v-model="form.serverPath"
          label="Путь к серверу"
          placeholder="Server/Base"
          icon="server"
          required
        />

        <div class="grid grid-cols-2 gap-4">
          <UiInput
            v-model="form.adminUser"
            label="Пользователь 1С"
            placeholder="Admin"
            icon="user"
            required
          />

          <UiInput
            v-model="form.adminPass"
            type="password"
            label="Пароль 1С"
            placeholder="••••••"
            icon="password"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Файл .dt
          </label>
          <div
            :class="{ 'border-purple-400 bg-purple-50': isDragging }"
            class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="handleDrop"
            @click="$refs.fileInput.click()"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".dt"
              class="hidden"
              @change="handleFileSelect"
            />
            <div v-if="selectedFile" class="text-green-600">
              <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="font-semibold">{{ selectedFile.name }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
            <div v-else class="text-gray-500">
              <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p class="font-medium">Перетащите файл .dt сюда</p>
              <p class="text-sm mt-1">или кликните для выбора</p>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span v-if="!isSubmitting">{{ base ? 'Сохранить' : 'Создать' }}</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Сохранение...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import UiInput from '@/components/UiInput.vue';
import type { Base1C, CreateBaseRequest } from '@/api/bases';

const props = defineProps<{
  base: Base1C | null;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: CreateBaseRequest, dtFile?: File];
}>();

const form = reactive<CreateBaseRequest>({
  name: props.base?.name || '',
  serverPath: props.base?.serverPath || '',
  adminUser: props.base?.adminUser || '',
  adminPass: props.base?.adminPass || '',
});

const selectedFile = ref<File | null>(null);
const isDragging = ref(false);
const isSubmitting = ref(false);

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
    const file = files[0];
    if (file.name.endsWith('.dt')) {
      selectedFile.value = file;
    } else {
      alert('Пожалуйста, выберите файл с расширением .dt');
    }
  }
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file.name.endsWith('.dt')) {
      selectedFile.value = file;
    } else {
      alert('Пожалуйста, выберите файл с расширением .dt');
    }
  }
}

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    emit('submit', { ...form }, selectedFile.value || undefined);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
