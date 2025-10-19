import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/landing-view.vue'),
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/auth/sign-in-view.vue'),
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('../views/auth/sign-up-view.vue'),
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/tasks-view.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

export default router;
