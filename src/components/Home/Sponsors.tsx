import { useTranslation } from "@/hooks/useTranslation";
import { Sponsor } from "@/type/sponsors";
import { motion } from "framer-motion";

function Sponsors() {
  const { t } = useTranslation();

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
        <a
          href="mailto:devmontreal.conf@gmail.com&subject=We%20want%20to%20sponsor%20/dev/mtl%202025"
          className="px-10 py-4 bg-secondary text-white font-medium rounded-md shadow-md hover:bg-secondary-dark uppercase inline-block text-center mt-12"
        >
          {t({ fr: "Devenez commanditaire", en: "Become a Sponsor" })}
        </a>
      </section>
    </div>
  );
}

export default Sponsors;

function SponsorsGroup({
  sponsors,
  className,
}: {
  sponsors: Sponsor[];
  className: string;
}) {
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
      {sponsors.map((sponsor, index) => (
        <motion.div
          key={`${sponsor.level}-${index}`}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center"
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
              className={`${className} object-contain mx-auto transition duration-300 group-hover:scale-110 bg-white p-4`}
            />
          </a>
        </motion.div>
      ))}
    </motion.div>
  );
}
