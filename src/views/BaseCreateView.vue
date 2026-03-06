<template>
  <div class="min-vh-100 bg-background">
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" max-width="600">
          <v-card elevation="2">
            <v-card-title class="pa-6">
              <div class="d-flex align-center ga-3">
                <v-btn variant="text" icon="mdi-arrow-left" @click="$router.back()" />
                <h1 class="text-h5 font-weight-bold">Новая база 1С</h1>
              </div>
            </v-card-title>

            <v-card-text class="pa-6">
              <v-form @submit.prevent="handleSubmit" ref="formRef">
                <AppInput
                  v-model="form.name"
                  label="Название базы"
                  placeholder="MyBase"
                  icon="mdi-text"
                  :rules="[rules.required, rules.nameFormat]"
                  required
                  hint="Только английские буквы и цифры, должно начинаться с буквы"
                />

                <AppInput
                  v-model="form.description"
                  label="Описание (необязательно)"
                  placeholder="Бухгалтерия предприятия"
                  icon="mdi-text-box"
                  :rules="[]"
                />

                <v-alert type="info" variant="tonal" density="compact" class="mt-4">
                  <strong>Путь к серверу:</strong> будет сформирован автоматически<br>
                  <span class="text-caption">{{ clusterAddress }}/{{ form.name || '...' }}</span>
                </v-alert>

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
                Создать
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBasesStore } from '@/stores/bases'
import AppInput from '@/components/ui/AppInput.vue'
import type { CreateBaseRequest } from '@/api/bases'

const router = useRouter()
const basesStore = useBasesStore()

const formRef = ref<HTMLFormElement | null>(null)

const form = reactive<CreateBaseRequest>({
  name: '',
  description: '',
})

const isSubmitting = ref(false)

const clusterAddress = computed(() => {
  return import.meta.env.VITE_CLUSTER_ADDRESS || '192.168.1.104'
})

const rules = {
  required: (v: string) => !!v || 'Обязательное поле',
  nameFormat: (v: string) => {
    if (!v) return true
    const regex = /^[a-zA-Z][a-zA-Z0-9]*$/
    return regex.test(v) || 'Название должно начинаться с английской буквы и содержать только английские буквы и цифры'
  },
}

async function handleSubmit() {
  if (!formRef.value) return

  isSubmitting.value = true
  try {
    const newBase = await basesStore.createBase(form)
    router.push(`/bases/${newBase.id}`)
  } catch (e) {
    // Ошибка уже установлена в store
  } finally {
    isSubmitting.value = false
  }
}
</script>
