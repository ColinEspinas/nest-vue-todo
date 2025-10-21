<script setup lang="ts">
import UiTag from '../../ui/ui-tag.vue';
import UiTooltip from '../../ui/ui-tooltip.vue';

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

const getTooltipContent = (priority: 'high' | 'medium' | 'low') => {
  const descriptions: Record<string, string> = {
    high: "Priorité haute - À traiter en premier, même si l'échéance est lointaine",
    medium: "Priorité normale - À traiter selon l'ordre des échéances",
    low: 'Priorité basse - À traiter quand le temps le permet',
  };
  return descriptions[priority] || 'Priorité non définie';
};
</script>

<template>
  <UiTooltip :content="getTooltipContent(priority)" side="bottom">
    <UiTag
      :label="getPriorityLabel(priority)"
      icon="ph:flag-bold"
      :icon-color="getPriorityIconColor(priority)"
    />
  </UiTooltip>
</template>
