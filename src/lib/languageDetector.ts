// src/lib/languageDetector.ts
import { NextRouter } from 'next/router';

interface LanguageDetector {
  name: string;
  lookup: (router?: NextRouter) => string | undefined;
  cacheUserLanguage: (lng: string) => void;
}

export const createLanguageDetector = (): LanguageDetector => {
  const detectors = {
    queryString: {
      name: 'queryString',
      lookup: () => {
        if (typeof window === 'undefined') return undefined;
        
        // Check URL for language parameter
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        if (langParam && ['en', 'fr', 'ar'].includes(langParam)) {
          return langParam;
        }
        
        return undefined;
      },
      cacheUserLanguage: () => { /* Not needed for query params */ }
    },
    localStorage: {
      name: 'localStorage',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      lookup: (router: NextRouter | undefined) => {
        if (typeof window === 'undefined') return undefined;
        
        try {
          const storedLang = localStorage.getItem('i18nextLng');
          if (storedLang && ['en', 'fr', 'ar'].includes(storedLang)) {
            return storedLang;
          }
        } catch (error) {
          console.error('Error accessing localStorage:', error);
        }
        
        return undefined;
      },
      cacheUserLanguage: (lng: string) => {
        if (typeof window === 'undefined') return;
        
        try {
          localStorage.setItem('i18nextLng', lng);
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
      }
    },
    navigator: {
      name: 'navigator',
      lookup: () => {
        if (typeof window === 'undefined') return undefined;
        
        try {
          const browserLang = navigator.language.split('-')[0];
          return ['en', 'fr', 'ar'].includes(browserLang) ? browserLang : undefined;
        } catch (error) {
          console.error('Error detecting browser language:', error);
          return undefined;
        }
      },
      cacheUserLanguage: () => { /* Not needed for navigator */ }
    }
  };

  return {
    name: 'customDetector',
    lookup: (router?: NextRouter) => {
      // Try each detector in order
      const detectorOrder = [detectors.queryString, detectors.localStorage, detectors.navigator];
      
      for (const detector of detectorOrder) {
        const language = detector.lookup(router);
        if (language) return language;
      }
      
      // Default fallback
      return 'en';
    },
    cacheUserLanguage: (lng: string) => {
      detectors.localStorage.cacheUserLanguage(lng);
    }
  };
};

export default createLanguageDetector;
