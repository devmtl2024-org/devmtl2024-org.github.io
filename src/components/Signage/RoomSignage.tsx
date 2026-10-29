import Logo from "@/assets/logo.svg?react";
import { trackNames } from "@/constants/tracks";
import { ScheduleSession } from "@/type/schedule";
import { Language, pauseLabel } from "./pauseLabel";
import { RoomEntry, roomProgram } from "./roomProgram";
import { Slide } from "./Slide";
import { splitAtLunch } from "./splitAtLunch";

// Track 3 hosts the partner communities, who speak either language
const ROOM_LANGUAGES: Language[] = ["fr", "en", "both"];

type RoomProps = {
  trackIndex: number;
  schedule: ScheduleSession[];
};

// Printed on 11x17 for the stand in front of the room
export function RoomPoster({ trackIndex, schedule }: RoomProps) {
  const language = ROOM_LANGUAGES[trackIndex];

  return (
    <section
      data-poster={`affiche-track-${trackIndex + 1}`}
      className="flex h-[17in] w-[11in] shrink-0 flex-col overflow-hidden bg-white px-16 pb-12 pt-14 font-['Archivo'] text-primary"
    >
      <header>
        <div className="mb-6 flex items-center justify-between">
          <Logo fill="#01055E" stroke="#01055E" className="h-12 w-auto" />
          <p className="font-['JetBrains_Mono'] text-2xl tracking-widest text-secondary-dark">
            27.11.2026
          </p>
        </div>
        <RoomName trackIndex={trackIndex} language={language} size="poster" />
      </header>
      <div className="mt-6 border-b-[6px] border-secondary" />
      <div className="flex flex-1 flex-col justify-evenly pt-4">
        {roomProgram(schedule, trackIndex).map((entry) => (
          <Entry
            key={entry.time}
            entry={entry}
            language={language}
            tone="light"
          />
        ))}
      </div>
    </section>
  );
}

// Same content for the screen next to the room's door
export function RoomSlide({ trackIndex, schedule }: RoomProps) {
  const language = ROOM_LANGUAGES[trackIndex];
  const { morning, afternoon } = splitAtLunch(schedule);

  return (
    <Slide id={`salle-track-${trackIndex + 1}`}>
      <header className="flex items-end justify-between px-16 pb-5 pt-8">
        <RoomName trackIndex={trackIndex} language={language} size="slide" />
        <div className="flex flex-col items-end gap-3">
          <Logo fill="white" stroke="white" className="h-14 w-auto" />
          <p className="font-['JetBrains_Mono'] text-2xl tracking-widest text-secondary-light">
            27.11.2026
          </p>
        </div>
      </header>
      <div className="grid flex-1 grid-cols-2 gap-x-16 border-t-4 border-secondary px-16 pb-10 pt-6">
        {[morning, afternoon].map((half, index) => (
          <div key={index} className="flex flex-col justify-evenly">
            {roomProgram(half, trackIndex).map((entry) => (
              <Entry
                key={entry.time}
                entry={entry}
                language={language}
                tone="dark"
              />
            ))}
          </div>
        ))}
      </div>
    </Slide>
  );
}

type RoomNameProps = {
  trackIndex: number;
  language: Language;
  size: "poster" | "slide";
};

function RoomName({ trackIndex, language, size }: RoomNameProps) {
  const [track, fr] = splitTrackName(trackNames[trackIndex].fr);
  const [, en] = splitTrackName(trackNames[trackIndex].en);
  const audience =
    language === "both" && fr !== en
      ? `${fr} · ${en}`
      : language === "en"
        ? en
        : fr;

  return (
    <div>
      <p
        className={`font-black uppercase leading-none tracking-tight ${size === "poster" ? "text-[120px]" : "text-8xl"}`}
      >
        {track}
      </p>
      <p
        className={`mt-3 font-extrabold uppercase ${size === "poster" ? "text-secondary-dark" : "text-secondary"} text-4xl`}
      >
        {audience}
      </p>
    </div>
  );
}

// "Track 3 (Communities)" → "Track 3", "Communities"
function splitTrackName(name: string) {
  return name.replace(/\)$/, "").split(" (");
}

type Tone = "light" | "dark";

const TONES = {
  light: {
    time: "text-secondary-dark",
    speakers: "text-secondary-dark",
    community: "text-primary-light",
    pause: "rounded-xl bg-gray-200 py-2 text-primary-light",
    talk: "",
    // On paper there is room for a full title
    title: "",
  },
  dark: {
    time: "text-secondary",
    speakers: "text-secondary",
    community: "text-secondary-light",
    pause: "text-secondary-light",
    talk: "rounded-2xl bg-primary-light",
    title: "line-clamp-2",
  },
};

type EntryProps = {
  entry: RoomEntry;
  language: Language;
  tone: Tone;
};

function Entry({ entry, language, tone }: EntryProps) {
  const colors = TONES[tone];
  const [hours, minutes] = entry.time.slice(11, 16).split(":");
  const time = (
    <p
      className={`font-['JetBrains_Mono'] font-bold ${colors.time} ${entry.kind === "pause" ? "text-2xl" : "text-3xl"}`}
    >
      {Number(hours)}:{minutes}
    </p>
  );

  if (entry.kind === "pause") {
    return (
      <div
        className={`grid grid-cols-[120px_1fr] items-baseline gap-x-6 px-6 ${colors.pause}`}
      >
        {time}
        <p className="text-2xl">{pauseLabel(entry.label, language)}</p>
      </div>
    );
  }

  const [talk] = entry.speakers;
  const presenters = entry.speakers
    .map((speaker) => speaker.name)
    .filter(Boolean)
    .join(" & ");

  return (
    <div
      className={`grid grid-cols-[120px_1fr] items-baseline gap-x-6 px-6 py-2 ${colors.talk}`}
    >
      {time}
      <div className="min-w-0">
        <p className={`text-[28px] font-bold leading-tight ${colors.title}`}>
          {talk.title || "À venir / TBA"}
        </p>
        <p className={`mt-1 text-2xl ${colors.speakers}`}>
          {presenters}
          {talk.community && (
            <span className={colors.community}> · {talk.community}</span>
          )}
        </p>
      </div>
    </div>
  );
}
