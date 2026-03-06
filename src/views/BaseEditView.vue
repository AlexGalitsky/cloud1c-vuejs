<template>
  <div class="min-vh-100 bg-background">
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" max-width="600">
          <v-card elevation="2">
            <v-card-title class="pa-6">
              <div class="d-flex align-center ga-3">
                <v-btn variant="text" icon="mdi-arrow-left" @click="$router.back()" />
                <h1 class="text-h5 font-weight-bold">Редактирование базы</h1>
              </div>
            </v-card-title>

            <v-card-text class="pa-6">
              <v-form @submit.prevent="handleSubmit" ref="formRef">
                <AppInput
                  v-model="form.name"
                  label="Название базы"
                  placeholder="Бухгалтерия"
                  icon="mdi-text"
                  :rules="[(v: string) => !!v || 'Введите название']"
                  required
                />

                <AppInput
                  v-model="form.serverPath"
                  label="Путь к серверу"
                  placeholder="Server/Base"
                  icon="mdi-server"
                  :rules="[(v: string) => !!v || 'Введите путь']"
                  required
                />

                <v-row>
                  <v-col cols="6">
                    <AppInput
                      v-model="form.adminUser"
                      label="Пользователь 1С"
                      placeholder="Admin"
                      icon="mdi-account"
                      :rules="[(v: string) => !!v || 'Введите пользователя']"
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
                      :rules="[(v: string) => !!v || 'Введите пароль']"
                      required
                    />
                  </v-col>
                </v-row>

                <FileUploader
                  v-model="selectedFile"
                  label="Новый файл .dt (необязательно)"
                  accept=".dt"
                  placeholder="Перетащите файл .dt сюда"
                  hint="Оставьте пустым, чтобы не менять файл"
                />

                <v-alert
                  v-if="basesStore.error"
                  type="error"
                  variant="tonal"
                  density="compact"
                  class="mt-4"
                >
                  {{ basesStore.error }}
                </v-alert>
              </v-form>
            </v-card-text>

            <v-card-actions class="pa-6 pt-0">
              <v-btn variant="outlined" @click="$router.back()">
                Отмена
              </v-btn>
              <v-spacer />
              <v-btn color="primary" :loading="isSubmitting" @click="handleSubmit">
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBasesStore } from '@/stores/bases'
import AppInput from '@/components/ui/AppInput.vue'
import FileUploader from '@/components/base/FileUploader.vue'
import type { CreateBaseRequest } from '@/api/bases'

const route = useRoute()
const router = useRouter()
const basesStore = useBasesStore()

const formRef = ref<HTMLFormElement | null>(null)
const baseId = ref(Number(route.params.id))

const form = reactive<CreateBaseRequest>({
  name: '',
  serverPath: '',
  adminUser: '',
  adminPass: '',
})

const selectedFile = ref<File | null>(null)
const isSubmitting = ref(false)

onMounted(async () => {
  const base = await basesStore.fetchBaseById(baseId.value)
  if (base) {
    form.name = base.name
    form.serverPath = base.serverPath
    form.adminUser = base.adminUser
    form.adminPass = '' // Пароль не загружаем из соображений безопасности
  }
})

async function handleSubmit() {
  if (!formRef.value) return

  isSubmitting.value = true
  try {
    await basesStore.updateBase(baseId.value, form, selectedFile.value || undefined)
    router.push(`/bases/${baseId.value}`)
  } catch (e) {
    // Ошибка уже установлена в store
  } finally {
    isSubmitting.value = false
  }
}
</script>
