import { useTranslation } from "@/hooks/useTranslation";
import backgroundImage from "../../assets/background-2.jpg";
import BuyTicketButton from "./BuyTicketButton";

function BuyTicket() {
  const { t } = useTranslation();

  return (
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
        {/* Title */}
        <h3 className="text-xs text-white uppercase tracking-widest mb-4">
          {t({ fr: "Dépêchez-vous", en: "Hurry up" })}
        </h3>
        <h3 className="text-4xl font-semibold text-white leading-tight mb-4">
          {t({ fr: "Réservez votre place", en: "Book your seat" })}
        </h3>
        <div className="w-16 h-1 bg-white mx-auto mb-6"></div>

        <BuyTicketButton />
      </div>
    </section>
  );
}

export default BuyTicket;
