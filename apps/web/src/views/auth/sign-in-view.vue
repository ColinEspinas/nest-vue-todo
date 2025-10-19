<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const login = async () => {
  // Handle login logic here
  console.log('Logging in with', email.value, password.value);
  await authStore.login(email.value, password.value);
  router.push({ name: 'tasks' });
};
</script>

<template>
  <div>
    <form @submit.prevent="login">
      <h1>Sign In</h1>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" v-model="email" required class="border-1" />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          v-model="password"
          required
          class="border-1"
        />
      </div>
      <button type="submit" class="border-1 bg-amber-500">Sign In</button>
    </form>
  </div>
</template>
