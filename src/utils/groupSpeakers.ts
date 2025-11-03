import { ScheduleSession } from "@/type/schedule";
import { Speaker } from "@/type/speakers";

export function groupSpeakersByTime(
  speakers: Speaker[],
  pauses: string[],
): ScheduleSession[] {
  const grouped: Record<string, ScheduleSession> = {};

  speakers.forEach((speaker) => {
    const time = new Date(speaker.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const trackIndex = speaker.track - 1;

    if (!grouped[time]) {
      grouped[time] = { time, tracks: [] };
    }

    const session = grouped[time];

    while (session.tracks.length <= trackIndex) {
      session.tracks.push(null);
    }

    session.tracks[trackIndex] = speaker;
  });

  pauses.forEach((pauseTime) => {
    const time = new Date(pauseTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    if (!grouped[time]) {
      grouped[time] = { time, tracks: [], isPause: true };
    }
  });

  return Object.values(grouped).sort(
    (a, b) =>
      new Date(`1970/01/01 ${a.time}`).getTime() -
      new Date(`1970/01/01 ${b.time}`).getTime(),
  );
}
