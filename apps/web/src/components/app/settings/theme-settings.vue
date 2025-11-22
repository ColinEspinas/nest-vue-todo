<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ThemeSelector from '@/components/app/theme-selector.vue';

const { t } = useI18n();
</script>

<template>
  <section class="bg-base-100 border-2 border-base-300 p-6 rounded-2xl flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h2 class="font-bold text-xl">{{ t('settings.appearance') }}</h2>
    </div>

    <ThemeSelector />
  </section>
</template>
