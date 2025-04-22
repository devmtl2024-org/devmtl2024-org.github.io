import { useState, useEffect } from "react";
import { Sponsor } from "@/type/sponsors";
import { loadData } from "@/utils/loadData";

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    loadData<Sponsor>("sponsors").then((sponsors) => {
      setSponsors(sponsors);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-center text-gray-700 mb-6 text-lg">
        /dev/mtl 2024 is only possible through the generosity of the
        organizations and businesses on this page. Their donations make this
        special day possible. Thank you for your support!
      </p>

      {/* Sponsors Section */}
      <div className="space-y-8 mb-12">
        {sponsors.map((sponsor, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 mt-8 p-6 pb-8 border rounded-lg shadow-md gap-6"
          >
            {/* Sponsor Logo */}
            <div className="w-32 h-32">
              <img
                src={`${import.meta.env.BASE_URL}${sponsor.logo}`}
                alt={sponsor.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Sponsor Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-secondary mb-4">
                {sponsor.name}
              </h2>
              <p className="text-gray-600 mb-6">{sponsor.description}</p>
              <a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-primary-light rounded-xl px-3 py-3"
              >
                Visit Website
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
