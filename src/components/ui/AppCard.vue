<template>
  <div
    :class="[
      'flex flex-col bg-white rounded-2xl shadow-xl',
      'w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3',
      'mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14',
      className,
    ]"
  >
    <!-- Header slot -->
    <div v-if="$slots.header" class="flex flex-row gap-3 pb-4">
      <slot name="header" />
    </div>

    <!-- Content -->
    <div :class="['flex flex-col', contentClass]">
      <slot />
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="mt-6">
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
