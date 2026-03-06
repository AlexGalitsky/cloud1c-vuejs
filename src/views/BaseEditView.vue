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

              <div class="text-subtitle-2 text-medium-emphasis mb-1">Описание</div>
              <AppInput
                v-model="form.description"
                label="Описание"
                placeholder="Бухгалтерия предприятия"
                icon="mdi-text-box"
                :rules="[]"
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBasesStore } from '@/stores/bases'
import type { Base1C } from '@/api/bases'
import AppInput from '@/components/ui/AppInput.vue'

const route = useRoute()
const router = useRouter()
const basesStore = useBasesStore()

const baseId = ref(Number(route.params.id))
const base = ref<Base1C | null>(null)

const form = reactive({
  description: '',
})

const isSubmitting = ref(false)

onMounted(async () => {
  const fetchedBase = await basesStore.fetchBaseById(baseId.value)
  if (fetchedBase) {
    base.value = fetchedBase
    form.description = fetchedBase.description || ''
  }
})

async function handleSubmit() {
  isSubmitting.value = true
  try {
    await basesStore.updateBase(baseId.value, form)
    router.push(`/bases/${baseId.value}`)
  } catch (e) {
    // Ошибка уже установлена в store
  } finally {
    isSubmitting.value = false
  }
}
</script>
