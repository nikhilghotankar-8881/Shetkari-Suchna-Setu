import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import mr from "./locales/mr.json";

const SUPPORTED_LANGS = ["en", "hi", "mr"];

const saved = (() => {
  try {
    const l = localStorage.getItem("lang");
    return l && SUPPORTED_LANGS.includes(l) ? l : null;
  } catch {
    return null;
  }
})();

const initialLang = saved ?? "mr";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
  },
  lng: initialLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Set document lang attribute immediately
if (typeof document !== "undefined") {
  document.documentElement.lang = initialLang;
}

i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
  try {
    localStorage.setItem("lang", lng);
  } catch {
    /* ignore */
  }
});

export default i18n;
