import { Speaker } from "./speakers";

export type ScheduleSession = {
  time: string;
  track1: Speaker | null;
  track2: Speaker | null;
};