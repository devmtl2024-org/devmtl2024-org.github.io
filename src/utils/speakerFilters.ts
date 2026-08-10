import { Speaker } from "@/type/speakers";

// Sessions still waiting for a speaker or a title only belong to the schedule
export function hasAnnouncedTalk(speaker: Speaker) {
  return (
    speaker.name !== "" && speaker.title !== "" && speaker.title !== "Intro"
  );
}

// Speakers we have no picture of yet fall back to a generic avatar, which is
// fine in the full listings but spoils the showcases on the home page
export function hasPhoto(speaker: Speaker) {
  return !speaker.image.endsWith("user.png");
}
