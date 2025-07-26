import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import idTranslation from './locales/id/translation.json';
import enTranslation from './locales/en/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      id: {
        translation: idTranslation
      },
      en: {
        translation: enTranslation
      }
    }
  });

export default i18n;
