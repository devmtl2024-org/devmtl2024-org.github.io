import { Speaker } from "@/type/speakers";
import { loadData } from "@/utils/loadData";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

type ScheduleSession = {
  time: string;
  track1: Speaker | null;
  track2: Speaker | null;
};

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
      <h3 className="text-xl font-medium mb-8 text-secondary">November 27, 2024</h3>
      <div className="hidden md:grid grid-cols-4 gap-4">
        {/* Time column with smaller width */}
        <div className="text-sm font-medium col-span-1">
          {/* No header for time */}
        </div>
        <div className="font-medium"><strong>Track 1</strong></div>
        <div className="font-medium"><strong>Track 2</strong></div>
      </div>
      {schedule.map((session, index) => (
        <div key={index} className="grid md:grid-cols-4 gap-4 mb-4">
          {/* Time column */}
          <div className="font-medium col-span-1">{session.time}</div>
          <TalkCard track={session.track1} />
          <TalkCard track={session.track2} />
        </div>
      ))}
    </div>
  );
  
}

function groupSpeakersByTime(speakers: Speaker[]): ScheduleSession[] {
  const grouped: Record<string, ScheduleSession> = {};

  speakers.forEach((speaker) => {
    const time = new Date(speaker.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    if (!grouped[time]) {
      grouped[time] = { time, track1: null, track2: null };
    }
    grouped[time][`track${speaker.track}` as "track1" | "track2"] = speaker;
  });

  return Object.values(grouped).sort(
    (a, b) => new Date(`1970/01/01 ${a.time}`).getTime() - new Date(`1970/01/01 ${b.time}`).getTime()
  );
}

type TalkCardProps = {
  track: Speaker | null;
};

function TalkCard({ track }: TalkCardProps) {
  if (!track) return <div className="border p-4">No Talk Scheduled</div>;

  return (
    <Link
      to={`/speakers/${track.name.toLowerCase().replace(/ /g, "-")}`}
      className="block border rounded-lg p-4 shadow hover:shadow-lg transition"
    >
      <h3 className="text-lg font-semibold">{track.title}</h3>
      <p className="text-sm text-gray-600">Speaker: {track.name}</p>
    </Link>
  );
}
