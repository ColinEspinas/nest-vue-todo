<script setup lang="ts">
import { ref } from 'vue';
import UiButton from '@/components/ui/ui-button.vue';
import { useFormValidation } from '@/composables/use-form-validation';
import { registerSchema } from '@/schemas';
import UiInput from '@/components/ui/ui-input.vue';

const { validate, getError } = useFormValidation(registerSchema);

const name = ref('');
const email = ref('');
const password = ref('');

const emit = defineEmits<{
  submit: [{ name: string; email: string; password: string }];
}>();

const handleSubmit = () => {
  const formData = { name: name.value, email: email.value, password: password.value };
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
        <h2 class="font-bold text-2xl">S'inscrire</h2>
        <p>Veuillez entrer vos identifiants pour vous inscrire.</p>
      </div>

      <form class="flex flex-col gap-2" @submit.prevent="handleSubmit">
        <UiInput
          v-model="name"
          name="name"
          type="text"
          label="Nom d'utilisateur"
          placeholder="Entrez votre nom..."
          :error="getError('name')"
        />
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
          label="Mot de passe (min. 8 caractères)"
          placeholder="Entrez votre mot de passe..."
          :error="getError('password')"
        />
        <UiButton
          after-icon="ph:arrow-bend-up-right-bold"
          text="S'inscrire"
          variant="accent"
          class="min-w-max"
          align="center"
          type="submit"
        />
      </form>

      <p class="text-sm">
        <span>Vous avez déjà un compte ?&nbsp;</span>
        <RouterLink to="/sign-in" class="text-accent">Se connecter</RouterLink>
      </p>
    </div>
  </section>
</template>
