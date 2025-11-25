import { useTranslation } from "@/hooks/useTranslation";

export default function ConductPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "/dev/mtl se consacre à offrir une expérience de conférence amusante et sans harcèlement pour tous, indépendamment du genre, de l'identité de genre, de l'orientation sexuelle, du handicap, de l'apparence physique, de la taille corporelle, de la race ou de la religion.",
              en: "/dev/mtl is dedicated to providing a fun harassment-free conference experience for everyone, regardless of gender, gender identity, sexual orientation, disability, physical appearance, body size, race, or religion.",
            })}
          </p>

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "Soyez gentil avec les autres. N'insultez pas et ne rabaissez pas les autres participants. Comportez-vous de manière professionnelle.",
              en: "Be kind to others. Do not insult or put down other attendees. Behave professionally.",
            })}
          </p>

          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "Rappelez-vous que le harcèlement et les blagues sexistes, racistes ou d'exclusion ne sont pas appropriés pour /dev/mtl.",
              en: "Remember that harassment and sexist, racist, or exclusionary jokes are not appropriate for /dev/mtl.",
            })}
          </p>

          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            {t({
              fr: "Les participants qui enfreignent ces règles peuvent être invités à quitter la conférence sans remboursement à la seule discrétion des organisateurs de la conférence.",
              en: "Attendees violating these rules may be asked to leave the conference without a refund at the sole discretion of the conference organizers.",
            })}
          </p>

          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            {t({
              fr: "Merci de contribuer à faire de cet événement un événement accueillant et amical pour tous.",
              en: "Thank you for helping make this a welcoming, friendly event for all.",
            })}
          </p>

          <h2 className="text-3xl font-semibold text-gray-700 mb-6">
            {t({
              fr: "Code de conduite complet",
              en: "Full Code of Conduct",
            })}
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6 italic">
            {t({
              fr: "Pour clarifier ce qui est attendu, tous les délégués/participants, conférenciers, exposants, organisateurs et bénévoles de tout événement /dev/mtl sont tenus de se conformer au Code de conduite suivant. Les organisateurs appliqueront ce code tout au long de l'événement.",
              en: "To make clear what is expected, all delegates/attendees, speakers, exhibitors, organizers and volunteers at any /dev/mtl event are required to conform to the following Code of Conduct. Organizers will enforce this code throughout the event.",
            })}
          </p>

          <h3 className="text-2xl font-semibold text-gray-700 mb-4 mt-8">
            {t({
              fr: "Ce qu'est la conférence",
              en: "What the conference is",
            })}
          </h3>

          <p className="text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "/dev/mtl est une conférence communautaire destinée au réseautage et à la collaboration dans la communauté des développeurs.",
              en: "/dev/mtl is a community conference intended for networking and collaboration in the developer community.",
            })}
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "Nous valorisons la participation de chaque membre de la communauté et souhaitons que tous les participants aient une expérience agréable et enrichissante. En conséquence, tous les participants sont censés faire preuve de respect et de courtoisie envers les autres participants tout au long de la conférence, lors de tous les événements de la conférence et dans tous les espaces en ligne de la conférence (tels que Discord), qu'ils soient officiellement parrainés par /dev/mtl ou non.",
              en: "We value the participation of each member of the community and want all attendees to have an enjoyable and fulfilling experience. Accordingly, all attendees are expected to show respect and courtesy to other attendees throughout the conference, at all conference events, and in all conference online spaces (such as Discord), whether officially sponsored by /dev/mtl or not.",
            })}
          </p>

          <h3 className="text-2xl font-semibold text-gray-700 mb-4 mt-8">
            {t({
              fr: "Soyez gentil avec les autres",
              en: "Be Kind To Others",
            })}
          </h3>

          <p className="text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "N'insultez pas et ne rabaissez pas les autres participants. Comportez-vous de manière professionnelle. Rappelez-vous que le harcèlement et les blagues sexistes, racistes ou d'exclusion ne sont pas appropriés pour /dev/mtl. Les participants qui enfreignent ces règles peuvent être invités à quitter la conférence sans remboursement à la seule discrétion des organisateurs de la conférence.",
              en: "Do not insult or put down other attendees. Behave professionally. Remember that harassment and sexist, racist, or exclusionary jokes are not appropriate for /dev/mtl. Attendees violating these rules may be asked to leave the conference without a refund at the sole discretion of the conference organizers.",
            })}
          </p>

          <h3 className="text-2xl font-semibold text-gray-700 mb-4 mt-8">
            {t({
              fr: "Soyez respectueux",
              en: "Be Respectful",
            })}
          </h3>

          <p className="text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "Nous ne serons pas tous d'accord tout le temps, mais le désaccord n'est pas une excuse pour un mauvais comportement et de mauvaises manières. Nous ne tolérons pas le harcèlement des participants à la conférence sous quelque forme que ce soit.",
              en: "Not all of us will agree all the time, but disagreement is no excuse for poor behavior and poor manners. We do not tolerate harassment of conference participants in any form.",
            })}
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "Le harcèlement comprend : les commentaires verbaux offensants liés au genre, à l'identité de genre, à l'orientation sexuelle, au handicap, à l'apparence physique, à la taille corporelle, à la race, à la religion ; les images sexuelles dans les espaces publics ; l'intimidation délibérée, le harcèlement ou le suivi ; la photographie ou l'enregistrement harcelant ; la perturbation soutenue des discussions ou d'autres événements ; le contact physique inapproprié ; et l'attention sexuelle non désirée.",
              en: "Harassment includes: offensive verbal comments related to gender, gender identity, sexual orientation, disability, physical appearance, body size, race, religion; sexual images in public spaces; deliberate intimidation, stalking, or following; harassing photography or recording; sustained disruption of talks or other events; inappropriate physical contact; and unwelcome sexual attention.",
            })}
          </p>

          <h3 className="text-2xl font-semibold text-gray-700 mb-4 mt-8">
            {t({
              fr: "Choisissez vos mots",
              en: "Choose Your Words",
            })}
          </h3>

          <p className="text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "Soyez prudent dans les mots que vous choisissez. Rappelez-vous que les blagues sexistes, racistes et autres blagues d'exclusion peuvent être offensantes pour ceux qui vous entourent. Les jurons excessifs et les blagues offensantes ne sont pas appropriés pour /dev/mtl. Nous sommes tous des adultes, capables d'avoir des conversations d'adultes. Préfacez votre présentation avec des avertissements de déclenchement/contenu appropriés, si nécessaire.",
              en: "Be careful in the words that you choose. Remember that sexist, racist, and other exclusionary jokes can be offensive to those around you. Excessive swearing and offensive jokes are not appropriate for /dev/mtl. We are all adults, capable of having adult conversations. Preface your presentation with appropriate Trigger/Content Warnings, if necessary.",
            })}
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "Toute communication doit être appropriée pour un public professionnel comprenant des personnes de nombreux horizons différents. Le langage et les images sexuels ne sont pas appropriés pour tout lieu de conférence, y compris les présentations.",
              en: "All communication should be appropriate for a professional audience including people of many different backgrounds. Sexual language and imagery is not appropriate for any conference venue, including talks.",
            })}
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "Les participants invités à cesser tout comportement de harcèlement sont censés se conformer immédiatement.",
              en: "Participants asked to stop any harassing behavior are expected to comply immediately.",
            })}
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "Les exposants dans le hall d'exposition, les stands de sponsors ou de vendeurs, ou des activités similaires sont également soumis à la politique anti-harcèlement. En particulier, les exposants ne doivent pas utiliser d'images, d'activités ou d'autres matériels sexualisés. Le personnel des stands (y compris les bénévoles) ne doit pas utiliser de vêtements/uniformes/costumes sexualisés, ou créer autrement un environnement sexualisé.",
              en: "Exhibitors in the expo hall, sponsor or vendor booths, or similar activities are also subject to the anti-harassment policy. In particular, exhibitors should not use sexualized images, activities, or other material. Booth staff (including volunteers) should not use sexualized clothing/uniforms/costumes, or otherwise create a sexualized environment.",
            })}
          </p>

          <h3 className="text-2xl font-semibold text-gray-700 mb-4 mt-8">
            {t({
              fr: "Photographie",
              en: "Photography",
            })}
          </h3>

          <p className="text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "Afin de faire de /dev/mtl 2024 une excellente expérience pour tous, ne photographiez, ne filmez ou n'enregistrez personne à /dev/mtl sans leur permission expresse, demandée à l'avance. Si quelqu'un ne veut pas être photographié, filmé ou enregistré, veuillez respecter ses souhaits.",
              en: "In order to make /dev/mtl 2024 a great experience for everyone, do not photograph, video, or audio record anyone at /dev/mtl without their express permission, sought in advance. If someone does not want to be photographed, video or audio recorded, please respect their wishes.",
            })}
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "Les photos de foule sont autorisées, mais lorsque seuls les visages de quelques personnes sont visibles, la permission doit être demandée à toutes ces personnes.",
              en: "Crowd shots are permitted, but when only the faces of a few people are visible, permission should be sought from all of those individuals.",
            })}
          </p>

          <p className="text-gray-600 leading-relaxed mb-12 italic">
            {t({
              fr: "Si un participant adopte un comportement qui viole ce code de conduite, les organisateurs de la conférence peuvent prendre toute mesure qu'ils jugent appropriée, y compris avertir le contrevenant ou l'expulsion de la conférence sans remboursement.",
              en: "If a participant engages in behavior that violates this code of conduct, the conference organizers may take any action they deem appropriate, including warning the offender or expulsion from the conference with no refund.",
            })}
          </p>

          <h2 className="text-3xl font-semibold text-gray-700 mb-6 mt-12">
            {t({
              fr: "Licence",
              en: "License",
            })}
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6">
            {t({
              fr: "Ce Code de conduite a été dérivé de l'exemple de politique du wiki Geek Feminism, créé par l'Ada Initiative et d'autres bénévoles, qui est sous licence Creative Commons Zero.",
              en: "This Code of Conduct was forked from the example policy from the Geek Feminism wiki, created by the Ada Initiative and other volunteers, which is under a Creative Commons Zero license.",
            })}
          </p>

          <p className="text-gray-600 leading-relaxed">
            {t({
              fr: "Le Code de conduite de la conférence par www.dev-mtl.ca/conduct est sous licence Creative Commons Attribution 3.0 Unported License.",
              en: "Conference Code of Conduct by www.dev-mtl.ca/conduct is licensed under a Creative Commons Attribution 3.0 Unported License.",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

