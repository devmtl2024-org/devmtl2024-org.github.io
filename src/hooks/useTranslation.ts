import { Language, useLanguage } from "@/contexts/LanguageContext";

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (translations: Record<Language, string>) => translations[language];

  return { t, language };
};
