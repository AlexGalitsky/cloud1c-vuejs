<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">
        {{ base ? 'Редактирование базы' : 'Новая база' }}
      </h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Название базы
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="serverPath">
            Путь к серверу (Server/Base)
          </label>
          <input
            id="serverPath"
            v-model="form.serverPath"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Server/Base"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="adminUser">
            Пользователь 1С
          </label>
          <input
            id="adminUser"
            v-model="form.adminUser"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="adminPass">
            Пароль 1С
          </label>
          <input
            id="adminPass"
            v-model="form.adminPass"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Файл .dt
          </label>
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer"
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
              <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="font-medium">{{ selectedFile.name }}</p>
              <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
            <div v-else :class="{ 'border-blue-500': isDragging }" class="text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p>Перетащите файл .dt сюда или кликните для выбора</p>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {{ isSubmitting ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
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
