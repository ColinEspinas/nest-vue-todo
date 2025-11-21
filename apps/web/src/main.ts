import './assets/main.css';
import '@fontsource-variable/hanken-grotesk';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import i18n from './i18n';
import { setupGuards } from './router/guards';
import { useAuthStore } from './stores/auth';

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);
  app.use(i18n);

  const auth = useAuthStore();
  await auth.restore();

  setupGuards(router);
  app.use(router);

  app.mount('#app');
}

bootstrap();
