<script setup lang="ts">
import UiTag from '../../ui/ui-tag.vue';

defineProps<{
  deadline: Date | string;
}>();

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric',
  });
};

const isOverdue = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
};
</script>

<template>
  <UiTag
    :label="formatDate(deadline)"
    icon="ph:clock"
    :icon-color="isOverdue(deadline) ? 'text-error' : 'text-accent'"
    :text-color="isOverdue(deadline) ? 'text-error' : 'text-base-content-200'"
  />
</template>
