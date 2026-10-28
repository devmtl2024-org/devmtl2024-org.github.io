import Logo from "@/assets/logo.svg?react";
import { Sponsor } from "@/type/sponsors";
import { Slide } from "./Slide";

const TIER_NAMES: Record<Sponsor["level"], { fr: string; en: string }> = {
  or: { fr: "Commanditaire Or", en: "Gold Sponsor" },
  argent: { fr: "Commanditaire Argent", en: "Silver Sponsor" },
  bronze: { fr: "Commanditaire Bronze", en: "Bronze Sponsor" },
  supporter: { fr: "Supporter", en: "Supporter" },
  media: { fr: "Partenaire média", en: "Media Partner" },
};

// The default slide, until the sponsor sends its own (see signage/overrides/)
export function SponsorSlide({ sponsor }: { sponsor: Sponsor }) {
  const tier = TIER_NAMES[sponsor.level];

  return (
    <Slide id={`sponsor-${sponsorSlug(sponsor)}`} reel="promo" seconds={8}>
      <div className="flex flex-1 flex-col items-center justify-center gap-12">
        <p className="text-4xl font-semibold uppercase tracking-widest text-secondary-light">
          Merci à · Thank you
        </p>
        <div className="flex h-[480px] w-[1100px] items-center justify-center rounded-3xl bg-white p-20">
          <img
            src={`${import.meta.env.BASE_URL}${sponsor.logo}`}
            alt={sponsor.name}
            className="size-full object-contain"
          />
        </div>
        <p className="text-4xl font-bold uppercase">
          {tier.fr}
          <span className="text-secondary"> · {tier.en}</span>
        </p>
      </div>
      <Logo
        fill="white"
        stroke="white"
        className="absolute bottom-12 right-16 h-12 w-auto opacity-80"
      />
    </Slide>
  );
}

function sponsorSlug(sponsor: Sponsor) {
  return sponsor.logo.replace(/^.*\//, "").replace(/\.\w+$/, "");
}

type SponsorsSlideProps = {
  id: string;
  reel: "infos" | "promo";
  tiers: Sponsor[][];
};

const LOGO_HEIGHTS = ["h-[170px]", "h-[130px]", "h-[100px]"];

export function SponsorsSlide({ id, reel, tiers }: SponsorsSlideProps) {
  return (
    <Slide id={id} reel={reel} seconds={10}>
      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-16">
        <Logo fill="white" stroke="white" className="h-20 w-auto" />
        <div className="text-center">
          <p className="text-5xl font-extrabold uppercase">
            Merci à nos commanditaires
          </p>
          <p className="mt-2 text-4xl font-semibold uppercase text-secondary">
            Thank you to our sponsors
          </p>
        </div>
        <div className="flex flex-col items-center gap-8">
          {tiers
            .filter((tier) => tier.length > 0)
            .map((tier, index) => (
              <div key={index} className="flex justify-center gap-8">
                {tier.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className={`flex items-center justify-center rounded-2xl bg-white px-10 py-6 ${LOGO_HEIGHTS[Math.min(index, LOGO_HEIGHTS.length - 1)]}`}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${sponsor.logo}`}
                      alt={sponsor.name}
                      className="h-full w-auto max-w-[380px] object-contain"
                    />
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </Slide>
  );
}
