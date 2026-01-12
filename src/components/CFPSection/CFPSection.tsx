import { useTranslation } from "@/hooks/useTranslation";

// const CFPSection: React.FC = () => {
//   const { t } = useTranslation();

//   return (
//     <section className="py-16">
//       <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-20">
//         <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">
//           {t({
//             fr: "Appel aux conférenciers pour 2025",
//             en: "Call For Papers for 2025",
//           })}
//         </h2>

//         <div className="text-lg text-gray-600 mb-8">
//           <p>
//             {t({
//               fr: "/dev/mtl est une conférence qui a lieu sur une journée, à Montréal. Nous acceptons des présentations en Français et en Anglais.",
//               en: "/dev/mtl is a day-long conference happening in Montréal. We are looking for French and English speakers.",
//             })}
//           </p>

//           <p className="mt-6">
//             {t({
//               fr: "Tout ce qui touche à la tech et peut intéresser les développeurs et développeuses est valide, par exemple:",
//               en: "Everything tech-related that could be interesting for developers is accepted, such as:",
//             })}
//           </p>

//           <ul className="list-disc pl-5 mt-4 text-left">
//             <li>
//               {t({
//                 fr: "Un sujet portant sur un langage particulier (JavaScript, Ruby, Python, PHP, Java, Kotlin, Elixir, etc.)",
//                 en: "A topic on a specific language (JavaScript, Ruby, Python, PHP, Java, Kotlin, Elixir, etc.)",
//               })}
//             </li>
//             <li>
//               {t({
//                 fr: "DevOps, CI/CD, livraison en continu",
//                 en: "DevOps, CI/CD, continuous delivery practices",
//               })}
//             </li>
//             <li>
//               {t({
//                 fr: "Les stratégies et outils de tests",
//                 en: "Testing tools & strategies",
//               })}
//             </li>
//             <li>
//               {t({
//                 fr: "L’architecture logicielle, les bonnes pratiques de développement",
//                 en: "Software architecture, development best practices",
//               })}
//             </li>
//             <li>
//               {t({
//                 fr: "Gérer du code legacy, refactoring",
//                 en: "Dealing with legacy code, refactoring",
//               })}
//             </li>
//             <li>
//               {t({
//                 fr: "Gestion de projet Agile, collaborer avec les autres",
//                 en: "Agile management, collaborating with others",
//               })}
//             </li>
//             <li>
//               {t({
//                 fr: "L'IA et les LLMs",
//                 en: "IA and LLMs",
//               })}
//             </li>
//             <li>
//               {t({
//                 fr: "Des projets persos, open-source ou non",
//                 en: "Personal projects, open-source or not",
//               })}
//             </li>
//           </ul>

//           <p className="mt-6">
//             {t({
//               fr: "Si vous avez quelque chose d’intéressant à raconter qui ne soit pas du spam, ou de la publicité pour un produit, alors vous avez toutes vos chances 😉",
//               en: "If you have something interesting to share that is not spam or an ad for some product, you can be selected to be a speaker at /dev/mtl! 😉",
//             })}
//           </p>
//         </div>

//         <div className="mt-8 text-center">
//           <a
//             href="https://www.papercall.io/dev-mtl-2025"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="px-8 py-3 bg-primary text-white text-lg font-medium rounded-lg hover:bg-primary-dark transition duration-300"
//           >
//             {t({
//               fr: "Présentez (CFP)",
//               en: "Call for Papers",
//             })}
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };

const CFPSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-20">
        <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">
          {t({
            fr: "Appel aux conférenciers pour 2026",
            en: "Call For Papers for 2026",
          })}
        </h2>

        <div className="text-lg text-gray-600 mb-8">
          <p>
            {t({
              fr: "Le CFP pour /dev/mtl 2026 ouvrira bientôt. Restez à l'écoute pour plus de détails!",
              en: "The CFP for /dev/mtl 2026 will open soon. Stay tuned for more details!",
            })}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CFPSection;
