import { ScheduleSession } from "@/type/schedule";
import { aSpeaker } from "@/type/speakers.builder";
import { describe, expect, it } from "vitest";
import { splitAtLunch } from "./splitAtLunch";

describe("splitAtLunch", () => {
  it("ends the morning with the longest pause of the day", () => {
    const keynote = someTalks("2026-11-27T08:30:00");
    const coffee = aPause("2026-11-27T09:30:00", "Pause");
    const late = someTalks("2026-11-27T10:00:00");
    const lunch = aPause("2026-11-27T11:45:00", "Repas");
    const afternoon = someTalks("2026-11-27T13:15:00");
    const end = aPause("2026-11-27T17:00:00", "Fin");

    expect(
      splitAtLunch([keynote, coffee, late, lunch, afternoon, end]),
    ).toEqual({
      morning: [keynote, coffee, late, lunch],
      afternoon: [afternoon, end],
    });
  });

  it("starts the morning at the first talk, after the welcome", () => {
    const welcome = aPause("2026-11-27T08:00:00", "Accueil");
    const keynote = someTalks("2026-11-27T08:30:00");
    const lunch = aPause("2026-11-27T11:45:00", "Repas");
    const afternoon = someTalks("2026-11-27T13:15:00");

    expect(splitAtLunch([welcome, keynote, lunch, afternoon]).morning).toEqual([
      keynote,
      lunch,
    ]);
  });
});

function aPause(time: string, label: string): ScheduleSession {
  return { kind: "pause", time, label: { fr: label, en: label } };
}

function someTalks(time: string): ScheduleSession {
  return { kind: "talks", time, tracks: [[aSpeaker({ time })]] };
}
