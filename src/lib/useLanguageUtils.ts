// src/lib/useLanguageUtils.ts
"use client";

import { useCallback } from 'react';
// import { useTranslation } from 'react-i18next';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLanguage } from '../components/LanguageProvider';

export interface LanguageUtils {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  setLanguageWithURL: (lang: string) => void;
  generateLocalizedLink: (path: string, lang: string) => string;
  isRTL: boolean;
}

export function useLanguageUtils(): LanguageUtils {
  // const { i18n } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  // const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Change language with URL update (for sharing links)
  const setLanguageWithURL = useCallback((lang: string) => {
    if (!['en', 'fr', 'ar'].includes(lang)) return;
    
    changeLanguage(lang);
    
    // Update URL without navigation
    const params = new URLSearchParams(searchParams);
    params.set('lang', lang);
    
    // Update the URL without reloading the page
    const newUrl = `${pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  }, [changeLanguage, pathname, searchParams]);

  // Generate a link with language parameter
  const generateLocalizedLink = useCallback((path: string, lang: string) => {
    if (!path) return '';
    
    // Don't add the param if it's the default language
    if (lang === 'en') return path;
    
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}lang=${lang}`;
  }, []);

  return {
    currentLanguage: language,
    changeLanguage,
    setLanguageWithURL,
    generateLocalizedLink,
    isRTL: language === 'ar',
  };
}

export default useLanguageUtils;
