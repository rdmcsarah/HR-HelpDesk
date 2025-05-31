import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../public/locales/en';
import fr from '../public/locales/fr';
import ar from '../public/locales/ar';

// Check if we're running on the client-side
const isClient = typeof window !== 'undefined';

// Get URL parameters for language (client-side only)
const getUrlParam = () => {
  if (!isClient) return null;
  
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    return langParam && ['en', 'fr', 'ar'].includes(langParam) ? langParam : null;
  } catch (error) {
    console.error('Error parsing URL parameters:', error);
    return null;
  }
};

// Initialize i18next with the resources and configuration
i18n
  .use(initReactI18next) // Connects i18n to React
  .init({
    resources: {
      en,
      fr,
      ar,
    },
    lng: 'en', // Default to English for server-side rendering
    fallbackLng: 'en', // Fallback language
    debug: process.env.NODE_ENV !== 'production',
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
    // Don't use initImmediate for better SSR support
    initImmediate: false
  });

// We will handle client-side initialization in LanguageProvider
// to ensure proper order of initialization and hydration
if (isClient) {
  // Check URL param first - highest priority
  const urlLang = getUrlParam();
  if (urlLang) {
    // We'll set this in the LanguageProvider to avoid hydration issues
    // Just store it for now
    sessionStorage.setItem('url_language_param', urlLang);
  }

  // This event just handles the localStorage and RTL setting
  i18n.on('languageChanged', (lng) => {
    try {
      // Save to localStorage
      localStorage.setItem('i18nextLng', lng);
      
      // Handle RTL for Arabic
      if (lng === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = lng;
      }
    } catch (error) {
      console.error('Error handling language change:', error);
    }
  });
}

export default i18n;
