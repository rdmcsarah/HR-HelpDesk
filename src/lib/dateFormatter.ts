// src/lib/dateFormatter.ts
"use client";

import { useTranslation } from 'react-i18next';

interface DateFormatterOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  hour12?: boolean;
}

export const useDateFormatter = () => {
  const { i18n } = useTranslation();
  
  const formatDate = (date: Date, options: DateFormatterOptions = {}) => {
    // Map language codes to locale codes
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'fr': 'fr-FR',
      'ar': 'ar-SA'
    };
    
    const locale = localeMap[i18n.language] || 'en-US';
    
    // Default options
    const defaultOptions: DateFormatterOptions = {
      dateStyle: 'medium',
      ...options
    };
    
    try {
      // Create a formatter
      return new Intl.DateTimeFormat(locale, defaultOptions as Intl.DateTimeFormatOptions).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      // Fallback formatting
      return date.toLocaleDateString(locale);
    }
  };
  
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    // Map language codes
    const texts: Record<string, Record<string, (value: number) => string>> = {
      en: {
        days: (value) => `${value} day${value !== 1 ? 's' : ''} ago`,
        hours: (value) => `${value} hour${value !== 1 ? 's' : ''} ago`,
        minutes: (value) => `${value} minute${value !== 1 ? 's' : ''} ago`,
        just: () => 'Just now'
      },
      fr: {
        days: (value) => `Il y a ${value} jour${value !== 1 ? 's' : ''}`,
        hours: (value) => `Il y a ${value} heure${value !== 1 ? 's' : ''}`,
        minutes: (value) => `Il y a ${value} minute${value !== 1 ? 's' : ''}`,
        just: () => 'À l\'instant'
      },
      ar: {
        days: (value) => `منذ ${value} ${value === 1 ? 'يوم' : value < 11 ? 'أيام' : 'يوماً'}`,
        hours: (value) => `منذ ${value} ${value === 1 ? 'ساعة' : value < 11 ? 'ساعات' : 'ساعة'}`,
        minutes: (value) => `منذ ${value} ${value === 1 ? 'دقيقة' : value < 11 ? 'دقائق' : 'دقيقة'}`,
        just: () => 'الآن'
      }
    };
    
    const text = texts[i18n.language] || texts.en;
    
    if (diffDays > 0) {
      return text.days(diffDays);
    } else if (diffHours > 0) {
      return text.hours(diffHours);
    } else if (diffMinutes > 0) {
      return text.minutes(diffMinutes);
    } else {
      return text.just(0);
    }
  };
  
  return {
    formatDate,
    formatRelativeTime
  };
};

export default useDateFormatter;
