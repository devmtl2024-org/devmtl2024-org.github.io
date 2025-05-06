import { useTranslation } from "@/hooks/useTranslation";
import overviewImage from "../../assets/venue.jpg";

function Meetups() {
  const { t } = useTranslation();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2">
      {/* Image avec surcouche bleue */}
      <div
        className="relative bg-cover bg-center flex items-center justify-center min-h-[300px] sm:min-h-[200px]"
        style={{ backgroundImage: `url(${overviewImage})` }}
      >
        <div className="absolute inset-0 bg-primary/50"></div>
      </div>

      {/* Texte à droite */}
      <div className="bg-gradient-to-b from-primary-dark to-primary/80 flex flex-col justify-center px-8 py-24 text-white">
        <h3 className="text-sm uppercase tracking-widest mb-2 opacity-80">
          {t({
            fr: "Un rendez-vous inoubliable",
            en: "An Unmissable Gathering",
          })}
        </h3>
        <h3 className="text-3xl font-semibold leading-tight mb-4">
          {t({
            fr: "Le lieu où se rencontrent toutes les communautés tech de Montréal",
            en: "The place where all Montreal meetups come together",
          })}
        </h3>
        <p className="text-lg mb-6 opacity-90">
          {t({
            fr: "Un lieu où la communauté tech de Montréal se réunit pour célébrer l'innovation. Rejoignez-nous pour échanger des idées, faire des rencontres et participer à un jour de conférences et de partage de connaissances.",
            en: "A place where Montreal's tech community unites to celebrate innovation. Join us to exchange ideas, make connections, and participate in a day of inspiring talks and knowledge-sharing.",
          })}
        </p>
        <div className="w-12 h-1 bg-white"></div>
      </div>
    </section>
  );
}

export default Meetups;
