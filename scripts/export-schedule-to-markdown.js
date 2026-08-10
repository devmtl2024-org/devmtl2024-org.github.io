#!/usr/bin/env node

import { exec } from "child_process";
import { readdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { createServer } from "vite";

const execAsync = promisify(exec);
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

const year = process.argv[2] ?? "2026";
const language = process.argv[3] ?? "fr";

main();

async function main() {
  // Going through Vite lets the script reuse the very modules the site runs on,
  // instead of duplicating the schedule logic and letting it drift
  const vite = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "warn",
  });

  try {
    const { groupSpeakersByTime } = await vite.ssrLoadModule(
      "/src/utils/groupSpeakers.ts",
    );
    const { pauses } = await vite.ssrLoadModule("/src/assets/pauses.ts");
    const { formatTime } = await vite.ssrLoadModule(
      "/src/components/Talks/formatTime.ts",
    );
    const { trackNames } = await vite.ssrLoadModule("/src/constants/tracks.ts");

    const speakers = await loadSpeakers(year);
    // Pauses are only defined for the current edition, so exporting a past year
    // should leave them out rather than mix in another day's breaks
    const day = speakers[0]?.time.slice(0, "YYYY-MM-DD".length);
    const schedule = groupSpeakersByTime(
      speakers,
      pauses.filter((pause) => pause.time.startsWith(day)),
    );

    const markdown = toMarkdown(schedule, { formatTime, trackNames });
    const outputPath = join(rootDir, `schedule-export-${year}.md`);
    await writeFile(outputPath, markdown, "utf-8");

    // Aligning the table columns is nice to have, not worth failing the export
    try {
      await execAsync(`yarn prettier --write ${JSON.stringify(outputPath)}`);
    } catch (error) {
      console.warn(`⚠️  Prettier could not format the table: ${error.message}`);
    }

    console.log(
      `✅ ${speakers.length} sessions exported to ${outputPath.replace(rootDir + "/", "")}`,
    );
  } finally {
    await vite.close();
  }
}

async function loadSpeakers(year) {
  const speakersDir = join(rootDir, "src", "assets", `speakers-${year}`);
  const files = await readdir(speakersDir);

  return Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) =>
        JSON.parse(await readFile(join(speakersDir, file), "utf-8")),
      ),
  );
}

function toMarkdown(schedule, { formatTime, trackNames }) {
  const headers = ["Time", ...trackNames.map((track) => track[language])];

  const rows = schedule.map((session) => {
    const time = formatTime(session.time);

    if (session.kind === "pause") {
      return [time, session.label[language], "", ""];
    }

    const tracks = trackNames.map((_, index) =>
      formatTalk(session.tracks[index] ?? []),
    );

    return [time, ...tracks];
  });

  return [
    `# /dev/mtl ${year} — ${language === "fr" ? "Programme" : "Schedule"}`,
    "",
    toTable(headers, rows),
  ].join("\n");
}

function formatTalk(speakers) {
  if (speakers.length === 0) {
    return "";
  }

  const [talk] = speakers;
  const presenters = speakers
    .filter((speaker) => speaker.name !== "")
    .map((speaker) => speaker.name);

  return [
    `**${talk.title || "_Titre à venir_"}**`,
    presenters.join(" & ") || "_À venir_",
    talk.community,
  ]
    .filter(Boolean)
    .join("<br>");
}

function toTable(headers, rows) {
  const line = (cells) => `| ${cells.join(" | ")} |`;

  return [
    line(headers),
    line(headers.map(() => "---")),
    ...rows.map(line),
  ].join("\n");
}
