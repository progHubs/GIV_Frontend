import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../locales/en/common.json';
import amTranslations from '../locales/am/common.json';

// Translation resources
const resources = {
  en: {
    common: enTranslations,
  },
  am: {
    common: amTranslations,
  },
};

// i18n configuration
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    
    // Default language
    fallbackLng: 'en',
    
    // Default namespace
    defaultNS: 'common',
    
    // Language detection options
    detection: {
      // Order of language detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Cache user language
      caches: ['localStorage'],
      
      // localStorage key
      lookupLocalStorage: 'giv-language',
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Debug mode (only in development)
    debug: import.meta.env.DEV,
    
    // React options
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
    },
  });

export default i18n;
