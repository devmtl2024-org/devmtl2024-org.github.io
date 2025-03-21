import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Speaker } from "@/type/speakers";
import Social from "@/components/Social/Social";
import TalkSession from "@/components/Talks/TalkSession";

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

  return (
    <div className="container mx-auto px-4 py-8 flex flex-row gap-8">
      <div className="p-6 bg-gray-100 flex flex-col items-center">
        <img
          src={speaker.image}
          alt={speaker.name}
          className="w-52 h-52 rounded-full mb-4"
        />
        <h2 className="text-2xl font-semibold">{speaker.name}</h2>

        <Social
          github={speaker.github}
          linkedin={speaker.linkedin}
          website={speaker.website}
        />

        <p className="mt-4 text-gray-600 text-center">{speaker.bio}</p>
      </div>

      <TalkSession speaker={speaker} index={0} />
    </div>
  );
}
