// Everything the reel shows, read from the site's own content so next year's video follows the data.
import fs from "node:fs";
import path from "node:path";

const BPM = 128;
// The honeycomb has 8 hand-picked cells to frame a close-up (see FOCUS_CELLS in reel.html).
const MAX_FEATURED = 8;
const TIERS = [
  { level: "or", label: ["OR", "GOLD"] },
  { level: "argent", label: ["ARGENT", "SILVER"] },
  { level: "bronze", label: ["BRONZE", ""] },
];

export function buildReelData({ siteRoot, config }) {
  const speakers = readJsonDir(
    path.join(siteRoot, `src/assets/speakers-${config.year}`),
  );
  const sponsors = readJsonDir(path.join(siteRoot, "src/assets/sponsors"));
  const sponsorTiers = TIERS.map((tier) => ({
    ...tier,
    sponsors: sponsors
      .filter((s) => s.isEnabled && s.level === tier.level)
      .sort((a, b) =>
        (a.joinedAt || "9999").localeCompare(b.joinedAt || "9999"),
      )
      .map((s) => ({ name: s.name, logo: `public/${s.logo}` })),
  })).filter((tier) => tier.sponsors.length > 0);

  return {
    config,
    stats: stats(speakers, config),
    featured: featuredSpeakers(speakers, config.featured),
    photos: [
      ...new Set(speakers.filter(hasPhoto).map((s) => `public/${s.image}`)),
    ],
    communities: [
      ...new Set(
        speakers
          .map((s) => s.community)
          .filter(Boolean)
          .map((c) => c.toUpperCase()),
      ),
    ],
    sponsorTiers,
    timeline: timeline(config.featured.length, sponsorTiers.length > 0),
  };
}

function readJsonDir(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
}

// A talk is a schedule slot: co-presented talks and not-yet-announced slots count once.
function stats(speakers, config) {
  const talks = new Set(speakers.map((s) => `${s.time}|${s.track}`)).size;
  const tracks = new Set(speakers.map((s) => s.track)).size;
  return [
    {
      value: config.days,
      label: config.days > 1 ? ["JOURS", "DAYS"] : ["JOUR", "DAY"],
    },
    { value: tracks, label: ["TRACKS", ""] },
    { value: talks, label: ["PRÉSENTATIONS", "TALKS"] },
    {
      value: config.attendees,
      plus: true,
      label: ["PARTICIPANT(E)S", "ATTENDEES"],
    },
  ].map((s) => ({ ...s, cols: odometerColumns(s.value, s.plus) }));
}

// Odometer columns: [plus sign on/off, hundreds, tens, units]; 10 stands for an empty column.
const BLANK = 10;
function odometerColumns(value, plus = false) {
  const digits = String(value)
    .padStart(3, " ")
    .split("")
    .map((d) => (d === " " ? BLANK : Number(d)));
  return [plus ? 1 : 0, ...digits];
}

function featuredSpeakers(speakers, names) {
  if (names.length > MAX_FEATURED) {
    throw new Error(
      `Feature at most ${MAX_FEATURED} speakers, got ${names.length}`,
    );
  }
  return names.map((name) => featuredSpeaker(speakers, name));
}

function featuredSpeaker(speakers, name) {
  const speaker = speakers.find((s) => s.name === name);
  if (!speaker) {
    throw new Error(
      `Featured speaker "${name}" is not in the lineup — check config.featured`,
    );
  }
  if (!hasPhoto(speaker)) {
    throw new Error(`Featured speaker "${name}" has no photo yet`);
  }
  const isKeynote = /^keynote\b/i.test(speaker.title);
  const time = speaker.time.slice(11, 16);
  return {
    name: speaker.name,
    title: speaker.title.replace(/^keynote\s*[-–:]\s*/i, ""),
    meta: isKeynote ? `KEYNOTE · ${time}` : `TRACK ${speaker.track} · ${time}`,
    photo: `public/${speaker.image}`,
  };
}

function hasPhoto(speaker) {
  return !speaker.image.endsWith("/user.png");
}

// The scenes are authored on a 32-beat grid (the original 15s cut). `warp` maps those beats onto the
// real edit: slope 1 during motion, stretched during holds. Speakers and sponsors are scheduled on
// the real grid directly: an overview bar, one bar per featured speaker, a bar back on the wall,
// then two bars of sponsors (if any) and the 16-beat finale.
function timeline(featuredCount, hasSponsors) {
  const focusAt = [...Array(featuredCount)].map((_, k) => 36 + 4 * k);
  const sponsorsAt = 36 + 4 * featuredCount + 4;
  const finaleAt = sponsorsAt + (hasSponsors ? 8 : 0);
  const beats = finaleAt + 16;
  const f = finaleAt;
  return {
    bpm: BPM,
    focusAt,
    pullback: sponsorsAt - 4.5,
    sponsorsAt,
    finaleAt,
    beats,
    dur: (beats * 60) / BPM,
    warp: [
      [0, 0],
      [3, 7],
      [4, 8],
      [5, 10],
      [5.75, 10.75],
      [6, 11],
      [7, 15],
      [8, 16],
      [9, 18],
      [10, 20],
      [11, 22],
      [12, 24],
      [13.75, 26.75],
      [14, 27],
      [15, 29],
      [15.5, 31.5],
      [16, 32],
      [16.5, 32.5],
      [18.75, 35.4],
      [24, f],
      [25, f + 2],
      [25.75, f + 2.75],
      [26, f + 4],
      [27, f + 6],
      [28, f + 8],
      [29, f + 10],
      [30, f + 12],
      [32, f + 16],
    ],
    typeStart: 0.75,
    typeStep: 0.12,
    typeJitter: [
      0, 0.012, -0.01, 0.02, 0, -0.008, 0.015, 0, 0.01, -0.005, 0.018,
    ],
  };
}

// Maps a beat of the original 32-beat grid onto the edit (shared by the soundtrack; reel.html has a copy).
export function warpBeat(warp, n) {
  for (let i = 1; i < warp.length; i++) {
    if (n <= warp[i][0]) {
      const [a0, b0] = warp[i - 1],
        [a1, b1] = warp[i];
      return b0 + ((n - a0) * (b1 - b0)) / (a1 - a0);
    }
  }
  const [a, c] = warp[warp.length - 1];
  return c + (n - a);
}
