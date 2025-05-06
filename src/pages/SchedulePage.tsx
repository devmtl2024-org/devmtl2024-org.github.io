import TalkRow from "@/components/Talks/TalkRow";
import { useTranslation } from "@/hooks/useTranslation";
import { ScheduleSession } from "@/type/schedule";
import { Speaker } from "@/type/speakers";
import { groupSpeakersByTime } from "@/utils/groupSpeakers";
import { loadData } from "@/utils/loadData";
import { useEffect, useState } from "react";

export default function SchedulePage() {
  const { t } = useTranslation();
  const [schedule, setSchedule] = useState<ScheduleSession[]>([]);

  useEffect(() => {
    loadData<Speaker>("speakers").then((speakers) => {
      const groupedByTime = groupSpeakersByTime(speakers);
      setSchedule(groupedByTime);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-medium mb-4 text-secondary text-center">
        {t({
          fr: "Programme du 27 Novembre 2024",
          en: "Schedule of November 27, 2024",
        })}
      </h2>
      <div className="w-16 h-1 bg-secondary mx-auto mb-12"></div>

      {schedule.map((session, index) => (
        <TalkRow
          time={session.time}
          speakers={[session.track1, session.track2]}
          index={index}
        />
      ))}
    </div>
  );
}
