// router/guards.ts or inside router/index.ts
import type { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default function setupGuards(router: Router) {
  router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { path: '/sign-in' };
    }

    return true;
  });
}
