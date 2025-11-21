<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useFormValidation } from '@/composables/use-form-validation';
import { updateProfileSchema } from '@/schemas';
import UiButton from '@/components/ui/ui-button.vue';
import UiInput from '@/components/ui/ui-input.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const { validate, getError, resetErrors } = useFormValidation(updateProfileSchema);

const name = ref(authStore.user?.name || '');
const email = ref(authStore.user?.email || '');
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

watch(
  () => authStore.user,
  (user) => {
    if (user) {
      name.value = user.name;
      email.value = user.email;
    }
  },
  { immediate: true },
);

const handleSubmit = async () => {
  successMessage.value = '';
  errorMessage.value = '';
  resetErrors();

  const formData = { name: name.value, email: email.value };
  if (!validate(formData)) return;

  loading.value = true;
  try {
    await authStore.updateProfile(formData);
    successMessage.value = t('settings.profile.successMessage');
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : t('settings.profile.errorMessage');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <section
    class="flex flex-col mb-4 bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10"
  >
    <div class="bg-base-100 border-2 border-base-300 p-4 rounded-2xl flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="font-bold text-2xl">{{ t('settings.profile.title') }}</h2>
        <p>{{ t('settings.profile.description') }}</p>
      </div>

      <form class="flex flex-col gap-2" @submit.prevent="handleSubmit">
        <UiInput
          v-model="name"
          name="name"
          type="text"
          :label="t('settings.profile.nameLabel')"
          :placeholder="t('settings.profile.namePlaceholder')"
          :error="getError('name')"
        />
        <UiInput
          v-model="email"
          name="email"
          type="email"
          :label="t('settings.profile.emailLabel')"
          :placeholder="t('settings.profile.emailPlaceholder')"
          :error="getError('email')"
        />

        <div v-if="successMessage" class="text-success text-sm p-2 bg-success/10 rounded-lg">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="text-error text-sm p-2 bg-error/10 rounded-lg">
          {{ errorMessage }}
        </div>

        <UiButton
          after-icon="ph:floppy-disk-bold"
          :text="t('settings.profile.saveButton')"
          variant="accent"
          class="min-w-max"
          align="center"
          type="submit"
          :disabled="loading"
        />
      </form>
    </div>
  </section>
</template>
