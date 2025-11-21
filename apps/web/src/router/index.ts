import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/default-layout.vue'),
      children: [
        {
          path: '/',
          name: 'landing',
          component: () => import('../views/landing-view.vue'),
          meta: { guestOnly: true },
        },
        {
          path: '/sign-in',
          name: 'sign-in',
          component: () => import('../views/auth/sign-in-view.vue'),
          meta: { guestOnly: true },
        },
        {
          path: '/sign-up',
          name: 'sign-up',
          component: () => import('../views/auth/sign-up-view.vue'),
          meta: { guestOnly: true },
        },
      ],
    },
    {
      path: '/',
      component: () => import('../layouts/sidebar-layout.vue'),
      children: [
        {
          path: '/tasks',
          name: 'tasks',
          component: () => import('../views/tasks-view.vue'),
          meta: { authOnly: true },
        },
        {
          path: '/tags/:tagId',
          name: 'tag-tasks',
          component: () => import('../views/tag-tasks-view.vue'),
          meta: { authOnly: true },
        },
      ],
    },
  ],
});

export default router;
