import { ScheduleSession } from "@/type/schedule";
import { Speaker } from "@/type/speakers";

export function groupSpeakersByTime(
  speakers: Speaker[],
  pauses: string[],
): ScheduleSession[] {
  const grouped: Record<string, ScheduleSession> = {};

  speakers.forEach((speaker) => {
    const time = speaker.time;
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
    const time = pauseTime;

    if (!grouped[time]) {
      grouped[time] = { time, tracks: [], isPause: true };
    }
  });

  return Object.values(grouped).sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  );
}
