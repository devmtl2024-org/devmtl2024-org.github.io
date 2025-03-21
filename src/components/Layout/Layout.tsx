import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../Footer/Footer";
import NavbarTransparent from "../Navbar/NavbarTransparent";
import Header from "../Header/Header";
import { navLinks } from "@/constants/navlinks";

export default function Layout() {
  const location = useLocation();

  const currentNav = navLinks.find((link) => link.href === location.pathname);
  let title = currentNav?.name || "Not found";

  if (location.pathname.startsWith("/speakers/")) {
    title = "Event Speakers";
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarTransparent />
      <Header>
        <div className="z-10 text-white">
          <h1 className="text-4xl lg:text-6xl font-bold my-6">
            {title}
          </h1>
          <div className="w-16 h-1 bg-white mx-auto mb-6"></div>
        </div>
      </Header>
      <main className="flex-grow pt-[90px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
