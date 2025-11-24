import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import languageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

import { languages, type LanguageKey } from "~/constants/languages";

export default i18next
  .use(initReactI18next)
  .use(languageDetector)
  .use(Backend)
  .init({
    fallbackLng: "en" as LanguageKey,
    supportedLngs: Object.keys(languages),
    fallbackNS: "common",
    defaultNS: "common",
    debug: import.meta.env.DEV,
    interpolation: { escapeValue: false },
  });

i18next.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});
