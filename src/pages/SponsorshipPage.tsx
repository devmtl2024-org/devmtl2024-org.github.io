import { useTranslation } from "@/hooks/useTranslation";
import { FaLinkedin, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const TIERS = [
  {
    name: { fr: "Or", en: "Gold" },
    color: "bg-yellow-500",
    price: "3 000",
    available: 3,
    tickets: 5,
    perks: [true, true, true, true, true, true, true, true, true],
  },
  {
    name: { fr: "Argent", en: "Silver" },
    color: "bg-gray-400",
    price: "2 000",
    available: 4,
    tickets: 4,
    perks: [true, true, true, true, true, true, true, false, false],
  },
  {
    name: { fr: "Bronze", en: "Bronze" },
    color: "bg-amber-700",
    price: "750",
    available: 5,
    tickets: 2,
    perks: [true, true, true, true, false, false, false, false, false],
  },
] as const;

const PERKS = [
  { fr: "Mention sur LinkedIn", en: "Mention on LinkedIn" },
  { fr: "Logo sur notre site web", en: "Logo on our website" },
  { fr: "Logo sur slides de la keynote", en: "Logo on keynote slides" },
  {
    fr: "Logo sur notre rollup physique",
    en: "Logo on our physical roll-up banner",
  },
  {
    fr: "Logo sur vidéos des talks (YouTube)",
    en: "Logo on talk videos (YouTube)",
  },
  {
    fr: "Possibilité de distribuer des swags/goodies",
    en: "Can distribute swags/goodies",
  },
  {
    fr: 'Stand sur place (+1 entrée "tenue du stand")',
    en: 'On-site booth (+1 "booth staff" entry)',
  },
  {
    fr: "Emplacement privilégié pour votre stand",
    en: "Premium booth location",
  },
  {
    fr: "Discours lors de la keynote (3min)",
    en: "Speaking slot during keynote (3min)",
  },
] as const;

export default function SponsorshipPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="max-w-4xl mx-auto mb-16">
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          {t({
            fr: "/dev/mtl est un événement communautaire qui rassemble des développeur·euse·s passionné·e·s autour du partage, de l'apprentissage et des meilleures pratiques du web.",
            en: "/dev/mtl is a community-driven event that brings together passionate developers to share knowledge, learn from one another, and explore web best practices.",
          })}
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          {t({
            fr: "En devenant commanditaire de l'édition 2026, vous soutenez directement la communauté locale tout en donnant de la visibilité à votre entreprise auprès de talents engagés.",
            en: "By becoming a sponsor for the 2026 edition, you directly support the local community while gaining visibility with engaged and talented developers.",
          })}
        </p>
      </section>

      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold text-gray-700 text-center mb-8">
          {t({ fr: "Grille de commandite", en: "Sponsorship Tiers" })}
        </h2>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left" />
                {TIERS.map((tier) => (
                  <th key={t(tier.name)} className="p-4 text-center">
                    <span
                      className={`inline-block px-6 py-2 rounded-full text-white font-bold text-lg ${tier.color}`}
                    >
                      {t(tier.name)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="p-4 font-medium text-gray-700">
                  {t({ fr: "Disponibles", en: "Available" })}
                </td>
                {TIERS.map((tier) => (
                  <td
                    key={t(tier.name)}
                    className="p-4 text-center text-gray-600"
                  >
                    {tier.available}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-200 bg-gray-50">
                <td className="p-4 font-medium text-gray-700">
                  {t({ fr: "Prix ($ CAD)", en: "Price ($ CAD)" })}
                </td>
                {TIERS.map((tier) => (
                  <td
                    key={t(tier.name)}
                    className="p-4 text-center font-bold text-xl text-primary"
                  >
                    ${tier.price}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-200">
                <td className="p-4 font-medium text-gray-700">
                  {t({
                    fr: "Billets pour la conférence inclus",
                    en: "Conference tickets included",
                  })}
                </td>
                {TIERS.map((tier) => (
                  <td
                    key={t(tier.name)}
                    className="p-4 text-center text-gray-600"
                  >
                    {tier.tickets}
                  </td>
                ))}
              </tr>
              {PERKS.map((perk, perkIndex) => (
                <tr
                  key={perkIndex}
                  className={`border-t border-gray-200 ${perkIndex % 2 === 0 ? "bg-gray-50" : ""}`}
                >
                  <td className="p-4 font-medium text-gray-700">{t(perk)}</td>
                  {TIERS.map((tier) => (
                    <td
                      key={t(tier.name)}
                      className="p-4 text-center text-xl"
                    >
                      {tier.perks[perkIndex] ? (
                        <span className="text-green-600">&#10003;</span>
                      ) : (
                        <span className="text-gray-300">&mdash;</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-8">
          {TIERS.map((tier) => (
            <div
              key={t(tier.name)}
              className="border rounded-lg shadow-md overflow-hidden"
            >
              <div
                className={`${tier.color} text-white text-center py-4 px-6`}
              >
                <h3 className="text-2xl font-bold">{t(tier.name)}</h3>
                <p className="text-3xl font-bold mt-1">${tier.price}</p>
                <p className="text-sm opacity-90">CAD</p>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-gray-700 pb-3 border-b border-gray-200">
                  <span>{t({ fr: "Disponibles", en: "Available" })}</span>
                  <span className="font-medium">{tier.available}</span>
                </div>
                <div className="flex justify-between text-gray-700 pb-3 border-b border-gray-200">
                  <span>
                    {t({
                      fr: "Billets inclus",
                      en: "Tickets included",
                    })}
                  </span>
                  <span className="font-medium">{tier.tickets}</span>
                </div>
                {PERKS.map((perk, perkIndex) => (
                  <div
                    key={perkIndex}
                    className={`flex justify-between items-start gap-4 pb-3 border-b border-gray-100 ${
                      tier.perks[perkIndex] ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    <span className="text-sm">{t(perk)}</span>
                    <span className="shrink-0">
                      {tier.perks[perkIndex] ? (
                        <span className="text-green-600">&#10003;</span>
                      ) : (
                        <span className="text-gray-300">&mdash;</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold text-gray-700 text-center mb-8">
          {t({ fr: "Notre audience", en: "Our Audience" })}
        </h2>
        <div className="flex flex-col items-center gap-6">
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-5xl font-bold text-primary mb-2">~160</p>
            <p className="text-gray-600 text-lg">
              {t({
                fr: "participants attendus en 2026",
                en: "expected attendees in 2026",
              })}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.youtube.com/@dev-mtl-conf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-primary font-medium hover:bg-gray-50 transition-colors"
            >
              <FaYoutube className="text-xl" />
              <span className="text-gray-500 font-normal">
                {t({
                  fr: "Nos talks passés",
                  en: "Our past talks",
                })}
              </span>
            </a>
            <a
              href="https://www.linkedin.com/company/dev-mtl/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-primary font-medium hover:bg-gray-50 transition-colors"
            >
              <FaLinkedin className="text-xl" />
              <span className="text-gray-500 font-normal">
                {t({
                  fr: "Suivez-nous",
                  en: "Follow us",
                })}
              </span>
            </a>
            <Link
              to="/transparency"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-primary font-medium hover:bg-gray-50 transition-colors"
            >
              {t({ fr: "Transparence", en: "Transparency" })}
              <span className="text-gray-500 font-normal">
                {t({
                  fr: "Nos chiffres des années précédentes",
                  en: "Our numbers from previous years",
                })}
              </span>
              &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto text-center mb-16">
        <div className="bg-gradient-to-b from-primary-dark to-primary/80 rounded-2xl p-12">
          <h2 className="text-3xl font-semibold text-white mb-4">
            {t({ fr: "Intéressé·e ?", en: "Interested?" })}
          </h2>
          <p className="text-white mb-8 text-lg">
            {t({
              fr: "Contactez-nous pour discuter de la formule qui vous convient le mieux.",
              en: "Get in touch to discuss the package that works best for you.",
            })}
          </p>
          <a
            href={`mailto:nicolascarlo.espeon@gmail.com?subject=${encodeURIComponent(t({ fr: "Commandite /dev/mtl 2026", en: "Sponsoring /dev/mtl 2026" }))}`}
            className="px-10 py-4 bg-secondary text-white font-medium rounded-md shadow-md hover:bg-secondary-dark uppercase inline-block"
          >
            {t({ fr: "Nous contacter", en: "Contact Us" })}
          </a>
        </div>
      </section>
    </div>
  );
}
