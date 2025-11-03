import PauseRow from "@/components/Talks/PauseRow.tsx";
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
    loadData<Speaker>("speakers2025").then((speakers) => {
      const groupedByTime = groupSpeakersByTime(speakers);
      setSchedule(groupedByTime);
    });
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

       {schedule.map((session, index) => {
         // Check if all tracks are break/pause sessions
         const allTracksAreBreaks = session.tracks.every(
           (speaker) =>
             speaker &&
             (speaker.title?.toLowerCase() === "break" ||
              speaker.title?.toLowerCase() === "pause")
         );

         if (allTracksAreBreaks) {
           return (
             <PauseRow
               key={index}
               time={session.time}
               index={index}
             />
           );
         }

         return (
           <TalkRow
             key={index}
             time={session.time}
             speakers={session.tracks}
             index={index}
           />
         );
       })}
     </div>
   );
 }
