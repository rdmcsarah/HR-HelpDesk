// src/app/components/LanguageSwitcher.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';
import { useSearchParams, usePathname } from 'next/navigation';

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Handler that changes language and updates URL
  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    
    // Update URL with language parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang);
    
    // Update URL without navigation
    window.history.pushState({}, '', `${pathname}?${params.toString()}`);
  };

  // Only show component after client-side hydration to prevent mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until after hydration to avoid mismatch
  if (!mounted) {
    return <div className="h-12"></div>; // Placeholder with similar height
  }

  return (
    <div className="flex flex-col items-center gap-2">
 <h1 className="text-2xl font-bold mb-4">{t('changeLanguage')}</h1>
   


        <div className="flex gap-2">
        <button 
          onClick={() => handleLanguageChange('en')} 
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            language === 'en' 
              ? 'bg-black text-white dark:bg-white dark:text-black' 
              : 'border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800'
          }`}
          title="Switch to English"
        >
          {t('english')}
        </button>
        <button 
          onClick={() => handleLanguageChange('fr')} 
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            language === 'fr' 
              ? 'bg-black text-white dark:bg-white dark:text-black' 
              : 'border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800'
          }`}
          title="Passer au français"
        >
          {t('french')}
        </button>
        <button 
          onClick={() => handleLanguageChange('ar')} 
          className={`px-3 py-1 rounded-md text-sm transition-colors ${
            language === 'ar' 
              ? 'bg-black text-white dark:bg-white dark:text-black' 
              : 'border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800'
          }`}
          title="التبديل إلى العربية"
        >
          {t('arabic')}
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
