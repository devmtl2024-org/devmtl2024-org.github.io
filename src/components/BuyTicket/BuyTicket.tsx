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
            fr: "Offre Early Bird — Quantité limitée",
            en: "Early Bird offer — Limited quantity",
          })}
        </h3>
        <h3 className="text-4xl font-semibold text-white leading-tight mb-4">
          {t({
            fr: "55$ au lieu de 70$",
            en: "$55 instead of $70",
          })}
        </h3>
        <div className="w-16 h-1 bg-white mx-auto mb-6"></div>

        <p className="text-lg mb-8">
          {t({
            fr: "Seulement 40 billets disponibles, jusqu'au 7 juin 2026.",
            en: "Only 40 tickets available, until June 7, 2026.",
          })}
        </p>

        <BuyTicketButton />
      </div>
    </section>
  ) : null;
}

export default BuyTicket;
