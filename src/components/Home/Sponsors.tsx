import { Sponsor } from "@/type/sponsors";
import { loadSponsors } from "@/utils/loadSponsors";
import { useEffect, useState } from "react";

function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    loadSponsors().then((sponsors) => {
      setSponsors(sponsors);
    });
  }, []);

  return (
    <div className="bg-primary">
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h3 className="text-3xl font-semibold text-white mb-10 ">Sponsors</h3>

        <div className="flex flex-wrap gap-8 justify-center">
          {sponsors.map(
            (sponsor, index) =>
              !sponsor.isDisabled && (
                <div
                  key={index}
                  className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 lg:w-1/5"
                >
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${sponsor.logo}`}
                      alt={sponsor.name}
                      className="w-32 h-32 object-contain mb-4 mx-auto"
                    />
                  </a>
                </div>
              )
          )}
        </div>
      </section>
    </div>
  );
}

export default Sponsors;
