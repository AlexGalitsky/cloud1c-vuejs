<template>
  <div
    :class="[
      'glass rounded-2xl shadow-xl overflow-hidden',
      'hover:shadow-2xl transition-shadow duration-300',
      className,
    ]"
  >
    <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-100">
      <slot name="header" />
    </div>
    <div :class="['p-6', contentClass]">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 bg-gray-50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  className?: string;
  contentClass?: string;
}>();
</script>
