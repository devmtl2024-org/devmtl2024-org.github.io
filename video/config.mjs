// Editorial choices for the promo reel. Everything else (speakers, sponsors, communities, talk
// count, photos, logo) is read from the site's content. Update this file for each edition.
export const CONFIG = {
  year: 2026,
  date: "27.11.2026",
  venue: "UNIVERSITÉ CONCORDIA  ·  MONTRÉAL",
  coordinates: "45.4973°N  73.5790°W",
  url: "dev-mtl.ca",
  days: 1,
  attendees: 150,
  // One bar (~1.9s) each, in this order. Pick head-and-shoulders photos: full-body shots are
  // unrecognizable at close-up size. Short titles read best.
  featured: [
    "Fabien Antoine",
    "Hugues Lamy",
    "Imad-eddine Charchar",
    "Reza Madabadi",
    "Carl Lapierre",
    "Margaret Gu",
  ],
  copy: {
    tagline: [
      "LA CONFÉRENCE DES COMMUNAUTÉS TECH DE MONTRÉAL",
      "MONTREAL'S COMMUNITY-DRIVEN TECH CONFERENCE",
    ],
    band: [
      { fr: "TOUTES LES COMMUNAUTÉS", en: "EVERY MONTRÉAL TECH COMMUNITY" },
      { fr: "UNE SEULE CONFÉRENCE", en: "ONE CONFERENCE" },
    ],
    speakersTag: "CONFÉRENCIER(E)S  /  SPEAKERS 2026",
    sponsors: {
      fr: "MERCI À NOS COMMANDITAIRES",
      en: "THANK YOU TO OUR SPONSORS",
    },
    tickets: "BILLETS / TICKETS",
  },
};
