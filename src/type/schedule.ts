import { Speaker } from "./speakers";

export type ScheduleSession = {
  time: string;
  tracks: (Speaker | null)[];
};
