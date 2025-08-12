// src/app/components/LanguageSwitcher.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';
import { useSearchParams, usePathname } from 'next/navigation';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { LanguagesIcon } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();
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


          <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full border-0">
          <LanguagesIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>



       
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('fr')}>

           Français
        
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('ar')}>
       
            العربية
         
        </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        
       
    
  );
};

export default LanguageSwitcher;
