// src/app/components/LanguageMeta.tsx
"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import Head from "next/head";

export default function LanguageMeta() {
  const { i18n } = useTranslation();
  
  // Generate alternate links for SEO
  const alternateLinks = useMemo(() => {
    // Function to create URL with language parameter
    const createUrlWithLang = (lang: string) => {
      if (typeof window === 'undefined') return '';
      
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      return url.toString();
    };
    
    return ['en', 'fr', 'ar'].map(lang => ({
      hrefLang: lang,
      href: createUrlWithLang(lang)
    }));
  }, []);

  // Update document language and direction when language changes
  useEffect(() => {
    if (i18n.language === 'ar') {
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.lang = i18n.language;
      document.documentElement.dir = 'ltr';
    }
  }, [i18n.language]);

  return (
    <Head>
      {alternateLinks.map(link => (
        <link
          key={link.hrefLang}
          rel="alternate"
          hrefLang={link.hrefLang}
          href={link.href}
        />
      ))}
    </Head>
  );
}
