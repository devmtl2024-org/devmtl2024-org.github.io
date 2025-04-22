import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../Footer/Footer";
import Navbar from "../Navbar";
import Header from "../Header/Header";
import { navLinks } from "@/constants/navlinks";

export default function Layout() {
  const location = useLocation();
  
  const path = location.pathname.replace(import.meta.env.BASE_URL, "/");
  const currentNav = navLinks.find((link) => link.href.endsWith(path));
  let title = currentNav?.name || "Not found";

  if (location.pathname.startsWith("/speakers/")) {
    title = "Event Speakers";
  }

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
