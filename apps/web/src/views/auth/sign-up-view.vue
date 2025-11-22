<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import SignUpForm from '@/components/app/forms/sign-up-form.vue';
import ErrorMessage from '@/components/app/common/error-message.vue';
import { ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

const error = ref<string | null>(null);

const register = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    await authStore.register({
      name,
      email,
      password,
    });
  } catch (authenticationError) {
    error.value = (authenticationError as Error).message;
    return;
  }
  await authStore.login(email, password);
  router.push({ name: 'tasks' });
};
</script>

<template>
  <div>
    <SignUpForm @submit="register" />
    <ErrorMessage v-if="error" :error="error" />
  </div>
</template>
