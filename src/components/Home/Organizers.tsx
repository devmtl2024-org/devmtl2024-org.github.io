import { useTranslation } from "@/hooks/useTranslation";
import { Organizer } from "@/type/organizers";
import { loadData } from "@/utils/loadData";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import backgroundImage from "../../assets/background-1.jpg";
import Social from "../Social/Social";

function Organizers() {
  const { t } = useTranslation();
  const [organizers, setOrganizers] = useState<Organizer[]>([]);

  useEffect(() => {
    loadData<Organizer>("organizers").then((organizers) => {
      setOrganizers(organizers);
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
        {/* Speakers Section */}
        <div className="mb-12">
          <h3 className="text-xs text-gray-700 uppercase tracking-widest mb-4">
            {t({ fr: "Derrière le rideau", en: "Behind the Scenes" })}
          </h3>
          <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
            {t({ fr: "Équipe d'organisation", en: "Organizing team" })}
          </h3>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
        </div>

        <div className="flex flex-wrap gap-8 justify-center">
          {organizers.map((organizer, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4"
            >
              <img
                src={`${import.meta.env.BASE_URL}${organizer.image}`}
                alt={organizer.name}
                className="w-32 h-32 rounded-full object-cover mb-4 mx-auto"
              />
              <p className="text-xl font-semibold text-gray-700 mt-2 group-hover:text-primary transition duration-300">
                {organizer.name}
              </p>

              <Social
                github={organizer.github}
                linkedin={organizer.linkedin}
                website={organizer.website}
              />
            </div>
          ))}
        </div>
      </motion.section>
    </section>
  );
}

export default Organizers;
