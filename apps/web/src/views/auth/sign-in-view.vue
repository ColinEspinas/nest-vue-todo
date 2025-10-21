<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import UiButton from '@/components/ui/ui-button.vue';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const login = async () => {
  await authStore.login(email.value, password.value);
  router.push({ name: 'tasks' });
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
      <form class="flex flex-col gap-2" @submit.prevent="login">
        <input
          v-model="email"
          type="email"
          placeholder="Entrez votre adresse e-mail..."
          class="transition-all bg-base-100 focus-within:border-base-300 border-2 border-base-200 bg-base-50 rounded-lg p-2 outline-none w-full flex flex-col items-end gap-2"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Entrez votre mot de passe..."
          class="transition-all bg-base-100 focus-within:border-base-300 border-2 border-base-200 bg-base-50 rounded-lg p-2 outline-none w-full flex flex-col items-end gap-2"
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
