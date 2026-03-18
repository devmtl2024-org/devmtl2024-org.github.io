import { navLinks } from "@/constants/navlinks";
import { useTranslation } from "@/hooks/useTranslation";
import { FaLinkedin, FaYoutube } from "react-icons/fa";
import BuyTicket from "../BuyTicket/BuyTicket";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

export function Footer() {
  const { t } = useTranslation();

  return (
    <div>
      <BuyTicket />
      <div className="bg-primary-dark">
        <footer className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">
          <div className="flex gap-8 h-(100%) justify-center mb-4 flex-wrap font-light">
            {navLinks.map((link) => (
              <a
                key={link.name.en}
                href={link.href}
                className={`text-md  hover:text-secondary`}
              >
                {t(link.name)}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-transparent transition-all duration-200`}
                ></span>
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
