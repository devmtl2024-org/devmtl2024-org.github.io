import { Pause } from "@/assets/pauses";
import { ScheduleSession } from "@/type/schedule";
import { Speaker } from "@/type/speakers";

export function groupSpeakersByTime(
  speakers: Speaker[],
  pauses: Pause[],
): ScheduleSession[] {
  const talksByTime: Record<string, Speaker[][]> = {};

  speakers.forEach((speaker) => {
    const tracks = (talksByTime[speaker.time] ??= []);
    const trackIndex = speaker.track - 1;

    while (tracks.length <= trackIndex) {
      tracks.push([]);
    }

    // Co-speakers of a same talk share a track, hence the list
    tracks[trackIndex].push(speaker);
  });

  const sessions: ScheduleSession[] = [
    ...Object.entries(talksByTime).map(
      ([time, tracks]): ScheduleSession => ({ kind: "talks", time, tracks }),
    ),
    ...pauses.map((pause): ScheduleSession => ({ kind: "pause", ...pause })),
  ];

  return sessions.sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  );
}
