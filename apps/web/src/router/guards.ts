// router/guards.ts or inside router/index.ts
import type { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export function setupGuards(router: Router) {
  router.beforeEach((to) => {
    const auth = useAuthStore();

    if (to.meta.authOnly && !auth.isAuthenticated) {
      return { path: '/sign-in' };
    }

    if (to.meta.guestOnly && auth.isAuthenticated) {
      return { path: '/tasks' };
    }

    return true;
  });
}
