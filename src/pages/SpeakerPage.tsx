import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Speaker } from "@/type/speakers";
import Social from "@/components/Social/Social";

export default function SpeakerPage() {
  const { name, year } = useParams<{ name: string; year: string }>();
  const [speaker, setSpeaker] = useState<Speaker | null>(null);

  useEffect(() => {
    if (!name) return;

    import(`../assets/speakers-${year}/${name}.json`)
      .then((module) => setSpeaker(module.default))
      .catch(() => console.error("Speaker not found"));
  }, [name]);

  if (!speaker) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Speaker not found.</p>
      </div>
    );
  }
  
  const formattedTime = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(new Date(speaker.time)); 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-medium text-center text-secondary mb-4">
        {speaker.title}
      </h1>
      <p className="text-center text-gray-700 font-semibold">{formattedTime}</p>
      <p className="mt-4 text-gray-600 text-lg">
        {speaker.description.split("\n").map((line, index) => (
          <p key={index} className="mb-2">
            {line}
          </p>
        ))}
      </p>

      <div className="mt-8 p-6 border rounded-lg shadow-md flex flex-col items-center">
        <img
          src={speaker.image}
          alt={speaker.name}
          className="w-32 h-32 rounded-full mb-4"
        />
        <h2 className="text-2xl font-semibold">{speaker.name}</h2>

        <Social
          github={speaker.github}
          linkedin={speaker.linkedin}
          website={speaker.website}
        />

        <p className="mt-4 text-gray-600 text-center">{speaker.bio}</p>
      </div>
    </div>
  );
}
