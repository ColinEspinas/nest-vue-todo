<script setup lang="ts">
import UiTag from '../../ui/ui-tag.vue';
import UiTooltip from '../../ui/ui-tooltip.vue';

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

const getTooltipContent = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const isOverdueFlag = dateObj < now;

  const fullDate = `${dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })} à ${dateObj.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  return isOverdueFlag ? `Échéance dépassée le ${fullDate}` : `Échéance prévue le ${fullDate}`;
};
</script>

<template>
  <UiTooltip :content="getTooltipContent(deadline)" side="bottom">
    <UiTag
      :label="formatDate(deadline)"
      icon="ph:clock-bold"
      :icon-color="isOverdue(deadline) ? 'text-error' : 'text-accent'"
      :text-color="isOverdue(deadline) ? 'text-error' : 'text-base-content-200'"
    />
  </UiTooltip>
</template>
