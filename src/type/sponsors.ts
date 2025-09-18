export interface Sponsor {
  name: string;
  logo: string;
  url: string;
  isEnabled: boolean;
  description: { fr: string; en: string };
  level: "or" | "argent" | "bronze" | "supporter";
}
