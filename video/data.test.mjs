import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildReelData } from "./data.mjs";

const BEAT = 60 / 128;
let siteRoot;

afterEach(() => fs.rmSync(siteRoot, { recursive: true, force: true }));

describe("buildReelData", () => {
  it("counts talks as schedule slots, so duos and unannounced slots count once", () => {
    givenSite({
      speakers: [
        aSpeaker({ name: "Ada", time: "2099-11-27T10:00:00", track: 1 }),
        aSpeaker({ name: "Grace", time: "2099-11-27T10:00:00", track: 2 }),
        aSpeaker({ name: "Alan", time: "2099-11-27T11:00:00", track: 1 }),
        aSpeaker({ name: "Joan", time: "2099-11-27T11:00:00", track: 1 }),
        aSpeaker({
          name: "",
          title: "",
          time: "2099-11-27T13:00:00",
          track: 3,
        }),
      ],
    });

    const data = buildReelData({
      siteRoot,
      config: aConfig({ days: 1, attendees: 150 }),
    });

    expect(data.stats.map((s) => s.value)).toEqual([1, 3, 4, 150]);
  });

  it("features the configured speakers with their slot, and a keynote without its prefix", () => {
    givenSite({
      speakers: [
        aSpeaker({
          name: "Ada",
          title: "Keynote - Engines of tomorrow",
          time: "2099-11-27T08:30:00",
          track: 1,
          image: "speakers-2099/ada.jpg",
        }),
        aSpeaker({
          name: "Grace",
          title: "Compilers",
          time: "2099-11-27T16:15:00",
          track: 2,
          image: "speakers-2099/grace.jpg",
        }),
      ],
    });

    const data = buildReelData({
      siteRoot,
      config: aConfig({ featured: ["Grace", "Ada"] }),
    });

    expect(data.featured).toEqual([
      {
        name: "Grace",
        title: "Compilers",
        meta: "TRACK 2 · 16:15",
        photo: "public/speakers-2099/grace.jpg",
      },
      {
        name: "Ada",
        title: "Engines of tomorrow",
        meta: "KEYNOTE · 08:30",
        photo: "public/speakers-2099/ada.jpg",
      },
    ]);
  });

  it("puts every speaker photo on the wall once, without the placeholder avatar", () => {
    givenSite({
      speakers: [
        aSpeaker({ name: "Ada", image: "speakers-2099/ada.jpg" }),
        aSpeaker({ name: "Grace", image: "speakers-2099/user.png" }),
        aSpeaker({ name: "Alan", image: "speakers-2099/alan.jpg" }),
      ],
    });

    const data = buildReelData({ siteRoot, config: aConfig() });

    expect(data.photos).toEqual([
      "public/speakers-2099/ada.jpg",
      "public/speakers-2099/alan.jpg",
    ]);
  });

  it("lists every partner community from the site's list, in its order", () => {
    givenSite({
      speakers: [aSpeaker({ name: "Ada", community: "Some Meetup" })],
      communities: [
        { name: "Ruby Montréal", url: "https://ruby.example" },
        { name: "CNCF Montréal", url: "https://cncf.example" },
      ],
    });

    const data = buildReelData({ siteRoot, config: aConfig() });

    expect(data.communities).toEqual(["RUBY MONTRÉAL", "CNCF MONTRÉAL"]);
  });

  it("shows the enabled gold, silver and bronze sponsors, by tier then by arrival", () => {
    givenSite({
      sponsors: [
        aSponsor({ name: "Late Gold", level: "or", joinedAt: "2099-09-01" }),
        aSponsor({ name: "Bronze", level: "bronze", joinedAt: "2099-01-01" }),
        aSponsor({ name: "Early Gold", level: "or", joinedAt: "2099-02-01" }),
        aSponsor({ name: "Gone", level: "argent", isEnabled: false }),
        aSponsor({ name: "Media", level: "media" }),
        aSponsor({ name: "Supporter", level: "supporter" }),
      ],
    });

    const data = buildReelData({ siteRoot, config: aConfig() });

    expect(data.sponsorTiers).toEqual([
      {
        level: "or",
        label: ["OR", "GOLD"],
        sponsors: [
          { name: "Early Gold", logo: "public/sponsors/early-gold.png" },
          { name: "Late Gold", logo: "public/sponsors/late-gold.png" },
        ],
      },
      {
        level: "bronze",
        label: ["BRONZE", ""],
        sponsors: [{ name: "Bronze", logo: "public/sponsors/bronze.png" }],
      },
    ]);
  });

  it("gives each featured speaker a bar, and the sponsors two, before the 16-bar finale", () => {
    givenSite({
      speakers: [aSpeaker({ name: "Ada" }), aSpeaker({ name: "Grace" })],
      sponsors: [aSponsor({ name: "Gold", level: "or" })],
    });

    const data = buildReelData({
      siteRoot,
      config: aConfig({ featured: ["Ada", "Grace"] }),
    });

    expect(data.timeline).toMatchObject({
      dropAt: 36,
      focusAt: [40, 44],
      pullback: 47.5,
      sponsorsAt: 52,
      finaleAt: 60,
      beats: 76,
      dur: 76 * BEAT,
    });
  });

  it("skips the sponsor wall when there is no sponsor to thank yet", () => {
    givenSite({ speakers: [aSpeaker({ name: "Ada" })] });

    const data = buildReelData({
      siteRoot,
      config: aConfig({ featured: ["Ada"] }),
    });

    expect(data.timeline).toMatchObject({
      sponsorsAt: 48,
      finaleAt: 48,
      beats: 64,
    });
  });

  it("fails loudly when a featured speaker is not in the lineup", () => {
    givenSite({ speakers: [aSpeaker({ name: "Ada" })] });

    expect(() =>
      buildReelData({ siteRoot, config: aConfig({ featured: ["Nobody"] }) }),
    ).toThrow(/Nobody/);
  });

  it("fails loudly when a featured speaker has no photo yet", () => {
    givenSite({
      speakers: [aSpeaker({ name: "Ada", image: "speakers-2099/user.png" })],
    });

    expect(() =>
      buildReelData({ siteRoot, config: aConfig({ featured: ["Ada"] }) }),
    ).toThrow(/Ada.*photo/);
  });

  it("fails loudly when more speakers are featured than the honeycomb has close-up spots", () => {
    const names = [...Array(9)].map((_, i) => `Speaker ${i}`);
    givenSite({
      speakers: names.map((name, i) =>
        aSpeaker({ name, image: `speakers-2099/${i}.jpg` }),
      ),
    });

    expect(() =>
      buildReelData({ siteRoot, config: aConfig({ featured: names }) }),
    ).toThrow(/at most 8/);
  });
});

function givenSite({ speakers = [], sponsors = [], communities = [] }) {
  siteRoot = fs.mkdtempSync(path.join(os.tmpdir(), "reel-site-"));
  const speakersDir = path.join(siteRoot, "src/assets/speakers-2099");
  const sponsorsDir = path.join(siteRoot, "src/assets/sponsors");
  fs.mkdirSync(speakersDir, { recursive: true });
  fs.mkdirSync(sponsorsDir, { recursive: true });
  speakers.forEach((s, i) =>
    fs.writeFileSync(path.join(speakersDir, `${i}.json`), JSON.stringify(s)),
  );
  sponsors.forEach((s, i) =>
    fs.writeFileSync(path.join(sponsorsDir, `${i}.json`), JSON.stringify(s)),
  );
  fs.writeFileSync(
    path.join(siteRoot, "src/assets/communities.json"),
    JSON.stringify(communities),
  );
}

function aSpeaker(overrides = {}) {
  return {
    name: "Ada Lovelace",
    title: "Notes on the Analytical Engine",
    image: "speakers-2099/ada.jpg",
    time: "2099-11-27T10:00:00",
    track: 1,
    ...overrides,
  };
}

function aSponsor(overrides = {}) {
  const name = overrides.name || "Acme";
  return {
    name,
    logo: `sponsors/${name.toLowerCase().replace(/ /g, "-")}.png`,
    isEnabled: true,
    level: "or",
    joinedAt: "2099-01-01",
    ...overrides,
  };
}

function aConfig(overrides = {}) {
  return { year: 2099, days: 1, attendees: 100, featured: [], ...overrides };
}
