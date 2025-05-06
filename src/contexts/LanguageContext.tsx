import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Language = "fr" | "en";
export type InlineTranslation = Record<Language, string>;

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // First check lang from URL
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");
    if (langParam === "en" || langParam === "fr") {
      return langParam;
    }

    // Otherwise, check localStorage value
    const storedLang = localStorage.getItem("language");
    if (storedLang === "en" || storedLang === "fr") {
      return storedLang;
    }

    // Defaults to French
    return "fr";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);

    // Store in localStorage so we remember user's preference for next visit
    localStorage.setItem("language", lang);

    // Update URL parameter without reloading the page
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());
  };

  // Keep HTML lang attribute in sync
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
