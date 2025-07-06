import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, supportedLanguages } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className, showLabel = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = getCurrentLanguage();

  const currentLangData = supportedLanguages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (langCode: 'en' | 'am') => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-2">🌐</span>
        {showLabel && (
          <span className="mr-2">{currentLangData?.nativeName || currentLangData?.name}</span>
        )}
        <svg
          className={cn('w-4 h-4 transition-transform duration-200', isOpen ? 'rotate-180' : '')}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 z-20 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {supportedLanguages.map(language => (
                <button
                  key={language.code}
                  className={cn(
                    'flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100',
                    currentLanguage === language.code
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700'
                  )}
                  role="menuitem"
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <span className="mr-3">{language.code === 'en' ? '🇺🇸' : '🇪🇹'}</span>
                  <div>
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-xs text-gray-500">{language.name}</div>
                  </div>
                  {currentLanguage === language.code && (
                    <svg
                      className="w-4 h-4 ml-auto text-primary-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
