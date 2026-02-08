import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

// Language modes
export const LANGUAGE_MODES = {
  ENGLISH: 'en',
  HINDI: 'hi',
  BILINGUAL: 'bi',
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get from localStorage or default to bilingual
    return localStorage.getItem('kaamgar_language') || LANGUAGE_MODES.BILINGUAL;
  });

  useEffect(() => {
    // Save to localStorage whenever language changes
    localStorage.setItem('kaamgar_language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (Object.values(LANGUAGE_MODES).includes(newLanguage)) {
      setLanguage(newLanguage);
    }
  };

  // Helper function to get text based on current language mode
  const getText = (english, hindi) => {
    switch (language) {
      case LANGUAGE_MODES.ENGLISH:
        return english;
      case LANGUAGE_MODES.HINDI:
        return hindi;
      case LANGUAGE_MODES.BILINGUAL:
        return `${english} / ${hindi}`;
      default:
        return `${english} / ${hindi}`;
    }
  };

  // Helper for button/action text (shorter, no separator)
  const getActionText = (english, hindi) => {
    switch (language) {
      case LANGUAGE_MODES.ENGLISH:
        return english;
      case LANGUAGE_MODES.HINDI:
        return hindi;
      case LANGUAGE_MODES.BILINGUAL:
        return `${english} / ${hindi}`;
      default:
        return `${english} / ${hindi}`;
    }
  };

  return (
    <LanguageContext.Provider value={{
      language,
      changeLanguage,
      getText,
      getActionText,
      isEnglish: language === LANGUAGE_MODES.ENGLISH,
      isHindi: language === LANGUAGE_MODES.HINDI,
      isBilingual: language === LANGUAGE_MODES.BILINGUAL,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
