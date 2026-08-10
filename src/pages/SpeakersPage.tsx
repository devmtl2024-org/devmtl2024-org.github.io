import { useTranslation } from "@/hooks/useTranslation";
import type { Speaker } from "@/type/speakers";
import { loadSpeakers } from "@/utils/loadData";
import { hasAnnouncedTalk } from "@/utils/speakerFilters";
import { toSpeakerSlug } from "@/utils/speakerSlug";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function SpeakersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { year } = useParams<{ year: string }>();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    const numericYear = Number(year);
    if (!numericYear) {
      return;
    }

    loadSpeakers<Speaker>(numericYear)
      .then(setSpeakers)
      .catch((err) => console.error("Error loading speakers:", err));
  }, [year]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20">
        <h2 className="text-3xl font-semibold text-gray-700 mb-28">
          {t({
            fr: "Nos conférenciers sont ✨ Fantastiques ✨",
            en: "Our Presenters are ✨ Amazing ✨",
          })}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {speakers.filter(hasAnnouncedTalk).map((speaker, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center group"
            >
              <div className="relative w-52 h-52 rounded-full overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}${speaker.image}`}
                  alt={speaker.name}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 bg-primary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
                  onClick={() => {
                    window.scrollTo({ top: 0 });
                    navigate(`/speaker/${toSpeakerSlug(speaker.name)}`);
                  }}
                >
                  <FiPlus className="text-white text-3xl" />
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-700 mt-2 group-hover:text-primary transition duration-300">
                {speaker.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
