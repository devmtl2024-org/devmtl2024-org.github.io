import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import logo from "@/assets/logo-black.svg";

function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="app">
      <nav>
        <div className="max-w-7xl mx-auto">
          <div className="flex mx-auto justify-between w-[90%] lg:w-5/6">
            {/* Primary menu and logo */}
            <div className="flex items-center gap-16 my-6 w-full justify-between">
              {/* Logo */}
              <div style={{ width: "200px" }}>
                <img
                  src={logo}
                  alt="logo"
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Primary */}
              <div className="hidden lg:flex gap-8">
                <a
                  href="#"
                  className="text-lg font-medium text-gray-700 hover:text-gray-900"
                >
                  Home
                </a>
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
                    <XMarkIcon className="h-8 w-8 text-gray-700 transition-transform duration-200" />
                  ) : (
                    <Bars3Icon className="h-8 w-8 text-gray-700 transition-transform duration-200" />
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
              <a
                href="#"
                className="text-lg font-medium text-gray-700 hover:text-gray-900"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
