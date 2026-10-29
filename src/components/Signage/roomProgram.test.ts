import { ScheduleSession } from "@/type/schedule";
import { aSpeaker } from "@/type/speakers.builder";
import { describe, expect, it } from "vitest";
import { roomProgram } from "./roomProgram";

describe("roomProgram", () => {
  it("keeps the room's own talks and every pause", () => {
    const french = aSpeaker({ title: "En français", track: 1 });
    const english = aSpeaker({ title: "In English", track: 2 });
    const talks = someTalks("2026-11-27T10:00:00", [[french], [english]]);
    const lunch = aPause("2026-11-27T11:45:00");

    expect(roomProgram([talks, lunch], 1)).toEqual([
      { kind: "talk", time: "2026-11-27T10:00:00", speakers: [english] },
      lunch,
    ]);
  });

  it("shows a talk alone in its slot in every room, the rooms are merged for it", () => {
    const keynote = aSpeaker({ title: "Keynote", track: 1 });
    const talks = someTalks("2026-11-27T08:30:00", [[keynote]]);

    expect(roomProgram([talks], 2)).toEqual([
      { kind: "talk", time: "2026-11-27T08:30:00", speakers: [keynote] },
    ]);
  });

  it("skips a slot where the room has no talk", () => {
    const busy = someTalks("2026-11-27T10:00:00", [
      [aSpeaker({ track: 1 })],
      [aSpeaker({ track: 2 })],
    ]);

    expect(roomProgram([busy], 2)).toEqual([]);
  });

  it("starts at the first talk, after the welcome", () => {
    const welcome = aPause("2026-11-27T08:00:00");
    const keynote = aSpeaker({ time: "2026-11-27T08:30:00" });
    const talks = someTalks("2026-11-27T08:30:00", [[keynote]]);

    expect(roomProgram([welcome, talks], 0)).toEqual([
      { kind: "talk", time: "2026-11-27T08:30:00", speakers: [keynote] },
    ]);
  });
});

function aPause(time: string): ScheduleSession {
  return { kind: "pause", time, label: { fr: "Pause", en: "Break" } };
}

function someTalks(
  time: string,
  tracks: ReturnType<typeof aSpeaker>[][],
): ScheduleSession {
  return { kind: "talks", time, tracks };
}
