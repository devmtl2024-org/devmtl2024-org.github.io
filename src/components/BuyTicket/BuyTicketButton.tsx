import { useTranslation } from "@/hooks/useTranslation";
import { NEWSLETTER_ANCHOR } from "../Newsletter/NewsletterSignup";
import { ARE_TICKETS_AVAILABLE } from "./BuyTicket";

export default function BuyTicketButton({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
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
    <a
      href={`#${NEWSLETTER_ANCHOR}`}
      onClick={onClick}
      className={`inline-block whitespace-nowrap px-8 py-4 bg-secondary text-white font-medium rounded-md shadow-md hover:bg-secondary-dark uppercase ${className ?? ""}`}
    >
      {t({ fr: "Rester informé", en: "Stay in the loop" })}
    </a>
  );
}
