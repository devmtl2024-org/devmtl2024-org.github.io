// Renders the promo reel frame by frame in headless Chromium, then muxes it with the soundtrack.
//   node video/render.mjs stills 3.2,10.5 [--sub 1]  → out/stills/ + out/sheet.png, for quick QA
//   node video/render.mjs frames [--chunks 0-7]      → out/segments/, in parallel (a full reel takes ~25 min)
//   node video/render.mjs mux                        → out/devmtl-<year>.mp4 and a lighter -share.mp4
//   node video/render.mjs all                        → frames, then mux
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { CONFIG } from "./config.mjs";
import { buildReelData } from "./data.mjs";

const VIDEO_DIR = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(VIDEO_DIR, "..");
const OUT = path.join(VIDEO_DIR, "out");
const SEGMENTS = path.join(OUT, "segments");
const FPS = 60;
const CHUNK_FRAMES = 113;
const REEL = buildReelData({ siteRoot: SITE_ROOT, config: CONFIG });
const FRAMES = Math.round(REEL.timeline.dur * FPS);
const CHUNKS = Math.ceil(FRAMES / CHUNK_FRAMES);

const [command = "all", ...args] = process.argv.slice(2);
const option = (name) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : undefined;

if (command === "stills") {
  await stills(args[0], Number(option("--sub") || 1));
} else if (command === "frames") {
  await frames(option("--chunks"));
} else if (command === "chunk") {
  await renderChunk(Number(args[0]));
} else if (command === "mux") {
  await mux();
} else if (command === "all") {
  await frames();
  await mux();
} else {
  throw new Error(`Unknown command "${command}"`);
}

async function stills(times, sub) {
  const dir = path.join(OUT, "stills");
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const { browser, page } = await openReel();
  for (const t of times.split(",").map(Number)) {
    await page.evaluate(([t, sub]) => window.renderTime(t, sub), [t, sub]);
    fs.writeFileSync(
      path.join(dir, `t${t.toFixed(3).padStart(7, "0")}.png`),
      await page.screenshot({ type: "png" }),
    );
  }
  await browser.close();
  const count = fs.readdirSync(dir).length;
  await run("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-framerate",
    "1",
    "-pattern_type",
    "glob",
    "-i",
    path.join(dir, "*.png"),
    "-vf",
    `scale=640:360,tile=3x${Math.ceil(count / 3)}`,
    "-frames:v",
    "1",
    path.join(OUT, "sheet.png"),
  ]);
  console.log(
    `${count} stills in ${dir}, contact sheet in ${path.join(OUT, "sheet.png")}`,
  );
}

async function frames(range = `0-${CHUNKS - 1}`) {
  const [first, last] = range.split("-").map(Number);
  const todo = [...Array(last - first + 1)].map((_, i) => first + i);
  fs.mkdirSync(SEGMENTS, { recursive: true });
  const started = Date.now();
  // one browser per chunk: canvas rendering is single-threaded per page
  const jobs = Math.min(8, os.cpus().length);
  const workers = [...Array(jobs)].map(async () => {
    while (todo.length) {
      await run(process.execPath, [
        fileURLToPath(import.meta.url),
        "chunk",
        String(todo.shift()),
      ]);
    }
  });
  await Promise.all(workers);
  console.log(
    `chunks ${range} of 0-${CHUNKS - 1} rendered in ${Math.round((Date.now() - started) / 1000)}s`,
  );
}

async function renderChunk(k) {
  const from = k * CHUNK_FRAMES,
    to = Math.min(FRAMES, from + CHUNK_FRAMES) - 1;
  const { browser, page } = await openReel();
  const ffmpeg = spawn(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      "-f",
      "image2pipe",
      "-framerate",
      String(FPS),
      "-i",
      "-",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "14",
      "-pix_fmt",
      "yuv420p",
      "-tune",
      "grain",
      segmentPath(k),
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  for (let i = from; i <= to; i++) {
    await page.evaluate((i) => window.renderFrame(i), i);
    const png = await page.screenshot({ type: "png" });
    if (!ffmpeg.stdin.write(png)) {
      await new Promise((resolve) => ffmpeg.stdin.once("drain", resolve));
    }
  }
  ffmpeg.stdin.end();
  await new Promise((resolve) => ffmpeg.on("close", resolve));
  await browser.close();
  console.log(`chunk ${k}: frames ${from}-${to}`);
}

async function mux() {
  const missing = [...Array(CHUNKS)]
    .map((_, k) => segmentPath(k))
    .filter((p) => !fs.existsSync(p));
  if (missing.length) {
    throw new Error(
      `Render these chunks first: ${missing.map((p) => path.basename(p)).join(", ")}`,
    );
  }
  const list = path.join(SEGMENTS, "list.txt");
  fs.writeFileSync(
    list,
    [...Array(CHUNKS)].map((_, k) => `file '${segmentPath(k)}'`).join("\n"),
  );
  const video = path.join(SEGMENTS, "video.mp4"),
    track = path.join(OUT, "track.wav");
  const master = path.join(OUT, `devmtl-${CONFIG.year}.mp4`),
    share = path.join(OUT, `devmtl-${CONFIG.year}-share.mp4`);
  await run("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    list,
    "-c",
    "copy",
    video,
  ]);
  await run(process.execPath, [path.join(VIDEO_DIR, "soundtrack.mjs"), track]);
  await run("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-i",
    video,
    "-i",
    track,
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "320k",
    "-ar",
    "48000",
    "-shortest",
    "-movflags",
    "+faststart",
    master,
  ]);
  await run("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-i",
    master,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "21",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "copy",
    "-movflags",
    "+faststart",
    share,
  ]);
  console.log(`${master}\n${share}`);
}

async function openReel() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  // A fake origin keeps photos and logos same-origin, so the canvas can read their pixels.
  await page.route("http://reel.local/**", (route) => {
    const { pathname } = new URL(route.request().url());
    if (pathname === "/reel-data.js") {
      return route.fulfill({
        contentType: "text/javascript",
        body: `const REEL = ${JSON.stringify(REEL)};`,
      });
    }
    const file = pathname.startsWith("/site/")
      ? path.join(
          SITE_ROOT,
          decodeURIComponent(pathname.slice("/site/".length)),
        )
      : path.join(VIDEO_DIR, decodeURIComponent(pathname));
    return route.fulfill({ path: file });
  });
  await page.goto("http://reel.local/reel.html");
  try {
    await page.waitForFunction(() => window.READY === true, null, {
      timeout: 60000,
    });
  } catch (e) {
    throw new Error(
      `The reel page did not load:\n${errors.join("\n") || e.message}`,
    );
  }
  return { browser, page };
}

function segmentPath(k) {
  return path.join(SEGMENTS, `seg_${String(k).padStart(2, "0")}.mp4`);
}

function run(cmd, cmdArgs) {
  return new Promise((resolve, reject) => {
    spawn(cmd, cmdArgs, { stdio: "inherit" }).on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited with ${code}`)),
    );
  });
}
