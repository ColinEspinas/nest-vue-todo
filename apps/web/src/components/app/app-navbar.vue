<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import UiButton from '../ui/ui-button.vue';
import Avatar from 'vue-boring-avatars';

const router = useRouter();
const { logout } = useAuthStore();
const { isAuthenticated, user } = storeToRefs(useAuthStore());

const logoutHandler = () => {
  logout();
  router.push({ name: 'landing' });
};
</script>

<template>
  <header class="flex justify-between items-center border-1 border-base-300 p-2 rounded-2xl">
    <div class="flex gap-2 items-center">
      <template v-if="isAuthenticated">
        <Avatar :name="user?.email || 'User'" :size="36" :variant="'marble'" />
        <p class="font-medium" v-if="user">{{ user.name }} ({{ user.email }})</p>
      </template>
      <template v-else>
        <RouterLink to="/" class="font-medium ml-1">Todo</RouterLink>
      </template>
    </div>
    <div class="flex gap-2">
      <template v-if="isAuthenticated">
        <UiButton @click="logoutHandler" variant="secondary" text="Se déconnecter" />
      </template>
      <template v-else>
        <UiButton text="Se connecter" to="/sign-in" variant="secondary" />
        <UiButton text="S'inscrire" to="/sign-up" variant="accent" />
      </template>
    </div>
  </header>
</template>
