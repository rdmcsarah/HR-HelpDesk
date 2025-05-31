// src/app/components/LanguageProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n'; // Import the i18n configuration

type LanguageContextType = {
  language: string;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  
  // Function to change the current language
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    // RTL logic is handled in the i18n.ts file through the 'languageChanged' event
  };
  // Effect to initialize the language and update state when language changes
  useEffect(() => {
    // This will update our state whenever the language changes
    setLanguage(i18n.language);
    
    // Handle initial language setting when component mounts
    const handleInitialLanguage = () => {
      // Check if we're running on the client-side
      if (typeof window !== 'undefined') {
        // Priority order: URL param > localStorage > browser language
        
        // 1. Check URL param first (highest priority)
        try {
          const urlLang = sessionStorage.getItem('url_language_param');
          if (urlLang && ['en', 'fr', 'ar'].includes(urlLang)) {
            i18n.changeLanguage(urlLang);
            return;
          }
        } catch (error) {
          console.error('Error accessing sessionStorage:', error);
        }
        
        // 2. Get language from localStorage if available
        try {
          const savedLang = localStorage.getItem('i18nextLng');
          if (savedLang && ['en', 'fr', 'ar'].includes(savedLang)) {
            i18n.changeLanguage(savedLang);
            return;
          }
        } catch (error) {
          console.error('Error accessing localStorage:', error);
        }
        
        // 3. Otherwise use browser language
        try {
          const browserLang = navigator.language.split('-')[0];
          const detectedLang = ['en', 'fr', 'ar'].includes(browserLang) ? browserLang : 'en';
          i18n.changeLanguage(detectedLang);
        } catch (error) {
          console.error('Error detecting browser language:', error);
          i18n.changeLanguage('en'); // Fallback to English
        }
      }
    };

    handleInitialLanguage();
    
    // Clean-up function
    return () => {
      // Any clean-up if needed
    };
  }, [i18n]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
