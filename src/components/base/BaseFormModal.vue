<template>
  <AppModal
    :model-value="modelValue"
    :title="base ? 'Редактирование базы' : 'Новая база'"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="flex flex-col">
      <AppInput
        v-model="form.name"
        label="Название базы"
        placeholder="Бухгалтерия"
        icon="text"
        required
      />

      <AppInput
        v-model="form.serverPath"
        label="Путь к серверу"
        placeholder="Server/Base"
        icon="server"
        required
      />

      <div class="grid grid-cols-2 gap-4">
        <AppInput
          v-model="form.adminUser"
          label="Пользователь 1С"
          placeholder="Admin"
          icon="user"
          required
        />

        <AppInput
          v-model="form.adminPass"
          type="password"
          label="Пароль 1С"
          placeholder="••••••"
          icon="password"
          required
        />
      </div>

      <div class="pb-4">
        <label class="block mb-2 text-sm font-medium text-[#111827]">
          Файл .dt
        </label>
        <FileUploader
          v-model="selectedFile"
          accept=".dt"
          placeholder="Перетащите файл .dt сюда"
          hint="или кликните для выбора"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3">
        <AppButton variant="outline" type="button" @click="$emit('close')">
          Отмена
        </AppButton>
        <AppButton
          type="submit"
          variant="primary"
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          {{ base ? 'Сохранить' : 'Создать' }}
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import AppModal from '@/components/ui/AppModal.vue';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';
import FileUploader from '@/components/base/FileUploader.vue';
import type { Base1C, CreateBaseRequest } from '@/api/bases';

const props = defineProps<{
  modelValue?: boolean;
  base: Base1C | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
  submit: [data: CreateBaseRequest, dtFile?: File];
}>();

const form = reactive<CreateBaseRequest>({
  name: '',
  serverPath: '',
  adminUser: '',
  adminPass: '',
});

const selectedFile = ref<File | null>(null);
const isSubmitting = ref(false);

watch(() => props.base, (base) => {
  if (base) {
    form.name = base.name;
    form.serverPath = base.serverPath;
    form.adminUser = base.adminUser;
    form.adminPass = '';
  } else {
    form.name = '';
    form.serverPath = '';
    form.adminUser = '';
    form.adminPass = '';
  }
  selectedFile.value = null;
}, { immediate: true });

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    emit('submit', { ...form }, selectedFile.value || undefined);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
