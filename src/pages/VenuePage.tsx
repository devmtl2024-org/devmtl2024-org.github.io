import venueImage from "@/assets/venue-ets.jpg";
import { FaCoffee, FaUtensils } from "react-icons/fa";

export default function VenuePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-gray-700 mb-8 text-center">
        Venue
      </h2>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
        {/* Info on the left */}
        <div className="md:w-1/2 text-gray-700 space-y-8">
          <h3 className="text-2xl font-bold">
            École de technologie supérieure (ÉTS)
          </h3>
          <p className="text-lg">
            Located in the heart of Montreal, ÉTS is an ideal place for tech
            events. Easily accessible by public transport, it offers a modern
            and welcoming environment to host attendees.
          </p>

          <div>
            <h4 className="text-xl font-semibold">Address</h4>
            <p className="text-lg">
              1220 Rue Notre-Dame Ouest, Montreal, QC H3C 1K5, Canada
            </p>
          </div>

          <div className="flex gap-6">
            {/* Snacks */}
            <div className="flex flex-col items-center">
              <div className="bg-secondary p-4 rounded-full text-white flex items-center justify-center w-16 h-16">
                <FaCoffee className="w-8 h-8" />
              </div>
              <p className="mt-2 text-lg text-gray-700">Snacks & coffee</p>
            </div>

            {/* Meals */}
            <div className="flex flex-col items-center">
              <div className="bg-secondary p-4 rounded-full text-white flex items-center justify-center w-16 h-16">
                <FaUtensils className="w-8 h-8" />
              </div>
              <p className="mt-2 text-lg text-gray-700">Lunch provided</p>
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
