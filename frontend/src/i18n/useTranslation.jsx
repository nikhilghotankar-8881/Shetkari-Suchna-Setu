import { createContext, useContext, useState } from 'react';
import mrTranslations from './mr.json';
import enTranslations from './en.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default to Marathi as mandated by design.md §Principle
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('sss_lang') || 'mr';
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('sss_lang', newLang);
  };

  const t = (key) => {
    const dict = lang === 'en' ? enTranslations : mrTranslations;
    return dict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
};
