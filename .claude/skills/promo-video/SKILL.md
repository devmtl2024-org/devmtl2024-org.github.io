---
name: promo-video
description: Regenerate the /dev/mtl promo reel (a ~40s, 1080p60 motion-graphics video with a synthesized soundtrack) from the site's own content. Use when asked to make, update or re-render the promo/teaser/showreel video for an edition, feature other speakers in it, or refresh it after the lineup or sponsors change.
---

# /dev/mtl promo reel

The reel is code in `video/`. It reads the site's content, so a new edition mostly needs an up-to-date
site and a new `video/config.mjs`. It is a 128 BPM edit: every cut, whip and impact lands on a beat,
and the soundtrack is synthesized from the same timeline.

| File                   | Role                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `video/config.mjs`     | Editorial choices: year, date, venue, attendee count, featured speakers, copy       |
| `video/data.mjs`       | Reads speakers, sponsors, photos; derives talk count, tracks, communities, timeline |
| `video/reel.html`      | The scenes, drawn on a canvas, deterministic in time (`renderFrame(i)`)             |
| `video/soundtrack.mjs` | The music and sound effects, generated from the same timeline                       |
| `video/render.mjs`     | Headless Chromium → frames → ffmpeg, plus the stills/QA and mux commands            |

## Setup (once per machine)

```bash
brew install ffmpeg
yarn install
yarn playwright install chromium --only-shell
```

Rendering loads Archivo and JetBrains Mono from Google Fonts, so it needs network access.

## Recipe for a new edition

1. **Get the site content right first.** The reel shows what the site has: `src/assets/speakers-{year}/`,
   `src/assets/sponsors/` (`isEnabled`, `level`, `joinedAt`), photos in `public/`. Only enabled gold,
   silver and bronze sponsors appear, ordered like the site (tier, then arrival).
2. **Edit `video/config.mjs`.** Bump `year`, `date`, `venue`, `attendees` and the copy.
   Pick `featured` speakers (at most 8, one bar ≈ 1.9s each, listed in schedule order):
   - head-and-shoulders photos only: a full-body shot is unrecognizable at close-up size;
   - short titles, since each one is on screen for about a second and a half;
   - a mix of French and English talks and all tracks.
3. **Validate the data:** `yarn vitest run video/`. `buildReelData` throws on a featured speaker who is
   missing from the lineup, has no photo, or on more than 8 featured speakers.
4. **Check key frames before the long render.** `yarn video:stills 1,5,9.6,11.6,20,30.2,31.6,40`
   writes `video/out/sheet.png` (times are seconds; stills skip motion blur, so they take seconds, not
   minutes). Look at every section, see the checklist below.
5. **Render:** `yarn video` (about 25 minutes with 8 parallel Chromium instances). When a command
   timeout applies (Claude Code caps a call at 10 minutes), render in batches instead:
   `yarn video frames --chunks 0-7`, `8-15`, `16-21` (the last index is printed), then `yarn video mux`.
6. **Measure, don't eyeball, what you report:**
   ```bash
   ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -show_entries format=duration -of compact video/out/devmtl-2026.mp4
   ffmpeg -hide_banner -i video/out/devmtl-2026.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary
   ```
   Expect `duration × 60` frames, around -14 LUFS, and a true peak below 0 dBFS.
7. **Deliver** `video/out/devmtl-{year}.mp4` (master, ~150 MB) and `-share.mp4` (~20 MB, same
   picture to the eye). `video/out/` is git-ignored.

## QA checklist

- **Numbers:** talks = distinct time + track slots (co-presented talks and unannounced slots count
  once). Cross-check with the home page counter in `src/components/Home/Numbers.tsx`, which is
  hardcoded and has drifted before (21 shown, 19 real).
- **Communities:** each name appears once, all white, and an orange flash visits each one in turn.
  The names come from the speakers' `community` field.
- **Close-ups:** the face reads, the name fits (long names shrink), and the title finishes typing before the whip.
- **Sponsors:** gold cards bigger than silver, silver bigger than bronze, logos legible. Logos are
  trimmed to their visible pixels and set on white cards, because most are dark art on transparency.
- **End card:** date, venue, URL.
- **Audio:** the soundtrack has only been checked through waveforms, spectrograms and loudness
  numbers, never by ear from Claude. Ask a human to listen before publishing.

## How the timeline works

- **Two beat grids.** Scenes in `reel.html` were authored on a 32-beat grid, the original 15s cut:
  `b(n)` maps those beats through `timeline.warp`, which keeps motion at full speed and stretches
  the holds. Speakers and sponsors are scheduled on the real grid directly: `nb(n) = n × 60/128`.
- **Speakers and sponsors section.** `data.mjs` lays it out:
  - an overview bar;
  - one bar per featured speaker, whips on downbeats;
  - a bar back on the full wall;
  - two sponsor bars (skipped when there are no sponsors);
  - the 16-beat finale.
- **Soundtrack in sync.** The soundtrack uses the same `timeline`: `b(n)` on the music grid, `ob(n)`
  for events of the original grid. When you move or add a visual event, add its sound at the same beat.
- **Motion blur.** It comes from accumulating 6 sub-frames per frame, and 24 in the `HOT` windows of
  fast moves. Add a window there for any new fast move, or it will show stepping.
