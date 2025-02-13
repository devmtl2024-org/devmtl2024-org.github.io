import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-[90px]">
        <Outlet />
      </main>
      <footer className="bg-primary text-white py-4 text-center">
        <p>&copy; {new Date().getFullYear()} /dev/mtl - All rights reserved.</p>
      </footer>
    </div>
  );
}
