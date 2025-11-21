<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UiTag from '../../ui/ui-tag.vue';
import UiTooltip from '../../ui/ui-tooltip.vue';

const { t } = useI18n();

defineProps<{
  priority: 'high' | 'medium' | 'low';
}>();

const getPriorityLabel = (priority: string) => {
  return t(`tasks.priority.${priority}`);
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
  return t(`tasks.priority.tooltip.${priority}`);
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
