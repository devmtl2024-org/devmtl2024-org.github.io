import { navLinks } from "@/constants/navlinks";
import { useTranslation } from "@/hooks/useTranslation";
import BuyTicket from "../BuyTicket/BuyTicket";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

export function Footer() {
  const { t } = useTranslation();

  return (
    <div>
      <BuyTicket />
      <div className="bg-primary-dark">
        <footer className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">
          <div className="flex gap-8 h-(100%) justify-center mb-4 flex-wrap">
            {navLinks.map((link) => (
              <a
                key={link.name.en}
                href={link.href}
                className={`text-md font-light hover:text-secondary`}
              >
                {t(link.name)}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-transparent transition-all duration-200`}
                ></span>
              </a>
            ))}
            <LanguageSwitcher />
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
