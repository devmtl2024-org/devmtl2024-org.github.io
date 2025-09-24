import Social from "@/components/Social/Social";
import { useTranslation } from "@/hooks/useTranslation";
import { Organizer } from "@/type/organizers";
import { loadData } from "@/utils/loadData";
import { useEffect, useState } from "react";

interface Meetup {
  name: string;
  url?: string;
}

const meetups: Meetup[] = [
  { name: "Jug Montréal", url: "https://www.montreal-jug.org/" },
  { name: "Montréal Python", url: "https://montrealpython.org/" },
  {
    name: "Software Crafters Montréal",
    url: "https://guild.host/software-crafters-montreal",
  },
  { name: "React Montréal", url: "https://guild.host/react-montreal" },
  {
    name: "TypeScript Montréal",
    url: "https://guild.host/typescript-montreal/",
  },
  {
    name: "CNCF Montréal",
    url: "https://community.cncf.io/cloud-native-montreal/",
  },
  {
    name: "AI Tinkerers Montréal",
    url: "https://montreal.aitinkerers.org/",
  },
  {
    name: "Generative AI Montréal",
    url: "https://luma.com/calendar/cal-ugymCoObncHE8Ph",
  },
  {
    name: "Software Crafters Québec",
    url: "https://guild.host/software-crafters-quebec",
  },
  { name: "Women in AI", url: "https://www.womeninai.co/canada" },
  { name: "Elixir Montréal", url: "https://www.montrealelixir.ca/" },
  { name: "Ruby Montréal", url: "https://www.meetup.com/montrealrb/" },
  {
    name: "AWS Montréal",
    url: "https://www.meetup.com/Montreal-AWS-Users-United/",
  },
  { name: "Flutter Montréal", url: "https://www.meetup.com/Flutter-Montreal/" },
];

export default function AboutPage() {
  const { t } = useTranslation();
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
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">
          {t({
            fr: "Communautés",
            en: "Communities",
          })}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t({
            fr: "L'événement /dev/mtl est né des communautés locales. Il ne serait pas possible sans le soutien de ces personnes.",
            en: "/dev/mtl is an event that was born from the local tech communities. It would not be possible without the contribution of these people.",
          })}
        </p>
        <div className="my-20 flex flex-wrap justify-center items-start gap-10">
          {meetups.map((meetup, index) => (
            <div
              key={index}
              className="text-3xl font-bold text-gray-500 text-center font-mono flex flex-col bg-gray-100 px-8 py-4 rounded-md"
            >
              {meetup.name.split(" ").map((word, i) => (
                <span key={i}>
                  {meetup.url ? (
                    <a
                      href={meetup.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-700 transition-colors"
                    >
                      {word}
                    </a>
                  ) : (
                    word
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Organizers Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            {t({ fr: "Organisation", en: "Organizers" })}
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
