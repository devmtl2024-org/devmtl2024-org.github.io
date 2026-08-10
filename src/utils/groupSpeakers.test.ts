import { aSpeaker } from "@/type/speakers.builder";
import { describe, expect, it } from "vitest";
import { groupSpeakersByTime } from "./groupSpeakers";

describe("groupSpeakersByTime", () => {
  it("puts each speaker in its own track", () => {
    const salmon = aSpeaker({ name: "Thomas Salmon", time: "10:00", track: 1 });
    const therrien = aSpeaker({
      name: "Zackary Therrien",
      time: "10:00",
      track: 2,
    });

    expect(groupSpeakersByTime([salmon, therrien], [])).toEqual([
      { kind: "talks", time: "10:00", tracks: [[salmon], [therrien]] },
    ]);
  });

  it("puts the co-speakers of a same talk in a same track", () => {
    const soichet = aSpeaker({ name: "Damien Soichet", time: "10:00" });
    const cailleau = aSpeaker({ name: "François Cailleau", time: "10:00" });

    expect(groupSpeakersByTime([soichet, cailleau], [])).toEqual([
      { kind: "talks", time: "10:00", tracks: [[soichet, cailleau]] },
    ]);
  });

  it("leaves empty the tracks without a talk", () => {
    const lamy = aSpeaker({ name: "Hugues Lamy", time: "10:00", track: 3 });

    expect(groupSpeakersByTime([lamy], [])).toEqual([
      { kind: "talks", time: "10:00", tracks: [[], [], [lamy]] },
    ]);
  });

  it("sorts the pauses with the talks, in chronological order", () => {
    const lunch = {
      time: "2026-11-27T11:45:00",
      label: { fr: "Repas", en: "Lunch" },
    };
    const morning = aSpeaker({ time: "2026-11-27T10:00:00" });
    const afternoon = aSpeaker({ time: "2026-11-27T13:15:00" });

    expect(groupSpeakersByTime([afternoon, morning], [lunch])).toEqual([
      { kind: "talks", time: "2026-11-27T10:00:00", tracks: [[morning]] },
      { kind: "pause", ...lunch },
      { kind: "talks", time: "2026-11-27T13:15:00", tracks: [[afternoon]] },
    ]);
  });
});
