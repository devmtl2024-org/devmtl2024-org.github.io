import { Speaker } from "@/type/speakers";

export default function TalkOverview({
  speaker,
  index,
}: {
  speaker: Speaker;
  index: number;
}) {
  return (
    <div className="flex flex-col md:flex-row bg-gray-100 mx-auto">
      {/* Left section: Time and Track */}
      <div
        className={`${
          index % 2 === 1 ? "bg-secondary-dark" : "bg-secondary"
        } text-white text-center md:text-left p-4 w-[200px] my-4 md:my-0 flex flex-col justify-center`}
      >
        <div className="text-lg font-semibold">
          {new Date(speaker.time)
            .toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
            .toUpperCase()}
        </div>
        <div className="text-sm">{`Track ${speaker.track}`}</div>
      </div>

      {/* Right section: Speaker's Info */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-8 bg-white w-full border border-dashed border-gray-400 md:border-l-0">
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}${speaker.image}`}
            alt={speaker.name}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
          />
        </div>
        <div className="flex flex-col max-w-xs">
          <div className="text-sm text-gray-600">{speaker.name}</div>
          <div className="text-xl font-semibold whitespace-normal">
            {speaker.title}
          </div>
          <p className="text-sm mt-2 text-gray-600 line-clamp-2">
            {speaker.description}
          </p>
        </div>
      </div>
    </div>
  );
}
