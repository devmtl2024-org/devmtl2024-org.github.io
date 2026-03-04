import { useTranslation } from "@/hooks/useTranslation";

const YOUTUBE_CHANNEL = "https://www.youtube.com/@dev-mtl-conf";

const playlists = [
  {
    year: 2025,
    embedUrl:
      "https://www.youtube.com/embed/videoseries?list=PLPGe9iaDEmKy9dEc1-jzmXeIe3sEhfBxu",
  },
  {
    year: 2024,
    embedUrl:
      "https://www.youtube.com/embed/videoseries?list=PLPGe9iaDEmKyersezl8qO1mfjz7UDrs2M",
  },
];

export default function VideosPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-center text-gray-700 mb-4 text-lg">
        {t({
          fr: "Retrouvez toutes les conférences des éditions passées de /dev/mtl.",
          en: "Watch all talks from past /dev/mtl editions.",
        })}
      </p>

      <p className="text-center mb-12">
        <a
          href={YOUTUBE_CHANNEL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white bg-primary-light hover:bg-primary rounded-xl px-3 py-3 inline-block"
        >
          {t({
            fr: "Voir notre chaîne YouTube",
            en: "Visit our YouTube channel",
          })}
        </a>
      </p>

      {playlists.map(({ year, embedUrl }) => (
        <div key={year} className="mb-16">
          <h2 className="text-3xl font-bold text-center text-secondary mb-8">
            {t({ fr: `Édition ${year}`, en: `${year} Edition` })}
          </h2>
          <div className="aspect-video w-full max-w-4xl mx-auto">
            <iframe
              className="w-full h-full rounded-lg"
              src={embedUrl}
              title={t({
                fr: `Playlist /dev/mtl ${year}`,
                en: `/dev/mtl ${year} Playlist`,
              })}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      ))}
    </div>
  );
}
