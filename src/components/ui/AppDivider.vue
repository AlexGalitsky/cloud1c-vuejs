<template>
  <div class="relative flex py-8 items-center">
    <div class="grow border-t border-[1px] border-gray-200"></div>
    <span class="shrink mx-4 font-medium text-gray-500">{{ text }}</span>
    <div class="grow border-t border-[1px] border-gray-200"></div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  text?: string;
}>(), {
  text: 'OR',
});
</script>
