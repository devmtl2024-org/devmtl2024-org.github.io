import { Organizer } from "@/type/organizers";
import { loadData } from "@/utils/loadData";
import { useEffect, useState } from "react";
import Social from "../Social/Social";

function Organizers() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);

  useEffect(() => {
    loadData<Organizer>("organizers").then((organizers) => {
      setOrganizers(organizers);
    });
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h3 className="text-3xl font-semibold text-black mb-10 ">Organizers</h3>

      <div className="flex flex-wrap gap-8 justify-center">
        {organizers.map((organizer, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-full sm:w-1/2 md:w-1/4 lg:w-1/5"
          >
            <img
              src={organizer.image}
              alt={organizer.name}
              className="w-32 h-32 rounded-full object-cover mb-4 mx-auto"
            />
            <p className="text-lg font-medium text-black text-center">
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
    </section>
  );
}

export default Organizers;
