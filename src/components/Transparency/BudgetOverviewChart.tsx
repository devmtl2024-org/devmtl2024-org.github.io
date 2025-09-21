import { useTranslation } from "@/hooks/useTranslation";
import { BudgetYear } from "@/type/transparency";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function BudgetOverviewChart({ data }: { data: BudgetYear[] }) {
  const { t } = useTranslation();

  const chartData = {
    labels: data.map(({ year }) => year.toString()),
    datasets: [
      {
        label: t({ fr: "Budget", en: "Budget" }),
        data: data.map((year) => year.budget),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: t({ fr: "Revenus", en: "Income" }),
        data: data.map(({ income }) => income.sponsors + income.tickets),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
      {
        label: t({ fr: "Dépenses", en: "Expenses" }),
        data: data.map(
          ({ expenses }) =>
            expenses.catering +
            expenses.marketing +
            expenses.venue +
            expenses.speakers +
            expenses.equipment +
            expenses.other,
        ),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label({ dataset, parsed }) {
            return `${dataset.label}: $${parsed.y.toLocaleString()} CAD`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback(value) {
            return "$" + value.toLocaleString() + " CAD";
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="h-96">
        <Bar data={chartData} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>
          *{" "}
          {t({
            fr: "Le budget de 2025 est une projection basée sur les revenus planifiés.",
            en: "2025 budget is a projection based on expected income.",
          })}
        </p>
      </div>
    </div>
  );
}
