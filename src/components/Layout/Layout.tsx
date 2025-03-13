import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Footer } from "../Footer/Foorter";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-[90px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
