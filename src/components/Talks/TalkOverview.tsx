import { trackNames } from "@/constants/tracks";
import { useTranslation } from "@/hooks/useTranslation";
import { Speaker } from "@/type/speakers";
import { toSpeakerSlug } from "@/utils/speakerSlug";
import { useNavigate } from "react-router-dom";
import { formatTime } from "./formatTime";

export default function TalkOverview({
  speaker,
  index,
}: {
  speaker: Speaker;
  index: number;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 mx-auto">
      {/* Left section: Time and Track */}
      <div
        className={`${
          index % 2 === 1 ? "bg-secondary-dark" : "bg-secondary"
        } text-white text-center md:text-left p-4 w-[200px] my-4 md:my-0 flex flex-col justify-center`}
      >
        <div className="text-lg font-semibold">{formatTime(speaker.time)}</div>
        <div className="text-sm">{t(trackNames[speaker.track - 1])}</div>
      </div>

      {/* Right section: Speaker's Info */}
      <div
        className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-8 bg-white w-full border border-dashed border-gray-400 md:border-l-0 cursor-pointer"
        onClick={() => {
          window.scrollTo({ top: 0 });
          navigate(`/speaker/${toSpeakerSlug(speaker.name)}`);
        }}
      >
        <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0">
          <img
            src={`${import.meta.env.BASE_URL}${speaker.image}`}
            alt=""
            className="w-full h-full object-cover transition duration-300 hover:scale-110"
          />
        </div>
        <div className="flex flex-col max-w-xs">
          <div className="text-sm text-gray-600">{speaker.name}</div>
          {speaker.community && (
            <div className="text-xs text-secondary-dark font-semibold uppercase tracking-wide">
              {speaker.community}
            </div>
          )}
          <div className="text-xl font-semibold whitespace-normal">
            {speaker.title}
          </div>
        </div>
      </div>
    </div>
  );
}
