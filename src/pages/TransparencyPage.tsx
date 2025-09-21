import BudgetOverviewChart from "@/components/Transparency/BudgetOverviewChart";
import IncomeExpensesBreakdown from "@/components/Transparency/IncomeExpensesBreakdown";
import { useTranslation } from "@/hooks/useTranslation";
import { TransparencyData } from "@/type/transparency";
import { useEffect, useState } from "react";

export default function TransparencyPage() {
  const { t } = useTranslation();
  const [transparencyData, setTransparencyData] =
    useState<TransparencyData | null>(null);

  useEffect(() => {
    import("@/assets/transparency-data.json")
      .then((module) => setTransparencyData(module.default))
      .catch(() => console.error("Transparency data not found"));
  }, []);

  if (!transparencyData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">
          Loading transparency data...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-12">
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          {t(transparencyData.description)}
        </p>
        <p className="text-md text-gray-500 leading-relaxed">
          {t(transparencyData.methodology)}
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-700 mb-8 text-center">
          {t({
            fr: "Budget au fil du temps",
            en: "Budget over time",
          })}
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          {t({
            fr: "Voici comment notre budget a évolué au fil des années.",
            en: "First, have a look at how our budget evolved over the years.",
          })}
        </p>
        <BudgetOverviewChart data={transparencyData.years} />
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-700 mb-8 text-center">
          {t({
            fr: "Répartition des revenus et dépenses",
            en: "Income & Expenses Breakdown",
          })}
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          {t({
            fr: "Voici la répartition de nos revenus et dépenses pour chaque événement. Utilisez le sélecteur ci-dessous pour naviguer entre nos événements précédents.",
            en: "Here is the breakdown of our income and expenses for each event. Use the selector below to navigate between our previous events.",
          })}
        </p>
        <IncomeExpensesBreakdown data={transparencyData.years} />
      </div>

      <div className="bg-gray-100 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">
          {t({
            fr: "Non-lucratif et transparent",
            en: "Non-profit and transparent",
          })}
        </h2>
        <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
          <p className="mb-4">
            {t({
              fr: "/dev/mtl est une initiative à but non-lucratif. Chaque événement jusqu'à présent a eu une bonne planification budgétaire, et nous gérons nos dépenses de manière à avoir une réserve d'argent qui nous aide à démarrer la prochaine édition.",
              en: "/dev/mtl is a non-profit initiative. Each event so far had good budget planning, and we manage our expenses so that we have enough money to help us kick-start the next edition.",
            })}
          </p>
          <p className="mb-6">
            {t({
              fr: "Nous n'en sommes encore qu'au début, mais notre ambition est de garder l'événement abordable et accessible pour tout le monde. Nous aimerions également pouvoir compenser les présentateurs et présentatrices, ainsi que de redonner aux communautés.",
              en: "We are still in the early stages, but our goal is to keep the event affordable to everyone. We would also like to be able to compensate speakers and presenters, as well as give back to the communities.",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
