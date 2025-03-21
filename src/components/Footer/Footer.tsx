import { navLinks } from "@/constants/navlinks";
import BuyTicket from "../BuyTicket/BuyTicket";

export function Footer() {
  return (
    <div>
      <BuyTicket />
      <div className="bg-primary-dark">
        <footer className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">
          <div className="lg:flex gap-8 h-(100%) justify-center mb-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-md font-light hover:text-secondary`}
              >
                {link.name}
                {/* Ajouter une bordure sous chaque lien */}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-transparent transition-all duration-200`}
                ></span>
              </a>
            ))}
          </div>
          <p>
            &copy; {new Date().getFullYear()} /dev/mtl - All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
