import Social from "@/components/Social/Social";
import TalkSession from "@/components/Talks/TalkSession";
import { Speaker } from "@/type/speakers";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type SpeakerWithYear = Speaker & { year?: number };

export default function SpeakerPage() {
  const { name } = useParams<{ name: string }>();
  const [talks, setTalks] = useState<SpeakerWithYear[]>([]);
  const [speakerInfo, setSpeakerInfo] = useState<SpeakerWithYear | null>(null);

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "-");

  useEffect(() => {
    if (!name) {
      return;
    }

    const modules = import.meta.glob("../assets/speakers-*/**/*.json");

    const matchedTalks: SpeakerWithYear[] = [];

    const promises = Object.entries(modules).map(async ([path, loader]) => {
      const { default: speaker } = (await loader()) as { default: Speaker };
      if (normalize(speaker.name) === normalize(name)) {
        const yearMatch = path.match(/speakers-(\d{4})/);
        matchedTalks.push({
          ...speaker,
          year: yearMatch ? parseInt(yearMatch[1]) : undefined,
        });
      }
    });

    Promise.all(promises).then(() => {
      matchedTalks.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
      setTalks(matchedTalks);
      setSpeakerInfo(matchedTalks[0] || null);
    });
  }, [name]);

  if (!speakerInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Speaker not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <div className="p-6 bg-gray-100 flex flex-col items-center w-80 mx-auto md:mx-0">
        <img
          src={`${import.meta.env.BASE_URL}${speakerInfo.image}`}
          alt={speakerInfo.name}
          className="w-52 h-52 rounded-full mb-4 object-cover"
        />
        <h2 className="text-2xl font-semibold">{speakerInfo.name}</h2>

        <Social
          github={speakerInfo.github}
          linkedin={speakerInfo.linkedin}
          website={speakerInfo.website}
        />

        <p className="mt-4 text-gray-600 text-center">{speakerInfo.bio}</p>
      </div>

      <div className="flex-1">
        <h3 className="text-2xl font-bold mb-4">Talks</h3>
        {talks.map((talk, i) => (
          <div key={`${talk.year}-${i}`} className="mb-8">
            <TalkSession speaker={talk} index={i} />
            <p className="text-sm text-gray-500 mt-2">Year: {talk.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
