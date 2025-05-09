import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import backgroundImage from "../../assets/background-1.jpg";
import CFPSection from "../CFPSection/CFPSection";

function CFP() {
  const { t } = useTranslation();

  return (
    <section
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-4 py-24 w-full text-center"
      >
        <div className="mb-12">
          <h3 className="text-xs text-gray-700 uppercase tracking-widest mb-4">
            {t({ fr: "Écoutez les", en: "Listen to the" })}
          </h3>
          <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
            {t({ fr: "Conférenciers", en: "Event Speakers" })}
          </h3>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
        </div>

        <CFPSection />
      </motion.section>
    </section>
  );
}

export default CFP;
