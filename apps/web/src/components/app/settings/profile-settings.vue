<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useFormValidation } from '@/composables/use-form-validation';
import { updateProfileSchema } from '@/schemas';
import { toast } from 'vue-sonner';
import UiButton from '@/components/ui/ui-button.vue';
import UiInput from '@/components/ui/ui-input.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const { validate, getError, resetErrors } = useFormValidation(updateProfileSchema);

const name = ref(authStore.user?.name || '');
const email = ref(authStore.user?.email || '');
const loading = ref(false);

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
  resetErrors();

  const formData = { name: name.value, email: email.value };
  if (!validate(formData)) return;

  loading.value = true;
  try {
    await authStore.updateProfile(formData);
    toast.success(t('settings.profile.successMessage'));
  } catch (error) {
    toast.error(error instanceof Error ? error.message : t('settings.profile.errorMessage'));
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <section class="bg-base-100 border-2 border-base-300 p-6 rounded-2xl flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h2 class="font-bold text-xl">{{ t('settings.profile.title') }}</h2>
      <p class="text-base-content-200 text-sm">{{ t('settings.profile.description') }}</p>
    </div>

    <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-4">
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
      </div>

      <div class="flex justify-end pt-2">
        <UiButton
          after-icon="ph:floppy-disk-bold"
          :text="t('settings.profile.saveButton')"
          variant="accent"
          type="submit"
          :loading="loading"
          :disabled="loading"
        />
      </div>
    </form>
  </section>
</template>
