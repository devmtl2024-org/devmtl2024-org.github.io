// Could be an env variable, but it's good enough for now
const ARE_TICKETS_AVAILABLE = false;

export default function BuyTicketButton() {
  return ARE_TICKETS_AVAILABLE ? (
    <a
      href="https://www.eventbrite.com/e/devmtl-2024-tickets-987499316037"
      target="_blank"
      rel="noopener noreferrer"
    >
      <button className="px-8 py-4 bg-secondary text-white font-medium rounded-md shadow-md hover:bg-secondary-dark uppercase">
        Buy Ticket
      </button>
    </a>
  ) : (
    <button className="px-8 py-4 bg-secondary text-white font-medium rounded-md shadow-md uppercase opacity-80 cursor-default">
      Tickets available soon
    </button>
  );
}
