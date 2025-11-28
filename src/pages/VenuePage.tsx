import venueImage from "@/assets/venue-ets.jpg";
import { useTranslation } from "@/hooks/useTranslation";
import { FaCoffee, FaUtensils } from "react-icons/fa";

export default function VenuePage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-gray-700 mb-8 text-center">
        {t({ fr: "Lieu", en: "Venue" })}
      </h2>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
        {/* Info on the left */}
        <div className="md:w-1/2 text-gray-700 space-y-8">
          <h3 className="text-2xl font-bold">
            École de technologie supérieure (ÉTS)
          </h3>
          <p className="text-lg">
            {t({
              fr: "Localisée au cœur de Montréal, l'ÉTS est un lieu idéal pour les événements tech. Facilement accessible en transports publics, elle propose un environnement moderne et accueillant pour accueillir les participants.",
              en: "Located in the heart of Montreal, ÉTS is an ideal place for tech events. Easily accessible by public transport, it offers a modern and welcoming environment to host attendees.",
            })}
          </p>

          <div>
            <h4 className="text-xl font-semibold">
              {t({ fr: "Adresse", en: "Address" })}
            </h4>
            <p className="text-lg">
              {t({
                fr: "3ème étage, 1220 Rue Notre-Dame Ouest, Montreal, QC H3C 1K5, Canada",
                en: "3rd floor, 1220 Rue Notre-Dame Ouest, Montreal, QC H3C 1K5, Canada",
              })}
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
        </div>

        {/* Image on the right */}
        <div className="md:w-1/2 mb-12">
          <img
            src={venueImage}
            alt="École de technologie supérieure (ÉTS)"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
