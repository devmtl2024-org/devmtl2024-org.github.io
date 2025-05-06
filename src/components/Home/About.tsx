import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import {
  FaHandshake,
  FaRegGrinStars,
  FaRegSurprise,
  FaUsers,
} from "react-icons/fa";
import BuyTicketButton from "../BuyTicket/BuyTicketButton";

function About() {
  const { t } = useTranslation();

  return (
    <section className="bg-gray-100 py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-12">
        {/* First Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/3"
        >
          <h3 className="text-xs text-gray-700 uppercase tracking-widest mb-4">
            {t({ fr: "À propos", en: "About" })}
          </h3>
          <h3 className="text-4xl font-semibold text-primary leading-tight mb-4">
            {t({
              fr: "Pourquoi rejoindre l'événement?",
              en: "Why you should join this event",
            })}
          </h3>
          <div className="w-16 h-1 bg-primary mb-6"></div>
          <p className="text-sm text-gray-800 mb-6">
            {t({
              fr: "Profitez d'une journée de partage, d'apprentissage et de réseautage avec les communautés tech de Montréal.",
              en: "Enjoy a day of learning, networking, and sharing with the local tech communities.",
            })}
          </p>
          <BuyTicketButton />
        </motion.div>

        {/* Second Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-white p-8 shadow-xl rounded-md relative">
            <FaRegSurprise className="absolute top-4 right-4 text-gray-400 text-2xl" />
            <h4 className="text-xl font-semibold text-black mb-2">
              {t({
                fr: "Célébrez l'innovation technologique",
                en: "Celebrate Tech Innovation",
              })}
            </h4>
            <p className="text-gray-700 text-sm">
              {t({
                fr: "Joignez-vous à la communauté tech et discutez des dernières innovations.",
                en: "Join our tech gathering in Montreal and talk about the latest innovations.",
              })}
            </p>
          </div>
          <div className="bg-white p-8 shadow-xl rounded-md relative">
            <FaHandshake className="absolute top-4 right-4 text-gray-400 text-2xl" />
            <h4 className="text-xl font-semibold text-black mb-2">
              {t({
                fr: "Réseautez avec des experts",
                en: "Network with Experts",
              })}
            </h4>
            <p className="text-gray-700 text-sm">
              {t({
                fr: "Rencontrez des professionnels et faites des connections qui vous aideront à développer votre carrière.",
                en: "Meet professionals and make connections that can boost your career.",
              })}
            </p>
          </div>
          <div className="bg-white p-8 shadow-xl rounded-md relative">
            <FaUsers className="absolute top-4 right-4 text-gray-400 text-2xl" />
            <h4 className="text-xl font-semibold text-black mb-2">
              {t({ fr: "Rejoignez la communauté", en: "Join the Community" })}
            </h4>
            <p className="text-gray-700 text-sm">
              {t({
                fr: "Rejoignez la communauté tech de Montréal et rencontrez des personnes passionnées de la tech.",
                en: "Connect with like-minded tech enthusiasts from all over Montreal.",
              })}
            </p>
          </div>
          <div className="bg-white p-8 shadow-xl rounded-md relative">
            <FaRegGrinStars className="absolute top-4 right-4 text-gray-400 text-2xl" />
            <h4 className="text-xl font-semibold text-black mb-2">
              {t({
                fr: "Du fun et de l'inspiration",
                en: "Fun and Inspiration",
              })}
            </h4>
            <p className="text-gray-700 text-sm">
              {t({
                fr: "Profitez d'une ambiance décontractée et laissez-vous inspirer!",
                en: "Enjoy a vibrant atmosphere and leave feeling inspired!",
              })}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
