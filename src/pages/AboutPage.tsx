import Social from "@/components/Social/Social";
import { Organizer } from "@/type/organizers";
import { loadData } from "@/utils/loadData";
import { useEffect, useState } from "react";

const meetups = [
  "Montréal Python",
  "Women in AI",
  "Jug Montréal",
  "TypeScript Montréal",
  "React Montréal",
  "Elixir Montréal",
  "Generative AI Montréal",
  "Ruby Montréal",
  "AWS Montréal",
  "Software Crafters Montréal",
  "Software Crafters Québec",
  "Flutter Montréal",
];

export default function AboutPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);

  useEffect(() => {
    loadData<Organizer>("organizers").then((organizers) => {
      setOrganizers(organizers);
    });
  }, []);

  return (
    <>
      {/* Meetups Section */}
      <div className="container mx-auto px-4 py-8 mb-12 text-center">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Meetups</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          /dev/mtl is an event that was born from the local tech communities. It
          would not be possible without the contribution of these people.
        </p>
        <div className="my-20 flex flex-wrap justify-center items-start gap-10">
          {meetups.map((meetup, index) => (
            <div
              key={index}
              className="text-3xl font-bold text-gray-500 text-center font-mono flex flex-col bg-gray-100 px-8 py-4 rounded-md"
            >
              {meetup.split(" ").map((word, i) => (
                <span key={i}>{word}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Organizers Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            Organizers
          </h2>

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
                <p className="text-xl font-semibold text-gray-700 mt-2">
                  {organizer.name}
                </p>
                <p className="text-lg text-gray-600">{organizer.role}</p>

                <Social
                  github={organizer.github}
                  linkedin={organizer.linkedin}
                  website={organizer.website}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
