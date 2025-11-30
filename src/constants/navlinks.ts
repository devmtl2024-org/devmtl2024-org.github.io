const base = import.meta.env.BASE_URL;

export const navLinks = [
  {
    name: { fr: "À propos", en: "About" },
    href: `${base}about`,
  },
  {
    inHeader: true,
    name: { fr: "Conférenciers", en: "Speakers" },
    href: `${base}speakers/2025`,
  },
  {
    inHeader: true,
    name: { fr: "Programme", en: "Schedule" },
    href: `${base}schedule`,
  },
  { name: { fr: "Lieu", en: "Venue" }, href: `${base}venue` },
  {
    inHeader: true,
    name: { fr: "Commanditaires", en: "Sponsors" },
    href: `${base}sponsors`,
  },
  {
    inHeader: true,
    name: { fr: "Transparence", en: "Transparency" },
    href: `${base}transparency`,
  },
  {
    name: { fr: "Code de conduite", en: "Code of Conduct" },
    href: `${base}conduct`,
  },
  {
    name: { fr: "Présentez (CFP)", en: "Call For Papers" },
    href: "https://www.papercall.io/dev-mtl-2025",
  },
];
