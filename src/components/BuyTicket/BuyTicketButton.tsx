import { useTranslation } from "@/hooks/useTranslation";
import { ARE_TICKETS_AVAILABLE } from "./BuyTicket";

export default function BuyTicketButton({ className }: { className?: string }) {
  const { t } = useTranslation();

  return ARE_TICKETS_AVAILABLE ? (
    <a
      href="https://www.eventbrite.com/e/devmtl-2026-tickets-1987111133893"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <button className="px-8 py-4 bg-secondary text-white font-medium rounded-md shadow-md hover:bg-secondary-dark uppercase">
        {t({ fr: "Acheter un billet", en: "Buy Ticket" })}
      </button>
    </a>
  ) : (
    <button className={`px-8 py-4 bg-secondary text-white font-medium rounded-md shadow-md uppercase opacity-80 cursor-default ${className ?? ""}`}>
      {t({ fr: "Billets disponibles bientôt", en: "Tickets available soon" })}
    </button>
  );
}
