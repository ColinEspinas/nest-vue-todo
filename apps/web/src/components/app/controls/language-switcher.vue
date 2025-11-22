<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Icon } from '@iconify/vue';
import {
  SelectRoot,
  SelectTrigger,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from 'reka-ui';
import { computed } from 'vue';

const { locale } = useI18n();

const languages = [
  { value: 'en', label: 'English', flag: 'twemoji:flag-united-kingdom' },
  { value: 'fr', label: 'Français', flag: 'twemoji:flag-france' },
] as const;

const handleUpdate = (value: string) => {
  if (value && typeof value === 'string') {
    locale.value = value;
    localStorage.setItem('locale', value);
  }
};

const currentLanguage = computed(() => {
  return languages.find((l) => l.value === locale.value) || languages[0];
});
</script>

<template>
  <SelectRoot v-model="locale" :modal="false" @update:model-value="handleUpdate">
    <SelectTrigger
      class="flex items-center justify-between gap-2 text-sm py-[9px] px-3 rounded-lg bg-base-100 text-base-content-100 border-2 border-base-content-100/20 ring-0 ring-base-content-100/10 hover:ring-3 focus:ring-3 transition-all outline-none cursor-pointer"
      aria-label="Language"
    >
      <div class="flex items-center gap-2">
        <Icon :icon="currentLanguage.flag" class="w-4 h-4" />
        <span>{{ currentLanguage.label }}</span>
      </div>
      <Icon
        icon="ph:caret-down-bold"
        class="w-4 h-4 text-base-content-300 transition-transform data-[state=open]:rotate-180"
      />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="z-50 min-w-[140px] bg-base-100 rounded-xl border-2 border-base-300 shadow-lg overflow-hidden p-1"
        position="popper"
        :side-offset="4"
      >
        <SelectViewport>
          <SelectItem
            v-for="lang in languages"
            :key="lang.value"
            :value="lang.value"
            class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm outline-none cursor-pointer data-[highlighted]:bg-base-200 data-[state=checked]:text-accent data-[state=checked]:font-medium"
          >
            <Icon :icon="lang.flag" class="w-4 h-4" />
            <SelectItemText>{{ lang.label }}</SelectItemText>
            <SelectItemIndicator class="ml-auto">
              <Icon icon="ph:check-bold" class="w-3.5 h-3.5" />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
