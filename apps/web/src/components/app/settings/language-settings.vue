<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from '@/components/app/controls/language-switcher.vue';

const { t } = useI18n();
</script>

<template>
  <section class="bg-base-100 border-2 border-base-300 p-6 rounded-2xl flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h2 class="font-bold text-xl">{{ t('settings.language.label') }}</h2>
      <p class="text-base-content-200 text-sm">{{ t('settings.language.description') }}</p>
    </div>

    <LanguageSwitcher />
  </section>
</template>
