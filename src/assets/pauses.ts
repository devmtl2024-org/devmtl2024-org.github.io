export type Pause = {
  time: string;
  label: { fr: string; en: string };
};

export const pauses: Pause[] = [
  {
    time: "2026-11-27T08:00:00",
    label: { fr: "Accueil & Café ☕", en: "Greetings & Coffee ☕" },
  },
  {
    time: "2026-11-27T09:30:00",
    label: { fr: "Pause", en: "Break" },
  },
  {
    time: "2026-11-27T10:45:00",
    label: { fr: "Pause", en: "Break" },
  },
  {
    time: "2026-11-27T11:45:00",
    label: { fr: "Repas (inclus) 🍱", en: "Lunch (included) 🍱" },
  },
  {
    time: "2026-11-27T14:00:00",
    label: { fr: "Pause", en: "Break" },
  },
  {
    time: "2026-11-27T15:00:00",
    label: { fr: "Pause", en: "Break" },
  },
  {
    time: "2026-11-27T16:00:00",
    label: { fr: "Pause", en: "Break" },
  },
  {
    time: "2026-11-27T17:00:00",
    label: { fr: "Fin 👋", en: "The End 👋" },
  },
];
