<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import SignInForm from '@/components/app/forms/sign-in-form.vue';
import { ref } from 'vue';
import ErrorMessage from '@/components/app/common/error-message.vue';

const authStore = useAuthStore();
const router = useRouter();

const error = ref<string | null>(null);

const login = async ({ email, password }: { email: string; password: string }) => {
  try {
    await authStore.login(email, password);
  } catch (authenticationError) {
    error.value = (authenticationError as Error).message;
    return;
  }
  router.push({ name: 'tasks' });
};
</script>

<template>
  <SignInForm @submit="login" />
  <ErrorMessage v-if="error" :error="error" />
</template>
