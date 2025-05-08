import {
  ReactNode,
  useEffect,
  useState
} from "react";
import { Language, LanguageContext } from "./LanguageContext";


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

    // Otherwise, try to use the browser language
    const browserLang = navigator.language;
    if (browserLang.startsWith("en") || browserLang.startsWith("fr")) {
      return browserLang.startsWith("en") ? "en" : "fr";
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
