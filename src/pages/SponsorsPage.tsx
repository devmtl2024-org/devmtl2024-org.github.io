import { useSponsors } from "@/hooks/useSponsors";
import { useTranslation } from "@/hooks/useTranslation";

export default function SponsorsPage() {
  const { t } = useTranslation();
  const sponsors = useSponsors();

  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-center text-gray-700 mb-6 text-lg">
        {t({
          fr: "/dev/mtl 2025 est possible grâce à la générosité des organisations et entreprises de cette page. Leurs soutien rend possible cet événement à un prix abordable. Merci à eux!",
          en: "/dev/mtl 2025 is only possible through the generosity of the organizations and businesses on this page. Their donations make this special day possible. Thank you for your support!",
        })}
      </p>

      <div className="space-y-8 mb-12">
        {sponsors.map((sponsor, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 mt-8 p-6 pb-8 border rounded-lg shadow-md gap-6"
          >
            <div className="size-32">
              <img
                src={`${import.meta.env.BASE_URL}${sponsor.logo}`}
                alt={sponsor.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold text-secondary mb-4">
                {sponsor.name}
              </h2>
              <p className="text-gray-600 mb-6">{sponsor.description}</p>
              <a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-primary-light hover:bg-primary rounded-xl px-3 py-3"
              >
                {t({ fr: "Visiter leur site", en: "Visit Website" })}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
