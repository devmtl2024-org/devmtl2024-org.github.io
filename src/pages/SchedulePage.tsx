import TalkRow from "@/components/Talks/TalkRow";
import { ScheduleSession } from "@/type/schedule";
import { Speaker } from "@/type/speakers";
import { groupSpeakersByTime } from "@/utils/groupSpeakers";
import { loadData } from "@/utils/loadData";
import { useState, useEffect } from "react";

export default function SchedulePage() {
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
        November 28, 2025
      </h2>
      <div className="w-16 h-1 bg-secondary mx-auto mb-12"></div>

      {/* Schedule */}
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
