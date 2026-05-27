import { useSponsors } from "@/hooks/useSponsors";
import { useTranslation } from "@/hooks/useTranslation";
import { Sponsor } from "@/type/sponsors";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Sponsors() {
  const { t } = useTranslation();
  const { orSponsors, argentSponsors, bronzeSponsors, supporterSponsors } =
    useSponsors();

  return (
    <div className="bg-gradient-to-b from-primary-dark to-primary/80">
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        {/* Title Section - Animated */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-xs text-white uppercase tracking-widest mb-4">
            {t({ fr: "Ceux qui nous aident", en: "Who helps us" })}
          </h3>
          <h3 className="text-4xl font-semibold text-white leading-tight mb-4">
            {t({ fr: "Commanditaires", en: "Sponsors" })}
          </h3>
          <div className="w-16 h-1 bg-white mx-auto mb-6"></div>
        </motion.div>

        <div className="flex flex-col gap-6 mb-12">
          <SponsorTier sponsors={orSponsors} size="size-52" />
          <SponsorTier sponsors={argentSponsors} size="size-44" />
          <SponsorTier sponsors={bronzeSponsors} size="size-36" />
          <SponsorTier sponsors={supporterSponsors} size="size-36" />
        </div>

        <h3 className="text-3xl font-semibold text-white mb-6 text-center">
          {t({
            fr: "Soutenez la communauté tech montréalaise",
            en: "Support the Montreal Tech Community",
          })}
        </h3>

        <p className="text-white">
          {t({
            fr: "/dev/mtl est un événement communautaire qui rassemble des développeur·euse·s passionné·e·s autour du partage, de l’apprentissage et des meilleures pratiques du web.",
            en: "/dev/mtl is a community-driven event that brings together passionate developers to share knowledge, learn from one another, and explore web best practices.",
          })}
        </p>

        <p className="text-white">
          {t({
            fr: "En devenant commanditaire de l’édition 2026, vous soutenez directement la communauté locale tout en donnant de la visibilité à votre entreprise auprès de talents engagés.",
            en: "By becoming a sponsor for the 2026 edition, you directly support the local community while gaining visibility with engaged and talented developers.",
          })}
        </p>
        <Link
          to="/sponsorship"
          className="px-10 py-4 bg-secondary text-white font-medium rounded-md shadow-md hover:bg-secondary-dark uppercase inline-block text-center mt-12"
        >
          {t({ fr: "Devenez commanditaire", en: "Become a Sponsor" })}
        </Link>
      </section>
    </div>
  );
}

export default Sponsors;

function SponsorTier({ sponsors, size }: { sponsors: Sponsor[]; size: string }) {
  if (sponsors.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-wrap gap-8 justify-center items-end"
    >
      {sponsors.map((sponsor) => (
        <motion.div
          key={sponsor.name}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <a
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <img
              src={`${import.meta.env.BASE_URL}${sponsor.logo}`}
              alt={sponsor.name}
              className={`${size} object-contain bg-white p-4 transition duration-300 group-hover:scale-110`}
            />
          </a>
        </motion.div>
      ))}
    </motion.div>
  );
}
