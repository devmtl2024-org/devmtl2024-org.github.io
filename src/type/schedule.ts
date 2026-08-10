import { Pause } from "@/assets/pauses";
import { Speaker } from "./speakers";

export type ScheduleSession =
  | { kind: "talks"; time: string; tracks: Speaker[][] }
  | ({ kind: "pause" } & Pause);
