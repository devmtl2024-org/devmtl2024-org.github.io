// Renders signage/index.html (served by Vite in dev, never built for the site) to what Concordia's TVs play: one .jpg per slide, and one muted .mp4 per reel.
// Also the 11x17 .pdf posters Concordia prints for the stands in front of the rooms.
//   node signage/render.mjs → signage/out/
// A sponsor's own slide replaces the default one: drop a 1920×1080 overrides/sponsor-<logo name>.jpg
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";

const SIGNAGE_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(SIGNAGE_DIR, "out");
const OVERRIDES = path.join(SIGNAGE_DIR, "overrides");
const FPS = 30;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const slides = await renderSignage();
const reels = new Set(slides.map((s) => s.reel).filter(Boolean));
for (const reel of reels) {
  await encodeReel(
    reel,
    slides.filter((s) => s.reel === reel),
  );
}

async function renderSignage() {
  const vite = await createServer({
    root: path.resolve(SIGNAGE_DIR, ".."),
    server: { port: 5199 },
    logLevel: "warn",
  });
  await vite.listen();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 2000, height: 1200 },
    });
    await openSignage(page);
    const slides = await screenshotSlides(page);
    await printPosters(page);
    return slides;
  } finally {
    await browser.close();
    await vite.close();
  }
}

async function openSignage(page) {
  await page.goto("http://localhost:5199/signage/index.html");
  await page.waitForSelector("[data-signage-ready]", { timeout: 60000 });
  await page.evaluate(() =>
    Promise.all([
      document.fonts.ready,
      ...[...document.images].map((img) => img.decode()),
    ]),
  );
}

async function screenshotSlides(page) {
  const found = await page.$$eval("[data-slide]", (sections) =>
    sections.map((s) => ({
      id: s.dataset.slide,
      reel: s.dataset.reel,
      seconds: Number(s.dataset.seconds),
    })),
  );
  const slides = [];
  for (const [index, slide] of found.entries()) {
    const file = path.join(
      OUT,
      slide.reel
        ? `${slide.reel}-${String(index + 1).padStart(2, "0")}-${slide.id}.jpg`
        : `${slide.id}.jpg`,
    );
    const override = path.join(OVERRIDES, `${slide.id}.jpg`);
    if (fs.existsSync(override)) {
      fs.copyFileSync(override, file);
    } else {
      await page
        .locator(`[data-slide="${slide.id}"]`)
        .screenshot({ path: file, type: "jpeg", quality: 92 });
    }
    slides.push({ ...slide, file });
  }
  return slides;
}

// Printing the whole page would paginate every slide: each poster is printed alone, on a fresh page
async function printPosters(page) {
  const ids = await page.$$eval("[data-poster]", (posters) =>
    posters.map((poster) => poster.dataset.poster),
  );
  for (const id of ids) {
    await openSignage(page);
    await page.evaluate((id) => {
      document.body.replaceChildren(
        document.querySelector(`[data-poster="${id}"]`),
      );
    }, id);
    const file = path.join(OUT, `${id}.pdf`);
    await page.pdf({
      path: file,
      width: "11in",
      height: "17in",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    console.log(file);
  }
}

// Plain cuts: the TVs loop the file, so the last slide cuts back to the first
async function encodeReel(reel, slides) {
  const mp4 = path.join(OUT, `devmtl-2026-${reel}.mp4`);
  await run("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    ...slides.flatMap((s) => [
      "-loop",
      "1",
      "-framerate",
      String(FPS),
      "-t",
      String(s.seconds),
      "-i",
      s.file,
    ]),
    "-filter_complex",
    `${slides.map((_, i) => `[${i}:v]`).join("")}concat=n=${slides.length}:v=1:a=0,format=yuv420p`,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "18",
    "-movflags",
    "+faststart",
    mp4,
  ]);
  console.log(`${mp4} (${slides.map((s) => s.id).join(", ")})`);
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    spawn(cmd, args, { stdio: "inherit" }).on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited with ${code}`)),
    );
  });
}
