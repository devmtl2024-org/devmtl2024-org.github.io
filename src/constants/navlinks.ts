const base = import.meta.env.BASE_URL;

export const navLinks = [
  { name: { fr: "À propos", en: "About" }, href: `${base}about` },
  { name: { fr: "Conférenciers", en: "Speakers" }, href: `${base}speakers` },
  { name: { fr: "Programme", en: "Schedule" }, href: `${base}schedule` },
  { name: { fr: "Lieu", en: "Venue" }, href: `${base}venue` },
  { name: { fr: "Commanditaires", en: "Sponsors" }, href: `${base}sponsors` },
  {
    name: { fr: "Présentez un sujet (CFP)", en: "Call For Papers" },
    href: "https://www.papercall.io/dev-mtl-2025",
  },
];
