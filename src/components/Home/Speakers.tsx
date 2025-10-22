import { useTranslation } from "@/hooks/useTranslation";
import { Speaker } from "@/type/speakers";
import { loadData } from "@/utils/loadData";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/background-1.jpg";

function Speakers() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    loadData<Speaker>("speakers-2025", 4, true).then((speakers) => {
      setSpeakers(speakers);
    });
  }, []);

  return (
    <section
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-4 py-24 w-full text-center"
      >
        <div className="mb-12">
          <h3 className="text-xs text-gray-700 uppercase tracking-widest mb-4">
            {t({ fr: "Écoutez les", en: "Listen to the" })}
          </h3>
          <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
            {t({ fr: "Conférenciers", en: "Event Speakers" })}
          </h3>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
        </div>

        {/* Speakers List */}
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
                  onClick={() =>
                    navigate(
                      `/speaker/${speaker.name
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/ /g, "-")}`,
                    )
                  }
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

        <div className="mt-20">
          <a
            href="/speakers/2025"
            className="px-12 py-5 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition duration-200 uppercase"
          >
            {t({ fr: "Les voir tous", en: "View all speakers" })}
          </a>
        </div>
      </motion.section>
    </section>
  );
}

export default Speakers;
