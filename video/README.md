# Promo reel

A ~40s, 1080p60 motion-graphics video of the current edition, generated from the site's own content
(speakers, sponsors, photos, logo) with a synthesized, beat-synced soundtrack.

```bash
yarn playwright install chromium --only-shell # once; ffmpeg must be installed too
yarn video:stills 5,20,31.6                   # quick look at a few moments → video/out/sheet.png
yarn video                                    # full render (~25 min) → video/out/devmtl-<year>.mp4
```

For a new edition, update `config.mjs`. The full recipe (choosing speakers, QA checklist, how the
timeline works) is in [`.claude/skills/promo-video/SKILL.md`](../.claude/skills/promo-video/SKILL.md).
