import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  const ariaLabel =
    language === "fr" ? "Switch to English" : "Passer au français";

  return (
    <button
      onClick={toggleLanguage}
      className="text-md hover:text-secondary transition-colors"
      aria-label={ariaLabel}
    >
      {language === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
    </button>
  );
}
