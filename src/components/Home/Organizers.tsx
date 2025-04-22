import { Organizer } from "@/type/organizers";
import { loadData } from "@/utils/loadData";
import { useEffect, useState } from "react";
import Social from "../Social/Social";
import { motion } from "framer-motion";

import backgroundImage from "../../assets/background-1.jpg";

function Organizers() {
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
            Behind the Scenes
          </h3>
          <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
            Organizing team
          </h3>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
        </div>

        <div className="flex flex-wrap gap-8 justify-center">
          {organizers.map((organizer, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 lg:w-1/5"
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
