import { pauses } from "@/assets/pauses";
import PauseRow from "@/components/Talks/PauseRow";
import TalkRow from "@/components/Talks/TalkRow.tsx";
import { useTranslation } from "@/hooks/useTranslation";
import { ScheduleSession } from "@/type/schedule.ts";
import { Speaker } from "@/type/speakers.ts";
import { groupSpeakersByTime } from "@/utils/groupSpeakers.ts";
import { loadData } from "@/utils/loadData.ts";
import { useEffect, useState } from "react";

// export default function SchedulePage() {
//   const { t } = useTranslation();
//
//   return (
//     <div className="container mx-auto px-4 py-16 text-center">
//       <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
//         {t({ fr: "Agenda (2025)", en: "Agenda (2025)" })}
//       </h3>
//       <p className="text-gray-700 text-2xl">
//         {t({ fr: "Bientôt disponible ..", en: "Coming soon .." })}
//       </p>
//     </div>
//   );
// }

export default function SchedulePage() {
  const { t } = useTranslation();
  const [schedule, setSchedule] = useState<ScheduleSession[]>([]);

  useEffect(() => {
    async function fetchSchedule() {
      const [speakers] = await Promise.all([loadData<Speaker>("speakers2025")]);

      const speakerSchedule = groupSpeakersByTime(speakers, pauses);

      setSchedule(speakerSchedule);
    }

    fetchSchedule();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-medium mb-4 text-secondary text-center">
        {t({
          fr: "Programme du 28 Novembre 2025",
          en: "Schedule of November 28, 2025",
        })}
      </h2>
      <div className="w-16 h-1 bg-secondary mx-auto mb-12"></div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_auto] bg-gray-100 mx-auto w-full max-w-screen-lg">
        <div
          className={`bg-white p-4 flex flex-col justify-center w-full md:w-[200px]`}
        ></div>

        <div
          className={`hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-6 bg-white w-full border border-dashed border-gray-400`}
        >
          <div className="text-center w-full text-xl font-semibold text-gray-600 mb-2">
            Track 1 (FR)
          </div>
          <div className="text-center w-full text-xl font-semibold text-gray-600 mb-2">
            Track 2 (EN)
          </div>
          <div className="text-center w-full text-xl font-semibold text-gray-600 mb-2">
            Track 3 (Mixed)
          </div>
        </div>
      </div>

      {schedule.map((session, index) =>
        session.isPause ? (
          <PauseRow
            key={session.time}
            time={session.time}
            index={index}
            text={
              session.time === "12:00 PM"
                ? t({ fr: "Repas (inclus) 🍱", en: "Lunch (included) 🍱" })
                : session.time === "08:30 AM"
                  ? t({ fr: "Accueil & Café ☕", en: "Greetings & Coffee ☕" })
                  : t({ fr: "Pause", en: "Break" })
            }
          />
        ) : (
          <TalkRow
            key={session.time}
            time={session.time}
            speakers={session.tracks!}
            index={index}
          />
        ),
      )}
    </div>
  );
}
