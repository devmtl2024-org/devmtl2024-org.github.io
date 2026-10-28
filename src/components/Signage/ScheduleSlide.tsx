import { trackNames } from "@/constants/tracks";
import { ScheduleSession } from "@/type/schedule";
import { Speaker } from "@/type/speakers";
import { pauseLabel } from "./pauseLabel";
import { Slide, SlideHeader } from "./Slide";
import { trackLabel } from "./trackLabel";

type ScheduleSlideProps = {
  id: string;
  title: { fr: string; en: string };
  sessions: ScheduleSession[];
};

export function ScheduleSlide({ id, title, sessions }: ScheduleSlideProps) {
  return (
    <Slide id={id} reel="infos" seconds={20}>
      <SlideHeader fr={title.fr} en={title.en} />
      <div className="grid grid-cols-[120px_repeat(3,1fr)] gap-x-6 px-[88px] pb-3">
        <div />
        {trackNames.map((_, index) => {
          const { track, audience } = trackLabel(index);

          return (
            <div key={track} className="border-b-4 border-secondary pb-3">
              <p className="text-3xl font-bold">{track}</p>
              <p className="text-3xl font-bold text-secondary">{audience}</p>
            </div>
          );
        })}
      </div>
      <div className="flex flex-1 flex-col px-16 pb-10">
        {sessions.map((session) =>
          session.kind === "pause" ? (
            <PauseRow key={session.time} session={session} />
          ) : (
            <TalksRow
              key={session.time}
              time={session.time}
              tracks={session.tracks}
            />
          ),
        )}
      </div>
    </Slide>
  );
}

function PauseRow({
  session,
}: {
  session: ScheduleSession & { kind: "pause" };
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center gap-x-6 px-6 py-2">
      <Time time={session.time} />
      <p className="text-2xl text-secondary-light">
        {pauseLabel(session.label)}
      </p>
    </div>
  );
}

function TalksRow({ time, tracks }: { time: string; tracks: Speaker[][] }) {
  const busyTracks = tracks.filter((track) => track.length > 0);
  const plenaryTrack =
    busyTracks.length === 1 ? tracks.indexOf(busyTracks[0]) : -1;

  return (
    <div className="grid flex-1 grid-cols-[120px_repeat(3,1fr)] items-center gap-x-6 rounded-2xl bg-primary-light px-6 py-2">
      <Time time={time} />
      {plenaryTrack >= 0 ? (
        <div className="col-span-3">
          <Talk speakers={tracks[plenaryTrack]} isPlenary />
        </div>
      ) : (
        trackNames.map((_, index) => (
          <Talk key={index} speakers={tracks[index] ?? []} />
        ))
      )}
    </div>
  );
}

function Time({ time }: { time: string }) {
  const [hours, minutes] = time.slice(11, 16).split(":");

  return (
    <p className="font-['JetBrains_Mono'] text-3xl font-bold text-secondary">
      {Number(hours)}:{minutes}
    </p>
  );
}

type TalkProps = {
  speakers: Speaker[];
  // A talk alone in its slot (the keynote) spans every track
  isPlenary?: boolean;
};

function Talk({ speakers, isPlenary = false }: TalkProps) {
  if (speakers.length === 0) {
    return <div />;
  }

  const [talk] = speakers;
  const presenters = speakers
    .map((speaker) => speaker.name)
    .filter(Boolean)
    .join(" & ");

  return (
    <div className="min-w-0">
      <p
        className={`font-semibold leading-tight ${isPlenary ? "text-4xl" : "line-clamp-3 text-[25px]"}`}
      >
        {talk.title || "À venir / TBA"}
      </p>
      <p className="mt-2 text-2xl text-secondary">
        {presenters}
        {talk.community && (
          <span className="text-secondary-light"> · {talk.community}</span>
        )}
      </p>
    </div>
  );
}
