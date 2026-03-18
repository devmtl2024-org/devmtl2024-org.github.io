import { navLinks } from "@/constants/navlinks";
import { useTranslation } from "@/hooks/useTranslation";
import { FaLinkedin, FaYoutube } from "react-icons/fa";
import BuyTicket from "../BuyTicket/BuyTicket";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

export function Footer() {
  const { t } = useTranslation();
  const primaryLinks = navLinks.filter((link) => !link.secondary);
  const secondaryLinks = navLinks.filter((link) => link.secondary);

  return (
    <div>
      <BuyTicket />
      <div className="bg-primary-dark">
        <footer className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">
          <nav className="flex gap-x-8 gap-y-2 justify-center mb-3 flex-wrap font-light">
            {primaryLinks.map((link) => (
              <a
                key={link.name.en}
                href={link.href}
                className="hover:text-secondary"
              >
                {t(link.name)}
              </a>
            ))}
          </nav>
          <div className="flex gap-x-6 gap-y-2 justify-center mb-6 flex-wrap text-sm text-gray-500">
            {secondaryLinks.map((link) => (
              <a
                key={link.name.en}
                href={link.href}
                className="hover:text-secondary"
              >
                {t(link.name)}
              </a>
            ))}
            <LanguageSwitcher />
          </div>
          <div className="flex gap-6 justify-center mb-4 text-xl">
            <a
              href="https://www.linkedin.com/company/dev-mtl/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.youtube.com/@dev-mtl-conf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-secondary"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>
          <p>
            &copy; {new Date().getFullYear()} /dev/mtl -{" "}
            {t({ fr: "Tous droits réservés", en: "All rights reserved" })}
          </p>
        </footer>
      </div>
    </div>
  );
}
