import { useTranslation } from "@/hooks/useTranslation";

export default function SchedulePage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
        {t({ fr: "Agenda (2025)", en: "Agenda (2025)" })}
      </h3>
      <p className="text-gray-700 text-2xl">
        {t({ fr: "Bientôt disponible ..", en: "Coming soon .." })}
      </p>
    </div>
  );
}

// export default function SchedulePage() {
//   const { t } = useTranslation();
//   const [schedule, setSchedule] = useState<ScheduleSession[]>([]);

//   useEffect(() => {
//     loadData<Speaker>("speakers").then((speakers) => {
//       const groupedByTime = groupSpeakersByTime(speakers);
//       setSchedule(groupedByTime);
//     });
//   }, []);

//   return (
//     <div className="container mx-auto px-4 py-16">
//       <h2 className="text-3xl font-medium mb-4 text-secondary text-center">
//         {t({
//           fr: "Programme du 27 Novembre 2024",
//           en: "Schedule of November 27, 2024",
//         })}
//       </h2>
//       <div className="w-16 h-1 bg-secondary mx-auto mb-12"></div>

//       {schedule.map((session, index) => (
//         <React.Fragment key={index}>
//           <TalkRow
//             time={session.time}
//             speakers={session.tracks}
//             index={index}
//           />
//         </React.Fragment>
//       ))}
//     </div>
//   );
// }
