import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { navLinks } from "@/constants/navlinks";

import Logo from "../../assets/logo.svg?react";
import BuyTicketButton from "@/components/BuyTicket/BuyTicketButton";

function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <div className="app">
      <nav
        className={`fixed w-full z-50 transition-colors duration-100 ${
          isScrolled
            ? "bg-white text-primary shadow-md"
            : "bg-transparent text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex mx-auto justify-between w-[90%] lg:w-5/6">
            {/* Primary menu and logo */}
            <div className="flex items-center gap-16 my-6 w-full justify-between">
              {/* Logo */}
              <div
                style={{
                  width: "200px",
                }}
              >
                <Logo
                  fill={!isScrolled ? "white" : "#01055E"}
                  stroke={!isScrolled ? "white" : "#01055E"}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Primary */}
              <div className="hidden lg:flex gap-8 h-(100%)">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`text-lg font-medium relative my-auto uppercase`}
                  >
                    {link.name}
                    {/* Ajouter une bordure sous chaque lien */}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[2px] bg-transparent transition-all duration-200`}
                    ></span>
                  </a>
                ))}
                <BuyTicketButton />
              </div>
            </div>

            {/* Secondary */}
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
            <div className="flex flex-col gap-8 font-bold tracking-wider">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-lg font-medium text-gray-700 hover:text-gray-900 hover:underline ${
                    isScrolled
                      ? "hover:underline-white"
                      : "hover:underline-primary"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <BuyTicketButton />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
