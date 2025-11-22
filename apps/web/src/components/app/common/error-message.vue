<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
  error: string;
}>();
</script>

<template>
  <div class="bg-error/10 border-2 border-error/20 rounded-3xl p-2 mb-6">
    <div class="flex items-center bg-base-100/80 p-4 rounded-2xl border-2 border-error/30">
      <Icon icon="ph:warning" class="w-5 h-5 text-error mr-2" />
      <span class="text-base-content-100">{{ error }}</span>
    </div>
  </div>
</template>
