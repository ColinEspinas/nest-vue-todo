import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import fr from './locales/fr.json';

export type MessageSchema = typeof en;

const i18n = createI18n<[MessageSchema], 'en' | 'fr'>({
  legacy: false,
  locale: localStorage.getItem('locale') || 'fr',
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
  },
});

export default i18n;
