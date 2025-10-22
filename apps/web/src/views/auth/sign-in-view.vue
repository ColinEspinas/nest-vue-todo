<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import SignInForm from '@/components/app/forms/sign-in-form.vue';

const authStore = useAuthStore();
const router = useRouter();

const login = async ({ email, password }: { email: string; password: string }) => {
  await authStore.login(email, password);
  router.push({ name: 'tasks' });
};
</script>

<template>
  <SignInForm @submit="login" />
</template>
