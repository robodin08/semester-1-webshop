export const languages = {
  en: "English",
  nl: "Nederlands",
} as const;

export type LanguageStrings = Record<keyof typeof languages, string>;

export type LanguageKey = keyof typeof languages;
