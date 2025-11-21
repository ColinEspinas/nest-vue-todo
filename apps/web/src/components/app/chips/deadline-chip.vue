<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UiTag from '../../ui/ui-tag.vue';
import UiTooltip from '../../ui/ui-tooltip.vue';

const { t, locale } = useI18n();

defineProps<{
  deadline: Date | string;
}>();

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale.value, {
    month: 'short',
    day: 'numeric',
  });
};

const isOverdue = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const overdueDate = new Date(dateObj);
  overdueDate.setHours(0, 0, 0, 0);
  overdueDate.setDate(overdueDate.getDate() + 1);
  return new Date() >= overdueDate;
};

const getTooltipContent = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const isOverdueFlag = dateObj < now;

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

  return isOverdueFlag
    ? t('tasks.time.deadlineOverdue', { date: formattedDate, time: formattedTime })
    : t('tasks.time.deadlineScheduled', { date: formattedDate, time: formattedTime });
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
