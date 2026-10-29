import { Pause } from "@/assets/pauses";

export type Language = "fr" | "en" | "both";

export function pauseLabel(label: Pause["label"], language: Language = "both") {
  const fr = withoutNotes(label.fr);
  const en = withoutNotes(label.en);
  if (language !== "both") {
    return language === "fr" ? fr : en;
  }
  if (fr === en) {
    return fr;
  }

  // Both languages side by side would show each emoji twice: keep the English one only
  const frWithoutEmoji = fr.replace(/\s*\p{Extended_Pictographic}/gu, "");
  return `${frWithoutEmoji}  ·  ${en}`;
}

// "(inclus)" informs ticket buyers on the site, attendees in the room already know
function withoutNotes(text: string) {
  return text.replace(/\s*\([^)]*\)/g, "");
}
