import { useTranslation } from "@/hooks/useTranslation";
import { BudgetYear } from "@/type/transparency";
import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface IncomeExpensesBreakdownProps {
  data: BudgetYear[];
}

export default function IncomeExpensesBreakdown({
  data,
}: IncomeExpensesBreakdownProps) {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(
    data[data.length - 1]?.year || 2024,
  );

  const selectedData =
    data.find(({ year }) => year === selectedYear) || data[0];

  const incomeData = {
    labels: [
      t({ fr: "Commanditaires", en: "Sponsors" }),
      t({ fr: "Billets", en: "Tickets" }),
    ],
    datasets: [
      {
        data: [selectedData.income.sponsors, selectedData.income.tickets],
        backgroundColor: ["rgba(59, 130, 246, 0.8)", "rgba(34, 197, 94, 0.8)"],
        borderColor: ["rgba(59, 130, 246, 1)", "rgba(34, 197, 94, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const expenseData = {
    labels: [
      t({ fr: "Lieu", en: "Venue" }),
      t({ fr: "Conférenciers", en: "Speakers" }),
      t({ fr: "Restauration", en: "Catering" }),
      t({ fr: "Marketing", en: "Marketing" }),
      t({ fr: "Équipement", en: "Equipment" }),
      t({ fr: "Autres", en: "Other" }),
    ],
    datasets: [
      {
        data: [
          selectedData.expenses.venue,
          selectedData.expenses.speakers,
          selectedData.expenses.catering,
          selectedData.expenses.marketing,
          selectedData.expenses.equipment,
          selectedData.expenses.other,
        ],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(107, 114, 128, 0.8)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(107, 114, 128, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label({ dataset, parsed, label }) {
            const total = dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((parsed / total) * 100).toFixed(1);
            return `${label}: $${parsed.toLocaleString()} CAD (${percentage}%)`;
          },
        },
      },
    },
  };

  const totalIncome =
    selectedData.income.sponsors + selectedData.income.tickets;
  const totalExpenses =
    selectedData.expenses.venue +
    selectedData.expenses.speakers +
    selectedData.expenses.catering +
    selectedData.expenses.marketing +
    selectedData.expenses.equipment +
    selectedData.expenses.other;

  return (
    <div>
      {/* Year Selector */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {data.map(({ year }) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedYear === year
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            {t({ fr: "Revenus", en: "Income" })}
          </h3>
          <div className="h-80">
            <Doughnut data={incomeData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold text-gray-700">
              {t({ fr: "Total:", en: "Total:" })} $
              {totalIncome.toLocaleString()} CAD
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            {t({ fr: "Dépenses", en: "Expenses" })}
          </h3>
          <div className="h-80">
            <Doughnut data={expenseData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold text-gray-700">
              {t({ fr: "Total:", en: "Total:" })} $
              {totalExpenses.toLocaleString()} CAD
            </p>
          </div>
        </div>
      </div>

      {selectedData.notes && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-blue-800">
            <strong>{t({ fr: "Note:", en: "Note:" })}</strong>{" "}
            {t(selectedData.notes)}
          </p>
        </div>
      )}
    </div>
  );
}
