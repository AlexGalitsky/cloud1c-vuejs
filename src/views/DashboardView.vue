<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Мои базы 1С</h1>
        <div class="flex gap-4">
          <button
            @click="showCreateModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Новая база
          </button>
          <button
            @click="logout"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Выйти
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="bases.length === 0" class="text-center py-8 text-gray-500">
        Нет созданных баз. Создайте первую базу!
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BaseCard
          v-for="base in bases"
          :key="base.id"
          :base="base"
          @edit="openEditModal(base)"
          @delete="handleDelete(base.id)"
        />
      </div>
    </div>

    <BaseFormModal
      v-if="showCreateModal"
      :base="null"
      @close="showCreateModal = false"
      @submit="handleCreate"
    />

    <BaseFormModal
      v-if="showEditModal && editingBase"
      :base="editingBase"
      @close="showEditModal = false"
      @submit="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBasesStore } from '@/stores/bases';
import { useAuthStore } from '@/stores/auth';
import BaseCard from '@/components/BaseCard.vue';
import BaseFormModal from '@/components/BaseFormModal.vue';
import type { Base1C, CreateBaseRequest } from '@/api/bases';

const router = useRouter();
const basesStore = useBasesStore();
const authStore = useAuthStore();

const bases = ref<Base1C[]>([]);
const isLoading = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingBase = ref<Base1C | null>(null);

onMounted(async () => {
  await loadBases();
  startPolling();
});

async function loadBases() {
  isLoading.value = true;
  await basesStore.fetchBases();
  bases.value = basesStore.bases;
  console.log('Loaded bases:', bases.value);
  isLoading.value = false;
}

function startPolling() {
  setInterval(async () => {
    await basesStore.fetchBases();
    bases.value = basesStore.bases;
  }, 1000);
}

function openEditModal(base: Base1C) {
  editingBase.value = base;
  showEditModal.value = true;
}

async function handleCreate(data: CreateBaseRequest, dtFile?: File) {
  await basesStore.createBase(data, dtFile);
  showCreateModal.value = false;
  await loadBases();
}

async function handleUpdate(data: CreateBaseRequest, dtFile?: File) {
  if (editingBase.value) {
    await basesStore.updateBase(editingBase.value.id, data, dtFile);
    showEditModal.value = false;
    editingBase.value = null;
    await loadBases();
  }
}

async function handleDelete(id: number) {
  if (confirm('Вы уверены, что хотите удалить эту базу?')) {
    await basesStore.deleteBase(id);
    await loadBases();
  }
}

function logout() {
  authStore.logout();
  router.push('/login');
}
</script>
