import { ScheduleSession } from "@/type/schedule";

// Lunch is the longest pause, whatever its label says
export function splitAtLunch(sessions: ScheduleSession[]) {
  const pauseLengths = sessions.map((session, i) =>
    session.kind === "pause" && i < sessions.length - 1
      ? minutesBetween(session.time, sessions[i + 1].time)
      : 0,
  );
  const lunchIndex = pauseLengths.indexOf(Math.max(...pauseLengths));
  // Whoever reads the TV has already arrived: the welcome is just noise
  const firstTalkIndex = Math.max(
    0,
    sessions.findIndex((session) => session.kind === "talks"),
  );

  return {
    morning: sessions.slice(firstTalkIndex, lunchIndex + 1),
    afternoon: sessions.slice(lunchIndex + 1),
  };
}

function minutesBetween(from: string, to: string) {
  return (new Date(to).getTime() - new Date(from).getTime()) / 60_000;
}
