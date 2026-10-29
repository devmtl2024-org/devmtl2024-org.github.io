import { describe, expect, it } from "vitest";
import { pauseLabel } from "./pauseLabel";

describe("pauseLabel", () => {
  it("shows the emoji once, at the end of both languages", () => {
    expect(
      pauseLabel({ fr: "Accueil & Café ☕", en: "Greetings & Coffee ☕" }),
    ).toBe("Accueil & Café  ·  Greetings & Coffee ☕");
  });

  it("leaves out the notes in parentheses, meant for ticket buyers", () => {
    expect(
      pauseLabel({ fr: "Repas (inclus) 🍱", en: "Lunch (included) 🍱" }),
    ).toBe("Repas  ·  Lunch 🍱");
  });

  it("shows a single language when asked to", () => {
    expect(
      pauseLabel({ fr: "Repas (inclus) 🍱", en: "Lunch (included) 🍱" }, "en"),
    ).toBe("Lunch 🍱");
  });

  it("shows a label once when both languages say the same", () => {
    expect(pauseLabel({ fr: "Pause", en: "Pause" })).toBe("Pause");
  });
});
