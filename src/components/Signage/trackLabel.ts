import { trackNames } from "@/constants/tracks";

// "Track 3 (Communautés)" → "Track 3", "Communautés": French only, the English names make it heavy
export function trackLabel(index: number) {
  const [track, audience] = trackNames[index].fr.replace(/\)$/, "").split(" (");

  return { track, audience };
}
