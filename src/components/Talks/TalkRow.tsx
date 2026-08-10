import { useTranslation } from "@/hooks/useTranslation";
import { Speaker } from "@/type/speakers";
import { useRef } from "react";
import { TalkDialog } from "./TalkDialog";

export default function TalkRow({
  time,
  tracks,
  index,
}: {
  time: string;
  tracks: Speaker[][];
  index: number;
}) {
  // A session without any parallel track gathers everyone in the same room
  const isPlenary = tracks.filter((track) => track.length > 0).length === 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[150px_auto] bg-gray-100 mx-auto w-full max-w-screen-xl">
      <div
        className={`${
          index % 2 === 1 ? "bg-secondary-dark" : "bg-secondary"
        } text-white text-center p-4 flex flex-col justify-center w-full md:w-[150px]`}
      >
        <div className="text-lg font-semibold">{time}</div>
      </div>

      <div
        className={`grid grid-cols-1 gap-6 p-4 bg-white w-full border border-dashed border-gray-400 ${
          isPlenary
            ? ""
            : "md:grid-cols-3 md:gap-0 md:divide-x md:divide-dashed md:divide-gray-300"
        }`}
      >
        {tracks.map((speakers, trackIndex) => (
          <TrackCell key={trackIndex} speakers={speakers} plenary={isPlenary} />
        ))}
      </div>
    </div>
  );
}

function TrackCell({
  speakers,
  plenary,
}: {
  speakers: Speaker[];
  plenary: boolean;
}) {
  const { t } = useTranslation();
  const details = useRef<HTMLDialogElement>(null);

  if (speakers.length === 0) {
    // Keep the column on desktop, but don't leave a gap on mobile
    return <div className="hidden md:block" />;
  }

  const [talk] = speakers;
  const presenters = speakers.filter((speaker) => speaker.name !== "");

  return (
    <>
      <button
        onClick={() => details.current?.showModal()}
        aria-haspopup="dialog"
        className={`flex flex-col items-center text-center w-full rounded p-2 transition hover:bg-gray-50 ${
          plenary ? "md:max-w-md md:mx-auto" : "md:px-3"
        }`}
      >
        <div className="flex justify-center -space-x-3 mb-2">
          {speakers.map((speaker, index) => (
            <img
              key={index}
              src={`${import.meta.env.BASE_URL}${speaker.image}`}
              alt=""
              className="w-20 h-20 md:w-16 md:h-16 rounded-full object-cover ring-4 ring-white"
            />
          ))}
        </div>

        <div className="text-sm text-gray-600">
          {presenters.length === 0
            ? t({ fr: "À venir", en: "Coming soon" })
            : presenters.map((speaker) => speaker.name).join(" & ")}
        </div>

        {talk.community && (
          <div className="text-xs text-secondary-dark font-semibold uppercase tracking-wide">
            {talk.community}
          </div>
        )}

        <div className="text-lg md:text-base font-semibold whitespace-normal mt-1">
          {talk.title || t({ fr: "Titre à venir", en: "Title coming soon" })}
        </div>
      </button>

      <TalkDialog ref={details} speakers={speakers} />
    </>
  );
}
