import { navLinks } from "@/constants/navlinks";
import { useTranslation } from "@/hooks/useTranslation";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../Footer/Footer";
import Header from "../Header/Header";
import Navbar from "../Navbar";

export default function Layout() {
  const { t } = useTranslation();
  const location = useLocation();

  window.scrollTo({ top: 0 });

  const path = location.pathname.replace(/\/$/, "");

  const currentNav = navLinks.find(
    (link) => link.href.replace(/\/$/, "") === path,
  );
  const title = t(
    location.pathname.startsWith("/speakers/")
      ? { fr: "Conférenciers", en: "Event Speakers" }
      : currentNav?.name || { fr: "/dev/mtl", en: "/dev/mtl" },
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Header>
        <div className="z-10 text-white mt-[180px]">
          <h1 className="text-4xl lg:text-6xl font-bold my-6 uppercase">
            {title}
          </h1>
          <div className="w-16 h-1 bg-white mx-auto mb-6"></div>
        </div>
      </Header>
      <main className="flex-grow pt-7">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
