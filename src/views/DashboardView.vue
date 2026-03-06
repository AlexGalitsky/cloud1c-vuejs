<template>
  <div class="min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <AppCard class="mb-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Облачная 1С</h1>
              <p class="text-sm text-gray-500">Управление базами данных</p>
            </div>
          </div>
          <div class="flex gap-3">
            <AppButton variant="primary" @click="showModal = true">
              <template #icon>
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </template>
              Новая база
            </AppButton>
            <AppButton variant="secondary" @click="logout">
              <template #icon>
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </template>
              Выйти
            </AppButton>
          </div>
        </div>
      </AppCard>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <AppCard class="!p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Всего баз</p>
              <p class="text-3xl font-bold text-gray-800 mt-1">{{ basesStore.totalCount }}</p>
            </div>
            <div class="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
              <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
        </AppCard>

        <AppCard class="!p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Готовы</p>
              <p class="text-3xl font-bold text-green-600 mt-1">{{ basesStore.readyCount }}</p>
            </div>
            <div class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </AppCard>

        <AppCard class="!p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">В процессе</p>
              <p class="text-3xl font-bold text-yellow-600 mt-1">{{ basesStore.processingCount }}</p>
            </div>
            <div class="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg class="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </AppCard>

        <AppCard class="!p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Ошибки</p>
              <p class="text-3xl font-bold text-red-600 mt-1">{{ basesStore.errorCount }}</p>
            </div>
            <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Loading state -->
      <div v-if="basesStore.isLoading" class="glass rounded-2xl shadow-xl p-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
          <svg class="animate-spin w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-gray-600 font-medium">Загрузка баз...</p>
      </div>

      <!-- Empty state -->
      <AppCard v-else-if="basesStore.bases.length === 0" class="p-12 text-center">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">Нет созданных баз</h3>
        <p class="text-gray-500 mb-6">Создайте первую базу 1С для начала работы</p>
        <AppButton variant="primary" @click="showModal = true">
          <template #icon>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </template>
          Создать базу
        </AppButton>
      </AppCard>

      <!-- Bases grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BaseCard
          v-for="base in basesStore.bases"
          :key="base.id"
          :base="base"
          @edit="openEditModal(base)"
          @delete="handleDelete(base.id)"
        />
      </div>
    </div>

    <!-- Modal -->
    <BaseFormModal
      v-model="showModal"
      :base="editingBase"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBasesStore } from '@/stores/bases';
import { useAuthStore } from '@/stores/auth';
import AppCard from '@/components/ui/AppCard.vue';
import AppButton from '@/components/ui/AppButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseFormModal from '@/components/base/BaseFormModal.vue';
import type { Base1C, CreateBaseRequest } from '@/api/bases';

const router = useRouter();
const basesStore = useBasesStore();
const authStore = useAuthStore();

const showModal = ref(false);
const editingBase = ref<Base1C | null>(null);

onMounted(() => {
  loadBases();
  basesStore.startPolling();
});

onUnmounted(() => {
  basesStore.stopPolling();
});

async function loadBases() {
  await basesStore.fetchBases();
}

function openEditModal(base: Base1C) {
  editingBase.value = base;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingBase.value = null;
}

async function handleSubmit(data: CreateBaseRequest, dtFile?: File) {
  if (editingBase.value) {
    await basesStore.updateBase(editingBase.value.id, data, dtFile);
  } else {
    await basesStore.createBase(data, dtFile);
  }
  closeModal();
}

async function handleDelete(id: number) {
  if (confirm('Вы уверены, что хотите удалить эту базу?')) {
    await basesStore.deleteBase(id);
  }
}

function logout() {
  authStore.logout();
  router.push('/login');
}
</script>
