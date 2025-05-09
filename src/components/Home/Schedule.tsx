import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";

function Schedule() {
  const { t } = useTranslation();

  return (
    <section className="bg-gray-100 py-24 px-6 overflow-hidden items-center gap-12 flex flex-col">
      <div className="max-w-5xl mx-auto items-center gap-12 flex flex-col">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full text-center"
        >
          <h3 className="text-xs text-gray-700 uppercase tracking-widest mb-4">
            {t({ fr: "Détails du programme", en: "Schedule details" })}
          </h3>
          <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
            {t({ fr: "Agenda (2025)", en: "Agenda (2025)" })}
          </h3>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
        </motion.div>

        <p className="text-gray-700 text-2xl">
          {t({ fr: "Bientôt disponible ...", en: "Coming soon ..." })}
        </p>
      </div>
    </section>
  );
}

export default Schedule;
