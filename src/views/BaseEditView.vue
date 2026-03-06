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
              <v-alert type="warning" variant="tonal" density="compact" class="mb-4">
                <strong>Внимание!</strong> Основные поля базы недоступны для редактирования
              </v-alert>

              <!-- Информация о базе -->
              <div class="mb-6">
                <div class="text-subtitle-2 text-medium-emphasis mb-1">Название базы</div>
                <div class="text-body-1 mb-3">{{ base?.name }}</div>

                <div class="text-subtitle-2 text-medium-emphasis mb-1">Путь к серверу</div>
                <div class="text-body-1 mb-3">{{ base?.serverPath }}</div>
              </div>

              <v-row>
                <v-col cols="6">
                  <AppInput
                    v-model="form.adminUser"
                    label="Пользователь 1С"
                    placeholder="Admin"
                    icon="mdi-account"
                    :rules="[]"
                    hint="Необязательно для первого восстановления"
                  />
                </v-col>
                <v-col cols="6">
                  <AppInput
                    v-model="form.adminPass"
                    type="password"
                    label="Пароль 1С"
                    placeholder="•••••• (оставьте пустым, чтобы не менять)"
                    icon="mdi-lock"
                    :rules="[]"
                    hint="Необязательно для первого восстановления"
                  />
                </v-col>
              </v-row>

              <div class="text-subtitle-2 text-medium-emphasis mb-1 mt-4">Описание</div>
              <AppInput
                v-model="form.description"
                label="Описание"
                placeholder="Бухгалтерия предприятия"
                icon="mdi-text-box"
                :rules="[]"
              />

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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBasesStore } from '@/stores/bases'
import type { Base1C, CreateBaseRequest } from '@/api/bases'
import AppInput from '@/components/ui/AppInput.vue'
import FileUploader from '@/components/base/FileUploader.vue'

const route = useRoute()
const router = useRouter()
const basesStore = useBasesStore()

const formRef = ref<HTMLFormElement | null>(null)
const baseId = ref(Number(route.params.id))
const base = ref<Base1C | null>(null)

const form = reactive({
  description: '',
  adminUser: '',
  adminPass: '',
})

const selectedFile = ref<File | null>(null)
const isSubmitting = ref(false)

onMounted(async () => {
  const fetchedBase = await basesStore.fetchBaseById(baseId.value)
  if (fetchedBase) {
    base.value = fetchedBase
    form.description = fetchedBase.description || ''
    form.adminUser = fetchedBase.adminUser || ''
    form.adminPass = '' // Пароль не загружаем из соображений безопасности
  }
})

async function handleSubmit() {
  if (!formRef.value) return

  isSubmitting.value = true
  try {
    // Отправляем adminUser/adminPass только если пароль был изменен
    const updateData: Partial<CreateBaseRequest> = {
      description: form.description,
      adminUser: form.adminUser,
    }
    if (form.adminPass) {
      updateData.adminPass = form.adminPass
    }
    
    await basesStore.updateBase(baseId.value, updateData, selectedFile.value || undefined)
    router.push(`/bases/${baseId.value}`)
  } catch (e) {
    // Ошибка уже установлена в store
  } finally {
    isSubmitting.value = false
  }
}
</script>
