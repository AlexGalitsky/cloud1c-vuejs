<template>
  <v-dialog v-model="model" max-width="600" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center pa-6">
        <span class="text-h5 font-weight-bold">{{ base ? 'Редактирование базы' : 'Новая база' }}</span>
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12">
              <AppInput
                v-model="form.name"
                label="Название базы"
                placeholder="Бухгалтерия"
                icon="mdi-text"
                :rules="[v => !!v || 'Введите название']"
                required
              />
            </v-col>
            <v-col cols="12">
              <AppInput
                v-model="form.serverPath"
                label="Путь к серверу"
                placeholder="Server/Base"
                icon="mdi-server"
                :rules="[v => !!v || 'Введите путь']"
                required
              />
            </v-col>
            <v-col cols="6">
              <AppInput
                v-model="form.adminUser"
                label="Пользователь 1С"
                placeholder="Admin"
                icon="mdi-account"
                :rules="[v => !!v || 'Введите пользователя']"
                required
              />
            </v-col>
            <v-col cols="6">
              <AppInput
                v-model="form.adminPass"
                type="password"
                label="Пароль 1С"
                placeholder="••••••"
                icon="mdi-lock"
                :rules="[v => !!v || 'Введите пароль']"
                required
              />
            </v-col>
            <v-col cols="12">
              <label class="text-body-2 font-weight-medium mb-2 d-block">Файл .dt</label>
              <FileUploader
                v-model="selectedFile"
                accept=".dt"
                placeholder="Перетащите файл .dt сюда"
                hint="или кликните для выбора"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-spacer />
        <v-btn variant="outlined" @click="close">
          Отмена
        </v-btn>
        <v-btn color="primary" :loading="isSubmitting" @click="handleSubmit">
          {{ base ? 'Сохранить' : 'Создать' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import FileUploader from '@/components/base/FileUploader.vue'
import type { Base1C, CreateBaseRequest } from '@/api/bases'

const props = defineProps<{
  modelValue?: boolean
  base: Base1C | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  submit: [data: CreateBaseRequest, dtFile?: File]
}>()

const model = ref(props.modelValue || false)
watch(() => props.modelValue, (val) => model.value = val)
watch(model, (val) => emit('update:modelValue', val))

const form = reactive<CreateBaseRequest>({
  name: '',
  serverPath: '',
  adminUser: '',
  adminPass: '',
})

const selectedFile = ref<File | null>(null)
const isSubmitting = ref(false)

watch(() => props.base, (base) => {
  if (base) {
    form.name = base.name
    form.serverPath = base.serverPath
    form.adminUser = base.adminUser
    form.adminPass = ''
  } else {
    form.name = ''
    form.serverPath = ''
    form.adminUser = ''
    form.adminPass = ''
  }
  selectedFile.value = null
}, { immediate: true })

function close() {
  emit('close')
  model.value = false
}

async function handleSubmit() {
  isSubmitting.value = true
  try {
    emit('submit', { ...form }, selectedFile.value || undefined)
  } finally {
    isSubmitting.value = false
  }
}
</script>
