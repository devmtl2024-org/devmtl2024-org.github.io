import { createContext, useContext } from "react";

export type Language = "fr" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);
