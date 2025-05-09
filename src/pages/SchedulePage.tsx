import { useTranslation } from "@/hooks/useTranslation";

export default function SchedulePage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
        {t({ fr: "Agenda (2025)", en: "Agenda (2025)" })}
      </h3>
      <p className="text-gray-700 text-2xl">
        {t({ fr: "Bientôt disponible ..", en: "Coming soon .." })}
      </p>
    </div>
  );
}
