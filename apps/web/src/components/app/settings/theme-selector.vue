<script setup lang="ts">
import { useTheme } from '@/composables/use-theme';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n();
const { mode } = useTheme();

const options = computed(() => [
  { value: 'light', icon: 'ph:sun', label: t('common.theme.light') },
  { value: 'dark', icon: 'ph:moon', label: t('common.theme.dark') },
  { value: 'auto', icon: 'ph:desktop', label: t('common.theme.system') },
]);

const selectMode = (newMode: 'light' | 'dark' | 'auto') => {
  mode.value = newMode;
};
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <button
      v-for="option in options"
      :key="option.value"
      class="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ring-0"
      :class="[
        mode === option.value
          ? 'bg-base-200 border-accent text-accent ring-accent/20 hover:ring-3'
          : 'bg-base-100 border-base-300 hover:border-base-content-100/20 text-base-content-200 ring-base-content-100/10 hover:ring-3',
      ]"
      @click="selectMode(option.value as 'light' | 'dark' | 'auto')"
    >
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
        :class="[mode === option.value ? 'bg-accent/10' : 'bg-base-200']"
      >
        <Icon :icon="option.icon" class="w-6 h-6" />
      </div>
      <span class="font-medium">{{ option.label }}</span>
    </button>
  </div>
</template>
