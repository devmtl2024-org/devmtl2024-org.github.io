const base = import.meta.env.BASE_URL;

export const navLinks = [
  { name: "About", href: `${base}about`.replace(/\/$/, "") },
  { name: "Speakers", href: `${base}speakers`.replace(/\/$/, "") },
  { name: "Schedule", href: `${base}schedule`.replace(/\/$/, "") },
  { name: "Venue", href: `${base}venue`.replace(/\/$/, "") },
  { name: "Sponsors", href: `${base}sponsors`.replace(/\/$/, "") },
];