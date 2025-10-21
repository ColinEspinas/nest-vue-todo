<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
  error: string;
}>();
</script>

<template>
  <div class="bg-base-200 border-2 border-error rounded-lg p-4 mb-6">
    <div class="flex items-center">
      <Icon icon="ph:x-circle" class="w-5 h-5 text-error mr-2" />
      <span class="text-error">{{ error }}</span>
    </div>
  </div>
</template>
