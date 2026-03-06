<template>
  <div class="min-vh-100 bg-background">
    <v-container fluid class="pa-8">
      <v-row justify="center">
        <v-col cols="12" max-width="1400">
          <v-card class="mb-6" elevation="2">
            <v-card-text class="pa-6">
              <div class="d-flex flex-column flex-md-row justify-space-between align-center ga-4">
                <div class="d-flex align-center ga-4">
                  <v-avatar color="primary" size="56">
                    <v-icon icon="mdi-database" size="28" color="white" />
                  </v-avatar>
                  <div>
                    <h1 class="text-h5 font-weight-bold">Облачная 1С</h1>
                    <p class="text-subtitle-2 text-medium-emphasis mb-0">Управление базами данных</p>
                  </div>
                </div>
                <div class="d-flex ga-2 flex-wrap">
                  <v-btn color="primary" prepend-icon="mdi-plus" @click="showModal = true">
                    Новая база
                  </v-btn>
                  <v-btn variant="outlined" prepend-icon="mdi-logout" @click="logout">
                    Выйти
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-row class="mb-6">
            <v-col cols="12" sm="6" md="3" v-for="(stat, index) in stats" :key="index">
              <v-card elevation="2">
                <v-card-text class="pa-5">
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <p class="text-subtitle-2 text-medium-emphasis mb-1">{{ stat.title }}</p>
                      <p :class="`text-h4 font-weight-bold ${stat.color}`">{{ stat.value }}</p>
                    </div>
                    <v-avatar :color="stat.bg" size="56">
                      <v-icon :color="stat.iconColor" :icon="stat.icon" size="28" />
                    </v-avatar>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-card v-if="basesStore.isLoading" class="pa-12 text-center" elevation="2">
            <v-progress-circular indeterminate color="primary" size="64" class="mb-4" />
            <p class="text-body-1 text-medium-emphasis">Загрузка баз...</p>
          </v-card>

          <v-card v-else-if="basesStore.bases.length === 0" class="pa-12 text-center" elevation="2">
            <v-avatar color="grey-lighten-3" size="80" class="mb-6">
              <v-icon icon="mdi-database-off" size="40" color="grey" />
            </v-avatar>
            <h3 class="text-h6 font-weight-bold mb-2">Нет созданных баз</h3>
            <p class="text-body-2 text-medium-emphasis mb-6">Создайте первую базу 1С для начала работы</p>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="showModal = true">
              Создать базу
            </v-btn>
          </v-card>

          <v-row v-else>
            <v-col
              v-for="base in basesStore.bases"
              :key="base.id"
              cols="12"
              md="6"
              lg="4"
            >
              <BaseCard
                :base="base"
                @edit="openEditModal(base)"
                @delete="handleDelete(base.id)"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <BaseFormModal
      v-model="showModal"
      :base="editingBase"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBasesStore } from '@/stores/bases'
import { useAuthStore } from '@/stores/auth'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseFormModal from '@/components/base/BaseFormModal.vue'
import type { Base1C, CreateBaseRequest } from '@/api/bases'

const router = useRouter()
const basesStore = useBasesStore()
const authStore = useAuthStore()

const showModal = ref(false)
const editingBase = ref<Base1C | null>(null)

const stats = computed(() => [
  { title: 'Всего баз', value: basesStore.totalCount, color: 'text-primary', bg: 'purple-lighten-4', icon: 'mdi-database', iconColor: 'primary' },
  { title: 'Готовы', value: basesStore.readyCount, color: 'text-success', bg: 'green-lighten-4', icon: 'mdi-check-circle', iconColor: 'success' },
  { title: 'В процессе', value: basesStore.processingCount, color: 'text-warning', bg: 'amber-lighten-4', icon: 'mdi-progress-clock', iconColor: 'warning' },
  { title: 'Ошибки', value: basesStore.errorCount, color: 'text-error', bg: 'red-lighten-4', icon: 'mdi-alert-circle', iconColor: 'error' },
])

onMounted(() => {
  loadBases()
  basesStore.startPolling()
})

onUnmounted(() => {
  basesStore.stopPolling()
})

async function loadBases() {
  await basesStore.fetchBases()
}

function openEditModal(base: Base1C) {
  editingBase.value = base
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingBase.value = null
}

async function handleSubmit(data: CreateBaseRequest, dtFile?: File) {
  if (editingBase.value) {
    await basesStore.updateBase(editingBase.value.id, data, dtFile)
  } else {
    await basesStore.createBase(data, dtFile)
  }
  closeModal()
}

async function handleDelete(id: number) {
  if (confirm('Вы уверены, что хотите удалить эту базу?')) {
    await basesStore.deleteBase(id)
  }
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
