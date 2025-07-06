import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    common: {
      appName: 'GIV Society',
      welcome: 'Welcome',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      view: 'View',
      allRightsReserved: 'All rights reserved',
    },
    auth: {
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email Address',
      password: 'Password',
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      confirmPassword: 'Confirm Password',
      loginToAccount: 'Login to your account',
      createAccount: 'Create a new account',
      welcomeBack: 'Welcome back!',
      getStarted: 'Get started today',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember me',
      passwordRequirements: 'Password must be at least 8 characters long',
      languagePreference: 'Language Preference',
      english: 'English',
      amharic: 'Amharic',
      isDonor: 'I want to make donations',
      isVolunteer: 'I want to volunteer',
      admin: 'Administrator',
      user: 'User',
    },
    navigation: {
      home: 'Home',
      about: 'About',
      campaigns: 'Campaigns',
      events: 'Events',
      blog: 'Blog',
      contact: 'Contact',
      donate: 'Donate',
      volunteer: 'Volunteer',
      getInvolved: 'Get Involved',
      impact: 'Impact',
      dashboard: 'Dashboard',
      appName: 'GIV Society',
      navigation: 'Navigation',
      userManagement: 'User Management',
      campaignManagement: 'Campaign Management',
      eventManagement: 'Event Management',
      contentManagement: 'Content Management',
      mediaManagement: 'Media Management',
      analytics: 'Analytics',
      systemSettings: 'System Settings',
    },
    forms: {
      required: 'This field is required',
      optional: 'Optional',
    },
    errors: {
      generic: 'An error occurred. Please try again.',
    },
  },
  am: {
    common: {
      appName: 'ጊቭ ማህበረሰብ',
      welcome: 'እንኳን ደህና መጡ',
      loading: 'በመጫን ላይ...',
      save: 'አስቀምጥ',
      cancel: 'ሰርዝ',
      view: 'ተመልከት',
      allRightsReserved: 'ሁሉም መብቶች የተጠበቁ ናቸው',
    },
    auth: {
      login: 'ግባ',
      logout: 'ውጣ',
      register: 'ተመዝገብ',
      signIn: 'ግባ',
      signUp: 'ተመዝገብ',
      email: 'ኢሜይል አድራሻ',
      password: 'የይለፍ ቃል',
      fullName: 'ሙሉ ስም',
      phoneNumber: 'ስልክ ቁጥር',
      confirmPassword: 'የይለፍ ቃል አረጋግጥ',
      loginToAccount: 'ወደ መለያዎ ይግቡ',
      createAccount: 'አዲስ መለያ ይፍጠሩ',
      welcomeBack: 'እንኳን ደህና ተመለሱ!',
      getStarted: 'ዛሬ ይጀምሩ',
      alreadyHaveAccount: 'አስቀድሞ መለያ አለዎት?',
      dontHaveAccount: 'መለያ የለዎትም?',
      forgotPassword: 'የይለፍ ቃልዎን ረሱት?',
      rememberMe: 'አስታውሰኝ',
      passwordRequirements: 'የይለፍ ቃል ቢያንስ 8 ቁምፊዎች ሊኖሩት ይገባል',
      languagePreference: 'የቋንቋ ምርጫ',
      english: 'እንግሊዝኛ',
      amharic: 'አማርኛ',
      isDonor: 'መዋጮ መስጠት እፈልጋለሁ',
      isVolunteer: 'በጎ ፈቃደኛ መሆን እፈልጋለሁ',
      admin: 'አስተዳዳሪ',
      user: 'ተጠቃሚ',
    },
    navigation: {
      home: 'መነሻ',
      about: 'ስለ እኛ',
      campaigns: 'ዘመቻዎች',
      events: 'ዝግጅቶች',
      blog: 'ብሎግ',
      contact: 'አግኙን',
      donate: 'መዋጮ',
      volunteer: 'በጎ ፈቃደኛ',
      getInvolved: 'ተሳተፉ',
      impact: 'ተፅእኖ',
      dashboard: 'ዳሽቦርድ',
      appName: 'ጊቭ ማህበረሰብ',
      navigation: 'አሰሳ',
      userManagement: 'የተጠቃሚ አስተዳደር',
      campaignManagement: 'የዘመቻ አስተዳደር',
      eventManagement: 'የዝግጅት አስተዳደር',
      contentManagement: 'የይዘት አስተዳደር',
      mediaManagement: 'የሚዲያ አስተዳደር',
      analytics: 'ትንታኔ',
      systemSettings: 'የስርዓት ቅንብሮች',
    },
    forms: {
      required: 'ይህ መስክ ያስፈልጋል',
      optional: 'አማራጭ',
    },
    errors: {
      generic: 'ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።',
    },
  },
};

// Language detector options
const detectionOptions = {
  // Order of language detection
  order: ['localStorage', 'navigator', 'htmlTag'],

  // Keys to look for in localStorage
  lookupLocalStorage: 'language',

  // Cache user language
  caches: ['localStorage'],

  // Don't cache if language is detected from navigator
  excludeCacheFor: ['navigator'],
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    // Default language
    fallbackLng: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',

    // Supported languages
    supportedLngs: ['en', 'am'],

    // Language detection
    detection: detectionOptions,

    // Namespace configuration
    defaultNS: 'common',
    ns: ['common', 'auth', 'navigation', 'forms', 'errors'],

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // React options
    react: {
      useSuspense: false, // Disable suspense for now
    },

    // Debug mode in development
    debug: import.meta.env.VITE_DEBUG === 'true',

    // Key separator
    keySeparator: '.',

    // Namespace separator
    nsSeparator: ':',
  });

// Export language change function
export const changeLanguage = (language: 'en' | 'am') => {
  i18n.changeLanguage(language);
  localStorage.setItem('language', language);

  // Update document language attribute
  document.documentElement.lang = language;

  // Update document direction for RTL languages (if needed in future)
  document.documentElement.dir = 'ltr';
};

// Export current language getter
export const getCurrentLanguage = (): 'en' | 'am' => {
  return i18n.language as 'en' | 'am';
};

// Export supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
] as const;

export default i18n;
