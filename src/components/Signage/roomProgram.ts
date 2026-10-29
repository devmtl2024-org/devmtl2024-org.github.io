import { Pause } from "@/assets/pauses";
import { ScheduleSession } from "@/type/schedule";
import { Speaker } from "@/type/speakers";

export type RoomEntry =
  | { kind: "talk"; time: string; speakers: Speaker[] }
  | ({ kind: "pause" } & Pause);

// What the poster at a room's door lists: its own talks, the keynote (the rooms are merged for it) and the pauses
export function roomProgram(sessions: ScheduleSession[], trackIndex: number) {
  // Whoever reads the poster has already arrived: the welcome is just noise
  const firstTalkIndex = Math.max(
    0,
    sessions.findIndex((session) => session.kind === "talks"),
  );

  return sessions.slice(firstTalkIndex).flatMap((session): RoomEntry[] => {
    if (session.kind === "pause") {
      return [session];
    }

    const busyTracks = session.tracks.filter((track) => track.length > 0);
    const speakers =
      busyTracks.length === 1
        ? busyTracks[0]
        : (session.tracks[trackIndex] ?? []);

    return speakers.length > 0
      ? [{ kind: "talk", time: session.time, speakers }]
      : [];
  });
}
