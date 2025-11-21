<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Icon } from '@iconify/vue';

const { locale, availableLocales } = useI18n();

const languages = {
  en: { name: 'English', flag: 'twemoji:flag-united-kingdom' },
  fr: { name: 'Français', flag: 'twemoji:flag-france' },
};

const switchLanguage = () => {
  const currentIndex = availableLocales.indexOf(locale.value);
  const nextIndex = (currentIndex + 1) % availableLocales.length;
  const nextLocale = availableLocales[nextIndex];
  if (nextLocale) {
    locale.value = nextLocale;
    localStorage.setItem('locale', locale.value);
  }
};

const currentLanguage = () => {
  return languages[locale.value as keyof typeof languages];
};
</script>

<template>
  <button
    @click="switchLanguage"
    class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-200 transition-colors"
    :aria-label="`Switch to ${currentLanguage().name}`"
  >
    <Icon :icon="currentLanguage().flag" class="w-5 h-5" />
    <span class="text-sm font-medium">{{ locale.toUpperCase() }}</span>
  </button>
</template>
