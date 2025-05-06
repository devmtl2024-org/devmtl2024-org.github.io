import { useTranslation } from "@/hooks/useTranslation";
import { Speaker } from "@/type/speakers";
import { loadData } from "@/utils/loadData";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function SpeakersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    loadData<Speaker>("speakers").then((speakers) => {
      setSpeakers(speakers);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-semibold text-gray-700 mb-28">
          {t({
            fr: "Nos conférenciers sont ✨ Fantastiques ✨",
            en: "Our Presenters are ✨ Amazing ✨",
          })}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {speakers.map((speaker, index) => (
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
                {/* Hover effect */}
                <div
                  className="absolute inset-0 bg-primary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
                  onClick={() => {
                    window.scrollTo({ top: 0 });
                    navigate(
                      `/speakers/2024/${speaker.name
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/ /g, "-")}`,
                    );
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
