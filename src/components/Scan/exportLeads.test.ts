import { describe, expect, it } from "vitest";
import { toCsv } from "./exportLeads";
import { Lead } from "./leads";

const camille: Lead = {
  id: "camille@studioboreal.example",
  firstName: "Camille",
  lastName: "Tremblay",
  fullName: "Camille Tremblay",
  organization: "Studio Boréal",
  title: "Développeuse full-stack",
  phone: "+1 438-555-0142",
  email: "camille@studioboreal.example",
  url: "https://www.linkedin.com/in/camille-tremblay",
  scannedAt: "2026-11-27T10:05:00",
  note: "Wants a demo",
};

const maika: Lead = {
  id: "maïka nguyen|undefined",
  firstName: "Maïka",
  lastName: "Nguyen",
  fullName: "Maïka Nguyen",
  scannedAt: "2026-11-27T10:00:00",
  note: "",
};

describe("toCsv", () => {
  it("writes one row per lead, with a BOM so Excel reads the accents", () => {
    expect(toCsv([camille, maika])).toBe(
      "\uFEFF" +
        [
          "First name,Last name,Organization,Title,Email,Phone,LinkedIn,Note,Scanned at",
          "Camille,Tremblay,Studio Boréal,Développeuse full-stack,camille@studioboreal.example,'+1 438-555-0142,https://www.linkedin.com/in/camille-tremblay,Wants a demo,2026-11-27T10:05:00",
          "Maïka,Nguyen,,,,,,,2026-11-27T10:00:00",
        ].join("\r\n"),
    );
  });

  it("quotes values holding commas, quotes or line breaks", () => {
    const lead = {
      ...maika,
      organization: "Studio Boréal, inc.",
      note: 'Said "call me"\nnext week',
    };

    expect(toCsv([lead]).split("\r\n")[1]).toBe(
      'Maïka,Nguyen,"Studio Boréal, inc.",,,,,"Said ""call me""\nnext week",2026-11-27T10:00:00',
    );
  });

  // A participant controls their own badge fields
  it.each(["=HYPERLINK(1)", "+1", "-1", "@SUM(1)"])(
    "neutralizes a value starting like a formula: %s",
    (title) => {
      const row = toCsv([{ ...maika, title }]).split("\r\n")[1];

      expect(row).toBe(`Maïka,Nguyen,,'${title},,,,,2026-11-27T10:00:00`);
    },
  );
});
