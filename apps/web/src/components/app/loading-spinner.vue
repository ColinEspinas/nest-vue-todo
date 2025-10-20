<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();
</script>

<template>
  <div v-if="loading" class="flex justify-center py-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
  </div>
</template>
