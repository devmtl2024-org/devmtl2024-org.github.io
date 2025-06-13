export interface Sponsor {
  name: string;
  logo: string;
  url: string;
  isEnabled: boolean;
  description: string;
  level: "or" | "argent" | "bronze" | "supporter";
}
