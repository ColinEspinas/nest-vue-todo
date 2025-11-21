<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import {
  SelectContent,
  SelectItem,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectViewport,
} from 'reka-ui';

const { t } = useI18n();

const priority = defineModel<'high' | 'medium' | 'low'>({ default: 'medium' });

const priorities = [
  { value: 'high', color: 'text-error' },
  { value: 'medium', color: 'text-accent' },
  { value: 'low', color: 'text-success' },
] as const;

const getCurrentPriority = () => {
  return priorities.find((p) => p.value === priority.value) || priorities[1];
};

const getPriorityLabel = (value: 'high' | 'medium' | 'low') => {
  return t(`tasks.priority.${value}`);
};
</script>

<template>
  <SelectRoot v-model="priority" modal>
    <SelectTrigger
      class="flex items-center justify-between gap-2 text-sm py-[9px] px-3 rounded-lg bg-base-100 text-base-content-100 border-2 border-base-content-100/20 ring-0 ring-base-content-100/10 hover:ring-3 focus:ring-3 transition-all outline-none cursor-pointer"
      :aria-label="t('tasks.priority.selectLabel')"
    >
      <div class="flex items-center gap-2">
        <Icon icon="ph:flag-bold" :class="[getCurrentPriority().color]" size="18" />
        <span>{{ getPriorityLabel(getCurrentPriority().value) }}</span>
      </div>
      <Icon
        icon="ph:caret-down-bold"
        class="w-4 h-4 text-base-content-300 transition-transform data-[state=open]:rotate-180"
      />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="bg-base-100 border-2 border-base-content-100/20 rounded-lg shadow-lg z-50 min-w-[var(--reka-select-trigger-width)] max-h-[200px] overflow-hidden"
        :side-offset="4"
        :collision-padding="8"
        :sticky="'always'"
        position="popper"
      >
        <SelectViewport>
          <SelectItem
            v-for="priority in priorities"
            :key="priority.value"
            :value="priority.value"
            class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-base-200 focus:bg-base-200 outline-none data-[highlighted]:bg-base-200 transition-colors"
          >
            <Icon icon="ph:flag-bold" :class="[priority.color]" size="18" />
            <span>{{ getPriorityLabel(priority.value) }}</span>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
