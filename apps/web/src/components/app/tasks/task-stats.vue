<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  total: number;
  completed: number;
  pending: number;
}>();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div class="bg-base-100 rounded-2xl border-2 border-base-300 p-6">
      <p class="text-2xl font-bold text-base-content-100">{{ total }}</p>
      <p class="text-sm text-base-content-200">{{ t('tasks.stats.total') }}</p>
    </div>

    <div class="bg-base-100 rounded-2xl border-2 border-base-300 p-6">
      <p class="text-2xl font-bold text-success">{{ completed }}</p>
      <p class="text-sm text-base-content-200">{{ t('tasks.stats.completed') }}</p>
    </div>

    <div class="bg-base-100 rounded-2xl border-2 border-base-300 p-6">
      <p class="text-2xl font-bold text-accent">{{ pending }}</p>
      <p class="text-sm text-base-content-200">{{ t('tasks.stats.pending') }}</p>
    </div>
  </div>
</template>
