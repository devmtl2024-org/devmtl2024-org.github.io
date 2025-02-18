import { Speaker } from "@/type/speakers";
import { Link } from "react-router-dom";

type TalkCardProps = {
  track: Speaker | null;
};

export function TalkCard({ track }: TalkCardProps) {
  if (!track) return <div className="border p-4">No Talk Scheduled</div>;

  return (
    <Link
      to={`/speakers/${track.name.toLowerCase().replace(/ /g, "-")}`}
      className="block border rounded-lg p-4 shadow hover:shadow-lg transition h-full"
    >
      <h3 className="text-lg font-semibold">{track.title}</h3>
      <p className="text-sm text-gray-600">Speaker: {track.name}</p>
    </Link>
  );
}
