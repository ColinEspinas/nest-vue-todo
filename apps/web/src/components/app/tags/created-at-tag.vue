<script setup lang="ts">
import UiTag from '../../ui/ui-tag.vue';
import UiTooltip from '../../ui/ui-tooltip.vue';

defineProps<{
  createdAt: Date | string;
}>();

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffMinutes < 60) {
    return diffMinutes <= 1 ? "À l'instant" : `Il y a ${diffMinutes} min`;
  } else if (diffHours < 24) {
    return `Il y a ${diffHours}h`;
  } else if (diffDays < 7) {
    return `Il y a ${diffDays}j`;
  } else {
    return dateObj.toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
    });
  }
};

const getTooltipContent = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return `Créée le ${dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })} à ${dateObj.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};
</script>

<template>
  <UiTooltip :content="getTooltipContent(createdAt)" side="bottom">
    <UiTag
      :label="formatDate(createdAt)"
      icon="ph:clock-counter-clockwise-bold"
      icon-color="text-base-content-200"
      text-color="text-base-content-200"
    />
  </UiTooltip>
</template>
