<script setup lang="ts">
import UiTag from '../../ui/ui-tag.vue';

defineProps<{
  priority: 'high' | 'medium' | 'low';
}>();

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse',
  };
  return labels[priority] || priority;
};

const getPriorityIconColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-error';
    case 'medium':
      return 'text-accent';
    case 'low':
      return 'text-success';
    default:
      return 'text-base-content-200';
  }
};
</script>

<template>
  <UiTag
    :label="getPriorityLabel(priority)"
    icon="ph:flag-bold"
    :icon-color="getPriorityIconColor(priority)"
  />
</template>
