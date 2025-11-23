#!/usr/bin/env node

import { exec } from "child_process";
import { readdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Pauses from src/assets/pauses.ts
const pauses = [
  "2025-11-28T08:30:00",
  "2025-11-28T10:00:00",
  "2025-11-28T11:00:00",
  "2025-11-28T12:00:00",
  "2025-11-28T13:45:00",
  "2025-11-28T14:45:00",
  "2025-11-28T15:45:00",
];

// Format time like the React component does
function formatTime(timeString) {
  const date = new Date(timeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

// Group speakers by time (same logic as groupSpeakersByTime)
function groupSpeakersByTime(speakers, pauses) {
  const grouped = {};

  speakers.forEach((speaker) => {
    const time = speaker.time;
    const trackIndex = speaker.track - 1;

    if (!grouped[time]) {
      grouped[time] = { time, tracks: [] };
    }

    const session = grouped[time];

    while (session.tracks.length <= trackIndex) {
      session.tracks.push(null);
    }

    session.tracks[trackIndex] = speaker;
  });

  pauses.forEach((pauseTime) => {
    const time = pauseTime;

    if (!grouped[time]) {
      grouped[time] = { time, tracks: [], isPause: true };
    }
  });

  return Object.values(grouped).sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  );
}

// Get pause text based on time
function getPauseText(formattedTime) {
  if (formattedTime === "12:00 PM") {
    return "Repas (inclus) 🍱 / Lunch (included) 🍱";
  } else if (formattedTime === "08:30 AM") {
    return "Accueil & Café ☕ / Greetings & Coffee ☕";
  }
  return "Pause / Break";
}

// Format speaker info for table cell
function formatSpeaker(speaker) {
  if (!speaker) {
    return "";
  }
  return `**${speaker.title}**<br>${speaker.name}`;
}

// Load all speakers from JSON files
async function loadSpeakers() {
  const speakersDir = join(__dirname, "..", "src", "assets", "speakers-2025");
  const files = await readdir(speakersDir);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  const speakers = await Promise.all(
    jsonFiles.map(async (file) => {
      const content = await readFile(join(speakersDir, file), "utf-8");
      return JSON.parse(content);
    }),
  );

  return speakers;
}

// Generate markdown table
function generateMarkdownTable(schedule) {
  let markdown = "# /dev/mtl 2025 - Schedule\n\n";
  markdown += "**Date:** November 28, 2025\n\n";
  markdown += "| Time | Track 1 (FR) | Track 2 (EN) | Track 3 (Mixed) |\n";
  markdown += "|------|--------------|--------------|------------------|\n";

  schedule.forEach((session) => {
    const formattedTime = formatTime(session.time);

    if (session.isPause) {
      const pauseText = getPauseText(formattedTime);
      markdown += `| ${formattedTime} | ${pauseText} | | |\n`;
    } else {
      const track1 = formatSpeaker(session.tracks[0]);
      const track2 = formatSpeaker(session.tracks[1]);
      const track3 = formatSpeaker(session.tracks[2]);
      markdown += `| ${formattedTime} | ${track1} | ${track2} | ${track3} |\n`;
    }
  });

  return markdown;
}

// Main function
async function main() {
  try {
    console.log("Loading speakers...");
    const speakers = await loadSpeakers();
    console.log(`Loaded ${speakers.length} speakers`);

    console.log("Grouping by time...");
    const schedule = groupSpeakersByTime(speakers, pauses);
    console.log(`Generated ${schedule.length} schedule sessions`);

    console.log("Generating markdown...");
    const markdown = generateMarkdownTable(schedule);

    const outputPath = join(__dirname, "..", "schedule-export.md");
    await writeFile(outputPath, markdown, "utf-8");

    console.log("Formatting with Prettier...");
    try {
      await execAsync(`npx prettier --write ${outputPath}`);
      console.log(`\n✅ Schedule exported and formatted: ${outputPath}`);
    } catch (prettierError) {
      console.log(`\n✅ Schedule exported to: ${outputPath}`);
      console.warn("⚠️  Prettier formatting failed:", prettierError.message);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();

