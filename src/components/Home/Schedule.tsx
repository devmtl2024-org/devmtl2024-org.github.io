import { useTranslation } from "@/hooks/useTranslation";
import { Speaker } from "@/type/speakers";
import { loadData } from "@/utils/loadData";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TalkOverview from "../Talks/TalkOverview";

function Schedule() {
  const { t } = useTranslation();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    loadData<Speaker>("speakers", 3, true).then((speakers) => {
      setSpeakers(speakers);
    });
  }, []);

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
            {t({ fr: "Agenda (2024)", en: "Agenda (2024)" })}
          </h3>
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
        </motion.div>

        {/* Date Card */}
        <div className="bg-secondary text-white rounded-lg p-8 shadow-md w-64 text-center">
          <h4 className="text-2xl font-semibold mb-2">
            {t({ fr: "27 Novembre", en: "November 27th" })}
          </h4>
          <p className="text-xl">{t({ fr: "Mercredi", en: "Wednesday" })}</p>
        </div>
      </div>

      <div>
        {speakers.map((speaker, index) => (
          <div key={index}>
            <TalkOverview speaker={speaker} index={index} />
          </div>
        ))}
      </div>

      <Link
        to="/schedule"
        className="px-12 py-5 bg-secondary text-white font-medium rounded-md shadow-md hover:bg-secondary-dark uppercase"
        onClick={() => window.scrollTo({ top: 0 })}
      >
        {t({ fr: "Voir plus", en: "See more" })}
      </Link>
    </section>
  );
}

export default Schedule;
