<script setup lang="ts">
import { ref } from 'vue';
import UiButton from '@/components/ui/ui-button.vue';
import { useFormValidation } from '@/composables/use-form-validation';
import { loginSchema } from '@/schemas';
import UiInput from '@/components/ui/ui-input.vue';

const { validate, getError } = useFormValidation(loginSchema);

const email = ref('');
const password = ref('');

const emit = defineEmits<{
  submit: [{ email: string; password: string }];
}>();

const handleSubmit = () => {
  const formData = { email: email.value, password: password.value };
  if (!validate(formData)) return;
  emit('submit', formData);
};
</script>

<template>
  <section
    class="flex flex-col mb-4 bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10"
  >
    <div class="bg-base-100 border-2 border-base-300 p-4 rounded-2xl flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="font-bold text-2xl">Se connecter</h2>

        <p>Veuillez entrer vos identifiants pour vous connecter.</p>
      </div>
      <form class="flex flex-col gap-2" @submit.prevent="handleSubmit">
        <UiInput
          v-model="email"
          name="email"
          type="email"
          label="Adresse e-mail"
          placeholder="Entrez votre adresse e-mail..."
          :error="getError('email')"
        />
        <UiInput
          v-model="password"
          name="password"
          type="password"
          label="Mot de passe"
          placeholder="Entrez votre mot de passe..."
          :error="getError('password')"
        />
        <UiButton
          after-icon="ph:arrow-bend-up-right-bold"
          text="Se connecter"
          variant="accent"
          class="min-w-max"
          align="center"
          type="submit"
        />
      </form>

      <p class="text-sm">
        <span>Vous n'avez pas de compte ?&nbsp;</span>
        <RouterLink to="/sign-up" class="text-accent">S'inscrire</RouterLink>
      </p>
    </div>
  </section>
</template>
