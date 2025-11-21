<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import UiButton from '../ui/ui-button.vue';
import AppLogo from './app-logo.vue';
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
  <header
    class="flex justify-between items-stretch bg-base-200/50 border-2 border-base-300 rounded-2xl overflow-hidden"
  >
    <div
      class="flex gap-2 items-center bg-base-100 px-4 py-2 border-r-2 border-base-content-100/10"
    >
      <template v-if="isAuthenticated && user">
        <Avatar :name="user?.email || 'User'" :size="36" variant="marble" />
        <div>
          <p class="font-medium text-sm">{{ user.name }}</p>
          <p class="font-medium text-xs">{{ user.email }}</p>
        </div>
      </template>
      <template v-else>
        <RouterLink to="/" class="flex items-center gap-2 font-medium">
          <AppLogo variant="md" />
        </RouterLink>
      </template>
    </div>
    <div class="flex gap-2 p-2">
      <template v-if="isAuthenticated">
        <UiButton
          @click="logoutHandler"
          variant="secondary"
          before-icon="ph:sign-out-bold"
          aria-label="Se déconnecter"
        />
      </template>
      <template v-else>
        <UiButton text="Se connecter" to="/sign-in" variant="secondary" />
        <UiButton text="S'inscrire" to="/sign-up" variant="accent" />
      </template>
    </div>
  </header>
</template>
