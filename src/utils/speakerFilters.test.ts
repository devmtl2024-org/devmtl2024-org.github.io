import { aSpeaker } from "@/type/speakers.builder";
import { describe, expect, it } from "vitest";
import { hasAnnouncedTalk, hasPhoto } from "./speakerFilters";

describe("hasAnnouncedTalk", () => {
  it.each([
    ["a speaker and a title", aSpeaker(), true],
    ["no speaker yet", aSpeaker({ name: "" }), false],
    ["no title yet", aSpeaker({ title: "" }), false],
    ["the opening words of the day", aSpeaker({ title: "Intro" }), false],
  ])("%s", (_, speaker, expected) => {
    expect(hasAnnouncedTalk(speaker)).toBe(expected);
  });
});

describe("hasPhoto", () => {
  it.each([
    ["their own photo", aSpeaker({ image: "speakers-2026/ada.jpg" }), true],
    [
      "the generic avatar",
      aSpeaker({ image: "speakers-2026/user.png" }),
      false,
    ],
  ])("%s", (_, speaker, expected) => {
    expect(hasPhoto(speaker)).toBe(expected);
  });
});
