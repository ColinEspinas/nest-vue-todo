<script setup lang="ts">
import { useTheme } from '@/composables/use-theme';
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ToggleGroupRoot, ToggleGroupItem } from 'reka-ui';

const { t } = useI18n();
const { mode } = useTheme();

const options = computed(() => [
  { value: 'light', icon: 'ph:sun', label: t('common.theme.light') },
  { value: 'dark', icon: 'ph:moon', label: t('common.theme.dark') },
  { value: 'auto', icon: 'ph:desktop', label: t('common.theme.system') },
]);

const handleUpdate = (value: unknown) => {
  if (value && typeof value === 'string') {
    mode.value = value as 'light' | 'dark' | 'auto';
  }
};
</script>

<template>
  <ToggleGroupRoot
    v-model="mode"
    type="single"
    class="flex items-center p-1 bg-base-100 rounded-lg border-2 border-base-content-100/20 ring-0 ring-base-content-100/10 hover:ring-3"
    aria-label="Theme toggle"
    @update:model-value="handleUpdate"
  >
    <ToggleGroupItem
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      class="p-[5px] rounded-md transition-all data-[state=on]:bg-base-200 data-[state=on]:shadow-sm data-[state=on]:text-accent text-base-content-200 hover:text-base-content-100"
      :aria-label="option.label"
      :title="option.label"
    >
      <Icon :icon="option.icon" class="w-5 h-5" />
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
