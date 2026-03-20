import { Link } from "react-router-dom";
import { useSponsors } from "@/hooks/useSponsors";
import { useTranslation } from "@/hooks/useTranslation";
import { Sponsor } from "@/type/sponsors";

export default function SponsorsPage() {
  const { t } = useTranslation();
  const { orSponsors, argentSponsors, bronzeSponsors, supporterSponsors } =
    useSponsors();

  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-center text-gray-700 mb-12 text-lg">
        {t({
          fr: "/dev/mtl 2026 est possible grâce à la générosité des organisations et entreprises de cette page. Leur soutien rend possible cet événement à un prix abordable. Merci à eux!",
          en: "/dev/mtl 2026 is only possible through the generosity of the organizations and businesses on this page. Their support makes this event possible at an affordable price. Thank you!",
        })}
      </p>

      <SponsorSection
        sponsors={orSponsors}
        title={{
          fr: "Commanditaires Or",
          en: "Gold Sponsors",
        }}
      />

      <SponsorSection
        sponsors={argentSponsors}
        title={{
          fr: "Commanditaires Argent",
          en: "Silver Sponsors",
        }}
      />

      <SponsorSection
        sponsors={bronzeSponsors}
        title={{
          fr: "Commanditaires Bronze",
          en: "Bronze Sponsors",
        }}
      />

      <SponsorSection
        sponsors={supporterSponsors}
        title={{
          fr: "Supporteurs",
          en: "Supporters",
        }}
      />

      <div className="text-center mt-16 mb-8 p-8 bg-primary/5 rounded-2xl">
        <h2 className="text-2xl font-bold text-primary mb-4">
          {t({
            fr: "Envie de soutenir /dev/mtl?",
            en: "Want to support /dev/mtl?",
          })}
        </h2>
        <p className="text-gray-700 mb-6 text-lg">
          {t({
            fr: "Devenez commanditaire et contribuez à rendre cet événement accessible à la communauté tech de Montréal.",
            en: "Become a sponsor and help make this event accessible to Montreal's tech community.",
          })}
        </p>
        <Link
          to="/sponsorship"
          className="inline-block text-white bg-secondary hover:bg-secondary-dark rounded-xl px-6 py-3 text-lg font-semibold transition-colors"
        >
          {t({
            fr: "Devenir commanditaire",
            en: "Become a Sponsor",
          })}
        </Link>
      </div>
    </div>
  );
}

function SponsorSection({
  sponsors,
  title,
}: {
  sponsors: Sponsor[];
  title: { fr: string; en: string };
}) {
  const { t } = useTranslation();

  if (sponsors.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center text-secondary mb-8">
        {t(title)}
      </h2>
      <div className="space-y-8">
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
              <h3 className="text-xl font-semibold text-secondary mb-4">
                {sponsor.name}
              </h3>
              <p className="text-gray-600 mb-6">{t(sponsor.description)}</p>
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
