<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UiTag from '../../ui/ui-tag.vue';
import UiTooltip from '../../ui/ui-tooltip.vue';

const { t, locale } = useI18n();

defineProps<{
  updatedAt: Date | string;
}>();

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffMinutes < 60) {
    return diffMinutes <= 1
      ? t('tasks.time.justNow')
      : t('tasks.time.minutesAgo', { minutes: diffMinutes });
  } else if (diffHours < 24) {
    return t('tasks.time.hoursAgo', { hours: diffHours });
  } else if (diffDays < 7) {
    return t('tasks.time.daysAgo', { days: diffDays });
  } else {
    return dateObj.toLocaleDateString(locale.value, {
      month: 'short',
      day: 'numeric',
    });
  }
};

const getTooltipContent = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const formattedDate = dateObj.toLocaleDateString(locale.value, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString(locale.value, {
    hour: '2-digit',
    minute: '2-digit',
  });
  return t('tasks.time.editedOn', { date: formattedDate, time: formattedTime });
};
</script>

<template>
  <UiTooltip :content="getTooltipContent(updatedAt)" side="bottom">
    <UiTag
      :label="formatDate(updatedAt)"
      icon="ph:pencil-bold"
      icon-color="text-base-content-200"
      text-color="text-base-content-200"
    />
  </UiTooltip>
</template>
