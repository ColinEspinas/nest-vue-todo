<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SettingsForm from '@/components/app/forms/settings-form.vue';

const { t } = useI18n();
</script>

<template>
  <div>
    <div class="bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10 mb-4">
      <div class="bg-base-100 border-2 border-base-300 p-4 rounded-2xl">
        <div class="flex flex-col gap-1 mb-4">
          <h1 class="font-bold text-3xl">{{ t('settings.title') }}</h1>
          <p class="text-base-content/70">{{ t('settings.description') }}</p>
        </div>
      </div>
    </div>

    <SettingsForm />
  </div>
</template>
