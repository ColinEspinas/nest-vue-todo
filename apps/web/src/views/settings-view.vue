<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ProfileSettings from '@/components/app/settings/profile-settings.vue';
import ThemeSettings from '@/components/app/settings/theme-settings.vue';
import LanguageSettings from '@/components/app/settings/language-settings.vue';

const { t } = useI18n();
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10">
      <div class="bg-base-100 border-2 border-base-300 p-6 rounded-2xl">
        <div class="flex flex-col gap-1">
          <h1 class="font-bold text-3xl">{{ t('settings.title') }}</h1>
          <p class="text-base-content-200">{{ t('settings.description') }}</p>
        </div>
      </div>
    </div>

    <div class="bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10">
      <ProfileSettings />
    </div>

    <div
      class="bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10 flex flex-col gap-4"
    >
      <ThemeSettings />
      <LanguageSettings />
    </div>
  </div>
</template>
