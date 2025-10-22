<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import SignUpForm from '@/components/app/forms/sign-up-form.vue';

const authStore = useAuthStore();
const router = useRouter();

const register = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  await authStore.register({
    name,
    email,
    password,
  });
  await authStore.login(email, password);
  router.push({ name: 'tasks' });
};
</script>

<template>
  <SignUpForm @submit="register" />
</template>
