import { useTranslation } from "@/hooks/useTranslation";
import backgroundImage from "../../assets/background-2.jpg";
import BuyTicketButton from "./BuyTicketButton";

// Could be an env variable, but it's good enough for now
export const ARE_TICKETS_AVAILABLE = true;

function BuyTicket() {
  const { t } = useTranslation();

  return ARE_TICKETS_AVAILABLE ? (
    <section
      className="relative bg-cover bg-center flex items-center justify-center text-center w-full py-24"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-4 text-white">
        <h3 className="text-xs text-secondary uppercase tracking-widest mb-4 font-semibold">
          {t({
            fr: "27 novembre 2026 — Montréal",
            en: "November 27, 2026 — Montreal",
          })}
        </h3>
        <h3 className="text-4xl font-semibold text-white leading-tight mb-4">
          {t({
            fr: "Réservez votre place — 70$",
            en: "Get your ticket — $70",
          })}
        </h3>
        <div className="w-16 h-1 bg-white mx-auto mb-6"></div>

        <p className="text-lg mb-8">
          {t({
            fr: "Une journée de conférences, de networking et d'inspiration pour les devs de Montréal.",
            en: "A full day of talks, networking, and inspiration for Montreal's dev community.",
          })}
        </p>

        <BuyTicketButton />
      </div>
    </section>
  ) : null;
}

export default BuyTicket;
