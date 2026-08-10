import { pauses } from "@/assets/pauses";
import { formatTime } from "@/components/Talks/formatTime";
import PauseRow from "@/components/Talks/PauseRow";
import TalkRow from "@/components/Talks/TalkRow.tsx";
import { trackNames } from "@/constants/tracks";
import { useTranslation } from "@/hooks/useTranslation";
import { ScheduleSession } from "@/type/schedule.ts";
import { Speaker } from "@/type/speakers.ts";
import { groupSpeakersByTime } from "@/utils/groupSpeakers.ts";
import { loadSpeakers } from "@/utils/loadData.ts";
import { useEffect, useState } from "react";

export default function SchedulePage() {
  const { t } = useTranslation();
  const [schedule, setSchedule] = useState<ScheduleSession[]>([]);

  useEffect(() => {
    async function fetchSchedule() {
      const speakers = await loadSpeakers<Speaker>(2026);

      setSchedule(groupSpeakersByTime(speakers, pauses));
    }

    fetchSchedule();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-medium mb-4 text-secondary text-center">
        {t({
          fr: "Programme du 27 Novembre 2026",
          en: "Schedule of November 27, 2026",
        })}
      </h2>
      <div className="w-16 h-1 bg-secondary mx-auto mb-12"></div>
      <div className="grid grid-cols-1 md:grid-cols-[150px_auto] bg-gray-100 mx-auto w-full max-w-screen-xl">
        <div
          className={`bg-white p-4 flex flex-col justify-center w-full md:w-[150px]`}
        ></div>

        <div
          className={`hidden md:grid md:grid-cols-3 md:divide-x md:divide-dashed md:divide-gray-300 p-4 bg-white w-full border border-dashed border-gray-400`}
        >
          {trackNames.map((trackName) => (
            <div
              key={trackName.en}
              className="text-center w-full text-lg font-semibold text-gray-600 md:px-2"
            >
              {t(trackName)}
            </div>
          ))}
        </div>
      </div>
      {schedule.map((session, index) =>
        session.kind === "pause" ? (
          <PauseRow
            key={session.time}
            time={formatTime(session.time)}
            index={index}
            text={t(session.label)}
          />
        ) : (
          <TalkRow
            key={session.time}
            time={formatTime(session.time)}
            tracks={session.tracks}
            index={index}
          />
        ),
      )}
    </div>
  );
}
