// Could be an env variable, but it's good enough for now
const ARE_TICKETS_AVAILABLE = true;

import { useTranslation } from "@/hooks/useTranslation";

export default function BuyTicketButton() {
  const { t } = useTranslation();

  return ARE_TICKETS_AVAILABLE ? (
    <a
      href="https://www.eventbrite.com/e/1357369902919/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <button className="px-8 py-4 bg-secondary text-white font-medium rounded-md shadow-md hover:bg-secondary-dark uppercase">
        {t({ fr: "Acheter un billet", en: "Buy Ticket" })}
      </button>
    </a>
  ) : (
    <button className="px-8 py-4 bg-secondary text-white font-medium rounded-md shadow-md uppercase opacity-80 cursor-default">
      {t({ fr: "Billets disponibles bientôt", en: "Tickets available soon" })}
    </button>
  );
}
