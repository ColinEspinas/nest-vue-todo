<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>
<template>
  <article class="flex flex-col bg-base-100 p-4 rounded-2xl border-2 border-base-300">
    <h2 class="text-lg font-semibold text-base-content-100 mb-2">{{ title }}</h2>
    <p class="text-base-content-200 text-sm">
      {{ description }}
    </p>
  </article>
</template>
