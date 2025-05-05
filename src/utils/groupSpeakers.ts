import { ScheduleSession } from "@/type/schedule";
import { Speaker } from "@/type/speakers";

export function groupSpeakersByTime(speakers: Speaker[]): ScheduleSession[] {
  const grouped: Record<string, ScheduleSession> = {};

  speakers.forEach((speaker) => {
    const time = new Date(speaker.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    if (!grouped[time]) {
      grouped[time] = { time, track1: null, track2: null };
    }
    grouped[time][`track${speaker.track}` as "track1" | "track2"] = speaker;
  });

  return Object.values(grouped).sort(
    (a, b) =>
      new Date(`1970/01/01 ${a.time}`).getTime() -
      new Date(`1970/01/01 ${b.time}`).getTime(),
  );
}
