// src/app/components/DateExample.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDateFormatter } from '@/lib/dateFormatter';

const DateExample: React.FC = () => {
  const { t } = useTranslation();
  const { formatDate, formatRelativeTime } = useDateFormatter();
  const [mounted, setMounted] = useState(false);
  const [currentDate] = useState(new Date());
  const [pastDate] = useState(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)); // 3 days ago
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="h-60"></div>; // Placeholder to prevent hydration mismatch
  }
  
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg mt-8">
      <h3 className="text-lg font-medium mb-4">{t('dateTimeExample')}</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('currentDate')}</p>
          <p className="font-medium">{formatDate(currentDate, { dateStyle: 'full' })}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('currentTime')}</p>
          <p className="font-medium">{formatDate(currentDate, { timeStyle: 'medium' })}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('pastDate')}</p>
          <p className="font-medium">
            {formatDate(pastDate)} ({formatRelativeTime(pastDate)})
          </p>
        </div>
      </div>
    </div>
  );
};

export default DateExample;
