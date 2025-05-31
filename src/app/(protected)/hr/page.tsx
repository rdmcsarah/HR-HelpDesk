"use client";

import { useTranslation } from 'react-i18next';
export default function HrPage() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">HR Page</h1>
      <p className="text-gray-700 dark:text-gray-300">
        This is the HR page content. You can add more details here.

      </p>
      <div className="border-t border-gray-300 my-4">
        {t('siso')}
      </div>
      {/* Add more content here as needed */}
    </div>
  );
}