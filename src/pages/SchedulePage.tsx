import { TalkCard } from "@/components/Schedule/TalkCard";
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-medium mb-6">Schedule</h1>
      <h3 className="text-xl font-medium mb-8 text-secondary">
        November 27, 2024
      </h3>

      {/* Desktop Header (Hidden on mobile) */}
      <div className="hidden md:grid grid-cols-5 gap-4 mb-4">
        <div className="col-span-1"></div>
        <div className="text-sm font-medium text-gray-600 col-span-2">
          <strong>Track 1</strong>
        </div>
        <div className="text-sm font-medium text-gray-600 col-span-2">
          <strong>Track 2</strong>
        </div>
      </div>

      {/* Schedule */}
      {schedule.map((session, index) => (
        <div key={index} className="grid md:grid-cols-5 gap-4 mb-4">
          {/* Time column */}
          <div className="font-medium col-span-1">{session.time}</div>

          {/* Track 1 */}
          <div className="col-span-2 flex flex-col">
            <div className="md:hidden text-sm font-medium text-gray-600">
              Track 1
            </div>
            <TalkCard track={session.track1} />
          </div>

          {/* Track 2 */}
          <div className="col-span-2 flex flex-col">
            <div className="md:hidden text-sm font-medium text-gray-600">
              Track 2
            </div>
            <TalkCard track={session.track2} />
          </div>
        </div>
      ))}
    </div>
  );
}
