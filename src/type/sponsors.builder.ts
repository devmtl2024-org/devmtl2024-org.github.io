import { Sponsor } from "./sponsors";

export function aSponsor(sponsor: Partial<Sponsor> = {}): Sponsor {
  return {
    name: "Acme",
    logo: "sponsors/acme.png",
    url: "https://acme.example",
    isEnabled: true,
    description: { fr: "Une description", en: "A description" },
    level: "or",
    joinedAt: "2026-01-01",
    ...sponsor,
  };
}
