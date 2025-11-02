import BuyTicketButton from "@/components/BuyTicket/BuyTicketButton";
import { navLinks } from "@/constants/navlinks";
import { useTranslation } from "@/hooks/useTranslation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg?react";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSpeakersDropdown, setShowSpeakersDropdown] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled down
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerNavLinks = navLinks.filter((link) => link.inHeader);

  return (
    <div className="app">
      <nav
        className={`fixed w-full z-50 transition-colors duration-100 ${
          isScrolled
            ? "bg-white text-primary shadow-md"
            : "bg-transparent text-white"
        }`}
      >
        <div className="max-w-8xl mx-auto">
          <div className="flex mx-auto justify-between w-[90%] 2xl:w-5/6">
            <div className="flex items-center gap-4 2xl:gap-16 my-6 w-full justify-between">
              {/* Logo */}
              <div
                className="hidden xl:block"
                style={{
                  width: "200px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              >
                <Logo
                  fill={isScrolled ? "#01055E" : "white"}
                  stroke={isScrolled ? "#01055E" : "white"}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="hidden lg:flex gap-8 h-(100%)">
                {headerNavLinks.map((link) => {
                  const isActive = window.location.pathname === link.href;

                  if (link.name.en === "Speakers") {
                    return (
                      <div
                        key={link.name.en}
                        className="relative group inline-flex items-center"
                      >
                        <a
                          href={link.href}
                          className={`text-lg font-medium relative my-auto uppercase hover:text-secondary transition-opacity duration-200 block`}
                        >
                          {t(link.name)}
                          <span
                            className={`absolute bottom-0 left-0 w-full h-[2px] transition-all duration-200 ${
                              isActive ? "bg-white" : "bg-transparent"
                            }`}
                          ></span>
                        </a>

                        <div className="absolute left-0 top-full mt-2 w-32 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                          <a
                            href="/speakers/2025"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-md"
                          >
                            2025
                          </a>
                          <a
                            href="/speakers/2024"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-md"
                          >
                            2024
                          </a>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={link.name.en}
                      href={link.href}
                      className={`text-lg font-medium relative my-auto uppercase hover:text-secondary transition-opacity duration-200 block`}
                    >
                      {t(link.name)}
                      <span
                        className={`absolute bottom-0 left-0 w-full h-[2px] transition-all duration-200 ${
                          isActive ? "bg-white" : "bg-transparent"
                        }`}
                      ></span>
                    </a>
                  );
                })}

                <LanguageSwitcher />
                <BuyTicketButton />
              </div>
            </div>

            <div className="flex gap-6">
              {/* Mobile navigation toggle */}
              <div className="lg:hidden flex items-center">
                <button
                  onClick={() => setToggleMenu(!toggleMenu)}
                  aria-label="Toggle navigation"
                  className="focus:outline-none"
                >
                  {toggleMenu ? (
                    <XMarkIcon className="h-8 w-8 transition-transform duration-200" />
                  ) : (
                    <Bars3Icon className="h-8 w-8 transition-transform duration-200" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <div
          className={`fixed z-40 w-full bg-gray-100 overflow-hidden flex flex-col lg:hidden gap-12 origin-top duration-700 ${
            !toggleMenu ? "h-0" : "h-full"
          }`}
        >
          <div className="px-8 py-4">
            <div className="flex flex-col gap-8 font-medium tracking-wider text-gray-700 text-lg ">
              {headerNavLinks.map((link) => {
                if (link.name.en === "Speakers") {
                  return (
                    <div key={link.name.en} className="flex flex-col gap-2">
                      <button
                        onClick={() => setShowSpeakersDropdown((prev) => !prev)}
                        className="flex justify-between items-center hover:text-secondary w-full"
                      >
                        Conférenciers
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${
                            showSpeakersDropdown ? "rotate-180" : "rotate-0"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      <div
                        className={`flex flex-col gap-2 pl-4 mt-2 overflow-hidden transition-all duration-300 ${
                          showSpeakersDropdown ? "max-h-40" : "max-h-0"
                        }`}
                      >
                        <a
                          href="/speakers/2024"
                          className="hover:text-secondary"
                        >
                          2024
                        </a>
                        <a
                          href="/speakers/2025"
                          className="hover:text-secondary"
                        >
                          2025
                        </a>
                      </div>
                    </div>
                  );
                }

                return (
                  <a
                    key={link.name.en}
                    href={link.href}
                    className="hover:text-secondary"
                  >
                    {t(link.name)}
                  </a>
                );
              })}

              <div className="hover:text-secondary">
                <LanguageSwitcher />
              </div>
              <BuyTicketButton />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
