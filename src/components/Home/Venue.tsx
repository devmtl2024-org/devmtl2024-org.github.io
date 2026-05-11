import venueImage from "@/assets/venue-concordia.jpg";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import { FaCoffee, FaUtensils } from "react-icons/fa";

function Venue() {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 text-gray-700"
        >
          <h3 className="text-xs text-gray-700 uppercase tracking-widest mb-4">
            {t({ fr: "Lieu", en: "Venue" })}
          </h3>
          <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
            {t({
              fr: "Centre de Conférence de l'Université Concordia",
              en: "Concordia University Conference Centre",
            })}
          </h3>
          <div className="w-16 h-1 bg-primary mb-6"></div>

          <p className="text-lg mb-8">
            {t({
              fr: "Situé au cœur du centre-ville de Montréal, le Centre de Conférence de l'Université Concordia est un lieu moderne et accueillant, facilement accessible en transports en commun.",
              en: "Located in the heart of downtown Montreal, the Concordia University Conference Centre is a modern and welcoming venue, easily accessible by public transit.",
            })}
          </p>

          <div className="mb-8">
            <h4 className="text-xl font-semibold mb-2">
              {t({ fr: "Adresse", en: "Address" })}
            </h4>
            <p className="text-lg">
              Suite GM-400
              <br />
              1550 De Maisonneuve Blvd W.
              <br />
              Montreal, QC H3G 1N1
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <div className="bg-secondary p-4 rounded-full text-white flex items-center justify-center w-16 h-16">
                <FaCoffee className="w-8 h-8" />
              </div>
              <p className="mt-2 text-lg text-gray-700">
                {t({ fr: "Snacks & café", en: "Snacks & coffee" })}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-secondary p-4 rounded-full text-white flex items-center justify-center w-16 h-16">
                <FaUtensils className="w-8 h-8" />
              </div>
              <p className="mt-2 text-lg text-gray-700">
                {t({ fr: "Repas fourni", en: "Lunch provided" })}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2"
        >
          <img
            src={venueImage}
            alt={t({
              fr: "Centre de Conférence de l'Université Concordia",
              en: "Concordia University Conference Centre",
            })}
            className="w-full rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Venue;
