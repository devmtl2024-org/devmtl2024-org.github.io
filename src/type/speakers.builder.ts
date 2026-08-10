import { Speaker } from "./speakers";

export function aSpeaker(speaker: Partial<Speaker> = {}): Speaker {
  return {
    name: "Ada Lovelace",
    bio: null,
    position: null,
    image: "speakers-2026/user.png",
    time: "2026-11-27T10:00:00",
    track: 1,
    title: "A talk",
    description: "A description",
    github: null,
    linkedin: null,
    website: null,
    ...speaker,
  };
}
