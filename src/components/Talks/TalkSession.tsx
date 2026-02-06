import { Speaker } from "@/type/speakers";
import { formatTime } from "./formatTime";
import { getYouTubeEmbedUrl } from "./getYoutubeEmbedUrl";

export default function TalkSession({
  speaker,
  index,
}: {
  speaker: Speaker;
  index: number;
}) {
  const embedUrl = getYouTubeEmbedUrl(speaker.videoLink);

  return (
    <div className="flex flex-col md:flex-row self-start w-full">
      {/* Left section: Time and Track */}
      <div
        className={`${
          index % 2 === 1 ? "bg-secondary-dark" : "bg-secondary"
        } text-white text-center md:text-left p-4 w-[200px] mb-4 md:mb-0 flex flex-col justify-center`}
      >
        <div className="text-lg font-semibold">{formatTime(speaker.time)}</div>
        <div className="text-sm">{`Track ${speaker.track}`}</div>
      </div>

      {/* Right section: Speaker's Info */}
      <div className="p-8 bg-white w-full border border-dashed border-gray-400 md:border-l-0">
        <div className="flex flex-col">
          <div className="text-sm text-gray-600">{speaker.name}</div>
          <div className="text-xl font-semibold whitespace-normal">
            {speaker.title}
          </div>
          <p className="text-sm mt-2 text-gray-600">{speaker.description}</p>
          {embedUrl && (
            <div className="mt-4 aspect-video w-full">
              <iframe
                className="w-full h-full rounded-lg"
                src={embedUrl}
                title={`Video of ${speaker.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
