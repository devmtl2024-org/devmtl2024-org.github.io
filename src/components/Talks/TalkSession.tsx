import { Speaker } from "@/type/speakers";

export default function TalkSession({
  speaker,
  index,
}: {
  speaker: Speaker;
  index: number;
}) {
  return (
    <div className="flex flex-col md:flex-row mx-auto fit-content self-start">
      {/* Left section: Time and Track */}
      <div
        className={`${
          index % 2 === 1 ? "bg-secondary-dark" : "bg-secondary"
        } text-white text-center md:text-left p-4 w-[200px] mb-4 md:mb-0 flex flex-col justify-center`}
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
      <div className="p-8 bg-white w-full border border-dashed border-gray-400 md:border-l-0">
        <div className="flex flex-col">
          <div className="text-sm text-gray-600">{speaker.name}</div>
          <div className="text-xl font-semibold whitespace-normal">
            {speaker.title}
          </div>
          <p className="text-sm mt-2 text-gray-600">
            {speaker.description}
          </p>
        </div>
      </div>
    </div>
  );
}
